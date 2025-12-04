import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Calendar, User, Clock, Video, Mail, Building, MapPin, Target, BookOpen, TrendingUp, Edit, Loader2, GraduationCap, Phone, Linkedin } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from "recharts";

function AnimatedStatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle,
  delay = 0 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string; 
  subtitle?: string;
  delay?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = value / steps;
    let current = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    
    const timer = setTimeout(() => {
      intervalId = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setDisplayValue(value);
          if (intervalId) clearInterval(intervalId);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
    }, delay);
    
    return () => {
      clearTimeout(timer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [value, delay]);

  return (
    <Card className="card-hover hover-lift overflow-hidden">
      <CardContent className="p-6 relative">
        <div className={`absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full opacity-10`} style={{ backgroundColor: color }} />
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{displayValue}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LearningProgressChart({ assignments }: { assignments: any[] }) {
  const totalExpectedSessions = assignments.length * 4;
  const completedSessions = assignments.reduce((acc, a) => acc + (a.sessions?.filter((s: any) => s.status === 'completed').length || 0), 0);
  const scheduledSessions = assignments.reduce((acc, a) => acc + (a.sessions?.filter((s: any) => s.status === 'scheduled').length || 0), 0);
  
  const progressPercentage = totalExpectedSessions > 0 
    ? Math.round((completedSessions / totalExpectedSessions) * 100) 
    : 0;

  const data = [
    { name: 'Completed', value: completedSessions, color: '#4ECDC4' },
    { name: 'Scheduled', value: scheduledSessions, color: '#2E86AB' },
    { name: 'Remaining', value: Math.max(0, totalExpectedSessions - completedSessions - scheduledSessions), color: '#e0e0e0' },
  ].filter(item => item.value > 0);

  const radialData = [
    {
      name: 'Progress',
      value: progressPercentage,
      fill: '#4ECDC4',
    },
  ];

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Learning Progress</CardTitle>
          <CardDescription>Your mentorship journey</CardDescription>
        </div>
        <Target className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="100%" 
                barSize={10} 
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{progressPercentage}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Sessions Completed</span>
                <span className="font-semibold">{completedSessions} / {totalExpectedSessions}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="flex flex-wrap gap-3">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EngagementTrendChart() {
  const trendData = [
    { month: 'Month 1', engagement: 60, sessions: 1 },
    { month: 'Month 2', engagement: 75, sessions: 2 },
    { month: 'Month 3', engagement: 85, sessions: 2 },
    { month: 'Month 4', engagement: 90, sessions: 3 },
  ];

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Engagement Trend</CardTitle>
          <CardDescription>Your progress over time</CardDescription>
        </div>
        <TrendingUp className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="#4ECDC4" 
                strokeWidth={2}
                fill="url(#engagementGradient)" 
                name="Engagement Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}



function LearningTopicsCard({ assignments }: { assignments: any[] }) {
  const topics = assignments.flatMap(a => a.mentor?.mentoringTopics || []).slice(0, 6);
  const uniqueTopics = Array.from(new Set(topics));

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Focus Areas</CardTitle>
          <CardDescription>Topics covered in mentoring</CardDescription>
        </div>
        <BookOpen className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {uniqueTopics.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No topics assigned yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {uniqueTopics.map((topic, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="hover-lift"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const yearOfStudyOptions = [
  "1st year undergraduate", "2nd year undergraduate", "3rd year undergraduate", 
  "4th year undergraduate", "5th year undergraduate", "1st year master's", 
  "2nd year master's", "1st year PhD", "2nd year PhD", "3rd+ year PhD"
];

export default function StudentDashboard() {
  const { user, isLoading: authLoading, isAuthenticated, refreshUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phoneNumber: '',
    linkedinUrl: '',
    universityName: '',
    academicProgram: '',
    yearOfStudy: '',
    careerInterests: '',
    mentorshipGoals: '',
  });

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

  useEffect(() => {
    if (user && isEditDialogOpen) {
      const userData = user as any;
      setEditForm({
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        linkedinUrl: userData.linkedinUrl || '',
        universityName: userData.universityName || '',
        academicProgram: userData.academicProgram || '',
        yearOfStudy: userData.yearOfStudy || '',
        careerInterests: userData.careerInterests || '',
        mentorshipGoals: userData.mentorshipGoals || '',
      });
    }
  }, [user, isEditDialogOpen]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof editForm) => {
      return apiRequest(`/api/users/${(user as any)?.id}`, "PUT", data);
    },
    onSuccess: async () => {
      toast({
        title: "Profile Updated",
        description: "Your application information has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ["/api/student/assignments"] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSaveProfile = () => {
    if (!editForm.fullName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }
    updateProfileMutation.mutate(editForm);
  };

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
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const assignmentList = assignments as any[] || [];
  const cohortList = cohorts as any[] || [];

  const upcomingSessions = assignmentList.reduce((acc, a) => acc + (a.sessions?.filter((s: any) => s.status === 'scheduled').length || 0), 0);
  const completedSessions = assignmentList.reduce((acc, a) => acc + (a.sessions?.filter((s: any) => s.status === 'completed').length || 0), 0);

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-edit-application">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Application
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Edit Your Application
                  </DialogTitle>
                  <DialogDescription>
                    Update your profile information below. Your changes will be saved immediately.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Your full name"
                        data-testid="input-edit-fullname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phoneNumber"
                          value={editForm.phoneNumber}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          placeholder="(555) 123-4567"
                          className="pl-10"
                          data-testid="input-edit-phone"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="linkedinUrl"
                        value={editForm.linkedinUrl}
                        onChange={(e) => setEditForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="pl-10"
                        data-testid="input-edit-linkedin"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="universityName">University Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="universityName"
                          value={editForm.universityName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, universityName: e.target.value }))}
                          placeholder="Your university"
                          className="pl-10"
                          data-testid="input-edit-university"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="academicProgram">Academic Program</Label>
                      <Input
                        id="academicProgram"
                        value={editForm.academicProgram}
                        onChange={(e) => setEditForm(prev => ({ ...prev, academicProgram: e.target.value }))}
                        placeholder="Computer Science, Business, etc."
                        data-testid="input-edit-program"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearOfStudy">Year of Study</Label>
                    <Select 
                      value={editForm.yearOfStudy} 
                      onValueChange={(value) => setEditForm(prev => ({ ...prev, yearOfStudy: value }))}
                    >
                      <SelectTrigger data-testid="select-edit-year">
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOfStudyOptions.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="careerInterests">Career Interests</Label>
                    <Textarea
                      id="careerInterests"
                      value={editForm.careerInterests}
                      onChange={(e) => setEditForm(prev => ({ ...prev, careerInterests: e.target.value }))}
                      placeholder="Describe your career interests..."
                      rows={3}
                      data-testid="input-edit-career"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentorshipGoals">Mentorship Goals</Label>
                    <Textarea
                      id="mentorshipGoals"
                      value={editForm.mentorshipGoals}
                      onChange={(e) => setEditForm(prev => ({ ...prev, mentorshipGoals: e.target.value }))}
                      placeholder="What do you hope to gain from this mentorship?"
                      rows={3}
                      data-testid="input-edit-goals"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                    data-testid="button-cancel-edit"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                    data-testid="button-save-edit"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground ml-11">
            Welcome back, {(user as any)?.fullName || 'Student'}! View your mentor and upcoming sessions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <AnimatedStatCard
            title="Assigned Mentor"
            value={assignmentList.length}
            icon={User}
            color="#2E86AB"
            subtitle="Your mentor"
            delay={0}
          />
          <AnimatedStatCard
            title="Active Cohorts"
            value={cohortList.length}
            icon={Calendar}
            color="#4ECDC4"
            subtitle="Current programs"
            delay={100}
          />
          <AnimatedStatCard
            title="Upcoming Sessions"
            value={upcomingSessions}
            icon={Video}
            color="#A23B72"
            subtitle="Scheduled meetings"
            delay={200}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LearningProgressChart assignments={assignmentList} />
          <EngagementTrendChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-semibold">My Mentor</CardTitle>
                  <CardDescription>Your assigned mentor for guidance</CardDescription>
                </div>
                <User className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {assignmentsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : assignmentList.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Mentor Assigned Yet</h3>
                    <p className="text-muted-foreground">You will be matched with a mentor once you are added to a cohort.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-1 gap-4">
                    {assignmentList.map((assignment: any, index: number) => (
                      <Card 
                        key={assignment.id} 
                        className="overflow-hidden hover-lift border-0 shadow-sm"
                        style={{ animationDelay: `${index * 100}ms` }}
                        data-testid={`card-mentor-${assignment.id}`}
                      >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                              <User className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-xl font-semibold text-foreground">{assignment.mentor?.fullName || 'Your Mentor'}</h3>
                                  <p className="text-muted-foreground">{assignment.mentor?.currentJobTitle || 'Professional Mentor'}</p>
                                </div>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  Active
                                </Badge>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-3 mb-4">
                                {assignment.mentor?.company && (
                                  <div className="flex items-center text-muted-foreground">
                                    <Building className="h-4 w-4 mr-2" />
                                    <span>{assignment.mentor.company}</span>
                                  </div>
                                )}
                                {assignment.mentor?.location && (
                                  <div className="flex items-center text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span>{assignment.mentor.location}</span>
                                  </div>
                                )}
                                {assignment.cohort && (
                                  <div className="flex items-center text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>Cohort: {assignment.cohort.name}</span>
                                  </div>
                                )}
                              </div>

                              {assignment.mentor?.mentoringTopics && assignment.mentor.mentoringTopics.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-foreground mb-2">Mentoring Topics:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {assignment.mentor.mentoringTopics.map((topic: string, idx: number) => (
                                      <Badge key={idx} variant="secondary">{topic}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <LearningTopicsCard assignments={assignmentList} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-semibold">Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled mentoring sessions</CardDescription>
              </div>
              <Video className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {assignmentList.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Sessions Scheduled</h3>
                  <p className="text-muted-foreground">Your mentor will schedule sessions once you're matched.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignmentList.flatMap((assignment: any) => 
                    (assignment.sessions || [])
                      .filter((s: any) => s.status === 'scheduled')
                      .map((session: any, idx: number) => (
                        <div key={session.id} className="p-4 rounded-lg bg-muted/50 hover-lift" style={{ animationDelay: `${idx * 100}ms` }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-full">
                                <Video className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  Session with {assignment.mentor?.fullName}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {session.scheduledDate ? format(new Date(session.scheduledDate), 'MMM d, yyyy') : 'TBD'}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {session.scheduledTime || 'TBD'}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
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
                            <div className="mt-3">
                              <Button asChild size="sm" className="hover-lift">
                                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Meeting
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                  )}
                  {assignmentList.every((a: any) => !a.sessions || a.sessions.filter((s: any) => s.status === 'scheduled').length === 0) && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Sessions</h3>
                      <p className="text-muted-foreground">Your mentor will schedule sessions soon.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-semibold">My Cohorts</CardTitle>
                <CardDescription>Programs you're participating in</CardDescription>
              </div>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {cohortsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : cohortList.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Not Part of Any Cohort Yet</h3>
                  <p className="text-muted-foreground">You will be added to a cohort by the program admin.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cohortList.map((cohort: any, index: number) => (
                    <div 
                      key={cohort.id} 
                      className="p-4 rounded-lg bg-muted/50 hover-lift"
                      style={{ animationDelay: `${index * 100}ms` }}
                      data-testid={`card-cohort-${cohort.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{cohort.name}</h3>
                        <Badge className={cohort.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {cohort.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{cohort.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {cohort.startDate ? format(new Date(cohort.startDate), 'MMM d, yyyy') : 'TBD'} - 
                          {cohort.endDate ? format(new Date(cohort.endDate), 'MMM d, yyyy') : 'TBD'}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {cohort.sessionsPerMonth || 2} sessions/month
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
