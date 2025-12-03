import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Briefcase, ArrowRight, Loader2 } from "lucide-react";
import logoPath from "@assets/AspireLink-Favicon_1751236188567.png";

export default function CompleteProfile() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  
  // Check if this is a new signup (user just registered)
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isNewSignup = urlParams?.get('new') === 'true';

  // Handle redirects in useEffect to avoid React state update during render
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // If this is a new signup, wait a bit longer for auth state to settle
        if (isNewSignup) {
          // Don't immediately redirect - give auth state time to populate
          const timeout = setTimeout(() => {
            // Check again after delay
            if (!user) {
              setLocation("/signin");
            }
          }, 2000);
          return () => clearTimeout(timeout);
        } else {
          setLocation("/signin");
        }
      } else if (user.role) {
        if (user.role === "student") {
          setLocation("/dashboard/student");
        } else if (user.role === "mentor") {
          setLocation("/dashboard/mentor");
        } else if (user.role === "admin") {
          setLocation("/admin/dashboard");
        }
      }
    }
  }, [user, isLoading, setLocation, isNewSignup]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-custom" />
      </div>
    );
  }

  // Show loading while redirecting or waiting for auth state (for new signups)
  if ((!user && isNewSignup) || (user && user.role)) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-custom" />
      </div>
    );
  }
  
  // If no user and not a new signup, the useEffect will redirect to signin
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-custom" />
      </div>
    );
  }

  const handleSelectStudent = () => {
    setLocation("/register-student?complete=true");
  };

  const handleSelectMentor = () => {
    setLocation("/register-mentor?complete=true");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoPath} alt="AspireLink" className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-bold text-charcoal-custom mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome, {user.displayName || user.email}! Tell us how you'd like to participate in AspireLink.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary-custom group"
            onClick={handleSelectStudent}
            data-testid="card-select-student"
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-charcoal-custom">I'm a Student</CardTitle>
              <CardDescription className="text-gray-600">
                Looking for guidance from experienced professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Get matched with an experienced mentor
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Receive career guidance and support
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Build professional skills through 1:1 sessions
                </li>
              </ul>
              <Button className="w-full bg-primary-custom" data-testid="button-continue-student">
                Continue as Student
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary-custom group"
            onClick={handleSelectMentor}
            data-testid="card-select-mentor"
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <Briefcase className="h-8 w-8 text-teal-600" />
              </div>
              <CardTitle className="text-xl text-charcoal-custom">I'm a Mentor</CardTitle>
              <CardDescription className="text-gray-600">
                Ready to share my experience and guide students
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Make a meaningful impact on students' careers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Flexible scheduling on your terms
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Join a community of volunteer professionals
                </li>
              </ul>
              <Button className="w-full bg-teal-600 hover:bg-teal-700" data-testid="button-continue-mentor">
                Continue as Mentor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          After selecting your role, you'll complete a short registration form to help us match you with the right people.
        </p>
      </div>
    </div>
  );
}
