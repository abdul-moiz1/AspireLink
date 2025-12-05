import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Calendar, User, Clock, Video, Users, Plus, GraduationCap, Building, RefreshCw, Edit, Loader2, Phone, Linkedin, MapPin, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function MentorDashboard() {
  const { user, isLoading: authLoading, isAuthenticated, refreshUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCohortSessionsDialogOpen, setIsCohortSessionsDialogOpen] = useState(false);
  const [selectedCohortForSessions, setSelectedCohortForSessions] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionForm, setSessionForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    durationMinutes: 30,
    meetingLink: '',
    notes: ''
  });
  const [editForm, setEditForm] = useState({
    fullName: '',
    phoneNumber: '',
    linkedinUrl: '',
    currentJobTitle: '',
    company: '',
    yearsExperience: '',
    education: '',
    location: '',
    profileSummary: '',
    motivation: '',
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit') === 'true' && isAuthenticated && !authLoading) {
      setIsEditDialogOpen(true);
      setLocation('/dashboard/mentor', { replace: true });
    }
  }, [isAuthenticated, authLoading, setLocation]);

  useEffect(() => {
    if (user && isEditDialogOpen) {
      const userData = user as any;
      setEditForm({
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        linkedinUrl: userData.linkedinUrl || '',
        currentJobTitle: userData.currentJobTitle || '',
        company: userData.company || '',
        yearsExperience: userData.yearsExperience?.toString() || '',
        education: userData.education || '',
        location: userData.location || '',
        profileSummary: userData.profileSummary || '',
        motivation: userData.motivation || '',
      });
    }
  }, [user, isEditDialogOpen]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof editForm) => {
      const updateData = {
        ...data,
        yearsExperience: data.yearsExperience ? parseInt(data.yearsExperience) : null
      };
      return apiRequest(`/api/users/${(user as any)?.id}`, "PUT", updateData);
    },
    onSuccess: async () => {
      toast({
        title: "Profile Updated",
        description: "Your application information has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ["/api/mentor/assignments"] });
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

  const rescheduleSessionMutation = useMutation({
    mutationFn: async ({ sessionId, data }: { sessionId: number; data: any }) => {
      return await apiRequest(`/api/sessions/${sessionId}`, 'PATCH', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentor/assignments"] });
      setIsRescheduleDialogOpen(false);
      setSelectedSession(null);
      setSessionForm({
        scheduledDate: '',
        scheduledTime: '',
        durationMinutes: 30,
        meetingLink: '',
        notes: ''
      });
      toast({
        title: "Session Rescheduled",
        description: "The session has been rescheduled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reschedule session. Please try again.",
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

  const handleRescheduleSession = () => {
    if (!selectedSession) return;
    
    rescheduleSessionMutation.mutate({
      sessionId: selectedSession.id,
      data: {
        scheduledDate: sessionForm.scheduledDate,
        scheduledTime: sessionForm.scheduledTime,
        durationMinutes: sessionForm.durationMinutes,
        meetingLink: sessionForm.meetingLink || selectedSession.meetingLink,
        notes: sessionForm.notes || selectedSession.notes
      }
    });
  };

  const openRescheduleDialog = (session: any, assignment: any) => {
    setSelectedSession(session);
    setSelectedAssignment(assignment);
    setSessionForm({
      scheduledDate: session.scheduledDate || '',
      scheduledTime: session.scheduledTime || '',
      durationMinutes: session.durationMinutes || 30,
      meetingLink: session.meetingLink || '',
      notes: session.notes || ''
    });
    setIsRescheduleDialogOpen(true);
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

  const sessionData = [
    { name: 'Scheduled', value: scheduledSessions },
    { name: 'Completed', value: completedSessions },
    { name: 'Total', value: totalSessions },
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Mentor Dashboard</h1>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
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
                      <Label htmlFor="currentJobTitle">Current Job Title</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="currentJobTitle"
                          value={editForm.currentJobTitle}
                          onChange={(e) => setEditForm(prev => ({ ...prev, currentJobTitle: e.target.value }))}
                          placeholder="Senior Software Engineer"
                          className="pl-10"
                          data-testid="input-edit-jobtitle"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="company"
                          value={editForm.company}
                          onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Your company"
                          className="pl-10"
                          data-testid="input-edit-company"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of Experience</Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        value={editForm.yearsExperience}
                        onChange={(e) => setEditForm(prev => ({ ...prev, yearsExperience: e.target.value }))}
                        placeholder="10"
                        data-testid="input-edit-experience"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="San Francisco, CA"
                          className="pl-10"
                          data-testid="input-edit-location"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={editForm.education}
                      onChange={(e) => setEditForm(prev => ({ ...prev, education: e.target.value }))}
                      placeholder="MBA, Computer Science Degree, etc."
                      data-testid="input-edit-education"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileSummary">Profile Summary</Label>
                    <Textarea
                      id="profileSummary"
                      value={editForm.profileSummary}
                      onChange={(e) => setEditForm(prev => ({ ...prev, profileSummary: e.target.value }))}
                      placeholder="Brief description of your professional background..."
                      rows={3}
                      data-testid="input-edit-summary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motivation">Motivation to Mentor</Label>
                    <Textarea
                      id="motivation"
                      value={editForm.motivation}
                      onChange={(e) => setEditForm(prev => ({ ...prev, motivation: e.target.value }))}
                      placeholder="Why do you want to be a mentor?"
                      rows={3}
                      data-testid="input-edit-motivation"
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
            Welcome back, {(user as any)?.fullName || 'Mentor'}! Manage your students and sessions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="text-2xl font-bold">{assignmentList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Cohorts</p>
                  <p className="text-2xl font-bold">{cohortList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">{scheduledSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sessions Overview</CardTitle>
            <CardDescription>Your mentoring activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionData} layout="horizontal" barCategoryGap="20%">
                  <XAxis dataKey="name" stroke="#888" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="value" fill="#2E86AB" radius={[4, 4, 4, 4]} name="Sessions" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg">My Students</CardTitle>
                <CardDescription>Students assigned to you</CardDescription>
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
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No students assigned yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignmentList.map((assignment: any) => (
                    <div 
                      key={assignment.id} 
                      className="p-3 rounded-lg bg-muted/50"
                      data-testid={`card-student-${assignment.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{assignment.student?.fullName || 'Student'}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {assignment.sessions?.length || 0} sessions
                        </Badge>
                      </div>
                      {assignment.student?.universityName && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                          <Building className="h-3 w-3" />
                          {assignment.student.universityName}
                        </p>
                      )}
                      <Dialog open={isScheduleDialogOpen && selectedAssignment?.id === assignment.id} onOpenChange={(open) => {
                        setIsScheduleDialogOpen(open);
                        if (open) {
                          setSelectedAssignment(assignment);
                          setSessionForm({
                            scheduledDate: '',
                            scheduledTime: '',
                            durationMinutes: 30,
                            meetingLink: '',
                            notes: ''
                          });
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="w-full" data-testid={`button-schedule-${assignment.id}`}>
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled meetings</CardDescription>
              </div>
              <Video className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {assignmentList.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No sessions scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignmentList.flatMap((assignment: any) => 
                    (assignment.sessions || [])
                      .filter((s: any) => s.status === 'scheduled')
                      .map((session: any) => (
                        <div key={session.id} className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">
                              {assignment.student?.fullName}
                            </span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                              Scheduled
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2 flex-wrap">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {session.scheduledDate ? format(new Date(session.scheduledDate), 'MMM d, yyyy') : 'TBD'}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {session.scheduledTime || 'TBD'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1"
                              onClick={() => openRescheduleDialog(session, assignment)}
                              data-testid={`button-reschedule-${session.id}`}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Reschedule
                            </Button>
                            {session.meetingLink && (
                              <Button asChild size="sm" className="flex-1">
                                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <Video className="h-3 w-3 mr-1" />
                                  Join
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                  {assignmentList.every((a: any) => !a.sessions || a.sessions.filter((s: any) => s.status === 'scheduled').length === 0) && (
                    <div className="text-center py-8">
                      <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No upcoming sessions</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg">My Cohorts</CardTitle>
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
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">Not part of any cohort yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cohortList.map((cohort: any) => {
                  const cohortSessions = assignmentList
                    .filter((a: any) => a.cohortId === cohort.id)
                    .flatMap((a: any) => (a.sessions || []).map((s: any) => ({
                      ...s,
                      studentName: a.student?.fullName || 'Student'
                    })))
                    .filter((s: any) => s.status === 'scheduled');
                  
                  return (
                    <div 
                      key={cohort.id} 
                      className="p-4 rounded-lg border bg-background"
                      data-testid={`card-cohort-${cohort.id}`}
                    >
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{cohort.name}</span>
                        </div>
                        <Badge className={cohort.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {cohort.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 flex-wrap">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {cohort.startDate ? format(new Date(cohort.startDate), 'MMM d, yyyy') : 'TBD'} -{' '}
                          {cohort.endDate ? format(new Date(cohort.endDate), 'MMM d, yyyy') : 'TBD'}
                        </span>
                        {cohort.sessionsPerMonth && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {cohort.sessionsPerMonth} sessions/month
                          </span>
                        )}
                      </div>
                      
                      {cohortSessions.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Upcoming Sessions ({cohortSessions.length})
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6"
                              onClick={() => {
                                setSelectedCohortForSessions({ ...cohort, sessions: cohortSessions });
                                setIsCohortSessionsDialogOpen(true);
                              }}
                              data-testid={`button-view-cohort-sessions-${cohort.id}`}
                            >
                              View Details
                            </Button>
                          </div>
                          <div className="space-y-1">
                            {cohortSessions.slice(0, 2).map((session: any) => (
                              <div key={session.id} className="text-xs flex justify-between items-center py-1">
                                <span className="text-muted-foreground">{session.studentName}</span>
                                <span className="text-foreground">
                                  {session.scheduledDate ? format(new Date(session.scheduledDate), 'MMM d') : ''} at {session.scheduledTime || 'TBD'}
                                </span>
                              </div>
                            ))}
                            {cohortSessions.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{cohortSessions.length - 2} more sessions
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={isCohortSessionsDialogOpen} onOpenChange={setIsCohortSessionsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {selectedCohortForSessions?.name} - Sessions
              </DialogTitle>
              <DialogDescription>
                Scheduled mentoring sessions in this cohort
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto">
              {selectedCohortForSessions?.sessions?.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No scheduled sessions in this cohort
                </div>
              ) : (
                selectedCohortForSessions?.sessions?.map((session: any) => (
                  <div key={session.id} className="p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{session.studentName}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        Scheduled
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {session.scheduledDate ? format(new Date(session.scheduledDate), 'MMM d, yyyy') : 'TBD'}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.scheduledTime || 'TBD'}
                      </span>
                      {session.durationMinutes && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {session.durationMinutes} mins
                        </span>
                      )}
                    </div>
                    {session.meetingLink && (
                      <Button asChild size="sm" className="mt-2 w-full">
                        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Video className="h-3 w-3 mr-1" />
                          Join Meeting
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reschedule Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reschedule-date">New Date</Label>
                  <Input
                    id="reschedule-date"
                    type="date"
                    value={sessionForm.scheduledDate}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    data-testid="input-reschedule-date"
                  />
                </div>
                <div>
                  <Label htmlFor="reschedule-time">New Time</Label>
                  <Input
                    id="reschedule-time"
                    type="time"
                    value={sessionForm.scheduledTime}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    data-testid="input-reschedule-time"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="reschedule-duration">Duration (minutes)</Label>
                <Input
                  id="reschedule-duration"
                  type="number"
                  value={sessionForm.durationMinutes}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) }))}
                  data-testid="input-reschedule-duration"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleRescheduleSession}
                disabled={!sessionForm.scheduledDate || !sessionForm.scheduledTime || rescheduleSessionMutation.isPending}
                data-testid="button-confirm-reschedule"
              >
                {rescheduleSessionMutation.isPending ? 'Rescheduling...' : 'Confirm Reschedule'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
