import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import ForStudents from "@/pages/ForStudents";
import ForMentors from "@/pages/ForMentors";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import RegisterMentor from "@/pages/RegisterMentor";
import RegisterStudent from "@/pages/RegisterStudent";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import AdminDashboard from "@/pages/AdminDashboard";
import CreateStudent from "@/pages/CreateStudent";
import CreateMentor from "@/pages/CreateMentor";
import CreateAssignment from "@/pages/CreateAssignment";
import EditStudent from "@/pages/EditStudent";
import EditMentor from "@/pages/EditMentor";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CodeOfConduct from "@/pages/CodeOfConduct";
import Accessibility from "@/pages/Accessibility";
import StudentDashboard from "@/pages/StudentDashboard";
import MentorDashboard from "@/pages/MentorDashboard";
import CohortManagement from "@/pages/CohortManagement";
import CompleteProfile from "@/pages/CompleteProfile";

// Pages that don't require role completion redirect (auth/onboarding routes only)
const ALLOWED_PATHS_WITHOUT_ROLE = [
  '/complete-profile',
  '/register-student',
  '/register-mentor',
  '/signin',
  '/signup',
  '/privacy',
  '/terms',
  '/conduct',
  '/accessibility'
];

// Public pages that anyone can access (no auth required)
const PUBLIC_PAGES = [
  '/',
  '/about',
  '/students',
  '/mentors',
  '/faq',
  '/contact'
];

function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, needsProfileCompletion } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Check if on a public page (no auth/profile required)
    const isPublicPage = PUBLIC_PAGES.some(path => 
      location === path || location.startsWith(path + '?')
    );
    
    // Skip profile completion check for public pages
    if (isPublicPage) return;

    // Check if user needs to complete profile and is not on an allowed path
    if (user && needsProfileCompletion) {
      const isAllowedPath = ALLOWED_PATHS_WITHOUT_ROLE.some(path => 
        location === path || location.startsWith(path + '?')
      );

      if (!isAllowedPath) {
        setLocation('/complete-profile');
      }
    }
  }, [user, isLoading, needsProfileCompletion, location, setLocation]);

  return <>{children}</>;
}

function Router() {
  return (
    <RoleGuard>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/students" component={ForStudents} />
            <Route path="/mentors" component={ForMentors} />
            <Route path="/register-mentor" component={RegisterMentor} />
            <Route path="/register-student" component={RegisterStudent} />
            <Route path="/faq" component={FAQ} />
            <Route path="/contact" component={Contact} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/complete-profile" component={CompleteProfile} />
            <Route path="/dashboard/student" component={StudentDashboard} />
            <Route path="/dashboard/mentor" component={MentorDashboard} />
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/cohorts" component={CohortManagement} />
            <Route path="/admin/create-student" component={CreateStudent} />
            <Route path="/admin/create-mentor" component={CreateMentor} />
            <Route path="/admin/create-assignment" component={CreateAssignment} />
            <Route path="/admin/edit-student/:id" component={EditStudent} />
            <Route path="/admin/edit-mentor/:id" component={EditMentor} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsOfService} />
            <Route path="/conduct" component={CodeOfConduct} />
            <Route path="/accessibility" component={Accessibility} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </RoleGuard>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
