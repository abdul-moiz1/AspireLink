import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth with role support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["student", "mentor"] }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mentorRegistrations = pgTable("mentor_registrations", {
  id: serial("id").primaryKey(),
  // Basic contact info
  fullName: text("full_name").notNull(),
  emailAddress: text("email_address").notNull(),
  // Professional data
  linkedinUrl: text("linkedin_url"),
  currentJobTitle: text("current_job_title"),
  company: text("company"),
  yearsExperience: integer("years_experience"),
  education: text("education"),
  skills: text("skills").array(),
  location: text("location"),
  timeZone: text("time_zone"),
  profileSummary: text("profile_summary"),
  // Mentorship-specific fields
  preferredDisciplines: text("preferred_disciplines").array(),
  mentoringTopics: text("mentoring_topics").array(),
  availability: text("availability").array(),
  motivation: text("motivation"),
  agreedToCommitment: boolean("agreed_to_commitment").default(false),
  consentToContact: boolean("consent_to_contact").default(false),
  // Admin fields
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentRegistrations = pgTable("student_registrations", {
  id: serial("id").primaryKey(),
  // Basic Information
  fullName: text("full_name").notNull(),
  emailAddress: text("email_address").notNull(),
  phoneNumber: text("phone_number"),
  universityName: text("university_name").notNull(),
  academicProgram: text("academic_program").notNull(),
  yearOfStudy: text("year_of_study").notNull(),
  // Nomination Verification
  nominatedBy: text("nominated_by").notNull(),
  professorEmail: text("professor_email").notNull(),
  // Mentorship Matching
  careerInterests: text("career_interests"),
  preferredDisciplines: text("preferred_disciplines").array(),
  mentoringTopics: text("mentoring_topics").array(),
  mentorshipGoals: text("mentorship_goals"),
  // Consent & Confirmation
  agreedToCommitment: boolean("agreed_to_commitment").default(false),
  consentToContact: boolean("consent_to_contact").default(false),
  // Admin fields
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mentor-Student assignments table
export const mentorStudentAssignments = pgTable("mentor_student_assignments", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").notNull().references(() => mentorRegistrations.id),
  studentId: integer("student_id").notNull().references(() => studentRegistrations.id),
  isActive: boolean("is_active").default(true),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

// Upsert user schema for Replit Auth
export const upsertUserSchema = createInsertSchema(users);

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertMentorRegistrationSchema = createInsertSchema(mentorRegistrations).omit({
  id: true,
  createdAt: true,
});

export const insertStudentRegistrationSchema = createInsertSchema(studentRegistrations).omit({
  id: true,
  createdAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertMentorStudentAssignmentSchema = createInsertSchema(mentorStudentAssignments).omit({
  id: true,
  assignedAt: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertMentorRegistration = z.infer<typeof insertMentorRegistrationSchema>;
export type MentorRegistration = typeof mentorRegistrations.$inferSelect;
export type InsertStudentRegistration = z.infer<typeof insertStudentRegistrationSchema>;
export type StudentRegistration = typeof studentRegistrations.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertMentorStudentAssignment = z.infer<typeof insertMentorStudentAssignmentSchema>;
export type MentorStudentAssignment = typeof mentorStudentAssignments.$inferSelect;
