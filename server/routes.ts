import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, isMentor, isStudent } from "./firebaseAuth";
import { insertContactSchema, insertMentorSchema, insertStudentSchema, insertCohortSchema, insertAssignmentSchema, insertMentoringSessionSchema } from "@shared/schema";
import { z } from "zod";

// Helper to normalize LinkedIn URLs - adds https:// if missing
function normalizeLinkedInUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return 'https://' + trimmed;
}

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const userEmail = req.user.email;
      let user = await storage.getUser(userId);
      
      if (!user) {
        user = await storage.upsertUser({
          id: userId,
          email: userEmail,
          fullName: req.user.displayName || null,
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/auth/register', isAuthenticated, async (req: any, res) => {
    try {
      const { email, displayName } = req.body;
      const userId = req.user.uid;
      
      const user = await storage.upsertUser({
        id: userId,
        email: email,
        fullName: displayName || null,
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Check if email is already registered
  app.post("/api/check-email-registration", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (user && user.role) {
        return res.json({ 
          exists: true, 
          type: user.role,
          message: `This email is already registered as a ${user.role}. Please sign in to access your dashboard.`
        });
      }

      return res.json({ exists: false });
    } catch (error) {
      console.error("Error checking email registration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, id: contact.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        console.error("Error creating contact:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============ USER REGISTRATION ROUTES ============
  
  // Mentor registration (creates or updates user with mentor role)
  app.post("/api/mentor-registration", async (req: any, res) => {
    try {
      // Map frontend field names to schema field names
      const { emailAddress, linkedinUrl: rawLinkedinUrl, linkedin, ...rest } = req.body;
      
      // Normalize LinkedIn URL (handles both field names and adds https:// if missing)
      const linkedinUrl = normalizeLinkedInUrl(rawLinkedinUrl || linkedin);
      
      const registrationData = insertMentorSchema.parse({
        ...rest,
        linkedinUrl,
        email: emailAddress || rest.email,
        role: 'mentor'
      });
      
      // Check if user already exists
      let user = await storage.getUserByEmail(registrationData.email);
      
      if (user) {
        if (user.role) {
          return res.status(400).json({ 
            error: `Email already registered as ${user.role}` 
          });
        }
        // Update existing user with mentor data
        user = await storage.updateUser(user.id, {
          ...registrationData,
          role: 'mentor'
        });
      } else {
        // Create new user with mentor data
        user = await storage.upsertUser({
          ...registrationData,
          role: 'mentor'
        });
      }
      
      res.json({ success: true, id: user.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid registration data", details: error.errors });
      } else {
        console.error("Error creating mentor registration:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Student registration (creates or updates user with student role)
  app.post("/api/student-registration", async (req: any, res) => {
    try {
      // Map frontend field names to schema field names
      const { emailAddress, linkedinUrl: rawLinkedinUrl, linkedin, ...rest } = req.body;
      
      // Normalize LinkedIn URL (handles both field names and adds https:// if missing)
      const linkedinUrl = normalizeLinkedInUrl(rawLinkedinUrl || linkedin);
      
      const dataToValidate = {
        ...rest,
        linkedinUrl,
        email: emailAddress || rest.email,
        role: 'student'
      };
      
      const registrationData = insertStudentSchema.parse(dataToValidate);
      
      // Check if user already exists
      let user = await storage.getUserByEmail(registrationData.email);
      
      if (user) {
        if (user.role) {
          return res.status(400).json({ 
            error: `Email already registered as ${user.role}` 
          });
        }
        // Update existing user with student data
        user = await storage.updateUser(user.id, {
          ...registrationData,
          role: 'student'
        });
      } else {
        // Create new user with student data
        user = await storage.upsertUser({
          ...registrationData,
          role: 'student'
        });
      }
      
      res.json({ success: true, id: user.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Student registration Zod validation errors:", JSON.stringify(error.errors, null, 2));
        res.status(400).json({ error: "Invalid registration data", details: error.errors });
      } else {
        console.error("Error creating student registration:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all mentors
  app.get("/api/mentors", async (req, res) => {
    try {
      const mentors = await storage.getUsersByRole('mentor');
      res.json(mentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all students
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getUsersByRole('student');
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get single user
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update user
  app.put("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Delete user
  app.delete("/api/users/:id", async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // ============ COHORT ROUTES ============
  
  app.post("/api/cohorts", async (req, res) => {
    try {
      const cohortData = insertCohortSchema.parse(req.body);
      const cohort = await storage.createCohort(cohortData);
      res.json(cohort);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid cohort data", details: error.errors });
      } else {
        console.error("Error creating cohort:", error);
        res.status(500).json({ error: "Failed to create cohort" });
      }
    }
  });

  app.get("/api/cohorts", async (req, res) => {
    try {
      const cohortList = await storage.getAllCohorts();
      res.json(cohortList);
    } catch (error) {
      console.error("Error fetching cohorts:", error);
      res.status(500).json({ error: "Failed to fetch cohorts" });
    }
  });

  app.get("/api/cohorts/:id", async (req, res) => {
    try {
      const cohort = await storage.getCohort(parseInt(req.params.id));
      if (!cohort) {
        return res.status(404).json({ error: "Cohort not found" });
      }
      res.json(cohort);
    } catch (error) {
      console.error("Error fetching cohort:", error);
      res.status(500).json({ error: "Failed to fetch cohort" });
    }
  });

  app.put("/api/cohorts/:id", async (req, res) => {
    try {
      const cohort = await storage.updateCohort(parseInt(req.params.id), req.body);
      res.json(cohort);
    } catch (error) {
      console.error("Error updating cohort:", error);
      res.status(500).json({ error: "Failed to update cohort" });
    }
  });

  app.delete("/api/cohorts/:id", async (req, res) => {
    try {
      await storage.deleteCohort(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting cohort:", error);
      res.status(500).json({ error: "Failed to delete cohort" });
    }
  });

  // Cohort members
  app.get("/api/cohorts/:id/members", async (req, res) => {
    try {
      const members = await storage.getCohortMembers(parseInt(req.params.id));
      
      // Enrich with user details
      const enrichedMembers = await Promise.all(members.map(async (member) => {
        const user = await storage.getUser(member.userId);
        return {
          ...member,
          user
        };
      }));
      
      res.json(enrichedMembers);
    } catch (error) {
      console.error("Error fetching cohort members:", error);
      res.status(500).json({ error: "Failed to fetch cohort members" });
    }
  });

  app.post("/api/cohorts/:id/members", async (req, res) => {
    try {
      const { userId, role } = req.body;
      const member = await storage.addCohortMember({
        cohortId: parseInt(req.params.id),
        userId,
        role,
        isActive: true
      });
      res.json(member);
    } catch (error) {
      console.error("Error adding cohort member:", error);
      res.status(500).json({ error: "Failed to add cohort member" });
    }
  });

  app.delete("/api/cohorts/:id/members/:userId", async (req, res) => {
    try {
      await storage.removeCohortMember(parseInt(req.params.id), req.params.userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing cohort member:", error);
      res.status(500).json({ error: "Failed to remove cohort member" });
    }
  });

  // ============ ASSIGNMENT ROUTES ============
  
  app.get("/api/assignments", async (req, res) => {
    try {
      const assignments = await storage.getAllAssignments();
      
      // Enrich with mentor and student details
      const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
        const mentor = await storage.getUser(assignment.mentorUserId);
        const student = await storage.getUser(assignment.studentUserId);
        const cohort = await storage.getCohort(assignment.cohortId);
        return {
          ...assignment,
          mentor,
          student,
          cohort
        };
      }));
      
      res.json(enrichedAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  app.get("/api/cohorts/:id/assignments", async (req, res) => {
    try {
      const assignments = await storage.getAssignmentsByCohort(parseInt(req.params.id));
      
      // Enrich with mentor and student details
      const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
        const mentor = await storage.getUser(assignment.mentorUserId);
        const student = await storage.getUser(assignment.studentUserId);
        return {
          ...assignment,
          mentorName: mentor?.fullName || 'Unknown Mentor',
          studentName: student?.fullName || 'Unknown Student',
          mentor,
          student
        };
      }));
      
      res.json(enrichedAssignments);
    } catch (error) {
      console.error("Error fetching cohort assignments:", error);
      res.status(500).json({ error: "Failed to fetch cohort assignments" });
    }
  });

  app.post("/api/cohorts/:id/assignments", async (req, res) => {
    try {
      const { mentorUserId, studentUserId } = req.body;
      const cohortId = parseInt(req.params.id);
      
      const mentor = await storage.getUser(mentorUserId);
      const student = await storage.getUser(studentUserId);
      
      if (!mentor || !student) {
        return res.status(404).json({ error: "Mentor or student not found" });
      }
      
      const assignment = await storage.createAssignment({
        cohortId,
        mentorUserId,
        studentUserId,
        isActive: true
      });
      
      res.json(assignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });

  app.put("/api/assignments/:id", async (req, res) => {
    try {
      const assignment = await storage.updateAssignment(parseInt(req.params.id), req.body);
      res.json(assignment);
    } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(500).json({ error: "Failed to update assignment" });
    }
  });

  app.delete("/api/assignments/:id", async (req, res) => {
    try {
      await storage.deleteAssignment(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res.status(500).json({ error: "Failed to delete assignment" });
    }
  });

  // ============ SESSION ROUTES ============
  
  app.post("/api/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const sessionData = insertMentoringSessionSchema.parse({
        ...req.body,
        createdBy: userId
      });
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid session data", details: error.errors });
      } else {
        console.error("Error creating session:", error);
        res.status(500).json({ error: "Failed to create session" });
      }
    }
  });

  app.get("/api/assignments/:id/sessions", async (req, res) => {
    try {
      const sessions = await storage.getSessionsByAssignment(parseInt(req.params.id));
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.put("/api/sessions/:id", isAuthenticated, async (req, res) => {
    try {
      const session = await storage.updateSession(parseInt(req.params.id), req.body);
      res.json(session);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ error: "Failed to update session" });
    }
  });

  app.delete("/api/sessions/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteSession(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ error: "Failed to delete session" });
    }
  });

  // ============ MENTOR DASHBOARD ROUTES ============
  
  app.get("/api/mentor/assignments", isAuthenticated, isMentor, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const assignments = await storage.getAssignmentsByMentor(userId);
      
      // Enrich with student details and cohort info
      const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
        const student = await storage.getUser(assignment.studentUserId);
        const cohort = await storage.getCohort(assignment.cohortId);
        const sessions = await storage.getSessionsByAssignment(assignment.id);
        return {
          ...assignment,
          student,
          cohort,
          sessions
        };
      }));
      
      res.json(enrichedAssignments);
    } catch (error) {
      console.error("Error fetching mentor assignments:", error);
      res.status(500).json({ error: "Failed to fetch mentor assignments" });
    }
  });

  app.get("/api/mentor/cohorts", isAuthenticated, isMentor, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const cohortList = await storage.getUserCohorts(userId);
      res.json(cohortList);
    } catch (error) {
      console.error("Error fetching mentor cohorts:", error);
      res.status(500).json({ error: "Failed to fetch mentor cohorts" });
    }
  });

  // ============ STUDENT DASHBOARD ROUTES ============
  
  app.get("/api/student/assignments", isAuthenticated, isStudent, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const assignments = await storage.getAssignmentsByStudent(userId);
      
      // Enrich with mentor details and cohort info
      const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
        const mentor = await storage.getUser(assignment.mentorUserId);
        const cohort = await storage.getCohort(assignment.cohortId);
        const sessions = await storage.getSessionsByAssignment(assignment.id);
        return {
          ...assignment,
          mentor,
          cohort,
          sessions
        };
      }));
      
      res.json(enrichedAssignments);
    } catch (error) {
      console.error("Error fetching student assignments:", error);
      res.status(500).json({ error: "Failed to fetch student assignments" });
    }
  });

  app.get("/api/student/cohorts", isAuthenticated, isStudent, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const cohortList = await storage.getUserCohorts(userId);
      res.json(cohortList);
    } catch (error) {
      console.error("Error fetching student cohorts:", error);
      res.status(500).json({ error: "Failed to fetch student cohorts" });
    }
  });

  // ============ ADMIN ROUTES ============
  
  // Admin stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const students = await storage.getUsersByRole('student');
      const mentors = await storage.getUsersByRole('mentor');
      const assignments = await storage.getAllAssignments();
      
      res.json({
        totalStudents: students.length,
        totalMentors: mentors.length,
        activeStudents: students.filter(s => s.isActive).length,
        activeMentors: mentors.filter(m => m.isActive).length,
        totalAssignments: assignments.length
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin get all students
  app.get("/api/admin/students", async (req, res) => {
    try {
      const students = await storage.getUsersByRole('student');
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  // Admin get all mentors
  app.get("/api/admin/mentors", async (req, res) => {
    try {
      const mentors = await storage.getUsersByRole('mentor');
      res.json(mentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ error: "Failed to fetch mentors" });
    }
  });

  // Admin get all assignments
  app.get("/api/admin/assignments", async (req, res) => {
    try {
      const assignments = await storage.getAllAssignments();
      
      const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
        const mentor = await storage.getUser(assignment.mentorUserId);
        const student = await storage.getUser(assignment.studentUserId);
        return {
          ...assignment,
          mentorName: mentor?.fullName || 'Unknown Mentor',
          studentName: student?.fullName || 'Unknown Student'
        };
      }));
      
      res.json(enrichedAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  // Admin toggle user status (uses string IDs from Firestore)
  app.put("/api/admin/students/:id/status", async (req, res) => {
    try {
      const { isActive } = req.body;
      const userId = req.params.id; // Keep as string - Firestore uses string IDs
      const user = await storage.updateUser(userId, { isActive });
      res.json(user);
    } catch (error) {
      console.error("Error updating student status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.put("/api/admin/mentors/:id/status", async (req, res) => {
    try {
      const { isActive } = req.body;
      const userId = req.params.id; // Keep as string - Firestore uses string IDs
      const user = await storage.updateUser(userId, { isActive });
      res.json(user);
    } catch (error) {
      console.error("Error updating mentor status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  // Admin delete user (uses string IDs from Firestore)
  app.delete("/api/admin/students/:id", async (req, res) => {
    try {
      const userId = req.params.id; // Keep as string - Firestore uses string IDs
      await storage.deleteUser(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  app.delete("/api/admin/mentors/:id", async (req, res) => {
    try {
      const userId = req.params.id; // Keep as string - Firestore uses string IDs
      await storage.deleteUser(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting mentor:", error);
      res.status(500).json({ error: "Failed to delete mentor" });
    }
  });

  // Make user admin
  app.post("/api/admin/make-admin", async (req, res) => {
    try {
      const { email, secretKey } = req.body;
      
      if (secretKey !== 'aspirelink-admin-seed-2025') {
        return res.status(403).json({ error: 'Invalid secret key' });
      }
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        user = await storage.updateUser(user.id, { role: 'admin' });
      } else {
        user = await storage.upsertUser({
          email,
          role: 'admin'
        });
      }
      
      console.log(`Made ${email} an admin`);
      res.json({ message: 'Admin created/updated successfully', user });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ error: 'Failed to create admin' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
