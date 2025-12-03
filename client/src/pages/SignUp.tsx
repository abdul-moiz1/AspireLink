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
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff, UserCheck, GraduationCap, Users } from "lucide-react";
import logoPath from "@assets/AspireLink-Favicon_1751236188567.png";

const signUpSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface RegistrationCheck {
  exists: boolean;
  type?: 'student' | 'mentor';
  message?: string;
}

export default function SignUp() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationInfo, setRegistrationInfo] = useState<RegistrationCheck | null>(null);
  
  // Check for URL params indicating pre-registration
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const preRegisteredRole = urlParams?.get('role') as 'student' | 'mentor' | null;
  const isPreRegistered = urlParams?.get('registered') === 'true';

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const checkEmailRegistration = async (email: string) => {
    try {
      const response = await fetch('/api/check-email-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setRegistrationInfo(data);
      return data;
    } catch (error) {
      console.error('Error checking email registration:', error);
      return null;
    }
  };

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    try {
      // Check for existing registration but don't block - just show personalized message
      const registrationCheck = await checkEmailRegistration(data.email);
      if (registrationCheck?.exists) {
        setRegistrationInfo(registrationCheck);
      }
      
      // Always proceed with signup - this creates the Firebase account
      // The backend will automatically assign the proper role based on existing form data
      await register(data.email, data.password, data.displayName);
      
      // If they had an existing registration (either from URL params or email check), redirect to login
      if (registrationCheck?.exists || isPreRegistered) {
        // They have a role assigned - redirect to login with success message
        const role = registrationCheck?.type || preRegisteredRole || 'user';
        setLocation(`/signin?welcome=true&role=${role}`);
      } else {
        // No existing registration - need to choose role
        // Add a small delay to allow auth state to update before redirect
        // This prevents the complete-profile page from seeing null user
        setTimeout(() => {
          setLocation("/complete-profile?new=true");
        }, 500);
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logoPath} alt="AspireLink" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-charcoal-custom">Create an account</CardTitle>
          <CardDescription>Join AspireLink and start your mentorship journey</CardDescription>
        </CardHeader>
        <CardContent>
          {isPreRegistered && preRegisteredRole && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              {preRegisteredRole === 'student' ? (
                <GraduationCap className="h-4 w-4 text-green-600" />
              ) : (
                <Users className="h-4 w-4 text-green-600" />
              )}
              <AlertTitle className="text-green-800">
                Welcome, {preRegisteredRole === 'student' ? 'Future Student' : 'Future Mentor'}!
              </AlertTitle>
              <AlertDescription className="text-green-700">
                Your {preRegisteredRole} application has been received! Create your account below to access your dashboard and track your application status.
              </AlertDescription>
            </Alert>
          )}
          {registrationInfo?.exists && !isPreRegistered && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <UserCheck className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                {registrationInfo.type === 'student' ? 'Welcome, Student!' : 'Welcome, Mentor!'}
              </AlertTitle>
              <AlertDescription className="text-green-700">
                We found your {registrationInfo.type} application. Complete your account setup below and you'll be automatically connected to your {registrationInfo.type} profile.
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        data-testid="input-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          placeholder="Create a password"
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          data-testid="input-confirm-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          data-testid="button-toggle-confirm-password"
                        >
                          {showConfirmPassword ? (
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
                disabled={isSubmitting}
                data-testid="button-sign-up"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary-custom hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
