import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertMentorRegistrationSchema, insertStudentRegistrationSchema, studentRegistrations, mentorRegistrations } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // LinkedIn auto-fill endpoint - requires actual LinkedIn data extraction
  app.post("/api/linkedin-autofill", async (req, res) => {
    try {
      const { linkedinUrl } = req.body;
      
      if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
        return res.status(400).json({ error: "Invalid LinkedIn URL" });
      }

      // Real LinkedIn data extraction would require LinkedIn API or web scraping
      // For security and legal reasons, we cannot scrape LinkedIn profiles
      res.status(501).json({ 
        error: "LinkedIn auto-fill requires LinkedIn API integration",
        message: "Please contact support to enable LinkedIn integration for your organization."
      });
    } catch (error) {
      console.error("Error in LinkedIn auto-fill:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mentor registration submission endpoint
  app.post("/api/mentor-registration", async (req, res) => {
    try {
      const registrationData = insertMentorRegistrationSchema.parse(req.body);
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

  // Get all mentor registrations (for admin purposes)
  app.get("/api/mentor-registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllMentorRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching mentor registrations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Student registration submission endpoint
  app.post("/api/student-registration", async (req, res) => {
    try {
      const registrationData = insertStudentRegistrationSchema.parse(req.body);
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

  // Get all student registrations (for admin purposes)
  app.get("/api/student-registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllStudentRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching student registrations:", error);
      res.status(500).json({ error: "Internal server error" });
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
      const students = await storage.getAllStudentRegistrations();
      const student = students.find(s => s.id === studentId);
      
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
      const mentors = await storage.getAllMentorRegistrations();
      const mentor = mentors.find(m => m.id === mentorId);
      
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

  // Admin create assignment endpoint
  app.post("/api/admin/assignments", async (req, res) => {
    try {
      const { mentorId, studentId } = req.body;
      
      // Get mentor and student names for the assignment
      const mentors = await storage.getAllMentorRegistrations();
      const students = await storage.getAllStudentRegistrations();
      
      const mentor = mentors.find(m => m.id === mentorId);
      const student = students.find(s => s.id === studentId);
      
      if (!mentor || !student) {
        return res.status(404).json({ error: "Mentor or student not found" });
      }
      
      const assignmentData = {
        mentorId,
        studentId,
        mentorName: mentor.fullName,
        studentName: student.fullName
      };
      
      const newAssignment = await storage.createAssignment(assignmentData);
      res.json(newAssignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });

  // Admin authentication endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      

      
      // Check hardcoded admin credentials
      if (email === "program.admin@aspirelink.org" && password === "@sp1reLink") {
        // Simple token for demo purposes
        const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

        res.json({ success: true, token });
      } else {

        res.status(401).json({ success: false, error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, error: "Login failed" });
    }
  });

  // Admin dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const students = await storage.getAllStudentRegistrations();
      const mentors = await storage.getAllMentorRegistrations();
      const assignments = await storage.getAllAssignments();
      
      const stats = {
        totalStudents: students.length,
        totalMentors: mentors.length,
        activeStudents: students.filter(s => s.isActive).length,
        activeMentors: mentors.filter(m => m.isActive).length,
        totalAssignments: assignments.length
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch stats" });
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
      
      await db.update(studentRegistrations)
        .set({ isActive })
        .where(eq(studentRegistrations.id, parseInt(id)));
      
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
      
      await db.update(mentorRegistrations)
        .set({ isActive })
        .where(eq(mentorRegistrations.id, parseInt(id)));
      
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
      
      await db.delete(studentRegistrations)
        .where(eq(studentRegistrations.id, parseInt(id)));
      
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
      
      await db.delete(mentorRegistrations)
        .where(eq(mentorRegistrations.id, parseInt(id)));
      
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
      
      // Enrich assignments with mentor and student names
      const enrichedAssignments = assignments.map(assignment => {
        const mentor = mentors.find(m => m.id === assignment.mentorId);
        const student = students.find(s => s.id === assignment.studentId);
        
        return {
          ...assignment,
          mentorName: mentor?.fullName || 'Unknown Mentor',
          studentName: student?.fullName || 'Unknown Student'
        };
      });
      
      res.json(enrichedAssignments);
    } catch (error) {
      console.error("Get assignments error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch assignments" });
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
