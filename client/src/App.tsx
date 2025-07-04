import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import AdminLogin from "@/pages/AdminLogin";
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
import Dashboard from "@/pages/Dashboard";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          {/* Public routes - always accessible */}
          <Route path="/about" component={About} />
          <Route path="/students" component={ForStudents} />
          <Route path="/mentors" component={ForMentors} />
          <Route path="/faq" component={FAQ} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/terms" component={TermsOfService} />
          <Route path="/conduct" component={CodeOfConduct} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/register-mentor" component={RegisterMentor} />
          <Route path="/register-student" component={RegisterStudent} />
          <Route path="/admin/login" component={AdminLogin} />

          {/* Authentication-aware routes */}
          {!isLoading && isAuthenticated ? (
            <>
              <Route path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route path="/admin/create-student" component={CreateStudent} />
              <Route path="/admin/create-mentor" component={CreateMentor} />
              <Route path="/admin/create-assignment" component={CreateAssignment} />
              <Route path="/admin/edit-student/:id" component={EditStudent} />
              <Route path="/admin/edit-mentor/:id" component={EditMentor} />
            </>
          ) : (
            <Route path="/" component={Home} />
          )}
          
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
