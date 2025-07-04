import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MessageCircle, Target, TrendingUp, CheckCircle, User, Mail, Phone, MapPin, GraduationCap, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

interface StudentProfile {
  id: number;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  linkedinUrl?: string;
  universityName?: string;
  academicProgram?: string;
  yearOfStudy?: string;
  preferredDisciplines: string[];
  mentoringTopics: string[];
  mentorshipGoals?: string;
  isActive: boolean;
  createdAt: string;
}

interface MentorMatch {
  id: number;
  mentorId: number;
  mentorName: string;
  mentorJobTitle?: string;
  mentorCompany?: string;
  mentorLocation?: string;
  isActive: boolean;
  assignedAt: string;
}

interface Session {
  id: number;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  nextSteps?: string;
}

export default function StudentDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phoneNumber: '',
    universityName: '',
    academicProgram: '',
    yearOfStudy: '',
    preferredDisciplines: [],
    mentoringTopics: [],
    mentorshipGoals: ''
  });

  // Enable session timeout after 7 minutes of inactivity
  useSessionTimeout();

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      await apiRequest('/api/student-profile', 'PUT', updatedData);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/student-profile'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Functions to handle editing
  const startEditing = () => {
    if (studentProfile) {
      setEditForm({
        fullName: studentProfile.fullName || '',
        phoneNumber: studentProfile.phoneNumber || '',
        universityName: studentProfile.universityName || '',
        academicProgram: studentProfile.academicProgram || '',
        yearOfStudy: studentProfile.yearOfStudy || '',
        preferredDisciplines: studentProfile.preferredDisciplines || [],
        mentoringTopics: studentProfile.mentoringTopics || [],
        mentorshipGoals: studentProfile.mentorshipGoals || ''
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      fullName: '',
      phoneNumber: '',
      universityName: '',
      academicProgram: '',
      yearOfStudy: '',
      preferredDisciplines: [],
      mentoringTopics: [],
      mentorshipGoals: ''
    });
  };

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

  const { data: studentProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/student-profile'],
    retry: false,
    enabled: !!user,
  });

  const { data: mentorMatch } = useQuery({
    queryKey: ['/api/student-mentor-assignment'],
    retry: false,
    enabled: !!user,
  });

  const { data: sessions } = useQuery({
    queryKey: ['/api/student-sessions'],
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
  const totalSessions = 4; // 4-month program with monthly sessions
  const progress = (completedSessions / totalSessions) * 100;

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
                <p className="text-sm text-gray-500">Student Dashboard</p>
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
          {['overview', 'profile', 'mentor', 'sessions'].map((tab) => (
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
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Mentorship Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Program Completion</span>
                    <span>{completedSessions}/{totalSessions} Sessions</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {completedSessions === 0 
                      ? "Your mentorship journey is about to begin!"
                      : `Great progress! You've completed ${completedSessions} session${completedSessions > 1 ? 's' : ''}.`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                      <p className="text-2xl font-bold text-charcoal-custom">{completedSessions}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mentor Status</p>
                      <p className="text-lg font-semibold text-charcoal-custom">
                        {mentorMatch ? 'Matched' : 'Pending'}
                      </p>
                    </div>
                    <User className="w-8 h-8 text-green-600" />
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

            {/* Mentor Match Card */}
            {mentorMatch && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-green-600" />
                    <span>Your Mentor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {mentorMatch.mentorName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-charcoal-custom">{mentorMatch.mentorName}</h3>
                      {mentorMatch.mentorJobTitle && (
                        <p className="text-gray-600">{mentorMatch.mentorJobTitle}</p>
                      )}
                      {mentorMatch.mentorCompany && (
                        <p className="text-sm text-gray-500">{mentorMatch.mentorCompany}</p>
                      )}
                      <Badge variant="secondary" className="mt-2">
                        Matched {new Date(mentorMatch.assignedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {selectedTab === 'profile' && studentProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Student Profile</span>
                <div className="space-x-2">
                  {!isEditing ? (
                    <Button onClick={startEditing} variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={handleSave} 
                        size="sm"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        onClick={handleCancel} 
                        variant="outline" 
                        size="sm"
                        disabled={updateProfileMutation.isPending}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{studentProfile.fullName}</p>
                      <p className="text-sm text-gray-500">Full Name</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{studentProfile.emailAddress}</p>
                      <p className="text-sm text-gray-500">Email Address</p>
                    </div>
                  </div>

                  {studentProfile.phoneNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{studentProfile.phoneNumber}</p>
                        <p className="text-sm text-gray-500">Phone Number</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {studentProfile.universityName && (
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{studentProfile.universityName}</p>
                        <p className="text-sm text-gray-500">University</p>
                      </div>
                    </div>
                  )}

                  {studentProfile.academicProgram && (
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{studentProfile.academicProgram}</p>
                        <p className="text-sm text-gray-500">Academic Program</p>
                      </div>
                    </div>
                  )}

                  {studentProfile.yearOfStudy && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{studentProfile.yearOfStudy}</p>
                        <p className="text-sm text-gray-500">Year of Study</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {studentProfile.preferredDisciplines.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Preferred Disciplines</h4>
                  <div className="flex flex-wrap gap-2">
                    {studentProfile.preferredDisciplines.map((discipline: string) => (
                      <Badge key={discipline} variant="secondary">{discipline}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {studentProfile.mentoringTopics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Mentoring Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {studentProfile.mentoringTopics.map((topic: string) => (
                      <Badge key={topic} variant="outline">{topic}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {studentProfile.mentorshipGoals && (
                <div>
                  <h4 className="font-medium mb-2">Mentorship Goals</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {studentProfile.mentorshipGoals}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Mentor Tab */}
        {selectedTab === 'mentor' && (
          <Card>
            <CardHeader>
              <CardTitle>Mentor Information</CardTitle>
            </CardHeader>
            <CardContent>
              {mentorMatch ? (
                <div className="space-y-6">
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {mentorMatch.mentorName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-charcoal-custom">{mentorMatch.mentorName}</h3>
                      {mentorMatch.mentorJobTitle && (
                        <p className="text-lg text-gray-600">{mentorMatch.mentorJobTitle}</p>
                      )}
                      {mentorMatch.mentorCompany && (
                        <p className="text-gray-500">{mentorMatch.mentorCompany}</p>
                      )}
                      {mentorMatch.mentorLocation && (
                        <div className="flex items-center space-x-1 mt-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{mentorMatch.mentorLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Next Steps
                    </h4>
                    <p className="text-sm text-gray-700">
                      Schedule your first mentorship session by reaching out to your mentor. 
                      We recommend starting with a 30-minute introduction call to discuss your goals and expectations.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <Button className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Session
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Mentor Assigned Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Our team is working on finding the perfect mentor match for you based on your preferences and goals.
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
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">
                            {new Date(session.date).toLocaleDateString()}
                          </span>
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
                        <p className="text-sm text-gray-600 mb-2">{session.notes}</p>
                      )}
                      {session.nextSteps && (
                        <div className="bg-yellow-50 p-3 rounded border">
                          <p className="text-sm font-medium text-yellow-800">Next Steps:</p>
                          <p className="text-sm text-yellow-700">{session.nextSteps}</p>
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
                    Once you're matched with a mentor, you can schedule your first session here.
                  </p>
                  <Button variant="outline" disabled={!mentorMatch}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule First Session
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