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
  Calendar,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
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

interface Assignment {
  id: number;
  mentorUserId: string;
  studentUserId: string;
  mentorName: string;
  studentName: string;
  isActive: boolean;
  assignedAt: string;
}

const CHART_COLORS = ['#2E86AB', '#A23B72', '#4ECDC4', '#FF6B6B', '#45B7D1', '#96CEB4'];

function AnimatedStatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendValue,
  delay = 0 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string; 
  trend?: 'up' | 'down';
  trendValue?: string;
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
    <Card className="card-hover hover-lift overflow-visible">
      <CardContent className="p-6 relative overflow-visible">
        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10`} style={{ backgroundColor: color }} />
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-xl flex-shrink-0`} style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {trend && trendValue && (
                <div className={`flex items-center gap-0.5 text-xs whitespace-nowrap ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                  {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <p className="text-3xl font-bold text-foreground animate-countUp">{displayValue}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewChart({ students, mentors }: { students: Student[]; mentors: Mentor[] }) {
  const monthlyData = [
    { month: 'Jan', students: 12, mentors: 5 },
    { month: 'Feb', students: 18, mentors: 7 },
    { month: 'Mar', students: 25, mentors: 10 },
    { month: 'Apr', students: 32, mentors: 12 },
    { month: 'May', students: 45, mentors: 15 },
    { month: 'Jun', students: students?.length || 52, mentors: mentors?.length || 18 },
  ];

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Growth Overview</CardTitle>
          <CardDescription>Monthly registration trends</CardDescription>
        </div>
        <BarChart3 className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
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
  );
}

function StatusDistributionChart({ stats }: { stats: DashboardStats | undefined }) {
  const data = [
    { name: 'Active Students', value: stats?.activeStudents || 0, color: '#4ECDC4' },
    { name: 'Inactive Students', value: (stats?.totalStudents || 0) - (stats?.activeStudents || 0), color: '#FF6B6B' },
    { name: 'Active Mentors', value: stats?.activeMentors || 0, color: '#45B7D1' },
    { name: 'Inactive Mentors', value: (stats?.totalMentors || 0) - (stats?.activeMentors || 0), color: '#96CEB4' },
  ].filter(item => item.value > 0);

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Status Distribution</CardTitle>
          <CardDescription>Active vs Inactive users</CardDescription>
        </div>
        <PieChartIcon className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentActivityChart({ assignments }: { assignments: Assignment[] }) {
  const weeklyData = (() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts: Record<string, number> = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };
    
    if (assignments && assignments.length > 0) {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      assignments.forEach(assignment => {
        if (assignment.assignedAt) {
          const assignedDate = new Date(assignment.assignedAt);
          if (assignedDate >= oneWeekAgo && assignedDate <= now) {
            const dayName = dayNames[assignedDate.getDay()];
            counts[dayName]++;
          }
        }
      });
    }
    
    return [
      { day: 'Mon', assignments: counts.Mon },
      { day: 'Tue', assignments: counts.Tue },
      { day: 'Wed', assignments: counts.Wed },
      { day: 'Thu', assignments: counts.Thu },
      { day: 'Fri', assignments: counts.Fri },
      { day: 'Sat', assignments: counts.Sat },
      { day: 'Sun', assignments: counts.Sun },
    ];
  })();

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
          <CardDescription>Assignment activity this week</CardDescription>
        </div>
        <Activity className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="day" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="assignments" fill="#2E86AB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivityFeed({ students, mentors }: { students: Student[]; mentors: Mentor[] }) {
  const activities = [
    ...(students?.slice(0, 3).map(s => ({
      type: 'student' as const,
      name: s.fullName,
      action: 'joined as a student',
      time: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recently'
    })) || []),
    ...(mentors?.slice(0, 2).map(m => ({
      type: 'mentor' as const,
      name: m.fullName,
      action: 'joined as a mentor',
      time: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Recently'
    })) || [])
  ].slice(0, 5);

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <CardDescription>Latest platform updates</CardDescription>
        </div>
        <TrendingUp className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
          ) : (
            activities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-2 rounded-full ${activity.type === 'student' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                  {activity.type === 'student' ? 
                    <GraduationCap className="w-4 h-4 text-blue-600" /> : 
                    <Users className="w-4 h-4 text-pink-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.name}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
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

  const { data: assignments } = useQuery({
    queryKey: ["/api/admin/assignments"],
    queryFn: () => apiRequest("/api/admin/assignments", "GET"),
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

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-background border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">AspireLink Admin</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/cohorts">
                <Button variant="outline" className="flex items-center gap-2 hover-lift" data-testid="link-manage-cohorts">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Manage Cohorts</span>
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 hover-lift" data-testid="button-logout">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <AnimatedStatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={GraduationCap}
            color="#2E86AB"
            trend="up"
            trendValue="+12%"
            delay={0}
          />
          <AnimatedStatCard
            title="Total Mentors"
            value={stats?.totalMentors || 0}
            icon={Users}
            color="#A23B72"
            trend="up"
            trendValue="+8%"
            delay={100}
          />
          <AnimatedStatCard
            title="Active Students"
            value={stats?.activeStudents || 0}
            icon={UserCheck}
            color="#4ECDC4"
            delay={200}
          />
          <AnimatedStatCard
            title="Active Mentors"
            value={stats?.activeMentors || 0}
            icon={UserCheck}
            color="#45B7D1"
            delay={300}
          />
          <AnimatedStatCard
            title="Assignments"
            value={stats?.totalAssignments || 0}
            icon={LinkIcon}
            color="#F18F01"
            trend="up"
            trendValue="+5"
            delay={400}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <OverviewChart students={students || []} mentors={mentors || []} />
          </div>
          <StatusDistributionChart stats={stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AssignmentActivityChart assignments={assignments || []} />
          <RecentActivityFeed students={students || []} mentors={mentors || []} />
        </div>

        <Tabs defaultValue="students" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <TabsList className="grid grid-cols-2 w-auto">
              <TabsTrigger value="students" data-testid="tab-students">Students ({filterUsers(students || []).length})</TabsTrigger>
              <TabsTrigger value="mentors" data-testid="tab-mentors">Mentors ({filterUsers(mentors || []).length})</TabsTrigger>
            </TabsList>
            <div className="flex gap-2 items-center flex-wrap w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-64">
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
                <SelectTrigger className="w-28" data-testid="select-filter-status">
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
              <h3 className="text-lg font-semibold text-foreground">Student Management</h3>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setLocation("/admin/create-student")}
                data-testid="button-add-student"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
            <div className="border rounded-lg">
                <div className="space-y-3">
                  {filterUsers(students || []).map((student: Student, index: number) => (
                    <div 
                      key={student.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover-lift bg-background"
                      style={{ animationDelay: `${index * 50}ms` }}
                      data-testid={`card-student-${student.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground truncate" data-testid={`text-student-name-${student.id}`}>{student.fullName || 'No Name'}</h3>
                            <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                            <p className="text-sm text-muted-foreground truncate">{student.universityName || 'N/A'} - {student.academicProgram || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">{student.yearOfStudy || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-wrap">
                        <Badge variant={student.isActive ? "default" : "secondary"} data-testid={`badge-student-status-${student.id}`}>
                          {student.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleToggleStatus("student", student.id, student.isActive)}
                          className="hover-lift"
                          data-testid={`button-toggle-student-${student.id}`}
                        >
                          {student.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => setLocation(`/admin/edit-student/${student.id}`)}
                          className="hover-lift"
                          data-testid={`button-edit-student-${student.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-destructive hover:text-destructive hover-lift"
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
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No students found matching your criteria.</p>
                    </div>
                  )}
                </div>
            </div>
          </TabsContent>

          <TabsContent value="mentors" className="mt-4">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Mentor Management</h3>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setLocation("/admin/create-mentor")}
                data-testid="button-add-mentor"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Mentor
              </Button>
            </div>
            <div className="border rounded-lg">
              <div className="space-y-3">
                  {filterUsers(mentors || []).map((mentor: Mentor, index: number) => (
                    <div 
                      key={mentor.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover-lift bg-background"
                      style={{ animationDelay: `${index * 50}ms` }}
                      data-testid={`card-mentor-${mentor.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="p-2 bg-pink-100 rounded-full">
                            <Users className="w-5 h-5 text-pink-600" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground truncate" data-testid={`text-mentor-name-${mentor.id}`}>{mentor.fullName || 'No Name'}</h3>
                            <p className="text-sm text-muted-foreground truncate">{mentor.currentJobTitle || 'N/A'} at {mentor.company || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground truncate">{mentor.location || 'N/A'}</p>
                            {mentor.linkedinUrl && (
                              <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                LinkedIn Profile
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-wrap">
                        <Badge variant={mentor.isActive ? "default" : "secondary"} data-testid={`badge-mentor-status-${mentor.id}`}>
                          {mentor.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleToggleStatus("mentor", mentor.id, mentor.isActive)}
                          className="hover-lift"
                          data-testid={`button-toggle-mentor-${mentor.id}`}
                        >
                          {mentor.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => setLocation(`/admin/edit-mentor/${mentor.id}`)}
                          className="hover-lift"
                          data-testid={`button-edit-mentor-${mentor.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-destructive hover:text-destructive hover-lift"
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
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No mentors found matching your criteria.</p>
                    </div>
                  )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
