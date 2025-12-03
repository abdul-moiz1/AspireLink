import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, isMentor, isStudent } from "./firebaseAuth";
import { insertContactSchema, insertMentorRegistrationSchema, insertStudentRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Firebase Auth
  await setupAuth(app);

  // Seed admin endpoint - creates admin user if not exists
  app.post('/api/seed-admin', async (req, res) => {
    try {
      const { email, secretKey } = req.body;
      
      // Simple security check - in production, use environment variable
      if (secretKey !== 'aspirelink-admin-seed-2025') {
        return res.status(403).json({ error: 'Invalid secret key' });
      }
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      // Check if admin already exists
      const existingAdmin = await storage.getAdminByEmail(email);
      if (existingAdmin) {
        return res.json({ message: 'Admin already exists', admin: existingAdmin });
      }
      
      // Create the admin (password is a placeholder - actual auth uses Firebase)
      const newAdmin = await storage.createAdmin({ 
        email, 
        password: 'firebase-auth-managed' 
      });
      console.log(`Created admin user: ${email}`);
      
      res.json({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ error: 'Failed to create admin' });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const userEmail = req.user.email;
      let user = await storage.getUser(userId);
      
      if (!user) {
        // Create new user
        user = await storage.upsertUser({
          id: userId,
          email: userEmail,
          firstName: req.user.displayName?.split(' ')[0] || null,
          lastName: req.user.displayName?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: null,
        });
      }
      
      // Ensure registration is linked to Firebase userId for existing users with roles
      if (user.role === 'mentor' && user.mentorRegistrationId && userEmail) {
        const mentorReg = await storage.getMentorRegistration(user.mentorRegistrationId);
        if (mentorReg && !mentorReg.userId) {
          await storage.updateMentorRegistration(mentorReg.id, { userId });
          console.log(`Linked existing mentor registration ${mentorReg.id} to Firebase user ${userId}`);
        }
      } else if (user.role === 'student' && user.studentRegistrationId && userEmail) {
        const studentReg = await storage.getStudentRegistration(user.studentRegistrationId);
        if (studentReg && !studentReg.userId) {
          await storage.updateStudentRegistration(studentReg.id, { userId });
          console.log(`Linked existing student registration ${studentReg.id} to Firebase user ${userId}`);
        }
      }
      
      // Check if user has a role assigned - if not, check for existing registrations
      if (!user.role && userEmail) {
        // Priority 1: Check for admin first (highest priority)
        const adminRecord = await storage.getAdminByEmail(userEmail);
        if (adminRecord) {
          user = await storage.updateUserRole(userId, 'admin');
          console.log(`Assigned admin role to user ${userEmail}`);
        } else {
          // Priority 2: Check for student and mentor registrations
          const studentRegistration = await storage.getStudentByEmail(userEmail);
          const mentorRegistration = await storage.getMentorByEmail(userEmail);
          
          // Handle dual registration case - warn and prefer the most recent
          if (studentRegistration && mentorRegistration) {
            console.warn(`User ${userEmail} has both student and mentor registrations. Using the most recent one.`);
            const studentDate = studentRegistration.createdAt ? new Date(studentRegistration.createdAt) : new Date(0);
            const mentorDate = mentorRegistration.createdAt ? new Date(mentorRegistration.createdAt) : new Date(0);
            
            if (mentorDate > studentDate) {
              user = await storage.updateUserRole(userId, 'mentor', mentorRegistration.id);
              // Link the Firebase userId to the mentor registration for assignment lookups
              if (!mentorRegistration.userId) {
                await storage.updateMentorRegistration(mentorRegistration.id, { userId });
                console.log(`Linked mentor registration ${mentorRegistration.id} to Firebase user ${userId}`);
              }
              console.log(`Assigned mentor role to user ${userEmail} based on more recent registration ${mentorRegistration.id}`);
            } else {
              user = await storage.updateUserRole(userId, 'student', studentRegistration.id);
              // Link the Firebase userId to the student registration for assignment lookups
              if (!studentRegistration.userId) {
                await storage.updateStudentRegistration(studentRegistration.id, { userId });
                console.log(`Linked student registration ${studentRegistration.id} to Firebase user ${userId}`);
              }
              console.log(`Assigned student role to user ${userEmail} based on more recent registration ${studentRegistration.id}`);
            }
          } else if (studentRegistration) {
            user = await storage.updateUserRole(userId, 'student', studentRegistration.id);
            // Link the Firebase userId to the student registration for assignment lookups
            if (!studentRegistration.userId) {
              await storage.updateStudentRegistration(studentRegistration.id, { userId });
              console.log(`Linked student registration ${studentRegistration.id} to Firebase user ${userId}`);
            }
            console.log(`Assigned student role to user ${userEmail} based on registration ${studentRegistration.id}`);
          } else if (mentorRegistration) {
            user = await storage.updateUserRole(userId, 'mentor', mentorRegistration.id);
            // Link the Firebase userId to the mentor registration for assignment lookups
            if (!mentorRegistration.userId) {
              await storage.updateMentorRegistration(mentorRegistration.id, { userId });
              console.log(`Linked mentor registration ${mentorRegistration.id} to Firebase user ${userId}`);
            }
            console.log(`Assigned mentor role to user ${userEmail} based on registration ${mentorRegistration.id}`);
          }
        }
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Auth registration endpoint
  app.post('/api/auth/register', isAuthenticated, async (req: any, res) => {
    try {
      const { email, displayName } = req.body;
      const userId = req.user.uid;
      
      const user = await storage.upsertUser({
        id: userId,
        email: email,
        firstName: displayName?.split(' ')[0] || null,
        lastName: displayName?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: null,
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Check if email is already registered as student, mentor, or admin
  app.post("/api/check-email-registration", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const studentRegistration = await storage.getStudentByEmail(email);
      const mentorRegistration = await storage.getMentorByEmail(email);
      const adminUser = await storage.getAdminByEmail(email);

      if (adminUser) {
        return res.json({ 
          exists: true, 
          type: 'admin',
          message: "Welcome back, Admin! Sign in to access your admin dashboard."
        });
      }

      if (studentRegistration) {
        return res.json({ 
          exists: true, 
          type: 'student',
          message: "This email is already registered as a student. Please sign in to access your student dashboard."
        });
      }

      if (mentorRegistration) {
        return res.json({ 
          exists: true, 
          type: 'mentor',
          message: "This email is already registered as a mentor. Please sign in to access your mentor dashboard."
        });
      }

      return res.json({ exists: false });
    } catch (error) {
      console.error("Error checking email registration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Contact form submission endpoint
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

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentor registration submission endpoint (public - no auth required)
  app.post("/api/mentor-registration", async (req: any, res) => {
    try {
      const registrationData = insertMentorRegistrationSchema.parse({
        ...req.body,
        userId: null
      });
      const registration = await storage.createMentorRegistration(registrationData);
      
      res.json({ success: true, id: registration.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid registration data", details: error.errors });
      } else {
        console.error("Error creating mentor registration:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all mentor registrations
  app.get("/api/mentor-registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllMentorRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching mentor registrations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Student registration submission endpoint (public - no auth required)
  app.post("/api/student-registration", async (req: any, res) => {
    try {
      const registrationData = insertStudentRegistrationSchema.parse({
        ...req.body,
        userId: null
      });
      const registration = await storage.createStudentRegistration(registrationData);
      
      res.json({ success: true, id: registration.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid registration data", details: error.errors });
      } else {
        console.error("Error creating student registration:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all student registrations
  app.get("/api/student-registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllStudentRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching student registrations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============ COHORT ROUTES ============
  
  // Create cohort (admin only)
  app.post("/api/cohorts", async (req, res) => {
    try {
      const cohort = await storage.createCohort(req.body);
      res.json(cohort);
    } catch (error) {
      console.error("Error creating cohort:", error);
      res.status(500).json({ error: "Failed to create cohort" });
    }
  });

  // Get all cohorts (admin only)
  app.get("/api/cohorts", async (req, res) => {
    try {
      const cohortList = await storage.getAllCohorts();
      res.json(cohortList);
    } catch (error) {
      console.error("Error fetching cohorts:", error);
      res.status(500).json({ error: "Failed to fetch cohorts" });
    }
  });

  // Get single cohort (admin only)
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

  // Update cohort (admin only)
  app.put("/api/cohorts/:id", async (req, res) => {
    try {
      const cohort = await storage.updateCohort(parseInt(req.params.id), req.body);
      res.json(cohort);
    } catch (error) {
      console.error("Error updating cohort:", error);
      res.status(500).json({ error: "Failed to update cohort" });
    }
  });

  // Delete cohort (admin only)
  app.delete("/api/cohorts/:id", async (req, res) => {
    try {
      await storage.deleteCohort(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting cohort:", error);
      res.status(500).json({ error: "Failed to delete cohort" });
    }
  });

  // Get cohort members (admin only)
  app.get("/api/cohorts/:id/members", async (req, res) => {
    try {
      const members = await storage.getCohortMembers(parseInt(req.params.id));
      
      // Enrich with user details
      const enrichedMembers = await Promise.all(members.map(async (member) => {
        const user = await storage.getUser(member.userId);
        let registration = null;
        if (member.role === 'mentor') {
          registration = await storage.getMentorByUserId(member.userId);
        } else if (member.role === 'student') {
          registration = await storage.getStudentByUserId(member.userId);
        }
        return {
          ...member,
          user,
          registration
        };
      }));
      
      res.json(enrichedMembers);
    } catch (error) {
      console.error("Error fetching cohort members:", error);
      res.status(500).json({ error: "Failed to fetch cohort members" });
    }
  });

  // Add member to cohort (admin only)
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

  // Remove member from cohort (admin only)
  app.delete("/api/cohorts/:id/members/:userId", async (req, res) => {
    try {
      await storage.removeCohortMember(parseInt(req.params.id), req.params.userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing cohort member:", error);
      res.status(500).json({ error: "Failed to remove cohort member" });
    }
  });

  // Get cohort assignments (admin only)
  app.get("/api/cohorts/:id/assignments", async (req, res) => {
    try {
      const assignments = await storage.getAssignmentsByCohort(parseInt(req.params.id));
      
      // Enrich with mentor and student details
      const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
        const mentor = await storage.getMentorRegistration(assignment.mentorId);
        const student = await storage.getStudentRegistration(assignment.studentId);
        return {
          ...assignment,
          mentorName: mentor?.fullName || 'Unknown Mentor',
          studentName: student?.fullName || 'Unknown Student'
        };
      }));
      
      res.json(enrichedAssignments);
    } catch (error) {
      console.error("Error fetching cohort assignments:", error);
      res.status(500).json({ error: "Failed to fetch cohort assignments" });
    }
  });

  // Create assignment in cohort (admin only)
  app.post("/api/cohorts/:id/assignments", async (req, res) => {
    try {
      const { mentorId, studentId } = req.body;
      const cohortId = parseInt(req.params.id);
      
      const mentor = await storage.getMentorRegistration(mentorId);
      const student = await storage.getStudentRegistration(studentId);
      
      if (!mentor || !student) {
        return res.status(404).json({ error: "Mentor or student not found" });
      }
      
      const assignment = await storage.createAssignment({
        cohortId,
        mentorId,
        studentId,
        mentorUserId: mentor.userId || undefined,
        studentUserId: student.userId || undefined,
        isActive: true
      });
      
      res.json(assignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });

  // ============ SESSION ROUTES ============
  
  // Create session (mentor only)
  app.post("/api/sessions", isAuthenticated, isMentor, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const session = await storage.createSession({
        ...req.body,
        createdBy: userId
      });
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Get sessions by assignment
  app.get("/api/assignments/:id/sessions", isAuthenticated, async (req, res) => {
    try {
      const sessions = await storage.getSessionsByAssignment(parseInt(req.params.id));
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Update session
  app.put("/api/sessions/:id", isAuthenticated, async (req, res) => {
    try {
      const session = await storage.updateSession(parseInt(req.params.id), req.body);
      res.json(session);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ error: "Failed to update session" });
    }
  });

  // Delete session
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
  
  // Get mentor's assignments
  app.get("/api/mentor/assignments", isAuthenticated, isMentor, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const assignments = await storage.getAssignmentsByMentorUserId(userId);
      
      // Enrich with student details and cohort info
      const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
        const student = await storage.getStudentRegistration(assignment.studentId);
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

  // Get mentor's cohorts
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
  
  // Get student's assignments
  app.get("/api/student/assignments", isAuthenticated, isStudent, async (req: any, res) => {
    try {
      const userId = req.user.uid;
      const assignments = await storage.getAssignmentsByStudentUserId(userId);
      
      // Enrich with mentor details and cohort info
      const enrichedAssignments = await Promise.all(assignments.map(async (assignment) => {
        const mentor = await storage.getMentorRegistration(assignment.mentorId);
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

  // Get student's cohorts
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
  
  // Set user role (admin only)
  app.put("/api/admin/users/:id/role", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { role } = req.body;
      const user = await storage.updateUserRole(req.params.id, role);
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  // Admin dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const students = await storage.getAllStudentRegistrations();
      const mentors = await storage.getAllMentorRegistrations();
      const assignments = await storage.getAllAssignments();
      const cohortList = await storage.getAllCohorts();
      
      const stats = {
        totalStudents: students.length,
        totalMentors: mentors.length,
        activeStudents: students.filter(s => s.isActive).length,
        activeMentors: mentors.filter(m => m.isActive).length,
        totalAssignments: assignments.length,
        totalCohorts: cohortList.length,
        activeCohorts: cohortList.filter(c => c.isActive).length
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch stats" });
    }
  });

  // Admin create student endpoint
  app.post("/api/admin/students", async (req, res) => {
    try {
      const studentData = req.body;
      const newStudent = await storage.createStudentRegistration(studentData);
      res.json(newStudent);
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ error: "Failed to create student" });
    }
  });

  // Admin create mentor endpoint
  app.post("/api/admin/mentors", async (req, res) => {
    try {
      const mentorData = req.body;
      const newMentor = await storage.createMentorRegistration(mentorData);
      res.json(newMentor);
    } catch (error) {
      console.error("Error creating mentor:", error);
      res.status(500).json({ error: "Failed to create mentor" });
    }
  });

  // Admin get single student endpoint
  app.get("/api/admin/students/:id", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const student = await storage.getStudentRegistration(studentId);
      
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      
      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  // Admin get single mentor endpoint
  app.get("/api/admin/mentors/:id", async (req, res) => {
    try {
      const mentorId = parseInt(req.params.id);
      const mentor = await storage.getMentorRegistration(mentorId);
      
      if (!mentor) {
        return res.status(404).json({ error: "Mentor not found" });
      }
      
      res.json(mentor);
    } catch (error) {
      console.error("Error fetching mentor:", error);
      res.status(500).json({ error: "Failed to fetch mentor" });
    }
  });

  // Admin update student endpoint
  app.put("/api/admin/students/:id", async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const updateData = req.body;
      const updatedStudent = await storage.updateStudentRegistration(studentId, updateData);
      res.json(updatedStudent);
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ error: "Failed to update student" });
    }
  });

  // Admin update mentor endpoint
  app.put("/api/admin/mentors/:id", async (req, res) => {
    try {
      const mentorId = parseInt(req.params.id);
      const updateData = req.body;
      const updatedMentor = await storage.updateMentorRegistration(mentorId, updateData);
      res.json(updatedMentor);
    } catch (error) {
      console.error("Error updating mentor:", error);
      res.status(500).json({ error: "Failed to update mentor" });
    }
  });

  // Get all students for admin
  app.get("/api/admin/students", async (req, res) => {
    try {
      const students = await storage.getAllStudentRegistrations();
      res.json(students);
    } catch (error) {
      console.error("Get students error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch students" });
    }
  });

  // Get all mentors for admin
  app.get("/api/admin/mentors", async (req, res) => {
    try {
      const mentors = await storage.getAllMentorRegistrations();
      res.json(mentors);
    } catch (error) {
      console.error("Get mentors error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch mentors" });
    }
  });

  // Toggle student status
  app.put("/api/admin/students/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      await storage.updateStudentRegistration(parseInt(id), { isActive });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Update student status error:", error);
      res.status(500).json({ success: false, error: "Failed to update student status" });
    }
  });

  // Toggle mentor status
  app.put("/api/admin/mentors/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      await storage.updateMentorRegistration(parseInt(id), { isActive });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Update mentor status error:", error);
      res.status(500).json({ success: false, error: "Failed to update mentor status" });
    }
  });

  // Delete student
  app.delete("/api/admin/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      await storage.deleteStudentRegistration(parseInt(id));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete student error:", error);
      res.status(500).json({ success: false, error: "Failed to delete student" });
    }
  });

  // Delete mentor
  app.delete("/api/admin/mentors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      await storage.deleteMentorRegistration(parseInt(id));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete mentor error:", error);
      res.status(500).json({ success: false, error: "Failed to delete mentor" });
    }
  });

  // Get assignments with mentor and student names
  app.get("/api/admin/assignments", async (req, res) => {
    try {
      const assignments = await storage.getAllAssignments();
      const mentors = await storage.getAllMentorRegistrations();
      const students = await storage.getAllStudentRegistrations();
      const cohortList = await storage.getAllCohorts();
      
      // Enrich assignments with mentor, student and cohort names
      const enrichedAssignments = assignments.map(assignment => {
        const mentor = mentors.find(m => m.id === assignment.mentorId);
        const student = students.find(s => s.id === assignment.studentId);
        const cohort = cohortList.find(c => c.id === assignment.cohortId);
        
        return {
          ...assignment,
          mentorName: mentor?.fullName || 'Unknown Mentor',
          studentName: student?.fullName || 'Unknown Student',
          cohortName: cohort?.name || 'Unknown Cohort'
        };
      });
      
      res.json(enrichedAssignments);
    } catch (error) {
      console.error("Get assignments error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch assignments" });
    }
  });

  // Create new assignment
  app.post("/api/admin/assignments", async (req, res) => {
    try {
      const { mentorId, studentId, cohortId } = req.body;
      
      if (!mentorId || !studentId) {
        return res.status(400).json({ error: "Mentor ID and Student ID are required" });
      }

      const assignment = await storage.createAssignment({
        mentorId: parseInt(mentorId),
        studentId: parseInt(studentId),
        cohortId: cohortId ? parseInt(cohortId) : null,
        isActive: true,
      });
      
      res.json(assignment);
    } catch (error) {
      console.error("Create assignment error:", error);
      res.status(500).json({ success: false, error: "Failed to create assignment" });
    }
  });

  // Delete assignment endpoint
  app.delete("/api/admin/assignments/:id", async (req, res) => {
    try {
      const assignmentId = parseInt(req.params.id);
      await storage.deleteAssignment(assignmentId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete assignment error:", error);
      res.status(500).json({ success: false, error: "Failed to delete assignment" });
    }
  });

  // Bulk delete assignments endpoint
  app.post("/api/admin/assignments/bulk-delete", async (req, res) => {
    try {
      const { assignmentIds } = req.body;
      
      if (!Array.isArray(assignmentIds) || assignmentIds.length === 0) {
        return res.status(400).json({ error: "Invalid assignment IDs" });
      }

      // Delete all assignments
      for (const id of assignmentIds) {
        await storage.deleteAssignment(parseInt(id));
      }

      res.json({ 
        success: true, 
        deletedCount: assignmentIds.length,
        message: `Successfully deleted ${assignmentIds.length} assignment(s)` 
      });
    } catch (error) {
      console.error("Bulk delete assignments error:", error);
      res.status(500).json({ success: false, error: "Failed to delete assignments" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
