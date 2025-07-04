import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Not authenticated</div>;
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case "admin":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <p className="mb-4">Welcome back, {user.firstName || user.email}!</p>
            <Button onClick={() => window.location.href = "/admin"}>
              Go to Admin Panel
            </Button>
          </div>
        );
      
      case "program_director":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Program Director Dashboard</h1>
            <p className="mb-4">Welcome back, {user.firstName || user.email}!</p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => window.location.href = "/admin"}>
                    View Students
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Manage Mentors</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => window.location.href = "/admin"}>
                    View Mentors
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case "mentor":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Welcome Back, Mentor!</h1>
            <p className="mb-4">Thank you for your dedication to mentoring the next generation.</p>
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Mentor Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Please complete your mentor registration to get matched with students.</p>
                <Button onClick={() => window.location.href = "/register-mentor"}>
                  Complete Registration
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      
      case "student":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Welcome to AspireLink!</h1>
            <p className="mb-4">We're excited to help you connect with industry professionals.</p>
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Student Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Please complete your student registration to get matched with a mentor.</p>
                <Button onClick={() => window.location.href = "/register-student"}>
                  Complete Application
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return (
          <div>
            <h1 className="text-3xl font-bold mb-6">Welcome to AspireLink</h1>
            <p>Your account is being set up. Please try again later.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          {getDashboardContent()}
          <div className="ml-auto">
            <Button variant="outline" onClick={() => window.location.href = "/api/logout"}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}