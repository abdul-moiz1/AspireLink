import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import type { UserRole } from "@shared/schema";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
  intentRole?: UserRole
) {
  const existingUser = await storage.getUser(claims["sub"]);
  
  // Determine role: prioritize intent role for role switching, fallback to existing or default
  let role: UserRole = "student";
  if (intentRole) {
    // If there's a role intent, use it (allows role switching)
    role = intentRole;
  } else if (existingUser?.role) {
    // If no intent but user exists, keep existing role
    role = existingUser.role;
  }
  // Otherwise, default to student

  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    role: role,
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async function(
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback,
    req?: any
  ) {
    try {
      const user = {};
      updateUserSession(user, tokens);
      
      // Check if there's a role intent in the session
      const intentRole = req?.session?.roleIntent as UserRole;
      
      console.log("Authentication verify - User claims:", tokens.claims());
      console.log("Authentication verify - Role intent:", intentRole);
      console.log("Authentication verify - Full session:", req?.session);
      
      await upsertUser(tokens.claims(), intentRole);
      
      console.log("Authentication verify - User session created:", user);
      verified(null, user);
    } catch (error) {
      console.error("Authentication verify error:", error);
      verified(error, null);
    }
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Role-specific login routes
  app.get("/api/login/mentor", (req, res, next) => {
    req.session.roleIntent = "mentor";
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/login/student", (req, res, next) => {
    req.session.roleIntent = "student";
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/login", (req, res, next) => {
    // Store role intent in session for post-login redirect
    const roleIntent = req.query.role as string;
    console.log("Login request - role parameter:", roleIntent);
    
    if (roleIntent && ['student', 'mentor', 'admin', 'program_director'].includes(roleIntent)) {
      req.session.roleIntent = roleIntent as UserRole;
      console.log("Login request - stored role intent:", req.session.roleIntent);
    }
    
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
      state: roleIntent || '', // Pass role intent as state parameter
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      failureRedirect: "/api/login",
    })(req, res, async (err: any) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.redirect("/api/login");
      }
      
      try {
        // Get user's role from database and redirect accordingly
        const user = req.user as any;
        const userId = user?.claims?.sub;
        
        if (userId) {
          const dbUser = await storage.getUser(userId);
          const userRole = dbUser?.role;
          
          console.log("Callback redirect - User role:", userRole);
          
          // Check if there was a role intent for registration/role switching
          const roleIntent = req.session.roleIntent;
          console.log("Callback redirect - Role intent from session:", roleIntent);
          if (roleIntent) {
            delete req.session.roleIntent;
            console.log("Callback redirect - Cleared role intent from session");
          }
          
          // If there's a role intent, redirect to registration
          if (roleIntent) {
            switch (roleIntent) {
              case 'student':
                return res.redirect('/register-student');
              case 'mentor':
                return res.redirect('/register-mentor');
              case 'admin':
                return res.redirect('/admin/dashboard');
              default:
                return res.redirect('/dashboard');
            }
          }
          
          // For existing users without role intent, redirect to dashboard
          switch (userRole) {
            case 'admin':
              return res.redirect('/admin/dashboard');
            default:
              return res.redirect('/dashboard');
          }
        }
      } catch (error) {
        console.error("Callback redirect error:", error);
      }
      
      // Default redirect to dashboard
      res.redirect('/dashboard');
    });
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: UserRole[]): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Attach user to request for convenience
      req.currentUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
};

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
    interface User {
      claims?: any;
    }
  }
}

// Extend session data type
declare module 'express-session' {
  interface SessionData {
    roleIntent?: UserRole;
  }
}