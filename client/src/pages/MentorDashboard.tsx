import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Calendar, User, Clock, Video, Users, Plus, GraduationCap, Building, TrendingUp, Target, Award, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

const CHART_COLORS = ['#2E86AB', '#A23B72', '#4ECDC4', '#FF6B6B', '#45B7D1'];

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

function SessionProgressChart({ assignments }: { assignments: any[] }) {
  const totalSessions = assignments.reduce((acc, a) => acc + (a.sessions?.length || 0), 0);
  const completedSessions = assignments.reduce((acc, a) => acc + (a.sessions?.filter((s: any) => s.status === 'completed').length || 0), 0);
  const scheduledSessions = assignments.reduce((acc, a) => acc + (a.sessions?.filter((s: any) => s.status === 'scheduled').length || 0), 0);
  
  const data = [
    { name: 'Completed', value: completedSessions, color: '#4ECDC4' },
    { name: 'Scheduled', value: scheduledSessions, color: '#2E86AB' },
    { name: 'Pending', value: Math.max(0, assignments.length * 4 - totalSessions), color: '#e0e0e0' },
  ].filter(item => item.value > 0);

  const completionRate = assignments.length > 0 
    ? Math.round((completedSessions / Math.max(1, assignments.length * 4)) * 100) 
    : 0;

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Session Progress</CardTitle>
          <CardDescription>Track your mentoring sessions</CardDescription>
        </div>
        <Target className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-semibold">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
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

function MentorActivityChart() {
  const activityData = [
    { week: 'Week 1', sessions: 2, hours: 1 },
    { week: 'Week 2', sessions: 3, hours: 1.5 },
    { week: 'Week 3', sessions: 2, hours: 1 },
    { week: 'Week 4', sessions: 4, hours: 2 },
  ];

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Monthly Activity</CardTitle>
          <CardDescription>Sessions conducted this month</CardDescription>
        </div>
        <TrendingUp className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E86AB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2E86AB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="week" stroke="#888" fontSize={12} />
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
                dataKey="sessions" 
                stroke="#2E86AB" 
                strokeWidth={2}
                fill="url(#sessionGradient)" 
                name="Sessions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentEngagementList({ assignments }: { assignments: any[] }) {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Student Engagement</CardTitle>
          <CardDescription>Progress with each student</CardDescription>
        </div>
        <Award className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No students assigned yet</p>
          ) : (
            assignments.slice(0, 4).map((assignment: any, index: number) => {
              const sessionCount = assignment.sessions?.length || 0;
              const completedCount = assignment.sessions?.filter((s: any) => s.status === 'completed').length || 0;
              const progress = Math.min(100, (completedCount / 4) * 100);
              
              return (
                <div 
                  key={assignment.id} 
                  className="p-3 rounded-lg bg-muted/50 hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-full">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-sm">{assignment.student?.fullName || 'Student'}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {completedCount}/{sessionCount} sessions
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MentorDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [sessionForm, setSessionForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    durationMinutes: 30,
    meetingLink: '',
    notes: ''
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access the mentor dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    } else if (!authLoading && isAuthenticated && (user as any)?.role !== 'mentor') {
      toast({
        title: "Access Denied",
        description: "This dashboard is only for mentors.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [authLoading, isAuthenticated, user, toast]);

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["/api/mentor/assignments"],
    enabled: isAuthenticated,
  });

  const { data: cohorts, isLoading: cohortsLoading } = useQuery({
    queryKey: ["/api/mentor/cohorts"],
    enabled: isAuthenticated,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return await apiRequest('/api/sessions', 'POST', sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentor/assignments"] });
      setIsScheduleDialogOpen(false);
      setSessionForm({
        scheduledDate: '',
        scheduledTime: '',
        durationMinutes: 30,
        meetingLink: '',
        notes: ''
      });
      toast({
        title: "Session Scheduled",
        description: "The mentoring session has been scheduled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule session. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleScheduleSession = () => {
    if (!selectedAssignment) return;
    
    createSessionMutation.mutate({
      assignmentId: selectedAssignment.id,
      cohortId: selectedAssignment.cohortId,
      scheduledDate: sessionForm.scheduledDate,
      scheduledTime: sessionForm.scheduledTime,
      durationMinutes: sessionForm.durationMinutes,
      meetingLink: sessionForm.meetingLink,
      notes: sessionForm.notes,
      status: 'scheduled'
    });
  };

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

  const totalSessions = assignmentList.reduce((acc, a) => acc + (a.sessions?.length || 0), 0);
  const scheduledSessions = assignmentList.reduce((acc, a) => acc + (a.sessions?.filter((s: any) => s.status === 'scheduled').length || 0), 0);
  const completedSessions = assignmentList.reduce((acc, a) => acc + (a.sessions?.filter((s: any) => s.status === 'completed').length || 0), 0);

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Mentor Dashboard</h1>
          </div>
          <p className="text-muted-foreground ml-11">
            Welcome back, {(user as any)?.firstName || 'Mentor'}! Manage your students and schedule sessions.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <AnimatedStatCard
            title="Assigned Students"
            value={assignmentList.length}
            icon={Users}
            color="#2E86AB"
            subtitle="Active mentees"
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
            title="Scheduled Sessions"
            value={scheduledSessions}
            icon={Video}
            color="#A23B72"
            subtitle="Upcoming meetings"
            delay={200}
          />
          <AnimatedStatCard
            title="Completed Sessions"
            value={completedSessions}
            icon={CheckCircle2}
            color="#45B7D1"
            subtitle="Sessions done"
            delay={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SessionProgressChart assignments={assignmentList} />
          <MentorActivityChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-semibold">My Students</CardTitle>
                  <CardDescription>Students assigned to you for mentoring</CardDescription>
                </div>
                <GraduationCap className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {assignmentsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : assignmentList.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Students Assigned Yet</h3>
                    <p className="text-muted-foreground">You will be matched with students once you are added to a cohort.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {assignmentList.map((assignment: any, index: number) => (
                      <Card 
                        key={assignment.id} 
                        className="overflow-hidden hover-lift border-0 shadow-sm"
                        style={{ animationDelay: `${index * 100}ms` }}
                        data-testid={`card-student-${assignment.id}`}
                      >
                        <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500" />
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-full">
                                <GraduationCap className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{assignment.student?.fullName || 'Student'}</h3>
                                <p className="text-sm text-muted-foreground">{assignment.student?.academicProgram || 'Academic Program'}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          </div>
                          
                          {assignment.student?.universityName && (
                            <div className="flex items-center text-muted-foreground text-sm mb-2">
                              <Building className="h-4 w-4 mr-2" />
                              <span className="truncate">{assignment.student.universityName}</span>
                            </div>
                          )}
                          
                          {assignment.cohort && (
                            <div className="flex items-center text-muted-foreground text-sm mb-3">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Cohort: {assignment.cohort.name}</span>
                            </div>
                          )}

                          {assignment.student?.mentoringTopics && assignment.student.mentoringTopics.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {assignment.student.mentoringTopics.slice(0, 3).map((topic: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">{topic}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-3 border-t">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Sessions: {assignment.sessions?.length || 0}</span>
                            </div>
                            <Dialog open={isScheduleDialogOpen && selectedAssignment?.id === assignment.id} onOpenChange={(open) => {
                              setIsScheduleDialogOpen(open);
                              if (open) setSelectedAssignment(assignment);
                            }}>
                              <DialogTrigger asChild>
                                <Button size="sm" className="w-full hover-lift" onClick={() => setSelectedAssignment(assignment)} data-testid={`button-schedule-${assignment.id}`}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Schedule Session
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Schedule Session with {assignment.student?.fullName}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="date">Date</Label>
                                      <Input
                                        id="date"
                                        type="date"
                                        value={sessionForm.scheduledDate}
                                        onChange={(e) => setSessionForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                                        data-testid="input-session-date"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="time">Time</Label>
                                      <Input
                                        id="time"
                                        type="time"
                                        value={sessionForm.scheduledTime}
                                        onChange={(e) => setSessionForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                                        data-testid="input-session-time"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="duration">Duration (minutes)</Label>
                                    <Input
                                      id="duration"
                                      type="number"
                                      value={sessionForm.durationMinutes}
                                      onChange={(e) => setSessionForm(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) }))}
                                      data-testid="input-session-duration"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="link">Meeting Link (optional)</Label>
                                    <Input
                                      id="link"
                                      type="url"
                                      placeholder="https://zoom.us/j/..."
                                      value={sessionForm.meetingLink}
                                      onChange={(e) => setSessionForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                                      data-testid="input-session-link"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="notes">Notes (optional)</Label>
                                    <Input
                                      id="notes"
                                      placeholder="Session agenda or notes..."
                                      value={sessionForm.notes}
                                      onChange={(e) => setSessionForm(prev => ({ ...prev, notes: e.target.value }))}
                                      data-testid="input-session-notes"
                                    />
                                  </div>
                                  <Button 
                                    className="w-full" 
                                    onClick={handleScheduleSession}
                                    disabled={!sessionForm.scheduledDate || !sessionForm.scheduledTime || createSessionMutation.isPending}
                                    data-testid="button-confirm-schedule"
                                  >
                                    {createSessionMutation.isPending ? 'Scheduling...' : 'Schedule Session'}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <StudentEngagementList assignments={assignmentList} />
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
                  <p className="text-muted-foreground">Schedule sessions with your students to get started.</p>
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
                                  Session with {assignment.student?.fullName}
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
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Scheduled
                              </Badge>
                              {session.meetingLink && (
                                <Button asChild size="sm" className="hover-lift">
                                  <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                    <Video className="h-4 w-4 mr-2" />
                                    Start
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                  {assignmentList.every((a: any) => !a.sessions || a.sessions.filter((s: any) => s.status === 'scheduled').length === 0) && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Sessions</h3>
                      <p className="text-muted-foreground">Schedule sessions with your students using the buttons above.</p>
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
