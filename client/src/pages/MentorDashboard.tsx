import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, User, Clock, Video, Users, Plus, GraduationCap, Building } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
          <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {(user as any)?.firstName || 'Mentor'}! Manage your students and schedule sessions.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Assigned Students</p>
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
                  <p className="text-sm text-gray-500">Scheduled Sessions</p>
                  <p className="text-2xl font-bold">
                    {assignmentList.reduce((acc: number, a: any) => acc + (a.sessions?.filter((s: any) => s.status === 'scheduled').length || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Completed Sessions</p>
                  <p className="text-2xl font-bold">
                    {assignmentList.reduce((acc: number, a: any) => acc + (a.sessions?.filter((s: any) => s.status === 'completed').length || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Students Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Students</h2>
          
          {assignmentsLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-custom mx-auto"></div>
              </CardContent>
            </Card>
          ) : assignmentList.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Assigned Yet</h3>
                <p className="text-gray-600">You will be matched with students once you are added to a cohort.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignmentList.map((assignment: any) => (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      {assignment.student?.fullName || 'Student'}
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      {assignment.student?.academicProgram || 'Academic Program'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {assignment.student?.universityName && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Building className="h-4 w-4 mr-2" />
                          <span>{assignment.student.universityName}</span>
                        </div>
                      )}
                      {assignment.cohort && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Cohort: {assignment.cohort.name}</span>
                        </div>
                      )}
                      
                      {assignment.student?.mentoringTopics && assignment.student.mentoringTopics.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Interests:</p>
                          <div className="flex flex-wrap gap-1">
                            {assignment.student.mentoringTopics.slice(0, 3).map((topic: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{topic}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Sessions: {assignment.sessions?.length || 0}</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Active
                          </Badge>
                        </div>
                        <Dialog open={isScheduleDialogOpen && selectedAssignment?.id === assignment.id} onOpenChange={(open) => {
                          setIsScheduleDialogOpen(open);
                          if (open) setSelectedAssignment(assignment);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="w-full" onClick={() => setSelectedAssignment(assignment)}>
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
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="time">Time</Label>
                                  <Input
                                    id="time"
                                    type="time"
                                    value={sessionForm.scheduledTime}
                                    onChange={(e) => setSessionForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
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
                                />
                              </div>
                              <div>
                                <Label htmlFor="notes">Notes (optional)</Label>
                                <Input
                                  id="notes"
                                  placeholder="Session agenda or notes..."
                                  value={sessionForm.notes}
                                  onChange={(e) => setSessionForm(prev => ({ ...prev, notes: e.target.value }))}
                                />
                              </div>
                              <Button 
                                className="w-full" 
                                onClick={handleScheduleSession}
                                disabled={!sessionForm.scheduledDate || !sessionForm.scheduledTime || createSessionMutation.isPending}
                              >
                                {createSessionMutation.isPending ? 'Scheduling...' : 'Schedule Session'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
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
                <p className="text-gray-600">Schedule sessions with your students to get started.</p>
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
                                Session with {assignment.student?.fullName}
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
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Scheduled
                            </Badge>
                            {session.meetingLink && (
                              <Button asChild size="sm">
                                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <Video className="h-4 w-4 mr-2" />
                                  Start
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
              {assignmentList.every((a: any) => !a.sessions || a.sessions.filter((s: any) => s.status === 'scheduled').length === 0) && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
                    <p className="text-gray-600">Schedule sessions with your students using the buttons above.</p>
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
