import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug Firebase config (only in development)
if (import.meta.env.DEV) {
  console.log('Firebase Config Debug:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    hasAppId: !!firebaseConfig.appId,
    authDomain: firebaseConfig.authDomain
  });
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with error handling for development
let db: any = null;
try {
  db = getFirestore(app);
  
  // In development, disable offline persistence to avoid connection issues
  if (import.meta.env.DEV) {
    console.log('Firestore initialized for development environment');
  }
} catch (error) {
  console.warn('Firestore initialization failed:', error);
  // Continue without Firestore for now
}

export { db };
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider with proper settings
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// User roles
export type UserRole = 'admin' | 'student' | 'mentor' | 'pd';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: Date;
  lastActive: Date;
}

// Authentication functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);

export const signUpWithEmailAndRole = async (email: string, password: string, role: UserRole) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create profile with specified role
    await createUserProfile(user, role);
    
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const logOut = () => signOut(auth);

// User profile functions
export const createUserProfile = async (user: User, role: UserRole, additionalData?: any) => {
  if (!db) {
    console.warn('Firestore not available, skipping user profile creation');
    // Return a basic profile structure without Firestore
    return {
      uid: user.uid,
      email: user.email!,
      role,
      displayName: user.displayName || '',
      createdAt: new Date(),
      lastActive: new Date(),
      ...additionalData
    };
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      role,
      displayName: user.displayName || '',
      createdAt: new Date(),
      lastActive: new Date(),
      ...additionalData
    };
    
    await setDoc(userRef, userProfile);
    return userProfile;
  } catch (error) {
    console.warn('Failed to create user profile in Firestore:', error);
    // Return basic profile as fallback
    return {
      uid: user.uid,
      email: user.email!,
      role,
      displayName: user.displayName || '',
      createdAt: new Date(),
      lastActive: new Date(),
      ...additionalData
    };
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) {
    console.warn('Firestore not available, returning null profile');
    return null;
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      console.log('Raw profile data from Firestore:', data);
      
      // Validate that required fields exist
      if (data && data.uid && data.email && data.role) {
        return data as UserProfile;
      } else {
        console.warn('Profile data is corrupted or incomplete:', data);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to get user profile from Firestore:', error);
    return null;
  }
};

export const updateLastActive = async (uid: string) => {
  if (!db) {
    return; // Skip silently to reduce console noise
  }

  try {
    // Use a timeout to prevent hanging on slow connections
    const userRef = doc(db, 'users', uid);
    const updatePromise = setDoc(userRef, { lastActive: new Date() }, { merge: true });
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Update timeout')), 2000)
    );
    
    await Promise.race([updatePromise, timeoutPromise]);
  } catch (error) {
    // Fail silently to avoid performance issues
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => 
  onAuthStateChanged(auth, callback);