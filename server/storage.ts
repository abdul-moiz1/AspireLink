import { users, contacts, mentorRegistrations, studentRegistrations, adminUsers, mentorStudentAssignments, type User, type InsertUser, type Contact, type InsertContact, type MentorRegistration, type InsertMentorRegistration, type StudentRegistration, type InsertStudentRegistration, type AdminUser, type InsertAdminUser, type MentorStudentAssignment, type InsertMentorStudentAssignment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Storage interface with CRUD operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
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
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private mentorRegistrations: Map<number, MentorRegistration>;
  private studentRegistrations: Map<number, StudentRegistration>;
  private currentUserId: number;
  private currentContactId: number;
  private currentMentorRegistrationId: number;
  private currentStudentRegistrationId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.mentorRegistrations = new Map();
    this.studentRegistrations = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentMentorRegistrationId = 1;
    this.currentStudentRegistrationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
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
}

export const storage = new DatabaseStorage();
