import { 
  users, 
  contacts, 
  mentorRegistrations, 
  studentRegistrations, 
  adminUsers, 
  mentorStudentAssignments,
  cohorts,
  cohortMembers,
  mentoringSessions,
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
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations (for Replit Auth)
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
  updateStudentRegistration(id: number, updates: Partial<StudentRegistration>): Promise<StudentRegistration>;
  deleteStudentRegistration(id: number): Promise<void>;
  
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

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string, registrationId?: number): Promise<User> {
    const updateData: any = { role, updatedAt: new Date() };
    if (role === 'mentor' && registrationId) {
      updateData.mentorRegistrationId = registrationId;
    } else if (role === 'student' && registrationId) {
      updateData.studentRegistrationId = registrationId;
    }
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  // Mentor registration operations
  async createMentorRegistration(insertRegistration: InsertMentorRegistration): Promise<MentorRegistration> {
    const [registration] = await db
      .insert(mentorRegistrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async getAllMentorRegistrations(): Promise<MentorRegistration[]> {
    return await db.select().from(mentorRegistrations);
  }

  async getMentorRegistration(id: number): Promise<MentorRegistration | undefined> {
    const [mentor] = await db.select().from(mentorRegistrations).where(eq(mentorRegistrations.id, id));
    return mentor || undefined;
  }

  async getMentorByUserId(userId: string): Promise<MentorRegistration | undefined> {
    const [mentor] = await db.select().from(mentorRegistrations).where(eq(mentorRegistrations.userId, userId));
    return mentor || undefined;
  }

  async updateMentorRegistration(id: number, updates: Partial<MentorRegistration>): Promise<MentorRegistration> {
    const [updatedMentor] = await db
      .update(mentorRegistrations)
      .set(updates)
      .where(eq(mentorRegistrations.id, id))
      .returning();
    return updatedMentor;
  }

  async deleteMentorRegistration(id: number): Promise<void> {
    await db.delete(mentorRegistrations).where(eq(mentorRegistrations.id, id));
  }

  // Student registration operations
  async createStudentRegistration(insertRegistration: InsertStudentRegistration): Promise<StudentRegistration> {
    const [registration] = await db
      .insert(studentRegistrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async getAllStudentRegistrations(): Promise<StudentRegistration[]> {
    return await db.select().from(studentRegistrations);
  }

  async getStudentRegistration(id: number): Promise<StudentRegistration | undefined> {
    const [student] = await db.select().from(studentRegistrations).where(eq(studentRegistrations.id, id));
    return student || undefined;
  }

  async getStudentByUserId(userId: string): Promise<StudentRegistration | undefined> {
    const [student] = await db.select().from(studentRegistrations).where(eq(studentRegistrations.userId, userId));
    return student || undefined;
  }

  async updateStudentRegistration(id: number, updates: Partial<StudentRegistration>): Promise<StudentRegistration> {
    const [updatedStudent] = await db
      .update(studentRegistrations)
      .set(updates)
      .where(eq(studentRegistrations.id, id))
      .returning();
    return updatedStudent;
  }

  async deleteStudentRegistration(id: number): Promise<void> {
    await db.delete(studentRegistrations).where(eq(studentRegistrations.id, id));
  }

  // Admin operations
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return admin || undefined;
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const [newAdmin] = await db
      .insert(adminUsers)
      .values(admin)
      .returning();
    return newAdmin;
  }

  // Cohort operations
  async createCohort(insertCohort: InsertCohort): Promise<Cohort> {
    const [cohort] = await db
      .insert(cohorts)
      .values(insertCohort)
      .returning();
    return cohort;
  }

  async getAllCohorts(): Promise<Cohort[]> {
    return await db.select().from(cohorts);
  }

  async getCohort(id: number): Promise<Cohort | undefined> {
    const [cohort] = await db.select().from(cohorts).where(eq(cohorts.id, id));
    return cohort || undefined;
  }

  async updateCohort(id: number, updates: Partial<Cohort>): Promise<Cohort> {
    const [updatedCohort] = await db
      .update(cohorts)
      .set(updates)
      .where(eq(cohorts.id, id))
      .returning();
    return updatedCohort;
  }

  async deleteCohort(id: number): Promise<void> {
    await db.delete(cohorts).where(eq(cohorts.id, id));
  }

  // Cohort member operations
  async addCohortMember(member: InsertCohortMember): Promise<CohortMember> {
    const [cohortMember] = await db
      .insert(cohortMembers)
      .values(member)
      .returning();
    return cohortMember;
  }

  async getCohortMembers(cohortId: number): Promise<CohortMember[]> {
    return await db.select().from(cohortMembers).where(eq(cohortMembers.cohortId, cohortId));
  }

  async getUserCohorts(userId: string): Promise<Cohort[]> {
    const members = await db.select().from(cohortMembers).where(eq(cohortMembers.userId, userId));
    const cohortIds = members.map(m => m.cohortId);
    if (cohortIds.length === 0) return [];
    
    const result: Cohort[] = [];
    for (const cohortId of cohortIds) {
      const cohort = await this.getCohort(cohortId);
      if (cohort) result.push(cohort);
    }
    return result;
  }

  async removeCohortMember(cohortId: number, userId: string): Promise<void> {
    await db.delete(cohortMembers).where(
      and(
        eq(cohortMembers.cohortId, cohortId),
        eq(cohortMembers.userId, userId)
      )
    );
  }

  // Assignment operations
  async createAssignment(assignment: InsertMentorStudentAssignment): Promise<MentorStudentAssignment> {
    const [newAssignment] = await db
      .insert(mentorStudentAssignments)
      .values(assignment)
      .returning();
    return newAssignment;
  }

  async getAllAssignments(): Promise<MentorStudentAssignment[]> {
    return await db.select().from(mentorStudentAssignments);
  }

  async getAssignmentsByCohort(cohortId: number): Promise<MentorStudentAssignment[]> {
    return await db.select().from(mentorStudentAssignments).where(eq(mentorStudentAssignments.cohortId, cohortId));
  }

  async getAssignmentsByMentor(mentorId: number): Promise<MentorStudentAssignment[]> {
    return await db.select().from(mentorStudentAssignments).where(eq(mentorStudentAssignments.mentorId, mentorId));
  }

  async getAssignmentsByStudent(studentId: number): Promise<MentorStudentAssignment[]> {
    return await db.select().from(mentorStudentAssignments).where(eq(mentorStudentAssignments.studentId, studentId));
  }

  async getAssignmentsByMentorUserId(userId: string): Promise<MentorStudentAssignment[]> {
    return await db.select().from(mentorStudentAssignments).where(eq(mentorStudentAssignments.mentorUserId, userId));
  }

  async getAssignmentsByStudentUserId(userId: string): Promise<MentorStudentAssignment[]> {
    return await db.select().from(mentorStudentAssignments).where(eq(mentorStudentAssignments.studentUserId, userId));
  }

  async deleteAssignment(id: number): Promise<void> {
    await db.delete(mentorStudentAssignments).where(eq(mentorStudentAssignments.id, id));
  }

  // Session operations
  async createSession(session: InsertMentoringSession): Promise<MentoringSession> {
    const [newSession] = await db
      .insert(mentoringSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getSessionsByAssignment(assignmentId: number): Promise<MentoringSession[]> {
    return await db.select().from(mentoringSessions).where(eq(mentoringSessions.assignmentId, assignmentId));
  }

  async getSessionsByCohort(cohortId: number): Promise<MentoringSession[]> {
    return await db.select().from(mentoringSessions).where(eq(mentoringSessions.cohortId, cohortId));
  }

  async updateSession(id: number, updates: Partial<MentoringSession>): Promise<MentoringSession> {
    const [updatedSession] = await db
      .update(mentoringSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(mentoringSessions.id, id))
      .returning();
    return updatedSession;
  }

  async deleteSession(id: number): Promise<void> {
    await db.delete(mentoringSessions).where(eq(mentoringSessions.id, id));
  }
}

export const storage = new DatabaseStorage();
