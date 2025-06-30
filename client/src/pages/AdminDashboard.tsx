import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
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
  Link as LinkIcon
} from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  totalMentors: number;
  activeStudents: number;
  activeMentors: number;
  totalAssignments: number;
}

interface Student {
  id: number;
  fullName: string;
  emailAddress: string;
  universityName: string;
  academicProgram: string;
  yearOfStudy: string;
  isActive: boolean;
  createdAt: string;
}

interface Mentor {
  id: number;
  fullName: string;
  linkedinUrl?: string;
  currentJobTitle?: string;
  company?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
}

interface Assignment {
  id: number;
  mentorId: number;
  studentId: number;
  mentorName: string;
  studentName: string;
  isActive: boolean;
  assignedAt: string;
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Check admin authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiRequest("/api/admin/stats", "GET"),
  });

  // Fetch students
  const { data: students } = useQuery({
    queryKey: ["/api/admin/students"],
    queryFn: () => apiRequest("/api/admin/students", "GET"),
  });

  // Fetch mentors
  const { data: mentors } = useQuery({
    queryKey: ["/api/admin/mentors"],
    queryFn: () => apiRequest("/api/admin/mentors", "GET"),
  });

  // Fetch assignments
  const { data: assignments } = useQuery({
    queryKey: ["/api/admin/assignments"],
    queryFn: () => apiRequest("/api/admin/assignments", "GET"),
  });

  // Toggle user status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ type, id, isActive }: { type: "student" | "mentor"; id: number; isActive: boolean }) => {
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

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async ({ type, id }: { type: "student" | "mentor"; id: number }) => {
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

  // Delete assignment mutation
  const deleteAssignmentMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/assignments/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/assignments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Assignment Deleted",
        description: "Assignment deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete assignment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin/login");
  };

  const handleToggleStatus = (type: "student" | "mentor", id: number, currentStatus: boolean) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this ${type}?`)) {
      toggleStatusMutation.mutate({ type, id, isActive: !currentStatus });
    }
  };

  const handleDelete = (type: "student" | "mentor", id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteUserMutation.mutate({ type, id });
    }
  };

  const handleDeleteAssignment = (id: number, mentorName: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to delete the assignment between ${mentorName} and ${studentName}?`)) {
      deleteAssignmentMutation.mutate(id);
    }
  };

  // Filter functions
  const filterUsers = (users: any[]) => {
    if (!users) return [];
    return users.filter(user => {
      const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.universityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || 
                           (filterStatus === "active" && user.isActive) ||
                           (filterStatus === "inactive" && !user.isActive);
      
      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className="min-h-screen bg-light-custom">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-charcoal-custom">AspireLink Admin</h1>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-8 h-8 text-primary-custom" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold text-charcoal-custom">{stats?.totalStudents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-secondary-custom" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Mentors</p>
                  <p className="text-2xl font-bold text-charcoal-custom">{stats?.totalMentors || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Students</p>
                  <p className="text-2xl font-bold text-charcoal-custom">{stats?.activeStudents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Mentors</p>
                  <p className="text-2xl font-bold text-charcoal-custom">{stats?.activeMentors || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <LinkIcon className="w-8 h-8 text-accent-custom" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Assignments</p>
                  <p className="text-2xl font-bold text-charcoal-custom">{stats?.totalAssignments || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, university, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "inactive" ? "default" : "outline"}
                  onClick={() => setFilterStatus("inactive")}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Students ({filterUsers(students || []).length})</TabsTrigger>
            <TabsTrigger value="mentors">Mentors ({filterUsers(mentors || []).length})</TabsTrigger>
            <TabsTrigger value="assignments">Assignments ({assignments?.length || 0})</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Student Management</span>
                  <Button 
                    className="bg-primary-custom hover:bg-primary-dark"
                    onClick={() => setLocation("/admin/create-student")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterUsers(students || []).map((student: Student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-semibold text-charcoal-custom">{student.fullName}</h3>
                            <p className="text-sm text-gray-500">{student.emailAddress}</p>
                            <p className="text-sm text-gray-500">{student.universityName} • {student.academicProgram}</p>
                            <p className="text-xs text-gray-400">{student.yearOfStudy}</p>
                          </div>
                          <Badge variant={student.isActive ? "default" : "secondary"}>
                            {student.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus("student", student.id, student.isActive)}
                        >
                          {student.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setLocation(`/admin/edit-student/${student.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete("student", student.id, student.fullName)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filterUsers(students || []).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No students found matching your criteria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentors Tab */}
          <TabsContent value="mentors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mentor Management</span>
                  <Button 
                    className="bg-secondary-custom hover:bg-secondary-dark"
                    onClick={() => setLocation("/admin/create-mentor")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Mentor
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterUsers(mentors || []).map((mentor: Mentor) => (
                    <div key={mentor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-semibold text-charcoal-custom">{mentor.fullName}</h3>
                            <p className="text-sm text-gray-500">{mentor.currentJobTitle} at {mentor.company}</p>
                            <p className="text-sm text-gray-500">{mentor.location}</p>
                            {mentor.linkedinUrl && (
                              <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                LinkedIn Profile
                              </a>
                            )}
                          </div>
                          <Badge variant={mentor.isActive ? "default" : "secondary"}>
                            {mentor.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus("mentor", mentor.id, mentor.isActive)}
                        >
                          {mentor.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setLocation(`/admin/edit-mentor/${mentor.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete("mentor", mentor.id, mentor.fullName)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filterUsers(mentors || []).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No mentors found matching your criteria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mentor-Student Assignments</span>
                  <Button 
                    className="bg-accent-custom hover:bg-accent-dark"
                    onClick={() => setLocation("/admin/create-assignment")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments?.map((assignment: Assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-charcoal-custom">
                              {assignment.mentorName} ↔ {assignment.studentName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Assigned on {new Date(assignment.assignedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={assignment.isActive ? "default" : "secondary"}>
                            {assignment.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteAssignment(assignment.id, assignment.mentorName, assignment.studentName)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!assignments || assignments.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      No assignments found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}