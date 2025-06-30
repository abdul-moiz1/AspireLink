import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft, Link as LinkIcon, Users, GraduationCap, Building } from "lucide-react";

interface Student {
  id: number;
  fullName: string;
  emailAddress: string;
  universityName: string;
  academicProgram: string;
  preferredDisciplines: string[];
  mentoringTopics: string[];
  isActive: boolean;
}

interface Mentor {
  id: number;
  fullName: string;
  currentJobTitle?: string;
  company?: string;
  preferredDisciplines: string[];
  mentoringTopics: string[];
  availability: string[];
  isActive: boolean;
}

export default function CreateAssignment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedMentorId, setSelectedMentorId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Fetch students and mentors
  const { data: students } = useQuery({
    queryKey: ["/api/admin/students"],
    queryFn: () => apiRequest("/api/admin/students", "GET"),
  });

  const { data: mentors } = useQuery({
    queryKey: ["/api/admin/mentors"],
    queryFn: () => apiRequest("/api/admin/mentors", "GET"),
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (data: { mentorId: number; studentId: number }) => {
      return apiRequest("/api/admin/assignments", "POST", data);
    },
    onSuccess: (data) => {
      console.log("Assignment created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/assignments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Assignment Created",
        description: "Student successfully assigned to mentor.",
      });
      setLocation("/admin/dashboard");
    },
    onError: (error) => {
      console.error("Assignment creation failed:", error);
      toast({
        title: "Assignment Failed",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted with:", { selectedMentorId, selectedStudentId });
    
    if (!selectedMentorId || !selectedStudentId) {
      toast({
        title: "Missing Selection",
        description: "Please select both a mentor and a student.",
        variant: "destructive",
      });
      return;
    }

    const mentorId = parseInt(selectedMentorId);
    const studentId = parseInt(selectedStudentId);

    console.log("Parsed IDs:", { mentorId, studentId });

    // Check if mentor and student are active
    const selectedMentor = mentors?.find((m: Mentor) => m.id === mentorId);
    const selectedStudent = students?.find((s: Student) => s.id === studentId);

    console.log("Found users:", { selectedMentor, selectedStudent });

    if (!selectedMentor?.isActive) {
      toast({
        title: "Inactive Mentor",
        description: "Cannot assign students to an inactive mentor.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedStudent?.isActive) {
      toast({
        title: "Inactive Student",
        description: "Cannot assign an inactive student to a mentor.",
        variant: "destructive",
      });
      return;
    }

    console.log("Creating assignment...");
    createAssignmentMutation.mutate({ mentorId, studentId });
  };

  // Get match score for mentor-student pairing
  const getMatchScore = (mentor: Mentor, student: Student) => {
    if (!mentor || !student) return 0;
    
    const disciplineMatches = mentor.preferredDisciplines?.filter(d => 
      student.preferredDisciplines?.includes(d)
    ).length || 0;
    
    const topicMatches = mentor.mentoringTopics?.filter(t => 
      student.mentoringTopics?.includes(t)
    ).length || 0;
    
    return disciplineMatches + topicMatches;
  };

  const selectedMentor = mentors?.find((m: Mentor) => m.id === parseInt(selectedMentorId));
  const selectedStudent = students?.find((s: Student) => s.id === parseInt(selectedStudentId));
  const matchScore = selectedMentor && selectedStudent ? getMatchScore(selectedMentor, selectedStudent) : 0;

  // Filter active users
  const activeStudents = students?.filter((s: Student) => s.isActive) || [];
  const activeMentors = mentors?.filter((m: Mentor) => m.isActive) || [];

  return (
    <div className="min-h-screen bg-light-custom py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/admin/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-3 mb-6">
            <LinkIcon className="w-8 h-8 text-accent-custom" />
            <h1 className="text-3xl font-bold text-charcoal-custom">Create Assignment</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-accent-custom" />
                <span>Mentor-Student Assignment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mentor Selection */}
                <div>
                  <Label className="flex items-center space-x-2 mb-3">
                    <Building className="w-4 h-4 text-secondary-custom" />
                    <span>Select Mentor</span>
                  </Label>
                  <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeMentors.map((mentor: Mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{mentor.fullName}</span>
                            <span className="text-sm text-gray-500">
                              {mentor.currentJobTitle} at {mentor.company}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {activeMentors.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">No active mentors available</p>
                  )}
                </div>

                {/* Student Selection */}
                <div>
                  <Label className="flex items-center space-x-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-primary-custom" />
                    <span>Select Student</span>
                  </Label>
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeStudents.map((student: Student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{student.fullName}</span>
                            <span className="text-sm text-gray-500">
                              {student.academicProgram} at {student.universityName}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {activeStudents.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">No active students available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Match Analysis */}
          {selectedMentor && selectedStudent && (
            <Card>
              <CardHeader>
                <CardTitle>Assignment Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mentor Details */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-secondary-custom mb-3 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Mentor: {selectedMentor.fullName}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Position:</strong> {selectedMentor.currentJobTitle} at {selectedMentor.company}</p>
                      <div>
                        <strong>Disciplines:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMentor.preferredDisciplines?.map((discipline: string) => (
                            <Badge key={discipline} variant="secondary" className="text-xs">
                              {discipline}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong>Topics:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMentor.mentoringTopics?.map((topic: string) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-primary-custom mb-3 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Student: {selectedStudent.fullName}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Program:</strong> {selectedStudent.academicProgram} at {selectedStudent.universityName}</p>
                      <div>
                        <strong>Disciplines:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedStudent.preferredDisciplines?.map((discipline: string) => (
                            <Badge 
                              key={discipline} 
                              variant={selectedMentor.preferredDisciplines?.includes(discipline) ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {discipline}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong>Topics:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedStudent.mentoringTopics?.map((topic: string) => (
                            <Badge 
                              key={topic} 
                              variant={selectedMentor.mentoringTopics?.includes(topic) ? "default" : "outline"}
                              className="text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-charcoal-custom">Match Score</h4>
                      <p className="text-sm text-gray-600">
                        Based on shared disciplines and mentoring topics
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-custom">{matchScore}</div>
                      <div className="text-sm text-gray-500">
                        {matchScore === 0 ? "No matches" : 
                         matchScore <= 2 ? "Low match" :
                         matchScore <= 4 ? "Good match" : "Excellent match"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation("/admin/dashboard")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-accent-custom hover:bg-accent-dark"
              disabled={createAssignmentMutation.isPending || !selectedMentorId || !selectedStudentId}
            >
              {createAssignmentMutation.isPending ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}