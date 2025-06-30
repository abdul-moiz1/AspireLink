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
      
      const stats = {
        totalStudents: students.length,
        totalMentors: mentors.length,
        activeStudents: students.filter(s => s.isActive).length,
        activeMentors: mentors.filter(m => m.isActive).length,
        totalAssignments: 0 // Will be implemented when assignments are added
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

  // Get assignments (placeholder for now)
  app.get("/api/admin/assignments", async (req, res) => {
    try {
      // For now return empty array until assignments table is fully implemented
      res.json([]);
    } catch (error) {
      console.error("Get assignments error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch assignments" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
