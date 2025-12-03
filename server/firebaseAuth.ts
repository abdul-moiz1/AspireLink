import type { Express, RequestHandler } from "express";
import { admin, isFirebaseEnabled } from "./firebase";
import { storage } from "./storage";
import session from "express-session";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  return session({
    secret: process.env.SESSION_SECRET || 'aspirelink-secret-key',
    store: new MemoryStore({
      checkPeriod: sessionTtl,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
}

async function verifyFirebaseToken(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  if (!token) {
    return null;
  }

  try {
    if (!isFirebaseEnabled()) {
      throw new Error('Firebase not enabled');
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return null;
  }
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  const decodedToken = await verifyFirebaseToken(req.headers.authorization);
  
  if (!decodedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = {
    uid: decodedToken.uid,
    email: decodedToken.email,
    displayName: decodedToken.name,
  };

  return next();
};

export const isAdmin: RequestHandler = async (req: any, res, next) => {
  const decodedToken = await verifyFirebaseToken(req.headers.authorization);
  
  if (!decodedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dbUser = await storage.getUser(decodedToken.uid);
  if (!dbUser || dbUser.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }

  req.user = {
    uid: decodedToken.uid,
    email: decodedToken.email,
    displayName: decodedToken.name,
    role: dbUser.role,
  };

  return next();
};

export const isMentor: RequestHandler = async (req: any, res, next) => {
  const decodedToken = await verifyFirebaseToken(req.headers.authorization);
  
  if (!decodedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dbUser = await storage.getUser(decodedToken.uid);
  if (!dbUser || dbUser.role !== 'mentor') {
    return res.status(403).json({ message: "Forbidden - Mentor access required" });
  }

  req.user = {
    uid: decodedToken.uid,
    email: decodedToken.email,
    displayName: decodedToken.name,
    role: dbUser.role,
  };

  return next();
};

export const isStudent: RequestHandler = async (req: any, res, next) => {
  const decodedToken = await verifyFirebaseToken(req.headers.authorization);
  
  if (!decodedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dbUser = await storage.getUser(decodedToken.uid);
  if (!dbUser || dbUser.role !== 'student') {
    return res.status(403).json({ message: "Forbidden - Student access required" });
  }

  req.user = {
    uid: decodedToken.uid,
    email: decodedToken.email,
    displayName: decodedToken.name,
    role: dbUser.role,
  };

  return next();
};
