import { users, contacts, mentorRegistrations, studentRegistrations, adminUsers, mentorStudentAssignments, type User, type UpsertUser, type UserRole, type Contact, type InsertContact, type MentorRegistration, type InsertMentorRegistration, type StudentRegistration, type InsertStudentRegistration, type AdminUser, type InsertAdminUser, type MentorStudentAssignment, type InsertMentorStudentAssignment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Storage interface with CRUD operations
export interface IStorage {
  // User operations (Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: UserRole): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  createMentorRegistration(registration: InsertMentorRegistration): Promise<MentorRegistration>;
  getAllMentorRegistrations(): Promise<MentorRegistration[]>;
  updateMentorRegistration(id: number, updates: Partial<MentorRegistration>): Promise<MentorRegistration>;
  deleteMentorRegistration(id: number): Promise<void>;
  createStudentRegistration(registration: InsertStudentRegistration): Promise<StudentRegistration>;
  getAllStudentRegistrations(): Promise<StudentRegistration[]>;
  updateStudentRegistration(id: number, updates: Partial<StudentRegistration>): Promise<StudentRegistration>;
  deleteStudentRegistration(id: number): Promise<void>;
  // Admin authentication
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  // Mentor-Student assignments
  createAssignment(assignment: InsertMentorStudentAssignment): Promise<MentorStudentAssignment>;
  getAllAssignments(): Promise<MentorStudentAssignment[]>;
  deleteAssignment(id: number): Promise<void>;
  getAssignmentsByMentor(mentorId: number): Promise<MentorStudentAssignment[]>;
  getAssignmentsByStudent(studentId: number): Promise<MentorStudentAssignment[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<number, Contact>;
  private mentorRegistrations: Map<number, MentorRegistration>;
  private studentRegistrations: Map<number, StudentRegistration>;
  private currentContactId: number;
  private currentMentorRegistrationId: number;
  private currentStudentRegistrationId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.mentorRegistrations = new Map();
    this.studentRegistrations = new Map();
    this.currentContactId = 1;
    this.currentMentorRegistrationId = 1;
    this.currentStudentRegistrationId = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      role: (userData.role as UserRole) || "student",
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, role, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { 
      ...insertContact,
      subject: insertContact.subject || null,
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createMentorRegistration(insertRegistration: InsertMentorRegistration): Promise<MentorRegistration> {
    const id = this.currentMentorRegistrationId++;
    const registration: MentorRegistration = {
      id,
      linkedinUrl: insertRegistration.linkedinUrl || null,
      fullName: insertRegistration.fullName,
      currentJobTitle: insertRegistration.currentJobTitle || null,
      company: insertRegistration.company || null,
      yearsExperience: insertRegistration.yearsExperience || null,
      education: insertRegistration.education || null,
      skills: insertRegistration.skills || null,
      location: insertRegistration.location || null,
      timeZone: insertRegistration.timeZone || null,
      profileSummary: insertRegistration.profileSummary || null,
      preferredDisciplines: insertRegistration.preferredDisciplines || null,
      mentoringTopics: insertRegistration.mentoringTopics || null,
      availability: insertRegistration.availability || null,
      motivation: insertRegistration.motivation || null,
      agreedToCommitment: insertRegistration.agreedToCommitment || false,
      consentToContact: insertRegistration.consentToContact || false,
      isActive: insertRegistration.isActive ?? true,
      createdAt: new Date()
    };
    this.mentorRegistrations.set(id, registration);
    return registration;
  }

  async getAllMentorRegistrations(): Promise<MentorRegistration[]> {
    return Array.from(this.mentorRegistrations.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createStudentRegistration(insertRegistration: InsertStudentRegistration): Promise<StudentRegistration> {
    const id = this.currentStudentRegistrationId++;
    const registration: StudentRegistration = {
      id,
      fullName: insertRegistration.fullName,
      emailAddress: insertRegistration.emailAddress,
      phoneNumber: insertRegistration.phoneNumber || null,
      universityName: insertRegistration.universityName,
      academicProgram: insertRegistration.academicProgram,
      yearOfStudy: insertRegistration.yearOfStudy,
      nominatedBy: insertRegistration.nominatedBy,
      professorEmail: insertRegistration.professorEmail,
      careerInterests: insertRegistration.careerInterests || null,
      preferredDisciplines: insertRegistration.preferredDisciplines || null,
      mentoringTopics: insertRegistration.mentoringTopics || null,
      mentorshipGoals: insertRegistration.mentorshipGoals || null,
      agreedToCommitment: insertRegistration.agreedToCommitment || false,
      consentToContact: insertRegistration.consentToContact || false,
      isActive: insertRegistration.isActive ?? true,
      createdAt: new Date()
    };
    this.studentRegistrations.set(id, registration);
    return registration;
  }

  async getAllStudentRegistrations(): Promise<StudentRegistration[]> {
    return Array.from(this.studentRegistrations.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateMentorRegistration(id: number, updates: Partial<MentorRegistration>): Promise<MentorRegistration> {
    const registration = this.mentorRegistrations.get(id);
    if (!registration) {
      throw new Error("Mentor registration not found");
    }
    
    const updatedRegistration = { ...registration, ...updates };
    this.mentorRegistrations.set(id, updatedRegistration);
    return updatedRegistration;
  }

  async deleteMentorRegistration(id: number): Promise<void> {
    if (!this.mentorRegistrations.has(id)) {
      throw new Error("Mentor registration not found");
    }
    this.mentorRegistrations.delete(id);
  }

  async updateStudentRegistration(id: number, updates: Partial<StudentRegistration>): Promise<StudentRegistration> {
    const registration = this.studentRegistrations.get(id);
    if (!registration) {
      throw new Error("Student registration not found");
    }
    
    const updatedRegistration = { ...registration, ...updates };
    this.studentRegistrations.set(id, updatedRegistration);
    return updatedRegistration;
  }

  async deleteStudentRegistration(id: number): Promise<void> {
    if (!this.studentRegistrations.has(id)) {
      throw new Error("Student registration not found");
    }
    this.studentRegistrations.delete(id);
  }

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    if (email === "program.admin@aspirelink.org") {
      return {
        id: 1,
        email: "program.admin@aspirelink.org",
        passwordHash: "@sp1reLink",
        isActive: true,
        createdAt: new Date()
      };
    }
    return undefined;
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const id = Date.now();
    const newAdmin: AdminUser = {
      ...admin,
      id,
      createdAt: new Date()
    };
    return newAdmin;
  }

  async createAssignment(assignment: InsertMentorStudentAssignment): Promise<MentorStudentAssignment> {
    const id = Date.now();
    const newAssignment: MentorStudentAssignment = {
      ...assignment,
      id,
      isActive: true,
      assignedAt: new Date()
    };
    return newAssignment;
  }

  async getAllAssignments(): Promise<MentorStudentAssignment[]> {
    return [];
  }

  async deleteAssignment(id: number): Promise<void> {
    // Demo implementation
  }

  async getAssignmentsByMentor(mentorId: number): Promise<MentorStudentAssignment[]> {
    return [];
  }

  async getAssignmentsByStudent(studentId: number): Promise<MentorStudentAssignment[]> {
    return [];
  }
}

export class DatabaseStorage implements IStorage {
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
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

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

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    if (email === "program.admin@aspirelink.org") {
      return {
        id: 1,
        email: "program.admin@aspirelink.org",
        passwordHash: "@sp1reLink",
        isActive: true,
        createdAt: new Date()
      };
    }
    return undefined;
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const [newAdmin] = await db
      .insert(adminUsers)
      .values(admin)
      .returning();
    return newAdmin;
  }

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

  async deleteAssignment(id: number): Promise<void> {
    await db.delete(mentorStudentAssignments).where(eq(mentorStudentAssignments.id, id));
  }

  async getAssignmentsByMentor(mentorId: number): Promise<MentorStudentAssignment[]> {
    return await db.select().from(mentorStudentAssignments).where(eq(mentorStudentAssignments.mentorId, mentorId));
  }

  async getAssignmentsByStudent(studentId: number): Promise<MentorStudentAssignment[]> {
    return await db.select().from(mentorStudentAssignments).where(eq(mentorStudentAssignments.studentId, studentId));
  }
}

export const storage = new DatabaseStorage();
