import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, Video, Mail, Building, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access the student dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    } else if (!authLoading && isAuthenticated && (user as any)?.role !== 'student') {
      toast({
        title: "Access Denied",
        description: "This dashboard is only for students.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [authLoading, isAuthenticated, user, toast]);

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["/api/student/assignments"],
    enabled: isAuthenticated,
  });

  const { data: cohorts, isLoading: cohortsLoading } = useQuery({
    queryKey: ["/api/student/cohorts"],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-custom mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const assignmentList = assignments as any[] || [];
  const cohortList = cohorts as any[] || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {(user as any)?.firstName || 'Student'}! View your mentor and upcoming sessions.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Assigned Mentor</p>
                  <p className="text-2xl font-bold">{assignmentList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Active Cohorts</p>
                  <p className="text-2xl font-bold">{cohortList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Upcoming Sessions</p>
                  <p className="text-2xl font-bold">
                    {assignmentList.reduce((acc: number, a: any) => acc + (a.sessions?.filter((s: any) => s.status === 'scheduled').length || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Mentor Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Mentor</h2>
          
          {assignmentsLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-custom mx-auto"></div>
              </CardContent>
            </Card>
          ) : assignmentList.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Mentor Assigned Yet</h3>
                <p className="text-gray-600">You will be matched with a mentor once you are added to a cohort.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
              {assignmentList.map((assignment: any) => (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {assignment.mentor?.fullName || 'Your Mentor'}
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      {assignment.mentor?.currentJobTitle || 'Professional Mentor'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {assignment.mentor?.company && (
                        <div className="flex items-center text-gray-600">
                          <Building className="h-4 w-4 mr-2" />
                          <span>{assignment.mentor.company}</span>
                        </div>
                      )}
                      {assignment.mentor?.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{assignment.mentor.location}</span>
                        </div>
                      )}
                      {assignment.cohort && (
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Cohort: {assignment.cohort.name}</span>
                        </div>
                      )}
                      
                      {assignment.mentor?.mentoringTopics && assignment.mentor.mentoringTopics.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Mentoring Topics:</p>
                          <div className="flex flex-wrap gap-2">
                            {assignment.mentor.mentoringTopics.map((topic: string, idx: number) => (
                              <Badge key={idx} variant="secondary">{topic}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Sessions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
          
          {assignmentList.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Scheduled</h3>
                <p className="text-gray-600">Your mentor will schedule sessions once you're matched.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {assignmentList.flatMap((assignment: any) => 
                (assignment.sessions || [])
                  .filter((s: any) => s.status === 'scheduled')
                  .map((session: any) => (
                    <Card key={session.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-full">
                              <Video className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Session with {assignment.mentor?.fullName}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {session.scheduledDate ? format(new Date(session.scheduledDate), 'MMM d, yyyy') : 'TBD'}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {session.scheduledTime || 'TBD'}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {session.durationMinutes || 30} mins
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Scheduled
                          </Badge>
                        </div>
                        {session.meetingLink && (
                          <div className="mt-4">
                            <Button asChild size="sm">
                              <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4 mr-2" />
                                Join Meeting
                              </a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
              )}
              {assignmentList.every((a: any) => !a.sessions || a.sessions.filter((s: any) => s.status === 'scheduled').length === 0) && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
                    <p className="text-gray-600">Your mentor will schedule sessions soon.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* My Cohorts Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Cohorts</h2>
          
          {cohortsLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-custom mx-auto"></div>
              </CardContent>
            </Card>
          ) : cohortList.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Part of Any Cohort Yet</h3>
                <p className="text-gray-600">You will be added to a cohort by the program admin.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cohortList.map((cohort: any) => (
                <Card key={cohort.id}>
                  <CardHeader>
                    <CardTitle>{cohort.name}</CardTitle>
                    <CardDescription>{cohort.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {cohort.startDate ? format(new Date(cohort.startDate), 'MMM d, yyyy') : 'TBD'} - 
                          {cohort.endDate ? format(new Date(cohort.endDate), 'MMM d, yyyy') : 'TBD'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{cohort.sessionsPerMonth || 2} sessions/month ({cohort.sessionDurationMinutes || 30} mins each)</span>
                      </div>
                    </div>
                    <Badge 
                      className={`mt-4 ${cohort.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {cohort.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
