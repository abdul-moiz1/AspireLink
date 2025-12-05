import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Calendar, User, Clock, Video, Building, MapPin, Edit, Loader2, GraduationCap, Phone, Linkedin, ChevronRight, Users, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const yearOfStudyOptions = [
  "1st year undergraduate", "2nd year undergraduate", "3rd year undergraduate", 
  "4th year undergraduate", "5th year undergraduate", "1st year master's", 
  "2nd year master's", "1st year PhD", "2nd year PhD", "3rd+ year PhD"
];

export default function StudentDashboard() {
  const { user, isLoading: authLoading, isAuthenticated, refreshUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMentorForPreview, setSelectedMentorForPreview] = useState<any>(null);
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
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit') === 'true' && isAuthenticated && !authLoading) {
      setIsEditDialogOpen(true);
      setLocation('/dashboard/student', { replace: true });
    }
  }, [isAuthenticated, authLoading, setLocation]);

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
    refetchInterval: 30000,
  });

  const { data: cohorts, isLoading: cohortsLoading } = useQuery({
    queryKey: ["/api/student/cohorts"],
    enabled: isAuthenticated,
    refetchInterval: 30000,
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

  const deduplicatedMentors = useMemo(() => {
    const mentorMap = new Map<string, {
      mentor: any;
      cohorts: { id: number; name: string; startDate?: string; endDate?: string; isActive: boolean; sessionCount: number }[];
      totalSessions: number;
      assignments: any[];
    }>();
    
    assignmentList.forEach((assignment) => {
      const mentorId = assignment.mentor?.id || assignment.mentorUserId;
      if (!mentorId) return;
      
      if (!mentorMap.has(mentorId)) {
        mentorMap.set(mentorId, {
          mentor: assignment.mentor,
          cohorts: [],
          totalSessions: 0,
          assignments: []
        });
      }
      
      const entry = mentorMap.get(mentorId)!;
      entry.assignments.push(assignment);
      entry.totalSessions += assignment.sessions?.length || 0;
      
      if (assignment.cohort) {
        const existingCohort = entry.cohorts.find(c => c.id === assignment.cohort.id);
        if (!existingCohort) {
          entry.cohorts.push({
            id: assignment.cohort.id,
            name: assignment.cohort.name,
            startDate: assignment.cohort.startDate,
            endDate: assignment.cohort.endDate,
            isActive: assignment.cohort.isActive ?? true,
            sessionCount: assignment.sessions?.length || 0
          });
        } else {
          existingCohort.sessionCount += assignment.sessions?.length || 0;
        }
      }
    });
    
    return Array.from(mentorMap.values());
  }, [assignmentList]);

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
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              data-testid="button-edit-profile"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Application
            </Button>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
            Welcome back, {(user as any)?.fullName || 'Student'}! Manage your mentors and sessions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Mentors</p>
                  <p className="text-2xl font-bold">{deduplicatedMentors.length}</p>
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
                  <Bar dataKey="value" fill="#4ECDC4" radius={[4, 4, 4, 4]} name="Sessions" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg">My Mentors</CardTitle>
                <CardDescription>Mentors assigned to you ({deduplicatedMentors.length} unique)</CardDescription>
              </div>
              <User className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {assignmentsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : deduplicatedMentors.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No mentors assigned yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {deduplicatedMentors.map((entry: any) => (
                    <div 
                      key={entry.mentor?.id || 'unknown'} 
                      className="p-3 rounded-lg bg-muted/50"
                      data-testid={`card-mentor-${entry.mentor?.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button 
                          className="flex items-center gap-2 text-left hover-elevate active-elevate-2 rounded-md px-1 -mx-1"
                          onClick={() => setSelectedMentorForPreview(entry)}
                          data-testid={`button-view-mentor-cohorts-${entry.mentor?.id}`}
                        >
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{entry.mentor?.fullName || 'Mentor'}</span>
                          {entry.cohorts.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              {entry.cohorts.length} cohorts
                            </Badge>
                          )}
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </button>
                        <Badge variant="outline" className="text-xs">
                          {entry.totalSessions} sessions
                        </Badge>
                      </div>
                      {entry.mentor?.currentJobTitle && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                          <Briefcase className="h-3 w-3" />
                          {entry.mentor.currentJobTitle}
                          {entry.mentor?.company && ` at ${entry.mentor.company}`}
                        </p>
                      )}
                      {entry.mentor?.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {entry.mentor.location}
                        </p>
                      )}
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
                              {assignment.mentor?.fullName}
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
                          {session.meetingLink && (
                            <Button asChild size="sm" className="w-full">
                              <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-3 w-3 mr-1" />
                                Join Meeting
                              </a>
                            </Button>
                          )}
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
                      mentorName: a.mentor?.fullName || 'Mentor'
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
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                            <Video className="h-3 w-3" />
                            Upcoming Sessions ({cohortSessions.length})
                          </span>
                          <div className="space-y-1">
                            {cohortSessions.slice(0, 2).map((session: any) => (
                              <div key={session.id} className="text-xs flex justify-between items-center py-1">
                                <span className="text-muted-foreground">{session.mentorName}</span>
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

        <Dialog open={!!selectedMentorForPreview} onOpenChange={() => setSelectedMentorForPreview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                {selectedMentorForPreview?.mentor?.fullName || 'Mentor'} - Cohorts
              </DialogTitle>
              <DialogDescription>
                Your mentor across different cohorts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              {selectedMentorForPreview?.cohorts?.map((cohort: any) => (
                <div key={cohort.id} className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cohort.name}</span>
                    <Badge className={cohort.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {cohort.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {cohort.startDate ? format(new Date(cohort.startDate), 'MMM d, yyyy') : 'TBD'} -{' '}
                      {cohort.endDate ? format(new Date(cohort.endDate), 'MMM d, yyyy') : 'TBD'}
                    </span>
                    <span className="flex items-center">
                      <Video className="h-3 w-3 mr-1" />
                      {cohort.sessionCount} sessions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
