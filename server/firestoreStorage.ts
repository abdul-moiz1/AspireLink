import { db, isFirebaseEnabled } from './firebase';
import type { 
  User, 
  UpsertUser, 
  Contact, 
  InsertContact, 
  MentorRegistration, 
  InsertMentorRegistration, 
  StudentRegistration, 
  InsertStudentRegistration, 
  Cohort,
  InsertCohort,
  CohortMember,
  InsertCohortMember,
  MentorStudentAssignment, 
  InsertMentorStudentAssignment,
  MentoringSession,
  InsertMentoringSession,
  AdminUser,
  InsertAdminUser
} from '@shared/schema';
import type { IStorage } from './storage';

export class FirestoreStorage implements IStorage {
  private getDb() {
    if (!db) throw new Error('Firestore not initialized');
    return db;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const doc = await this.getDb().collection('users').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as User;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || this.getDb().collection('users').doc().id;
    const now = new Date();
    const data = {
      ...userData,
      updatedAt: now,
      createdAt: userData.createdAt || now,
    };
    await this.getDb().collection('users').doc(id).set(data, { merge: true });
    return { id, ...data } as User;
  }

  async updateUserRole(id: string, role: string, registrationId?: number): Promise<User> {
    const updateData: any = { role, updatedAt: new Date() };
    if (role === 'mentor' && registrationId) {
      updateData.mentorRegistrationId = registrationId;
    } else if (role === 'student' && registrationId) {
      updateData.studentRegistrationId = registrationId;
    }
    await this.getDb().collection('users').doc(id).update(updateData);
    const user = await this.getUser(id);
    return user!;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const snapshot = await this.getDb().collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const docRef = this.getDb().collection('contacts').doc();
    const data = {
      ...insertContact,
      createdAt: new Date(),
    };
    await docRef.set(data);
    return { id: parseInt(docRef.id) || Date.now(), ...data } as Contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    const snapshot = await this.getDb().collection('contacts').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: parseInt(doc.id) || Date.now(), ...doc.data() })) as Contact[];
  }

  // Mentor registration operations
  async createMentorRegistration(insertRegistration: InsertMentorRegistration): Promise<MentorRegistration> {
    const counterRef = this.getDb().collection('counters').doc('mentorRegistrations');
    const counterDoc = await counterRef.get();
    const nextId = (counterDoc.exists ? counterDoc.data()?.count || 0 : 0) + 1;
    await counterRef.set({ count: nextId });

    const docRef = this.getDb().collection('mentorRegistrations').doc(nextId.toString());
    const data = {
      ...insertRegistration,
      id: nextId,
      isActive: insertRegistration.isActive ?? true,
      createdAt: new Date(),
    };
    await docRef.set(data);
    return data as MentorRegistration;
  }

  async getAllMentorRegistrations(): Promise<MentorRegistration[]> {
    const snapshot = await this.getDb().collection('mentorRegistrations').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data()) as MentorRegistration[];
  }

  async getMentorRegistration(id: number): Promise<MentorRegistration | undefined> {
    const doc = await this.getDb().collection('mentorRegistrations').doc(id.toString()).get();
    if (!doc.exists) return undefined;
    return doc.data() as MentorRegistration;
  }

  async getMentorByUserId(userId: string): Promise<MentorRegistration | undefined> {
    const snapshot = await this.getDb().collection('mentorRegistrations').where('userId', '==', userId).limit(1).get();
    if (snapshot.empty) return undefined;
    return snapshot.docs[0].data() as MentorRegistration;
  }

  async updateMentorRegistration(id: number, updates: Partial<MentorRegistration>): Promise<MentorRegistration> {
    await this.getDb().collection('mentorRegistrations').doc(id.toString()).update(updates);
    const mentor = await this.getMentorRegistration(id);
    return mentor!;
  }

  async deleteMentorRegistration(id: number): Promise<void> {
    await this.getDb().collection('mentorRegistrations').doc(id.toString()).delete();
  }

  // Student registration operations
  async createStudentRegistration(insertRegistration: InsertStudentRegistration): Promise<StudentRegistration> {
    const counterRef = this.getDb().collection('counters').doc('studentRegistrations');
    const counterDoc = await counterRef.get();
    const nextId = (counterDoc.exists ? counterDoc.data()?.count || 0 : 0) + 1;
    await counterRef.set({ count: nextId });

    const docRef = this.getDb().collection('studentRegistrations').doc(nextId.toString());
    const data = {
      ...insertRegistration,
      id: nextId,
      isActive: insertRegistration.isActive ?? true,
      createdAt: new Date(),
    };
    await docRef.set(data);
    return data as StudentRegistration;
  }

  async getAllStudentRegistrations(): Promise<StudentRegistration[]> {
    const snapshot = await this.getDb().collection('studentRegistrations').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data()) as StudentRegistration[];
  }

  async getStudentRegistration(id: number): Promise<StudentRegistration | undefined> {
    const doc = await this.getDb().collection('studentRegistrations').doc(id.toString()).get();
    if (!doc.exists) return undefined;
    return doc.data() as StudentRegistration;
  }

  async getStudentByUserId(userId: string): Promise<StudentRegistration | undefined> {
    const snapshot = await this.getDb().collection('studentRegistrations').where('userId', '==', userId).limit(1).get();
    if (snapshot.empty) return undefined;
    return snapshot.docs[0].data() as StudentRegistration;
  }

  async updateStudentRegistration(id: number, updates: Partial<StudentRegistration>): Promise<StudentRegistration> {
    await this.getDb().collection('studentRegistrations').doc(id.toString()).update(updates);
    const student = await this.getStudentRegistration(id);
    return student!;
  }

  async deleteStudentRegistration(id: number): Promise<void> {
    await this.getDb().collection('studentRegistrations').doc(id.toString()).delete();
  }

  // Admin operations
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const snapshot = await this.getDb().collection('adminUsers').where('email', '==', email).limit(1).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: parseInt(doc.id) || Date.now(), ...doc.data() } as AdminUser;
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const docRef = this.getDb().collection('adminUsers').doc();
    const data = {
      ...admin,
      createdAt: new Date(),
    };
    await docRef.set(data);
    return { id: parseInt(docRef.id) || Date.now(), ...data } as AdminUser;
  }

  // Cohort operations
  async createCohort(insertCohort: InsertCohort): Promise<Cohort> {
    const counterRef = this.getDb().collection('counters').doc('cohorts');
    const counterDoc = await counterRef.get();
    const nextId = (counterDoc.exists ? counterDoc.data()?.count || 0 : 0) + 1;
    await counterRef.set({ count: nextId });

    const docRef = this.getDb().collection('cohorts').doc(nextId.toString());
    const data = {
      ...insertCohort,
      id: nextId,
      isActive: insertCohort.isActive ?? true,
      createdAt: new Date(),
    };
    await docRef.set(data);
    return data as Cohort;
  }

  async getAllCohorts(): Promise<Cohort[]> {
    const snapshot = await this.getDb().collection('cohorts').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data()) as Cohort[];
  }

  async getCohort(id: number): Promise<Cohort | undefined> {
    const doc = await this.getDb().collection('cohorts').doc(id.toString()).get();
    if (!doc.exists) return undefined;
    return doc.data() as Cohort;
  }

  async updateCohort(id: number, updates: Partial<Cohort>): Promise<Cohort> {
    await this.getDb().collection('cohorts').doc(id.toString()).update(updates);
    const cohort = await this.getCohort(id);
    return cohort!;
  }

  async deleteCohort(id: number): Promise<void> {
    await this.getDb().collection('cohorts').doc(id.toString()).delete();
  }

  // Cohort member operations
  async addCohortMember(member: InsertCohortMember): Promise<CohortMember> {
    const counterRef = this.getDb().collection('counters').doc('cohortMembers');
    const counterDoc = await counterRef.get();
    const nextId = (counterDoc.exists ? counterDoc.data()?.count || 0 : 0) + 1;
    await counterRef.set({ count: nextId });

    const docRef = this.getDb().collection('cohortMembers').doc(nextId.toString());
    const data = {
      ...member,
      id: nextId,
      isActive: member.isActive ?? true,
      joinedAt: new Date(),
    };
    await docRef.set(data);
    return data as CohortMember;
  }

  async getCohortMembers(cohortId: number): Promise<CohortMember[]> {
    const snapshot = await this.getDb().collection('cohortMembers').where('cohortId', '==', cohortId).get();
    return snapshot.docs.map(doc => doc.data()) as CohortMember[];
  }

  async getUserCohorts(userId: string): Promise<Cohort[]> {
    const membersSnapshot = await this.getDb().collection('cohortMembers').where('userId', '==', userId).get();
    const cohortIds = membersSnapshot.docs.map(doc => doc.data().cohortId);
    if (cohortIds.length === 0) return [];
    
    const cohorts: Cohort[] = [];
    for (const cohortId of cohortIds) {
      const cohort = await this.getCohort(cohortId);
      if (cohort) cohorts.push(cohort);
    }
    return cohorts;
  }

  async removeCohortMember(cohortId: number, userId: string): Promise<void> {
    const snapshot = await this.getDb().collection('cohortMembers')
      .where('cohortId', '==', cohortId)
      .where('userId', '==', userId)
      .get();
    
    const batch = this.getDb().batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // Assignment operations
  async createAssignment(assignment: InsertMentorStudentAssignment): Promise<MentorStudentAssignment> {
    const counterRef = this.getDb().collection('counters').doc('assignments');
    const counterDoc = await counterRef.get();
    const nextId = (counterDoc.exists ? counterDoc.data()?.count || 0 : 0) + 1;
    await counterRef.set({ count: nextId });

    const docRef = this.getDb().collection('assignments').doc(nextId.toString());
    const data = {
      ...assignment,
      id: nextId,
      isActive: assignment.isActive ?? true,
      assignedAt: new Date(),
    };
    await docRef.set(data);
    return data as MentorStudentAssignment;
  }

  async getAllAssignments(): Promise<MentorStudentAssignment[]> {
    const snapshot = await this.getDb().collection('assignments').orderBy('assignedAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data()) as MentorStudentAssignment[];
  }

  async getAssignmentsByCohort(cohortId: number): Promise<MentorStudentAssignment[]> {
    const snapshot = await this.getDb().collection('assignments').where('cohortId', '==', cohortId).get();
    return snapshot.docs.map(doc => doc.data()) as MentorStudentAssignment[];
  }

  async getAssignmentsByMentor(mentorId: number): Promise<MentorStudentAssignment[]> {
    const snapshot = await this.getDb().collection('assignments').where('mentorId', '==', mentorId).get();
    return snapshot.docs.map(doc => doc.data()) as MentorStudentAssignment[];
  }

  async getAssignmentsByStudent(studentId: number): Promise<MentorStudentAssignment[]> {
    const snapshot = await this.getDb().collection('assignments').where('studentId', '==', studentId).get();
    return snapshot.docs.map(doc => doc.data()) as MentorStudentAssignment[];
  }

  async getAssignmentsByMentorUserId(userId: string): Promise<MentorStudentAssignment[]> {
    const snapshot = await this.getDb().collection('assignments').where('mentorUserId', '==', userId).get();
    return snapshot.docs.map(doc => doc.data()) as MentorStudentAssignment[];
  }

  async getAssignmentsByStudentUserId(userId: string): Promise<MentorStudentAssignment[]> {
    const snapshot = await this.getDb().collection('assignments').where('studentUserId', '==', userId).get();
    return snapshot.docs.map(doc => doc.data()) as MentorStudentAssignment[];
  }

  async deleteAssignment(id: number): Promise<void> {
    await this.getDb().collection('assignments').doc(id.toString()).delete();
  }

  // Session operations
  async createSession(session: InsertMentoringSession): Promise<MentoringSession> {
    const counterRef = this.getDb().collection('counters').doc('sessions');
    const counterDoc = await counterRef.get();
    const nextId = (counterDoc.exists ? counterDoc.data()?.count || 0 : 0) + 1;
    await counterRef.set({ count: nextId });

    const docRef = this.getDb().collection('mentoringSessions').doc(nextId.toString());
    const data = {
      ...session,
      id: nextId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await docRef.set(data);
    return data as MentoringSession;
  }

  async getSessionsByAssignment(assignmentId: number): Promise<MentoringSession[]> {
    const snapshot = await this.getDb().collection('mentoringSessions').where('assignmentId', '==', assignmentId).get();
    return snapshot.docs.map(doc => doc.data()) as MentoringSession[];
  }

  async getSessionsByCohort(cohortId: number): Promise<MentoringSession[]> {
    const snapshot = await this.getDb().collection('mentoringSessions').where('cohortId', '==', cohortId).get();
    return snapshot.docs.map(doc => doc.data()) as MentoringSession[];
  }

  async updateSession(id: number, updates: Partial<MentoringSession>): Promise<MentoringSession> {
    await this.getDb().collection('mentoringSessions').doc(id.toString()).update({
      ...updates,
      updatedAt: new Date(),
    });
    const doc = await this.getDb().collection('mentoringSessions').doc(id.toString()).get();
    return doc.data() as MentoringSession;
  }

  async deleteSession(id: number): Promise<void> {
    await this.getDb().collection('mentoringSessions').doc(id.toString()).delete();
  }
}
