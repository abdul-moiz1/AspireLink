import { z } from "zod";

// User type for Firebase Auth
export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: string | null;
  mentorRegistrationId: number | null;
  studentRegistrationId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface UpsertUser {
  id?: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  role?: string | null;
  mentorRegistrationId?: number | null;
  studentRegistrationId?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: Date;
}

export interface MentorRegistration {
  id: number;
  userId: string | null;
  emailAddress: string | null;
  linkedinUrl: string | null;
  fullName: string;
  currentJobTitle: string | null;
  company: string | null;
  yearsExperience: number | null;
  education: string | null;
  skills: string[] | null;
  location: string | null;
  timeZone: string | null;
  profileSummary: string | null;
  phoneNumber: string | null;
  preferredDisciplines: string[] | null;
  mentoringTopics: string[] | null;
  availability: string[] | null;
  motivation: string | null;
  agreedToCommitment: boolean | null;
  consentToContact: boolean | null;
  isActive: boolean | null;
  createdAt: Date;
}

export interface StudentRegistration {
  id: number;
  userId: string | null;
  fullName: string;
  emailAddress: string;
  linkedinUrl: string | null;
  phoneNumber: string | null;
  universityName: string | null;
  academicProgram: string | null;
  yearOfStudy: string | null;
  nominatedBy: string;
  professorEmail: string;
  careerInterests: string | null;
  preferredDisciplines: string[] | null;
  mentoringTopics: string[] | null;
  mentorshipGoals: string | null;
  agreedToCommitment: boolean | null;
  consentToContact: boolean | null;
  isActive: boolean | null;
  createdAt: Date;
}

export interface Cohort {
  id: number;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  sessionsPerMonth: number | null;
  sessionDurationMinutes: number | null;
  isActive: boolean | null;
  createdAt: Date;
}

export interface CohortMember {
  id: number;
  cohortId: number;
  userId: string;
  role: string;
  isActive: boolean | null;
  joinedAt: Date;
}

export interface MentorStudentAssignment {
  id: number;
  cohortId: number;
  mentorId: number;
  studentId: number;
  mentorUserId: string | null;
  studentUserId: string | null;
  isActive: boolean | null;
  assignedAt: Date;
}

export interface MentoringSession {
  id: number;
  assignmentId: number;
  cohortId: number;
  scheduledDate: Date;
  scheduledTime: string;
  durationMinutes: number | null;
  status: string | null;
  meetingLink: string | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface AdminUser {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  profileImageUrl: z.string().url().nullable().optional(),
  role: z.string().nullable().optional(),
  mentorRegistrationId: z.number().nullable().optional(),
  studentRegistrationId: z.number().nullable().optional(),
});

export const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().nullable().optional(),
  message: z.string().min(1, "Message is required"),
});

export const insertMentorRegistrationSchema = z.object({
  userId: z.string().nullable().optional(),
  emailAddress: z.string().email().nullable().optional(),
  linkedinUrl: z.string().url().nullable().optional(),
  fullName: z.string().min(1, "Full name is required"),
  currentJobTitle: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  yearsExperience: z.number().nullable().optional(),
  education: z.string().nullable().optional(),
  skills: z.array(z.string()).nullable().optional(),
  location: z.string().nullable().optional(),
  timeZone: z.string().nullable().optional(),
  profileSummary: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  preferredDisciplines: z.array(z.string()).nullable().optional(),
  mentoringTopics: z.array(z.string()).nullable().optional(),
  availability: z.array(z.string()).nullable().optional(),
  motivation: z.string().nullable().optional(),
  agreedToCommitment: z.boolean().nullable().optional(),
  consentToContact: z.boolean().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
});

export const insertStudentRegistrationSchema = z.object({
  userId: z.string().nullable().optional(),
  fullName: z.string().min(1, "Full name is required"),
  emailAddress: z.string().email("Invalid email address"),
  linkedinUrl: z.string().url().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  universityName: z.string().nullable().optional(),
  academicProgram: z.string().nullable().optional(),
  yearOfStudy: z.string().nullable().optional(),
  nominatedBy: z.string().min(1, "Nominator name is required"),
  professorEmail: z.string().email("Invalid professor email"),
  careerInterests: z.string().nullable().optional(),
  preferredDisciplines: z.array(z.string()).nullable().optional(),
  mentoringTopics: z.array(z.string()).nullable().optional(),
  mentorshipGoals: z.string().nullable().optional(),
  agreedToCommitment: z.boolean().nullable().optional(),
  consentToContact: z.boolean().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
});

export const insertCohortSchema = z.object({
  name: z.string().min(1, "Cohort name is required"),
  description: z.string().nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  sessionsPerMonth: z.number().nullable().optional(),
  sessionDurationMinutes: z.number().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
});

export const insertCohortMemberSchema = z.object({
  cohortId: z.number(),
  userId: z.string(),
  role: z.string(),
  isActive: z.boolean().nullable().optional(),
});

export const insertMentorStudentAssignmentSchema = z.object({
  cohortId: z.number().nullable().optional(),
  mentorId: z.number(),
  studentId: z.number(),
  mentorUserId: z.string().nullable().optional(),
  studentUserId: z.string().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
});

export const insertMentoringSessionSchema = z.object({
  assignmentId: z.number(),
  cohortId: z.number(),
  scheduledDate: z.coerce.date(),
  scheduledTime: z.string(),
  durationMinutes: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  meetingLink: z.string().url().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
});

export const insertAdminUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Insert types derived from Zod schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertMentorRegistration = z.infer<typeof insertMentorRegistrationSchema>;
export type InsertStudentRegistration = z.infer<typeof insertStudentRegistrationSchema>;
export type InsertCohort = z.infer<typeof insertCohortSchema>;
export type InsertCohortMember = z.infer<typeof insertCohortMemberSchema>;
export type InsertMentorStudentAssignment = z.infer<typeof insertMentorStudentAssignmentSchema>;
export type InsertMentoringSession = z.infer<typeof insertMentoringSessionSchema>;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
