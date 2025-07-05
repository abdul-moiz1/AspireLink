import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, userProfile, logout, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && userProfile?.role) {
      // Redirect based on role
      switch (userProfile.role) {
        case 'student':
          setLocation('/student/dashboard');
          break;
        case 'mentor':
          setLocation('/mentor/dashboard');
          break;
        case 'admin':
          setLocation('/admin/dashboard');
          break;
        default:
          // Stay on this page for unknown roles
          break;
      }
    }
  }, [userProfile, loading, setLocation]);

  // Debug function to fix profile issues
  const fixUserProfile = async () => {
    if (currentUser) {
      try {
        console.log('Fixing corrupted user profile...');
        const { db } = await import('@/lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        
        if (db) {
          // Create a complete new profile, overwriting any corrupted data
          const userRef = doc(db, 'users', currentUser.uid);
          const completeProfile = {
            uid: currentUser.uid,
            email: currentUser.email!,
            role: 'student',
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            createdAt: new Date(),
            lastActive: new Date()
          };
          
          console.log('Setting complete profile:', completeProfile);
          await setDoc(userRef, completeProfile);
          console.log('Profile completely rebuilt, refreshing...');
          
          // Force refresh to reload auth context
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.error('Firestore not available');
        }
      } catch (error) {
        console.error('Failed to fix profile:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page after successful logout
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardContent = () => {
    if (!userProfile || !userProfile.role) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Profile Setup Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Your account role is not recognized. Please contact support.</p>
            <div className="space-x-2">
              <Button onClick={fixUserProfile} variant="outline">
                Fix My Profile (Auto-assign Student Role)
              </Button>
              <Button onClick={handleLogout} variant="secondary">
                Sign Out & Start Fresh
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Debug info:</p>
              <pre>{JSON.stringify({ currentUser: !!currentUser, userProfile }, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      );
    }

    switch (userProfile.role) {
      case 'admin':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Welcome to the admin dashboard.</p>
                <a href="/admin" className="text-blue-600 hover:underline">
                  Go to Admin Panel
                </a>
              </CardContent>
            </Card>
          </div>
        );

      case 'student':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Welcome to your student dashboard.</p>
                <p className="text-sm text-gray-600 mb-4">
                  Complete your profile to get matched with a mentor.
                </p>
                <a href="/register-student" className="text-blue-600 hover:underline">
                  Complete Student Profile
                </a>
              </CardContent>
            </Card>
          </div>
        );

      case 'mentor':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Welcome to your mentor dashboard.</p>
                <p className="text-sm text-gray-600 mb-4">
                  Complete your profile to start mentoring students.
                </p>
                <a href="/register-mentor" className="text-blue-600 hover:underline">
                  Complete Mentor Profile
                </a>
              </CardContent>
            </Card>
          </div>
        );

      case 'pd':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Program Director Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Welcome to the program director dashboard.</p>
                <p className="text-sm text-gray-600 mb-4">
                  Manage mentorship programs and oversee student-mentor relationships.
                </p>
                <a href="/admin" className="text-blue-600 hover:underline">
                  Access Admin Tools
                </a>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <p>Your account role is not recognized. Please contact support.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {userProfile?.displayName || currentUser?.email}
              </h1>
              <p className="text-gray-600 capitalize">
                Role: {userProfile?.role}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Sign Out
            </Button>
          </div>

          {getDashboardContent()}
        </div>
      </div>
    </ProtectedRoute>
  );
}