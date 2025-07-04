import type { Express, RequestHandler } from "express";
import session from "express-session";

// Simple mock authentication for testing
export function setupSimpleAuth(app: Express) {
  // Basic session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Mock login endpoint for testing
  app.get("/api/login", (req, res) => {
    // For testing, create a mock user session
    (req.session as any).user = {
      claims: {
        sub: "test-user-123",
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        profile_image_url: null
      },
      access_token: "mock-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600
    };
    res.redirect('/');
  });

  // Mock logout endpoint
  app.get("/api/logout", (req, res) => {
    req.session?.destroy(() => {
      res.redirect('/');
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const user = (req.session as any)?.user;
  
  if (!user || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now > user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  (req as any).user = user;
  next();
};