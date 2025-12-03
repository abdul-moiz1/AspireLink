import { 
  type User, 
  type UpsertUser, 
  type Contact, 
  type InsertContact, 
  type MentorRegistration, 
  type InsertMentorRegistration, 
  type StudentRegistration, 
  type InsertStudentRegistration, 
  type AdminUser, 
  type InsertAdminUser, 
  type MentorStudentAssignment, 
  type InsertMentorStudentAssignment,
  type Cohort,
  type InsertCohort,
  type CohortMember,
  type InsertCohortMember,
  type MentoringSession,
  type InsertMentoringSession
} from "@shared/schema";

export interface IStorage {
  // User operations (for Firebase Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string, registrationId?: number): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  
  // Mentor registration operations
  createMentorRegistration(registration: InsertMentorRegistration): Promise<MentorRegistration>;
  getAllMentorRegistrations(): Promise<MentorRegistration[]>;
  getMentorRegistration(id: number): Promise<MentorRegistration | undefined>;
  getMentorByUserId(userId: string): Promise<MentorRegistration | undefined>;
  updateMentorRegistration(id: number, updates: Partial<MentorRegistration>): Promise<MentorRegistration>;
  deleteMentorRegistration(id: number): Promise<void>;
  
  // Student registration operations
  createStudentRegistration(registration: InsertStudentRegistration): Promise<StudentRegistration>;
  getAllStudentRegistrations(): Promise<StudentRegistration[]>;
  getStudentRegistration(id: number): Promise<StudentRegistration | undefined>;
  getStudentByUserId(userId: string): Promise<StudentRegistration | undefined>;
  getStudentByEmail(email: string): Promise<StudentRegistration | undefined>;
  updateStudentRegistration(id: number, updates: Partial<StudentRegistration>): Promise<StudentRegistration>;
  deleteStudentRegistration(id: number): Promise<void>;
  
  // Mentor registration email lookup
  getMentorByEmail(email: string): Promise<MentorRegistration | undefined>;
  
  // Admin operations
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  
  // Cohort operations
  createCohort(cohort: InsertCohort): Promise<Cohort>;
  getAllCohorts(): Promise<Cohort[]>;
  getCohort(id: number): Promise<Cohort | undefined>;
  updateCohort(id: number, updates: Partial<Cohort>): Promise<Cohort>;
  deleteCohort(id: number): Promise<void>;
  
  // Cohort member operations
  addCohortMember(member: InsertCohortMember): Promise<CohortMember>;
  getCohortMembers(cohortId: number): Promise<CohortMember[]>;
  getUserCohorts(userId: string): Promise<Cohort[]>;
  removeCohortMember(cohortId: number, userId: string): Promise<void>;
  
  // Assignment operations
  createAssignment(assignment: InsertMentorStudentAssignment): Promise<MentorStudentAssignment>;
  getAllAssignments(): Promise<MentorStudentAssignment[]>;
  getAssignmentsByCohort(cohortId: number): Promise<MentorStudentAssignment[]>;
  getAssignmentsByMentor(mentorId: number): Promise<MentorStudentAssignment[]>;
  getAssignmentsByStudent(studentId: number): Promise<MentorStudentAssignment[]>;
  getAssignmentsByMentorUserId(userId: string): Promise<MentorStudentAssignment[]>;
  getAssignmentsByStudentUserId(userId: string): Promise<MentorStudentAssignment[]>;
  deleteAssignment(id: number): Promise<void>;
  
  // Session operations
  createSession(session: InsertMentoringSession): Promise<MentoringSession>;
  getSessionsByAssignment(assignmentId: number): Promise<MentoringSession[]>;
  getSessionsByCohort(cohortId: number): Promise<MentoringSession[]>;
  updateSession(id: number, updates: Partial<MentoringSession>): Promise<MentoringSession>;
  deleteSession(id: number): Promise<void>;
}

import { isFirebaseEnabled } from './firebase';
import { FirestoreStorage } from './firestoreStorage';

// Ensure Firebase is properly configured before creating storage
if (!isFirebaseEnabled()) {
  console.error('CRITICAL: Firebase is not initialized. Please ensure all Firebase environment variables are set:');
  console.error('  - FIREBASE_PROJECT_ID');
  console.error('  - FIREBASE_PRIVATE_KEY');
  console.error('  - FIREBASE_PRIVATE_KEY_ID');
  console.error('  - FIREBASE_CLIENT_EMAIL');
  console.error('  - FIREBASE_CLIENT_ID');
  console.error('  - FIREBASE_CERT_URL');
}

// Use Firestore for all storage operations
export const storage: IStorage = new FirestoreStorage();
