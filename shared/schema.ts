import { sql } from 'drizzle-orm';
import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
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

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("student"), // 'student', 'mentor', 'admin'
  mentorRegistrationId: integer("mentor_registration_id"),
  studentRegistrationId: integer("student_registration_id"),
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
  userId: varchar("user_id").references(() => users.id),
  linkedinUrl: text("linkedin_url"),
  fullName: text("full_name").notNull(),
  currentJobTitle: text("current_job_title"),
  company: text("company"),
  yearsExperience: integer("years_experience"),
  education: text("education"),
  skills: text("skills").array(),
  location: text("location"),
  timeZone: text("time_zone"),
  profileSummary: text("profile_summary"),
  phoneNumber: text("phone_number"),
  preferredDisciplines: text("preferred_disciplines").array(),
  mentoringTopics: text("mentoring_topics").array(),
  availability: text("availability").array(),
  motivation: text("motivation"),
  agreedToCommitment: boolean("agreed_to_commitment").default(false),
  consentToContact: boolean("consent_to_contact").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentRegistrations = pgTable("student_registrations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  fullName: text("full_name").notNull(),
  emailAddress: text("email_address").notNull(),
  linkedinUrl: text("linkedin_url"),
  phoneNumber: text("phone_number"),
  universityName: text("university_name"),
  academicProgram: text("academic_program"),
  yearOfStudy: text("year_of_study"),
  nominatedBy: text("nominated_by").notNull(),
  professorEmail: text("professor_email").notNull(),
  careerInterests: text("career_interests"),
  preferredDisciplines: text("preferred_disciplines").array(),
  mentoringTopics: text("mentoring_topics").array(),
  mentorshipGoals: text("mentorship_goals"),
  agreedToCommitment: boolean("agreed_to_commitment").default(false),
  consentToContact: boolean("consent_to_contact").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cohorts table
export const cohorts = pgTable("cohorts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  sessionsPerMonth: integer("sessions_per_month").default(2),
  sessionDurationMinutes: integer("session_duration_minutes").default(30),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cohort members (students and mentors assigned to cohorts)
export const cohortMembers = pgTable("cohort_members", {
  id: serial("id").primaryKey(),
  cohortId: integer("cohort_id").notNull().references(() => cohorts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").notNull(), // 'student' or 'mentor'
  isActive: boolean("is_active").default(true),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Mentor-Student assignments within cohorts
export const mentorStudentAssignments = pgTable("mentor_student_assignments", {
  id: serial("id").primaryKey(),
  cohortId: integer("cohort_id").notNull().references(() => cohorts.id),
  mentorId: integer("mentor_id").notNull().references(() => mentorRegistrations.id),
  studentId: integer("student_id").notNull().references(() => studentRegistrations.id),
  mentorUserId: varchar("mentor_user_id").references(() => users.id),
  studentUserId: varchar("student_user_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

// Mentoring sessions
export const mentoringSessions = pgTable("mentoring_sessions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => mentorStudentAssignments.id),
  cohortId: integer("cohort_id").notNull().references(() => cohorts.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  durationMinutes: integer("duration_minutes").default(30),
  status: varchar("status").default("scheduled"), // 'scheduled', 'completed', 'cancelled', 'rescheduled'
  meetingLink: text("meeting_link"),
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin users table (keeping for backwards compatibility)
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

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

export const insertCohortSchema = createInsertSchema(cohorts).omit({
  id: true,
  createdAt: true,
});

export const insertCohortMemberSchema = createInsertSchema(cohortMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertMentorStudentAssignmentSchema = createInsertSchema(mentorStudentAssignments).omit({
  id: true,
  assignedAt: true,
});

export const insertMentoringSessionSchema = createInsertSchema(mentoringSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertMentorRegistration = z.infer<typeof insertMentorRegistrationSchema>;
export type MentorRegistration = typeof mentorRegistrations.$inferSelect;
export type InsertStudentRegistration = z.infer<typeof insertStudentRegistrationSchema>;
export type StudentRegistration = typeof studentRegistrations.$inferSelect;
export type InsertCohort = z.infer<typeof insertCohortSchema>;
export type Cohort = typeof cohorts.$inferSelect;
export type InsertCohortMember = z.infer<typeof insertCohortMemberSchema>;
export type CohortMember = typeof cohortMembers.$inferSelect;
export type InsertMentorStudentAssignment = z.infer<typeof insertMentorStudentAssignmentSchema>;
export type MentorStudentAssignment = typeof mentorStudentAssignments.$inferSelect;
export type InsertMentoringSession = z.infer<typeof insertMentoringSessionSchema>;
export type MentoringSession = typeof mentoringSessions.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
