import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MessageCircle, Users, TrendingUp, CheckCircle, User, Mail, Briefcase, MapPin, Target, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { isUnauthorizedError } from "@/lib/authUtils";

interface MentorProfile {
  id: number;
  fullName: string;
  emailAddress: string;
  currentJobTitle?: string;
  company?: string;
  location?: string;
  yearsExperience?: number;
  preferredDisciplines: string[];
  mentoringTopics: string[];
  availability: string[];
  motivation?: string;
  isActive: boolean;
  createdAt: string;
}

interface StudentMatch {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentUniversity?: string;
  studentProgram?: string;
  studentYear?: string;
  isActive: boolean;
  assignedAt: string;
}

interface Session {
  id: number;
  studentId: number;
  studentName: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  nextSteps?: string;
}

export default function MentorDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Enable session timeout after 7 minutes of inactivity
  useSessionTimeout();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  const { data: mentorProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/mentor-profile'],
    retry: false,
    enabled: !!user,
  });

  const { data: studentMatches } = useQuery({
    queryKey: ['/api/mentor-student-assignments'],
    retry: false,
    enabled: !!user,
  });

  const { data: sessions } = useQuery({
    queryKey: ['/api/mentor-sessions'],
    retry: false,
    enabled: !!user,
  });

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-light-custom flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-custom"></div>
          <p className="mt-4 text-charcoal-custom">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const completedSessions = sessions?.filter((s: Session) => s.status === 'completed').length || 0;
  const activeStudents = studentMatches?.filter((s: StudentMatch) => s.isActive).length || 0;
  const upcomingSessions = sessions?.filter((s: Session) => s.status === 'scheduled').length || 0;

  return (
    <div className="min-h-screen bg-light-custom">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-charcoal-custom">
                  Welcome back, {user?.firstName}!
                </h1>
                <p className="text-sm text-gray-500">Mentor Dashboard</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/api/logout'}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 mb-8 border-b">
          {['overview', 'profile', 'students', 'sessions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm capitalize ${
                selectedTab === tab
                  ? 'border-primary-custom text-primary-custom'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Impact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-gold-600" />
                  <span>Your Mentoring Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-primary-custom">{activeStudents}</p>
                    <p className="text-sm text-gray-600">Active Students</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600">{completedSessions}</p>
                    <p className="text-sm text-gray-600">Sessions Completed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-600">{upcomingSessions}</p>
                    <p className="text-sm text-gray-600">Upcoming Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Students Mentored</p>
                      <p className="text-2xl font-bold text-charcoal-custom">{activeStudents}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                      <p className="text-2xl font-bold text-charcoal-custom">{completedSessions}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Program Status</p>
                      <p className="text-lg font-semibold text-charcoal-custom">Active</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Students */}
            {studentMatches && studentMatches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Your Students</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentMatches.slice(0, 3).map((student: StudentMatch) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {student.studentName.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-charcoal-custom">{student.studentName}</h4>
                            <p className="text-sm text-gray-500">
                              {student.studentProgram && student.studentUniversity
                                ? `${student.studentProgram} at ${student.studentUniversity}`
                                : student.studentEmail
                              }
                            </p>
                            <Badge variant="secondary" className="mt-1">
                              Matched {new Date(student.assignedAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Sessions */}
            {upcomingSessions > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span>Upcoming Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sessions?.filter((s: Session) => s.status === 'scheduled').slice(0, 3).map((session: Session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium">{session.studentName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString()}
                          </p>
                        </div>
                        <Button size="sm">
                          Join Session
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {selectedTab === 'profile' && mentorProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Mentor Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{mentorProfile.fullName}</p>
                      <p className="text-sm text-gray-500">Full Name</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{mentorProfile.emailAddress}</p>
                      <p className="text-sm text-gray-500">Email Address</p>
                    </div>
                  </div>

                  {mentorProfile.currentJobTitle && (
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{mentorProfile.currentJobTitle}</p>
                        <p className="text-sm text-gray-500">Job Title</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {mentorProfile.company && (
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{mentorProfile.company}</p>
                        <p className="text-sm text-gray-500">Company</p>
                      </div>
                    </div>
                  )}

                  {mentorProfile.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{mentorProfile.location}</p>
                        <p className="text-sm text-gray-500">Location</p>
                      </div>
                    </div>
                  )}

                  {mentorProfile.yearsExperience && (
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{mentorProfile.yearsExperience} years</p>
                        <p className="text-sm text-gray-500">Experience</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {mentorProfile.preferredDisciplines.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Preferred Disciplines</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentorProfile.preferredDisciplines.map((discipline: string) => (
                      <Badge key={discipline} variant="secondary">{discipline}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {mentorProfile.mentoringTopics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Mentoring Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentorProfile.mentoringTopics.map((topic: string) => (
                      <Badge key={topic} variant="outline">{topic}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {mentorProfile.availability.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Availability</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentorProfile.availability.map((slot: string) => (
                      <Badge key={slot} className="bg-green-100 text-green-800">{slot}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {mentorProfile.motivation && (
                <div>
                  <h4 className="font-medium mb-2">Mentoring Motivation</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {mentorProfile.motivation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Students Tab */}
        {selectedTab === 'students' && (
          <Card>
            <CardHeader>
              <CardTitle>Your Students</CardTitle>
            </CardHeader>
            <CardContent>
              {studentMatches && studentMatches.length > 0 ? (
                <div className="space-y-4">
                  {studentMatches.map((student: StudentMatch) => (
                    <div key={student.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-lg">
                              {student.studentName.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-charcoal-custom">{student.studentName}</h3>
                            <p className="text-gray-600">{student.studentEmail}</p>
                            {student.studentUniversity && (
                              <p className="text-sm text-gray-500">{student.studentUniversity}</p>
                            )}
                            {student.studentProgram && (
                              <p className="text-sm text-gray-500">{student.studentProgram}</p>
                            )}
                            {student.studentYear && (
                              <p className="text-sm text-gray-500">{student.studentYear}</p>
                            )}
                            <Badge 
                              variant={student.isActive ? "default" : "secondary"}
                              className="mt-2"
                            >
                              {student.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <p className="text-xs text-gray-400 mt-1">
                              Matched on {new Date(student.assignedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Students Assigned Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Our team is working on matching you with students who align with your expertise and availability.
                  </p>
                  <Badge variant="secondary">Matching in Progress</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sessions Tab */}
        {selectedTab === 'sessions' && (
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {sessions && sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((session: Session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-sm">
                              {session.studentName.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{session.studentName}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(session.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            session.status === 'completed' ? 'default' :
                            session.status === 'scheduled' ? 'secondary' : 'destructive'
                          }
                        >
                          {session.status}
                        </Badge>
                      </div>
                      {session.notes && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-1">Session Notes:</h5>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{session.notes}</p>
                        </div>
                      )}
                      {session.nextSteps && (
                        <div className="bg-blue-50 p-3 rounded border">
                          <h5 className="text-sm font-medium text-blue-800 mb-1">Next Steps:</h5>
                          <p className="text-sm text-blue-700">{session.nextSteps}</p>
                        </div>
                      )}
                      {session.status === 'scheduled' && (
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm">Join Session</Button>
                          <Button variant="outline" size="sm">Reschedule</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Sessions Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Once you're matched with students, you can schedule mentorship sessions here.
                  </p>
                  <Button variant="outline" disabled={!studentMatches || studentMatches.length === 0}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}