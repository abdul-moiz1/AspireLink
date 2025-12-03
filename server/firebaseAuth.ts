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

function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
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
    if (isFirebaseEnabled()) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } else {
      const payload = decodeJwtPayload(token);
      if (!payload || !payload.user_id) {
        return null;
      }
      
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null;
      }
      
      return {
        uid: payload.user_id || payload.sub,
        email: payload.email,
        name: payload.name,
        email_verified: payload.email_verified,
      };
    }
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
