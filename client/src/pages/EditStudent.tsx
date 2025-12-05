import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, User, GraduationCap } from "lucide-react";

const disciplines = [
  "Computer Science", "Engineering", "Business", "Marketing", "Design", 
  "Data Science", "Product Management", "Finance", "Healthcare", "Education",
  "Non-Profit", "Consulting", "Sales", "Operations", "Research"
];

const mentoringTopics = [
  "Career Planning", "Technical Skills", "Leadership", "Networking", 
  "Interview Preparation", "Resume Building", "Industry Insights", 
  "Work-Life Balance", "Entrepreneurship", "Professional Development",
  "Communication Skills", "Project Management", "Team Building"
];

const yearOfStudyOptions = [
  "1st year undergraduate", "2nd year undergraduate", "3rd year undergraduate", 
  "4th year undergraduate", "5th year undergraduate", "1st year master's", 
  "2nd year master's", "1st year PhD", "2nd year PhD", "3rd+ year PhD"
];

export default function EditStudent() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const studentId = params.id as string;

  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    universityName: "",
    academicProgram: "",
    yearOfStudy: "",
    nominatedBy: "",
    professorEmail: "",
    careerInterests: "",
    preferredDisciplines: [] as string[],
    mentoringTopics: [] as string[],
    mentorshipGoals: "",
    agreedToCommitment: false,
    consentToContact: false,
    isActive: true
  });

  // Fetch student data
  const { data: student, isLoading } = useQuery({
    queryKey: ["/api/admin/students", studentId],
    queryFn: () => apiRequest(`/api/admin/students/${studentId}`, "GET"),
    enabled: !!studentId
  });

  // Populate form when student data is loaded
  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || "",
        emailAddress: student.emailAddress || "",
        phoneNumber: student.phoneNumber || "",
        universityName: student.universityName || "",
        academicProgram: student.academicProgram || "",
        yearOfStudy: student.yearOfStudy || "",
        nominatedBy: student.nominatedBy || "",
        professorEmail: student.professorEmail || "",
        careerInterests: student.careerInterests || "",
        preferredDisciplines: student.preferredDisciplines || [],
        mentoringTopics: student.mentoringTopics || [],
        mentorshipGoals: student.mentorshipGoals || "",
        agreedToCommitment: student.agreedToCommitment || false,
        consentToContact: student.consentToContact || false,
        isActive: student.isActive
      });
    }
  }, [student]);

  const updateStudentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/admin/students/${studentId}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/students"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Student Updated",
        description: "Student profile updated successfully.",
      });
      setLocation("/admin/dashboard");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update student profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const toggleSelection = (item: string, list: string[], setter: (list: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.emailAddress.trim()) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    updateStudentMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-custom flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-custom mx-auto mb-4"></div>
          <p>Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-light-custom flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Student not found</p>
          <Button onClick={() => setLocation("/admin/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
            <GraduationCap className="w-8 h-8 text-primary-custom" />
            <h1 className="text-3xl font-bold text-charcoal-custom">Edit Student</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary-custom" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => setFormData({...formData, emailAddress: e.target.value})}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="universityName">University Name</Label>
                  <Input
                    id="universityName"
                    value={formData.universityName}
                    onChange={(e) => setFormData({...formData, universityName: e.target.value})}
                    placeholder="Name of University"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="academicProgram">Academic Program</Label>
                  <Input
                    id="academicProgram"
                    value={formData.academicProgram}
                    onChange={(e) => setFormData({...formData, academicProgram: e.target.value})}
                    placeholder="e.g., Computer Science, Business Administration"
                  />
                </div>
                <div>
                  <Label htmlFor="yearOfStudy">Year of Study</Label>
                  <Select value={formData.yearOfStudy} onValueChange={(value) => setFormData({...formData, yearOfStudy: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year of study" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOfStudyOptions.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nominatedBy">Nominated By</Label>
                  <Input
                    id="nominatedBy"
                    value={formData.nominatedBy}
                    onChange={(e) => setFormData({...formData, nominatedBy: e.target.value})}
                    placeholder="Professor or advisor name"
                  />
                </div>
                <div>
                  <Label htmlFor="professorEmail">Professor Email</Label>
                  <Input
                    id="professorEmail"
                    type="email"
                    value={formData.professorEmail}
                    onChange={(e) => setFormData({...formData, professorEmail: e.target.value})}
                    placeholder="Professor's email address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Academic Disciplines</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select academic disciplines of interest
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {disciplines.map((discipline) => (
                    <Button
                      key={discipline}
                      type="button"
                      variant={formData.preferredDisciplines.includes(discipline) ? "default" : "outline"}
                      onClick={() => toggleSelection(discipline, formData.preferredDisciplines, (list) => setFormData({...formData, preferredDisciplines: list}))}
                      className="justify-start h-auto py-2"
                    >
                      {discipline}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Mentoring Topics</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select topics for mentoring guidance
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mentoringTopics.map((topic) => (
                    <Button
                      key={topic}
                      type="button"
                      variant={formData.mentoringTopics.includes(topic) ? "default" : "outline"}
                      onClick={() => toggleSelection(topic, formData.mentoringTopics, (list) => setFormData({...formData, mentoringTopics: list}))}
                      className="justify-start h-auto py-2"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="careerInterests">Career Interests</Label>
                <Textarea
                  id="careerInterests"
                  value={formData.careerInterests}
                  onChange={(e) => setFormData({...formData, careerInterests: e.target.value})}
                  placeholder="Describe career interests and goals"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="mentorshipGoals">Mentorship Goals</Label>
                <Textarea
                  id="mentorshipGoals"
                  value={formData.mentorshipGoals}
                  onChange={(e) => setFormData({...formData, mentorshipGoals: e.target.value})}
                  placeholder="What do you hope to gain from this mentorship experience?"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Consent & Status */}
          <Card>
            <CardHeader>
              <CardTitle>Consent & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreedToCommitment"
                  checked={formData.agreedToCommitment}
                  onCheckedChange={(checked) => setFormData({...formData, agreedToCommitment: !!checked})}
                />
                <Label htmlFor="agreedToCommitment">
                  Agrees to 4-month mentorship commitment
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consentToContact"
                  checked={formData.consentToContact}
                  onCheckedChange={(checked) => setFormData({...formData, consentToContact: !!checked})}
                />
                <Label htmlFor="consentToContact">
                  Consents to be contacted by AspireLink
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: !!checked})}
                />
                <Label htmlFor="isActive">
                  Set as active student
                </Label>
              </div>
            </CardContent>
          </Card>

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
              className="bg-primary-custom hover:bg-primary-dark"
              disabled={updateStudentMutation.isPending}
            >
              {updateStudentMutation.isPending ? "Updating..." : "Update Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}