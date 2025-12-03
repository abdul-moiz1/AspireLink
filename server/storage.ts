import { 
  type User, 
  type UpsertUser, 
  type Contact, 
  type InsertContact, 
  type Cohort,
  type InsertCohort,
  type CohortMember,
  type InsertCohortMember,
  type Assignment,
  type InsertAssignment,
  type MentoringSession,
  type InsertMentoringSession,
  type StudentRegistration,
  type InsertStudentRegistration,
  type MentorRegistration,
  type InsertMentorRegistration
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: 'admin' | 'mentor' | 'student'): Promise<User[]>;
  deleteUser(id: string): Promise<void>;
  
  // Student Registration operations (no auth required)
  createStudentRegistration(data: InsertStudentRegistration): Promise<StudentRegistration>;
  getStudentRegistration(id: string): Promise<StudentRegistration | undefined>;
  getStudentRegistrationByEmail(email: string): Promise<StudentRegistration | undefined>;
  updateStudentRegistration(id: string, updates: Partial<StudentRegistration>): Promise<StudentRegistration>;
  getAllStudentRegistrations(): Promise<StudentRegistration[]>;
  
  // Mentor Registration operations (no auth required)
  createMentorRegistration(data: InsertMentorRegistration): Promise<MentorRegistration>;
  getMentorRegistration(id: string): Promise<MentorRegistration | undefined>;
  getMentorRegistrationByEmail(email: string): Promise<MentorRegistration | undefined>;
  updateMentorRegistration(id: string, updates: Partial<MentorRegistration>): Promise<MentorRegistration>;
  getAllMentorRegistrations(): Promise<MentorRegistration[]>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  
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
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  getAllAssignments(): Promise<Assignment[]>;
  getAssignmentsByCohort(cohortId: number): Promise<Assignment[]>;
  getAssignmentsByMentor(mentorUserId: string): Promise<Assignment[]>;
  getAssignmentsByStudent(studentUserId: string): Promise<Assignment[]>;
  getAssignment(id: number): Promise<Assignment | undefined>;
  updateAssignment(id: number, updates: Partial<Assignment>): Promise<Assignment | null>;
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

if (!isFirebaseEnabled()) {
  console.error('CRITICAL: Firebase is not initialized. Please ensure all Firebase environment variables are set:');
  console.error('  - FIREBASE_PROJECT_ID');
  console.error('  - FIREBASE_PRIVATE_KEY');
  console.error('  - FIREBASE_PRIVATE_KEY_ID');
  console.error('  - FIREBASE_CLIENT_EMAIL');
  console.error('  - FIREBASE_CLIENT_ID');
  console.error('  - FIREBASE_CERT_URL');
}

export const storage: IStorage = new FirestoreStorage();
