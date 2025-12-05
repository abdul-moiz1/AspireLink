import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff, CheckCircle, GraduationCap, Users } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import logoPath from "@assets/AspireLink-Favicon_1751236188567.png";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [, setLocation] = useLocation();
  const { login, loginWithGoogle, refreshUser, user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  
  // Check for URL params indicating new account was created
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isWelcome = urlParams?.get('welcome') === 'true';
  const welcomeRole = urlParams?.get('role') as 'student' | 'mentor' | null;
  const messageParam = urlParams?.get('message');
  const isAccountCreated = messageParam === 'account_created';
  const isAccountExists = messageParam === 'account_exists';

  // Handle redirect after user state is fully updated
  useEffect(() => {
    if (pendingRedirect && user && !isLoading) {
      setLocation(pendingRedirect);
      setPendingRedirect(null);
    }
  }, [pendingRedirect, user, isLoading, setLocation]);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      
      // Wait a bit for auth state to settle, then refresh user data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user has a registration by querying the API
      const checkResponse = await fetch('/api/check-email-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      const checkData = await checkResponse.json();
      
      if (checkData.exists && !checkData.hasAccount) {
        // User has a registration but account not linked yet - try to link
        try {
          const { getIdToken } = await import('@/lib/firebase');
          let token = null;
          let retries = 3;
          
          while (!token && retries > 0) {
            token = await getIdToken();
            if (!token) {
              await new Promise(resolve => setTimeout(resolve, 500));
              retries--;
            }
          }
          
          if (token) {
            const linkResponse = await fetch('/api/auth/link-registration', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                email: data.email,
                registrationId: checkData.registrationId || null,
                registrationType: checkData.type || null
              })
            });
            
            const linkResult = await linkResponse.json();
            
            if (linkResult.success && linkResult.role) {
              // Successfully linked - refresh user and redirect to role-specific dashboard
              await refreshUser();
              const dashboard = linkResult.role === 'student' ? '/dashboard/student' : 
                               linkResult.role === 'mentor' ? '/dashboard/mentor' : 
                               linkResult.role === 'admin' ? '/admin/dashboard' : '/';
              setPendingRedirect(dashboard);
              return;
            }
          }
        } catch (linkError) {
          console.error('Error linking registration:', linkError);
        }
      }
      
      // Refresh user data to get latest role
      await refreshUser();
      
      if (checkData.exists) {
        // User has a registration - redirect to their specific dashboard
        const role = checkData.type;
        if (role === 'student') {
          setPendingRedirect("/dashboard/student");
        } else if (role === 'mentor') {
          setPendingRedirect("/dashboard/mentor");
        } else if (role === 'admin') {
          setPendingRedirect("/admin/dashboard");
        } else {
          setPendingRedirect("/");
        }
      } else {
        // No registration found, redirect to complete profile
        setPendingRedirect("/complete-profile");
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    try {
      const { user: googleUser, isNew } = await loginWithGoogle();
      
      // Wait for auth state to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh user data to get the latest role information from backend
      await refreshUser();
      
      // Check registration status and determine proper redirect
      if (googleUser.email) {
        try {
          const checkResponse = await fetch('/api/check-email-registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: googleUser.email }),
          });
          const checkData = await checkResponse.json();
          
          if (checkData.exists && checkData.hasAccount) {
            // User has registration and account - redirect to their dashboard
            const role = checkData.type;
            if (role === 'student') {
              setPendingRedirect("/dashboard/student");
            } else if (role === 'mentor') {
              setPendingRedirect("/dashboard/mentor");
            } else if (role === 'admin') {
              setPendingRedirect("/admin/dashboard");
            } else {
              setPendingRedirect("/complete-profile");
            }
            return;
          } else if (checkData.exists && !checkData.hasAccount) {
            // User has registration but no account linked yet - try to link
            const { getIdToken } = await import('@/lib/firebase');
            const token = await getIdToken();
            
            if (token) {
              const linkResponse = await fetch('/api/auth/link-registration', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  email: googleUser.email,
                  registrationId: checkData.registrationId || null,
                  registrationType: checkData.type || null
                })
              });
              
              const linkResult = await linkResponse.json();
              
              if (linkResult.success && linkResult.role) {
                await refreshUser();
                const dashboard = linkResult.role === 'student' ? '/dashboard/student' : 
                                 linkResult.role === 'mentor' ? '/dashboard/mentor' : 
                                 linkResult.role === 'admin' ? '/admin/dashboard' : '/complete-profile';
                setPendingRedirect(dashboard);
                return;
              }
            }
          }
        } catch (checkError) {
          console.error('Error checking registration:', checkError);
        }
      }
      
      // Fallback: Check if user already has a role from initial sign-in
      if (googleUser.role) {
        const dashboard = googleUser.role === 'student' ? '/dashboard/student' : 
                         googleUser.role === 'mentor' ? '/dashboard/mentor' : 
                         googleUser.role === 'admin' ? '/admin/dashboard' : '/complete-profile';
        setPendingRedirect(dashboard);
      } else {
        // No role found - redirect to complete profile
        setPendingRedirect("/complete-profile");
      }
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logoPath} alt="AspireLink" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-charcoal-custom">Welcome back</CardTitle>
          <CardDescription>Sign in to your AspireLink account</CardDescription>
        </CardHeader>
        <CardContent>
          {(isWelcome || isAccountCreated) && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                Account Created Successfully!
              </AlertTitle>
              <AlertDescription className="text-green-700">
                {welcomeRole === 'student' ? (
                  <>Your student account is ready! Sign in with your credentials to access your dashboard.</>
                ) : welcomeRole === 'mentor' ? (
                  <>Your mentor account is ready! Sign in with your credentials to access your dashboard.</>
                ) : (
                  <>Your account is ready! Sign in with your credentials to access your dashboard.</>
                )}
              </AlertDescription>
            </Alert>
          )}
          {isAccountExists && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">
                Account Already Exists
              </AlertTitle>
              <AlertDescription className="text-blue-700">
                An account with this email already exists. Please sign in to access your dashboard.
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        data-testid="input-email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          data-testid="input-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-primary-custom hover:bg-primary-dark"
                disabled={isSubmitting || isGoogleSubmitting}
                data-testid="button-sign-in"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-muted-foreground">
              or
            </span>
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleSubmitting}
            data-testid="button-google-signin"
          >
            {isGoogleSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in with Google...
              </>
            ) : (
              <>
                <SiGoogle className="mr-2 h-4 w-4" />
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary-custom hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
