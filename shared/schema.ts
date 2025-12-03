import { z } from "zod";

// Unified User type - handles admin, mentor, and student roles
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'mentor' | 'student' | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Basic profile (all users)
  fullName: string | null;
  phoneNumber: string | null;
  linkedinUrl: string | null;
  profileImageUrl: string | null;
  
  // Mentor-specific fields
  currentJobTitle: string | null;
  company: string | null;
  yearsExperience: number | null;
  education: string | null;
  skills: string[] | null;
  location: string | null;
  timeZone: string | null;
  profileSummary: string | null;
  availability: string[] | null;
  motivation: string | null;
  
  // Student-specific fields
  universityName: string | null;
  academicProgram: string | null;
  yearOfStudy: string | null;
  nominatedBy: string | null;
  professorEmail: string | null;
  careerInterests: string | null;
  mentorshipGoals: string | null;
  
  // Shared preferences (mentor & student)
  preferredDisciplines: string[] | null;
  mentoringTopics: string[] | null;
  
  // Consent flags
  agreedToCommitment: boolean | null;
  consentToContact: boolean | null;
}

export interface UpsertUser {
  id?: string;
  email: string;
  role?: 'admin' | 'mentor' | 'student' | null;
  isActive?: boolean;
  fullName?: string | null;
  phoneNumber?: string | null;
  linkedinUrl?: string | null;
  profileImageUrl?: string | null;
  currentJobTitle?: string | null;
  company?: string | null;
  yearsExperience?: number | null;
  education?: string | null;
  skills?: string[] | null;
  location?: string | null;
  timeZone?: string | null;
  profileSummary?: string | null;
  availability?: string[] | null;
  motivation?: string | null;
  universityName?: string | null;
  academicProgram?: string | null;
  yearOfStudy?: string | null;
  nominatedBy?: string | null;
  professorEmail?: string | null;
  careerInterests?: string | null;
  mentorshipGoals?: string | null;
  preferredDisciplines?: string[] | null;
  mentoringTopics?: string[] | null;
  agreedToCommitment?: boolean | null;
  consentToContact?: boolean | null;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
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
  isActive: boolean;
  createdAt: Date;
}

export interface CohortMember {
  id: number;
  cohortId: number;
  userId: string;
  role: 'mentor' | 'student';
  isActive: boolean;
  joinedAt: Date;
}

export interface Assignment {
  id: number;
  cohortId: number;
  mentorUserId: string;
  studentUserId: string;
  isActive: boolean;
  assignedAt: Date;
}

export interface MentoringSession {
  id: number;
  assignmentId: number;
  cohortId: number;
  scheduledDate: Date;
  scheduledTime: string;
  durationMinutes: number | null;
  status: 'scheduled' | 'completed' | 'cancelled' | null;
  meetingLink: string | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  role: z.enum(['admin', 'mentor', 'student']).nullable().optional(),
  isActive: z.boolean().optional().default(true),
  fullName: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  linkedinUrl: z.string().url().nullable().optional().or(z.literal('')),
  profileImageUrl: z.string().url().nullable().optional(),
  currentJobTitle: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  yearsExperience: z.number().nullable().optional(),
  education: z.string().nullable().optional(),
  skills: z.array(z.string()).nullable().optional(),
  location: z.string().nullable().optional(),
  timeZone: z.string().nullable().optional(),
  profileSummary: z.string().nullable().optional(),
  availability: z.array(z.string()).nullable().optional(),
  motivation: z.string().nullable().optional(),
  universityName: z.string().nullable().optional(),
  academicProgram: z.string().nullable().optional(),
  yearOfStudy: z.string().nullable().optional(),
  nominatedBy: z.string().nullable().optional(),
  professorEmail: z.string().email().nullable().optional().or(z.literal('')),
  careerInterests: z.string().nullable().optional(),
  mentorshipGoals: z.string().nullable().optional(),
  preferredDisciplines: z.array(z.string()).nullable().optional(),
  mentoringTopics: z.array(z.string()).nullable().optional(),
  agreedToCommitment: z.boolean().nullable().optional(),
  consentToContact: z.boolean().nullable().optional(),
});

export const insertMentorSchema = insertUserSchema.extend({
  fullName: z.string().min(1, "Full name is required"),
  currentJobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  agreedToCommitment: z.boolean().refine(val => val === true, "You must agree to the commitment"),
  consentToContact: z.boolean().refine(val => val === true, "You must consent to contact"),
});

export const insertStudentSchema = insertUserSchema.extend({
  fullName: z.string().min(1, "Full name is required"),
  universityName: z.string().min(1, "University name is required"),
  nominatedBy: z.string().nullable().optional(),
  professorEmail: z.string().email("Invalid professor email").nullable().optional().or(z.literal('')),
  agreedToCommitment: z.boolean().refine(val => val === true, "You must agree to the commitment"),
  consentToContact: z.boolean().refine(val => val === true, "You must consent to contact"),
});

export const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().nullable().optional(),
  message: z.string().min(1, "Message is required"),
});

export const insertCohortSchema = z.object({
  name: z.string().min(1, "Cohort name is required"),
  description: z.string().nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  sessionsPerMonth: z.number().nullable().optional(),
  sessionDurationMinutes: z.number().nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

export const insertCohortMemberSchema = z.object({
  cohortId: z.number(),
  userId: z.string(),
  role: z.enum(['mentor', 'student']),
  isActive: z.boolean().optional().default(true),
});

export const insertAssignmentSchema = z.object({
  cohortId: z.number(),
  mentorUserId: z.string(),
  studentUserId: z.string(),
  isActive: z.boolean().optional().default(true),
});

export const insertMentoringSessionSchema = z.object({
  assignmentId: z.number(),
  cohortId: z.number(),
  scheduledDate: z.coerce.date(),
  scheduledTime: z.string(),
  durationMinutes: z.number().nullable().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).nullable().optional(),
  meetingLink: z.string().url().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
});

// Insert types derived from Zod schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertCohort = z.infer<typeof insertCohortSchema>;
export type InsertCohortMember = z.infer<typeof insertCohortMemberSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type InsertMentoringSession = z.infer<typeof insertMentoringSessionSchema>;
