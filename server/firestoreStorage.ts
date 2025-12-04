import { db, isFirebaseEnabled } from './firebase';
import type { 
  User, 
  UpsertUser, 
  Contact, 
  InsertContact, 
  Cohort,
  InsertCohort,
  CohortMember,
  InsertCohortMember,
  Assignment, 
  InsertAssignment,
  MentoringSession,
  InsertMentoringSession,
  StudentRegistration,
  InsertStudentRegistration,
  MentorRegistration,
  InsertMentorRegistration
} from '@shared/schema';
import type { IStorage } from './storage';

function isNotFoundError(error: any): boolean {
  return error?.code === 5 || 
         error?.code === 'NOT_FOUND' || 
         (error?.message && error.message.includes('NOT_FOUND'));
}

export class FirestoreStorage implements IStorage {
  private getDb() {
    if (!db) throw new Error('Firestore not initialized');
    return db;
  }
  
  private handleFirestoreError(error: any, operation: string): never {
    if (isNotFoundError(error)) {
      console.error(`Firestore ${operation}: Resource not found - Database may not be initialized`);
      throw new Error(`Database not initialized. Please create the Firestore database in Firebase Console.`);
    }
    throw error;
  }

  private async getNextId(counterName: string): Promise<number> {
    const counterRef = this.getDb().collection('counters').doc(counterName);
    const counterDoc = await counterRef.get();
    const nextId = (counterDoc.exists ? counterDoc.data()?.count || 0 : 0) + 1;
    await counterRef.set({ count: nextId });
    return nextId;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const doc = await this.getDb().collection('users').doc(id).get();
      if (!doc.exists) return undefined;
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as User;
    } catch (error) {
      if (isNotFoundError(error)) return undefined;
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const snapshot = await this.getDb().collection('users').where('email', '==', email).limit(1).get();
      if (snapshot.empty) return undefined;
      const doc = snapshot.docs[0];
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as User;
    } catch (error) {
      if (isNotFoundError(error)) return undefined;
      throw error;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const id = userData.id || this.getDb().collection('users').doc().id;
      const now = new Date();
      
      let existingData = {};
      try {
        const existingDoc = await this.getDb().collection('users').doc(id).get();
        existingData = existingDoc.exists ? existingDoc.data() || {} : {};
      } catch (error) {
        if (!isNotFoundError(error)) throw error;
      }
      
      const data = {
        ...existingData,
        ...userData,
        id,
        isActive: userData.isActive ?? (existingData as any)?.isActive ?? true,
        updatedAt: now,
        createdAt: (existingData as any)?.createdAt || now,
      };
      
      await this.getDb().collection('users').doc(id).set(data, { merge: true });
      return { ...data, id } as User;
    } catch (error) {
      if (isNotFoundError(error)) {
        this.handleFirestoreError(error, 'upsertUser');
      }
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await this.getDb().collection('users').doc(id).update({
      ...updates,
      updatedAt: new Date()
    });
    const user = await this.getUser(id);
    return user!;
  }

  async getAllUsers(): Promise<User[]> {
    const snapshot = await this.getDb().collection('users').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as User;
    });
  }

  async getUsersByRole(role: 'admin' | 'mentor' | 'student'): Promise<User[]> {
    const snapshot = await this.getDb().collection('users').where('role', '==', role).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as User;
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.getDb().collection('users').doc(id).delete();
  }

  // Student Registration operations
  async createStudentRegistration(data: InsertStudentRegistration): Promise<StudentRegistration> {
    try {
      const id = this.getDb().collection('studentRegistration').doc().id;
      const now = new Date();
      const registrationData = {
        ...data,
        id,
        status: 'pending' as const,
        linkedUserId: null,
        createdAt: now,
        updatedAt: now,
      };
      await this.getDb().collection('studentRegistration').doc(id).set(registrationData);
      return registrationData as StudentRegistration;
    } catch (error) {
      if (isNotFoundError(error)) {
        this.handleFirestoreError(error, 'createStudentRegistration');
      }
      throw error;
    }
  }

  async getStudentRegistration(id: string): Promise<StudentRegistration | undefined> {
    try {
      const doc = await this.getDb().collection('studentRegistration').doc(id).get();
      if (!doc.exists) return undefined;
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as StudentRegistration;
    } catch (error) {
      if (isNotFoundError(error)) return undefined;
      throw error;
    }
  }

  async getStudentRegistrationByEmail(email: string): Promise<StudentRegistration | undefined> {
    try {
      const snapshot = await this.getDb().collection('studentRegistration').where('email', '==', email).limit(1).get();
      if (snapshot.empty) return undefined;
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as StudentRegistration;
    } catch (error) {
      if (isNotFoundError(error)) return undefined;
      throw error;
    }
  }

  async updateStudentRegistration(id: string, updates: Partial<StudentRegistration>): Promise<StudentRegistration> {
    await this.getDb().collection('studentRegistration').doc(id).update({
      ...updates,
      updatedAt: new Date()
    });
    const doc = await this.getDb().collection('studentRegistration').doc(id).get();
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
      updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
    } as StudentRegistration;
  }

  async getAllStudentRegistrations(): Promise<StudentRegistration[]> {
    const snapshot = await this.getDb().collection('studentRegistration').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as StudentRegistration;
    });
  }

  // Mentor Registration operations
  async createMentorRegistration(data: InsertMentorRegistration): Promise<MentorRegistration> {
    try {
      const id = this.getDb().collection('mentorRegistration').doc().id;
      const now = new Date();
      const registrationData = {
        ...data,
        id,
        status: 'pending' as const,
        linkedUserId: null,
        createdAt: now,
        updatedAt: now,
      };
      await this.getDb().collection('mentorRegistration').doc(id).set(registrationData);
      return registrationData as MentorRegistration;
    } catch (error) {
      if (isNotFoundError(error)) {
        this.handleFirestoreError(error, 'createMentorRegistration');
      }
      throw error;
    }
  }

  async getMentorRegistration(id: string): Promise<MentorRegistration | undefined> {
    try {
      const doc = await this.getDb().collection('mentorRegistration').doc(id).get();
      if (!doc.exists) return undefined;
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as MentorRegistration;
    } catch (error) {
      if (isNotFoundError(error)) return undefined;
      throw error;
    }
  }

  async getMentorRegistrationByEmail(email: string): Promise<MentorRegistration | undefined> {
    try {
      const snapshot = await this.getDb().collection('mentorRegistration').where('email', '==', email).limit(1).get();
      if (snapshot.empty) return undefined;
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as MentorRegistration;
    } catch (error) {
      if (isNotFoundError(error)) return undefined;
      throw error;
    }
  }

  async updateMentorRegistration(id: string, updates: Partial<MentorRegistration>): Promise<MentorRegistration> {
    await this.getDb().collection('mentorRegistration').doc(id).update({
      ...updates,
      updatedAt: new Date()
    });
    const doc = await this.getDb().collection('mentorRegistration').doc(id).get();
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
      updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
    } as MentorRegistration;
  }

  async getAllMentorRegistrations(): Promise<MentorRegistration[]> {
    const snapshot = await this.getDb().collection('mentorRegistration').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as MentorRegistration;
    });
  }

  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const nextId = await this.getNextId('contacts');
    const docRef = this.getDb().collection('contacts').doc(nextId.toString());
    const data = {
      ...insertContact,
      id: nextId,
      createdAt: new Date(),
    };
    await docRef.set(data);
    return data as Contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    const snapshot = await this.getDb().collection('contacts').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt
      } as Contact;
    });
  }

  // Cohort operations
  async createCohort(insertCohort: InsertCohort): Promise<Cohort> {
    const nextId = await this.getNextId('cohorts');
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
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        startDate: data?.startDate?.toDate?.() || data?.startDate,
        endDate: data?.endDate?.toDate?.() || data?.endDate,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt
      } as Cohort;
    });
  }

  async getCohort(id: number): Promise<Cohort | undefined> {
    const doc = await this.getDb().collection('cohorts').doc(id.toString()).get();
    if (!doc.exists) return undefined;
    const data = doc.data();
    return {
      ...data,
      startDate: data?.startDate?.toDate?.() || data?.startDate,
      endDate: data?.endDate?.toDate?.() || data?.endDate,
      createdAt: data?.createdAt?.toDate?.() || data?.createdAt
    } as Cohort;
  }

  async updateCohort(id: number, updates: Partial<Cohort>): Promise<Cohort> {
    await this.getDb().collection('cohorts').doc(id.toString()).update(updates);
    const cohort = await this.getCohort(id);
    return cohort!;
  }

  async deleteCohort(id: number): Promise<void> {
    await this.getDb().collection('cohorts').doc(id.toString()).delete();
  }

  // Cohort member operations - DERIVED FROM ASSIGNMENTS
  // Members are now automatically derived from assignments, no separate collection needed
  
  async addCohortMember(member: InsertCohortMember): Promise<CohortMember> {
    // DEPRECATED: Members are now derived from assignments automatically
    // This method is kept for backward compatibility but does NOT persist data
    // To add a member to a cohort, create an assignment instead
    console.warn('DEPRECATED: addCohortMember no longer persists. Members are derived from assignments. Create an assignment to add members.');
    return {
      id: Date.now(), // Unique ID for this call
      cohortId: member.cohortId,
      userId: member.userId,
      role: member.role,
      isActive: member.isActive ?? true,
      joinedAt: new Date(),
    } as CohortMember;
  }

  async getCohortMembers(cohortId: number): Promise<CohortMember[]> {
    // Derive members from assignments - get all mentors and students in this cohort
    const assignments = await this.getAssignmentsByCohort(cohortId);
    
    // Build unique member list from assignments with unique IDs
    const memberMap = new Map<string, CohortMember>();
    let idCounter = 1;
    
    for (const assignment of assignments) {
      // Add mentor if not already in map
      if (!memberMap.has(assignment.mentorUserId)) {
        memberMap.set(assignment.mentorUserId, {
          id: idCounter++,
          cohortId: cohortId,
          userId: assignment.mentorUserId,
          role: 'mentor',
          isActive: assignment.isActive,
          joinedAt: assignment.assignedAt
        });
      }
      
      // Add student if not already in map
      if (!memberMap.has(assignment.studentUserId)) {
        memberMap.set(assignment.studentUserId, {
          id: idCounter++,
          cohortId: cohortId,
          userId: assignment.studentUserId,
          role: 'student',
          isActive: assignment.isActive,
          joinedAt: assignment.assignedAt
        });
      }
    }
    
    return Array.from(memberMap.values());
  }

  async getUserCohorts(userId: string): Promise<Cohort[]> {
    // Derive cohorts from assignments - find all cohorts where user is mentor or student
    const mentorAssignments = await this.getAssignmentsByMentor(userId);
    const studentAssignments = await this.getAssignmentsByStudent(userId);
    
    // Combine and get unique cohort IDs
    const allAssignments = [...mentorAssignments, ...studentAssignments];
    const cohortIdSet = new Set(allAssignments.map(a => a.cohortId));
    const cohortIds = Array.from(cohortIdSet);
    
    if (cohortIds.length === 0) return [];
    
    const cohorts: Cohort[] = [];
    for (const cohortId of cohortIds) {
      const cohort = await this.getCohort(cohortId);
      if (cohort) cohorts.push(cohort);
    }
    return cohorts;
  }

  async removeCohortMember(cohortId: number, userId: string): Promise<void> {
    // DEPRECATED: Members are now derived from assignments automatically
    // This method is kept for backward compatibility but does NOT remove data
    // To remove a member from a cohort, delete their assignments instead
    console.warn(`DEPRECATED: removeCohortMember no longer removes data. Members are derived from assignments. Delete assignments to remove members. (cohortId: ${cohortId}, userId: ${userId})`);
    // No-op since members are derived from assignments
  }

  // Assignment operations
  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const nextId = await this.getNextId('assignments');
    const docRef = this.getDb().collection('assignments').doc(nextId.toString());
    const data = {
      ...assignment,
      id: nextId,
      isActive: assignment.isActive ?? true,
      assignedAt: new Date(),
    };
    await docRef.set(data);
    return data as Assignment;
  }

  async getAllAssignments(): Promise<Assignment[]> {
    const snapshot = await this.getDb().collection('assignments').orderBy('assignedAt', 'desc').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        assignedAt: data?.assignedAt?.toDate?.() || data?.assignedAt
      } as Assignment;
    });
  }

  async getAssignmentsByCohort(cohortId: number): Promise<Assignment[]> {
    const snapshot = await this.getDb().collection('assignments').where('cohortId', '==', cohortId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        assignedAt: data?.assignedAt?.toDate?.() || data?.assignedAt
      } as Assignment;
    });
  }

  async getAssignmentsByMentor(mentorUserId: string): Promise<Assignment[]> {
    const snapshot = await this.getDb().collection('assignments').where('mentorUserId', '==', mentorUserId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        assignedAt: data?.assignedAt?.toDate?.() || data?.assignedAt
      } as Assignment;
    });
  }

  async getAssignmentsByStudent(studentUserId: string): Promise<Assignment[]> {
    const snapshot = await this.getDb().collection('assignments').where('studentUserId', '==', studentUserId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        assignedAt: data?.assignedAt?.toDate?.() || data?.assignedAt
      } as Assignment;
    });
  }

  async getAssignment(id: number): Promise<Assignment | undefined> {
    const doc = await this.getDb().collection('assignments').doc(id.toString()).get();
    if (!doc.exists) return undefined;
    const data = doc.data();
    return {
      ...data,
      assignedAt: data?.assignedAt?.toDate?.() || data?.assignedAt
    } as Assignment;
  }

  async updateAssignment(id: number, updates: Partial<Assignment>): Promise<Assignment | null> {
    const docRef = this.getDb().collection('assignments').doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return null;
    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();
    return {
      ...data,
      assignedAt: data?.assignedAt?.toDate?.() || data?.assignedAt
    } as Assignment;
  }

  async deleteAssignment(id: number): Promise<void> {
    await this.getDb().collection('assignments').doc(id.toString()).delete();
  }

  // Session operations
  async createSession(session: InsertMentoringSession): Promise<MentoringSession> {
    const nextId = await this.getNextId('sessions');
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
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        scheduledDate: data?.scheduledDate?.toDate?.() || data?.scheduledDate,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as MentoringSession;
    });
  }

  async getSessionsByCohort(cohortId: number): Promise<MentoringSession[]> {
    const snapshot = await this.getDb().collection('mentoringSessions').where('cohortId', '==', cohortId).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        scheduledDate: data?.scheduledDate?.toDate?.() || data?.scheduledDate,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
      } as MentoringSession;
    });
  }

  async updateSession(id: number, updates: Partial<MentoringSession>): Promise<MentoringSession> {
    await this.getDb().collection('mentoringSessions').doc(id.toString()).update({
      ...updates,
      updatedAt: new Date(),
    });
    const doc = await this.getDb().collection('mentoringSessions').doc(id.toString()).get();
    const data = doc.data();
    return {
      ...data,
      scheduledDate: data?.scheduledDate?.toDate?.() || data?.scheduledDate,
      createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
      updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt
    } as MentoringSession;
  }

  async deleteSession(id: number): Promise<void> {
    await this.getDb().collection('mentoringSessions').doc(id.toString()).delete();
  }
}
