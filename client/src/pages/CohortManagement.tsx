import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation, Link } from "wouter";
import { format } from "date-fns";
import { 
  Calendar, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Link as LinkIcon,
  Clock,
  GraduationCap,
  Building,
  Video,
  User,
  AlertTriangle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

export default function CohortManagement() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<any>(null);
  const [cohortForm, setCohortForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    sessionsPerMonth: 2,
    sessionDurationMinutes: 30
  });
  const [assignForm, setAssignForm] = useState({
    mentorId: '',
    studentId: ''
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access cohort management.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    } else if (!authLoading && isAuthenticated && (user as any)?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "This page is only for administrators.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [authLoading, isAuthenticated, user, toast]);

  const { data: cohorts, isLoading: cohortsLoading } = useQuery({
    queryKey: ["/api/cohorts"],
  });

  const { data: students } = useQuery({
    queryKey: ["/api/admin/students"],
  });

  const { data: mentors } = useQuery({
    queryKey: ["/api/admin/mentors"],
  });

  const createCohortMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/cohorts', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cohorts"] });
      setIsCreateDialogOpen(false);
      setCohortForm({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        sessionsPerMonth: 2,
        sessionDurationMinutes: 30
      });
      toast({
        title: "Cohort Created",
        description: "The cohort has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create cohort. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteCohortMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/cohorts/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cohorts"] });
      toast({
        title: "Cohort Deleted",
        description: "The cohort has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete cohort. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async ({ cohortId, mentorUserId, studentUserId }: { cohortId: number; mentorUserId: string; studentUserId: string }) => {
      return await apiRequest(`/api/cohorts/${cohortId}/assignments`, 'POST', { mentorUserId, studentUserId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cohorts/${selectedCohort?.id}/assignments`] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/assignments"] });
      setIsAssignDialogOpen(false);
      setAssignForm({ mentorId: '', studentId: '' });
      toast({
        title: "Assignment Created",
        description: "The mentor-student assignment has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateCohort = () => {
    createCohortMutation.mutate({
      ...cohortForm,
      startDate: new Date(cohortForm.startDate),
      endDate: new Date(cohortForm.endDate),
      isActive: true
    });
  };

  const handleDeleteCohort = (cohort: any) => {
    if (window.confirm(`Are you sure you want to delete cohort "${cohort.name}"?`)) {
      deleteCohortMutation.mutate(cohort.id);
    }
  };

  const handleCreateAssignment = () => {
    if (!selectedCohort || !assignForm.mentorId || !assignForm.studentId) return;
    
    createAssignmentMutation.mutate({
      cohortId: selectedCohort.id,
      mentorUserId: assignForm.mentorId,
      studentUserId: assignForm.studentId
    });
  };

  const cohortList = cohorts as any[] || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cohort Management</h1>
              <p className="text-gray-600 mt-1">Create and manage mentorship cohorts</p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-custom hover:bg-primary-dark">
                <Plus className="h-4 w-4 mr-2" />
                Create Cohort
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Cohort</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="name">Cohort Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Cohort-Jan-2025"
                    value={cohortForm.name}
                    onChange={(e) => setCohortForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the cohort"
                    value={cohortForm.description}
                    onChange={(e) => setCohortForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={cohortForm.startDate}
                      onChange={(e) => setCohortForm(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={cohortForm.endDate}
                      onChange={(e) => setCohortForm(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionsPerMonth">Sessions Per Month</Label>
                    <Input
                      id="sessionsPerMonth"
                      type="number"
                      value={cohortForm.sessionsPerMonth}
                      onChange={(e) => setCohortForm(prev => ({ ...prev, sessionsPerMonth: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionDuration">Session Duration (mins)</Label>
                    <Input
                      id="sessionDuration"
                      type="number"
                      value={cohortForm.sessionDurationMinutes}
                      onChange={(e) => setCohortForm(prev => ({ ...prev, sessionDurationMinutes: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleCreateCohort}
                  disabled={!cohortForm.name || !cohortForm.startDate || !cohortForm.endDate || createCohortMutation.isPending}
                >
                  {createCohortMutation.isPending ? 'Creating...' : 'Create Cohort'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cohorts Grid */}
        {cohortsLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-custom mx-auto"></div>
            </CardContent>
          </Card>
        ) : cohortList.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cohorts Yet</h3>
              <p className="text-gray-600 mb-4">Create your first cohort to start organizing mentorship programs.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Cohort
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {cohortList.map((cohort: any) => (
              <CohortCard 
                key={cohort.id} 
                cohort={cohort}
                students={students as any[]}
                mentors={mentors as any[]}
                onDelete={() => handleDeleteCohort(cohort)}
                onSelectForAssignment={() => {
                  setSelectedCohort(cohort);
                  setIsAssignDialogOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Create Assignment Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Mentor to Student in {selectedCohort?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Mentor</Label>
                <Select value={assignForm.mentorId} onValueChange={(value) => setAssignForm(prev => ({ ...prev, mentorId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {(mentors as any[])?.filter(m => m.isActive).map((m: any) => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        {m.fullName} - {m.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Student</Label>
                <Select value={assignForm.studentId} onValueChange={(value) => setAssignForm(prev => ({ ...prev, studentId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {(students as any[])?.filter(s => s.isActive).map((s: any) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.fullName} - {s.universityName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateAssignment}
                disabled={!assignForm.mentorId || !assignForm.studentId || createAssignmentMutation.isPending}
              >
                {createAssignmentMutation.isPending ? 'Creating...' : 'Create Assignment'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function CohortCard({ cohort, students, mentors, onDelete, onSelectForAssignment }: { 
  cohort: any; 
  students: any[];
  mentors: any[];
  onDelete: () => void;
  onSelectForAssignment: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSession, setEditingSession] = useState<any>(null);
  const [deletingSession, setDeletingSession] = useState<any>(null);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: '',
    status: 'scheduled'
  });

  const { data: members } = useQuery({
    queryKey: [`/api/cohorts/${cohort.id}/members`],
  });

  const { data: assignments } = useQuery({
    queryKey: [`/api/cohorts/${cohort.id}/assignments`],
  });

  const { data: sessions } = useQuery({
    queryKey: [`/api/cohorts/${cohort.id}/sessions`],
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest(`/api/sessions/${id}`, 'PATCH', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cohorts/${cohort.id}/sessions`] });
      setEditingSession(null);
      toast({
        title: "Session Updated",
        description: "The session has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update session.",
        variant: "destructive",
      });
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/sessions/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cohorts/${cohort.id}/sessions`] });
      setDeletingSession(null);
      toast({
        title: "Session Deleted",
        description: "The session has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete session.",
        variant: "destructive",
      });
    }
  });

  const handleEditSession = (session: any) => {
    const dateTime = session.scheduledDate ? new Date(session.scheduledDate) : new Date();
    setSessionForm({
      title: session.title || '',
      scheduledDate: dateTime.toISOString().split('T')[0],
      scheduledTime: dateTime.toTimeString().slice(0, 5),
      notes: session.notes || '',
      status: session.status || 'scheduled'
    });
    setEditingSession(session);
  };

  const handleSaveSession = () => {
    if (!editingSession) return;
    const scheduledDate = new Date(`${sessionForm.scheduledDate}T${sessionForm.scheduledTime}`);
    updateSessionMutation.mutate({
      id: editingSession.id,
      data: {
        title: sessionForm.title,
        scheduledDate: scheduledDate.toISOString(),
        notes: sessionForm.notes,
        status: sessionForm.status
      }
    });
  };

  const memberList = members as any[] || [];
  const assignmentList = assignments as any[] || [];
  const sessionList = sessions as any[] || [];
  const studentMembers = memberList.filter(m => m.role === 'student');
  const mentorMembers = memberList.filter(m => m.role === 'mentor');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-custom" />
              {cohort.name}
            </CardTitle>
            <CardDescription>{cohort.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={cohort.isActive ? "default" : "secondary"}>
              {cohort.isActive ? "Active" : "Inactive"}
            </Badge>
            <Button variant="ghost" size="sm" className="text-red-600" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {cohort.startDate ? format(new Date(cohort.startDate), 'MMM d, yyyy') : 'TBD'} - 
              {cohort.endDate ? format(new Date(cohort.endDate), 'MMM d, yyyy') : 'TBD'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{cohort.sessionsPerMonth || 2} sessions/month</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{cohort.sessionDurationMinutes || 30} mins/session</span>
          </div>
        </div>

        <Tabs defaultValue="members">
          <TabsList className="mb-4">
            <TabsTrigger value="members">
              Members ({memberList.length})
            </TabsTrigger>
            <TabsTrigger value="assignments">
              Assignments ({assignmentList.length})
            </TabsTrigger>
            <TabsTrigger value="sessions">
              Sessions ({sessionList.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {studentMembers.length} Students
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {mentorMembers.length} Mentors
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Members are automatically added when assignments are created
                </p>
              </div>
              
              {memberList.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No members yet. Create an assignment to add members to this cohort.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {memberList.map((member: any) => (
                    <div key={member.userId} className="p-3 border rounded-lg flex items-center justify-between" data-testid={`member-${member.userId}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${member.role === 'mentor' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {member.role === 'mentor' ? (
                            <Building className="h-4 w-4 text-blue-600" />
                          ) : (
                            <GraduationCap className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.user?.fullName || member.registration?.fullName || member.user?.firstName || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-4">
              <div className="flex items-center justify-end">
                <Button size="sm" onClick={onSelectForAssignment}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
              
              {assignmentList.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No mentor-student assignments in this cohort yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {assignmentList.map((assignment: any) => (
                    <div key={assignment.id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Building className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{assignment.mentorName}</span>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-green-100 rounded-full">
                            <GraduationCap className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium">{assignment.studentName}</span>
                        </div>
                      </div>
                      <Badge variant={assignment.isActive ? "default" : "secondary"}>
                        {assignment.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="space-y-4">
              {sessionList.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No sessions scheduled in this cohort yet.</p>
                  <p className="text-sm">Sessions are created by mentors from their dashboard.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessionList.map((session: any) => (
                    <div key={session.id} className="p-4 border rounded-lg" data-testid={`session-${session.id}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Video className="h-4 w-4 text-primary-custom" />
                            <span className="font-medium">{session.title || 'Untitled Session'}</span>
                            <Badge 
                              variant={session.status === 'completed' ? 'default' : session.status === 'cancelled' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {session.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {session.scheduledDate ? format(new Date(session.scheduledDate), 'MMM d, yyyy h:mm a') : 'TBD'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3 text-blue-600" />
                              {session.mentorName}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3 text-green-600" />
                              {session.studentName}
                            </span>
                          </div>
                          {session.notes && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{session.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditSession(session)}
                            data-testid={`button-edit-session-${session.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600"
                            onClick={() => setDeletingSession(session)}
                            data-testid={`button-delete-session-${session.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Session Dialog */}
        <Dialog open={!!editingSession} onOpenChange={(open) => !open && setEditingSession(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Title</Label>
                <Input 
                  value={sessionForm.title} 
                  onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Session title"
                  data-testid="input-session-title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={sessionForm.scheduledDate}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    data-testid="input-session-date"
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input 
                    type="time" 
                    value={sessionForm.scheduledTime}
                    onChange={(e) => setSessionForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    data-testid="input-session-time"
                  />
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select 
                  value={sessionForm.status} 
                  onValueChange={(value) => setSessionForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger data-testid="select-session-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea 
                  value={sessionForm.notes}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Session notes..."
                  className="min-h-[100px]"
                  data-testid="input-session-notes"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSession(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveSession}
                  disabled={updateSessionMutation.isPending}
                  data-testid="button-save-session"
                >
                  {updateSessionMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Session Confirmation */}
        <AlertDialog open={!!deletingSession} onOpenChange={(open) => !open && setDeletingSession(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Session
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this session? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => deletingSession && deleteSessionMutation.mutate(deletingSession.id)}
                data-testid="button-confirm-delete-session"
              >
                {deleteSessionMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
