import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  GraduationCap, 
  Building, 
  LogOut, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Plus,
  Link as LinkIcon,
  Calendar
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface DashboardStats {
  totalStudents: number;
  totalMentors: number;
  activeStudents: number;
  activeMentors: number;
  totalAssignments: number;
}

interface Student {
  id: string;
  fullName: string | null;
  email: string;
  universityName: string | null;
  academicProgram: string | null;
  yearOfStudy: string | null;
  isActive: boolean;
  createdAt: string;
}

interface Mentor {
  id: string;
  fullName: string | null;
  email: string;
  linkedinUrl?: string | null;
  currentJobTitle?: string | null;
  company?: string | null;
  location?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      setLocation("/signin");
    }
  }, [user, isLoading, setLocation]);

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiRequest("/api/admin/stats", "GET"),
  });

  const { data: students } = useQuery({
    queryKey: ["/api/admin/students"],
    queryFn: () => apiRequest("/api/admin/students", "GET"),
  });

  const { data: mentors } = useQuery({
    queryKey: ["/api/admin/mentors"],
    queryFn: () => apiRequest("/api/admin/mentors", "GET"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ type, id, isActive }: { type: "student" | "mentor"; id: string; isActive: boolean }) => {
      return apiRequest(`/api/admin/${type}s/${id}/status`, "PUT", { isActive });
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/${type}s`] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Status Updated",
        description: `${type === "student" ? "Student" : "Mentor"} status updated successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async ({ type, id }: { type: "student" | "mentor"; id: string }) => {
      return apiRequest(`/api/admin/${type}s/${id}`, "DELETE");
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/${type}s`] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Deleted Successfully",
        description: `${type === "student" ? "Student" : "Mentor"} deleted successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete. Please try again.",
        variant: "destructive",
      });
    }
  });

  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleToggleStatus = (type: "student" | "mentor", id: string, currentStatus: boolean) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this ${type}?`)) {
      toggleStatusMutation.mutate({ type, id, isActive: !currentStatus });
    }
  };

  const handleDelete = (type: "student" | "mentor", id: string, name: string | null) => {
    if (window.confirm(`Are you sure you want to delete ${name || 'this user'}? This action cannot be undone.`)) {
      deleteUserMutation.mutate({ type, id });
    }
  };

  const filterUsers = (users: any[]) => {
    if (!users) return [];
    return users.filter(user => {
      const matchesSearch = (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.universityName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.company || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || 
                           (filterStatus === "active" && user.isActive) ||
                           (filterStatus === "inactive" && !user.isActive);
      
      return matchesSearch && matchesStatus;
    });
  };

  const chartData = [
    { month: 'Jan', students: 12, mentors: 5 },
    { month: 'Feb', students: 18, mentors: 7 },
    { month: 'Mar', students: 25, mentors: 10 },
    { month: 'Apr', students: 32, mentors: 12 },
    { month: 'May', students: 45, mentors: 15 },
    { month: 'Jun', students: stats?.totalStudents || 52, mentors: stats?.totalMentors || 18 },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/cohorts">
                <Button variant="outline" className="flex items-center gap-2" data-testid="link-manage-cohorts">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Cohorts</span>
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2" data-testid="button-logout">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-xl font-bold">{stats?.totalStudents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Mentors</p>
                  <p className="text-xl font-bold">{stats?.totalMentors || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Active Students</p>
                  <p className="text-xl font-bold">{stats?.activeStudents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Active Mentors</p>
                  <p className="text-xl font-bold">{stats?.activeMentors || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Assignments</p>
                  <p className="text-xl font-bold">{stats?.totalAssignments || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Growth Overview</CardTitle>
            <CardDescription>Monthly registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E86AB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2E86AB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="mentorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A23B72" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A23B72" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#2E86AB" 
                    strokeWidth={2}
                    fill="url(#studentGradient)" 
                    name="Students"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mentors" 
                    stroke="#A23B72" 
                    strokeWidth={2}
                    fill="url(#mentorGradient)" 
                    name="Mentors"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="students" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <TabsList className="grid grid-cols-2 w-auto">
              <TabsTrigger value="students" data-testid="tab-students">Students ({filterUsers(students || []).length})</TabsTrigger>
              <TabsTrigger value="mentors" data-testid="tab-mentors">Mentors ({filterUsers(mentors || []).length})</TabsTrigger>
            </TabsList>
            <div className="flex gap-2 items-center flex-wrap w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-56">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as "all" | "active" | "inactive")}>
                <SelectTrigger className="w-24" data-testid="select-filter-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="students" className="mt-4">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Students</h3>
              <Button 
                onClick={() => setLocation("/admin/create-student")}
                data-testid="button-add-student"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
            <div className="space-y-2">
              {filterUsers(students || []).map((student: Student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 border rounded-lg bg-background"
                  data-testid={`card-student-${student.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground truncate" data-testid={`text-student-name-${student.id}`}>
                        {student.fullName || 'No Name'}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {student.universityName || 'N/A'} - {student.academicProgram || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <Badge variant={student.isActive ? "default" : "secondary"} className="text-xs" data-testid={`badge-student-status-${student.id}`}>
                      {student.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleStatus("student", student.id, student.isActive)}
                      data-testid={`button-toggle-student-${student.id}`}
                    >
                      {student.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => setLocation(`/admin/edit-student/${student.id}`)}
                      data-testid={`button-edit-student-${student.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete("student", student.id, student.fullName)}
                      data-testid={`button-delete-student-${student.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filterUsers(students || []).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No students found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mentors" className="mt-4">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Mentors</h3>
              <Button 
                onClick={() => setLocation("/admin/create-mentor")}
                data-testid="button-add-mentor"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Mentor
              </Button>
            </div>
            <div className="space-y-2">
              {filterUsers(mentors || []).map((mentor: Mentor) => (
                <div 
                  key={mentor.id} 
                  className="flex items-center justify-between p-3 border rounded-lg bg-background"
                  data-testid={`card-mentor-${mentor.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-pink-100 rounded-full flex-shrink-0">
                      <Users className="w-4 h-4 text-pink-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground truncate" data-testid={`text-mentor-name-${mentor.id}`}>
                        {mentor.fullName || 'No Name'}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {mentor.currentJobTitle || 'N/A'} at {mentor.company || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{mentor.location || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <Badge variant={mentor.isActive ? "default" : "secondary"} className="text-xs" data-testid={`badge-mentor-status-${mentor.id}`}>
                      {mentor.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleStatus("mentor", mentor.id, mentor.isActive)}
                      data-testid={`button-toggle-mentor-${mentor.id}`}
                    >
                      {mentor.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => setLocation(`/admin/edit-mentor/${mentor.id}`)}
                      data-testid={`button-edit-mentor-${mentor.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete("mentor", mentor.id, mentor.fullName)}
                      data-testid={`button-delete-mentor-${mentor.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filterUsers(mentors || []).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No mentors found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
