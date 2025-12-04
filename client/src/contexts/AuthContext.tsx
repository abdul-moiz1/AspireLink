import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth, signIn, signUp, signOut, signInWithGoogle, getIdToken, subscribeToAuthChanges, type User } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
  registrationId?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsProfileCompletion: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ user: AuthUser; isNew: boolean }>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        try {
          const response = await fetch("/api/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: userData.role,
              registrationId: userData.registrationId,
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            });
          }
        } catch (error) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      let message = "Failed to sign in. Please check your credentials.";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (error.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      }
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const firebaseUser = await signUp(email, password, displayName);
      const token = await firebaseUser.getIdToken();
      
      await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          displayName,
        }),
      });
      
      toast({
        title: "Account created!",
        description: "Welcome to AspireLink.",
      });
    } catch (error: any) {
      let title = "Registration failed";
      let message = "Failed to create account.";
      if (error.code === "auth/email-already-in-use") {
        title = "Account Already Exists";
        message = "An account with this email already exists. Please sign in instead.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      }
      toast({
        title,
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<{ user: AuthUser; isNew: boolean }> => {
    try {
      const firebaseUser = await signInWithGoogle();
      const token = await firebaseUser.getIdToken();
      
      // Try to get user from backend to check if they already exist
      const response = await fetch("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      let isNew = false;
      let backendUserData = null;
      
      if (!response.ok) {
        // User doesn't exist in backend, register them
        isNew = true;
        await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          }),
        });
        
        // Check for existing registration and try to link
        if (firebaseUser.email) {
          try {
            const checkResponse = await fetch('/api/check-email-registration', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: firebaseUser.email }),
            });
            const checkData = await checkResponse.json();
            
            if (checkData.exists && !checkData.hasAccount) {
              // Try to link registration
              const linkResponse = await fetch('/api/auth/link-registration', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  email: firebaseUser.email,
                  registrationId: checkData.registrationId || null,
                  registrationType: checkData.type || null
                })
              });
              
              const linkResult = await linkResponse.json();
              if (linkResult.success) {
                backendUserData = { role: linkResult.role };
              }
            }
          } catch (linkError) {
            console.error('Error linking registration during Google sign-in:', linkError);
          }
        }
      } else {
        backendUserData = await response.json();
      }
      
      const authUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: backendUserData?.role,
        registrationId: backendUserData?.registrationId,
      };
      
      setUser(authUser);
      
      toast({
        title: isNew ? "Account created!" : "Welcome back!",
        description: isNew ? "Welcome to AspireLink." : "You have successfully signed in with Google.",
      });
      
      return { user: authUser, isNew };
    } catch (error: any) {
      let message = "Failed to sign in with Google.";
      if (error.code === "auth/popup-closed-by-user") {
        message = "Sign in was cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        message = "Pop-up was blocked. Please allow pop-ups for this site.";
      }
      toast({
        title: "Google Sign In Failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getToken = async () => {
    return getIdToken();
  };

  const refreshUser = async () => {
    const currentUser = auth?.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      try {
        const response = await fetch("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: userData.role,
            registrationId: userData.registrationId,
          });
        }
      } catch (error) {
        console.error("Error refreshing user:", error);
      }
    }
  };

  const needsProfileCompletion = !!user && !user.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        needsProfileCompletion,
        login,
        register,
        loginWithGoogle,
        logout,
        getToken,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
