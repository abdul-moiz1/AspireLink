import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Building, User, Clock } from "lucide-react";

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

const availabilityOptions = [
  "Weekday mornings", "Weekday afternoons", "Weekday evenings",
  "Weekend mornings", "Weekend afternoons", "Weekend evenings",
  "Flexible scheduling"
];

export default function EditMentor() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mentorId = params.id as string;

  const [formData, setFormData] = useState({
    linkedinUrl: "",
    fullName: "",
    currentJobTitle: "",
    company: "",
    yearsExperience: 0,
    education: "",
    skills: [] as string[],
    location: "",
    timeZone: "",
    profileSummary: "",
    preferredDisciplines: [] as string[],
    mentoringTopics: [] as string[],
    availability: [] as string[],
    motivation: "",
    agreedToCommitment: false,
    consentToContact: false,
    isActive: true
  });

  // Fetch mentor data
  const { data: mentor, isLoading } = useQuery({
    queryKey: ["/api/admin/mentors", mentorId],
    queryFn: () => apiRequest(`/api/admin/mentors/${mentorId}`, "GET"),
    enabled: !!mentorId
  });

  // Populate form when mentor data is loaded
  useEffect(() => {
    if (mentor) {
      setFormData({
        linkedinUrl: mentor.linkedinUrl || "",
        fullName: mentor.fullName || "",
        currentJobTitle: mentor.currentJobTitle || "",
        company: mentor.company || "",
        yearsExperience: mentor.yearsExperience || 0,
        education: mentor.education || "",
        skills: mentor.skills || [],
        location: mentor.location || "",
        timeZone: mentor.timeZone || "",
        profileSummary: mentor.profileSummary || "",
        preferredDisciplines: mentor.preferredDisciplines || [],
        mentoringTopics: mentor.mentoringTopics || [],
        availability: mentor.availability || [],
        motivation: mentor.motivation || "",
        agreedToCommitment: mentor.agreedToCommitment || false,
        consentToContact: mentor.consentToContact || false,
        isActive: mentor.isActive
      });
    }
  }, [mentor]);

  const updateMentorMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/admin/mentors/${mentorId}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/mentors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Mentor Updated",
        description: "Mentor profile updated successfully.",
      });
      setLocation("/admin/dashboard");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update mentor profile. Please try again.",
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
    
    if (!formData.fullName.trim()) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    updateMentorMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-custom flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-custom mx-auto mb-4"></div>
          <p>Loading mentor data...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-light-custom flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Mentor not found</p>
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
            <Building className="w-8 h-8 text-secondary-custom" />
            <h1 className="text-3xl font-bold text-charcoal-custom">Edit Mentor</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-secondary-custom" />
                <span>Professional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn URL (Optional)</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

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
                  <Label htmlFor="currentJobTitle">Current Job Title</Label>
                  <Input
                    id="currentJobTitle"
                    value={formData.currentJobTitle}
                    onChange={(e) => setFormData({...formData, currentJobTitle: e.target.value})}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Current company name"
                  />
                </div>
                <div>
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="0"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({...formData, yearsExperience: parseInt(e.target.value) || 0})}
                    placeholder="Years of professional experience"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="City, Province"
                  />
                </div>
                <div>
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <Input
                    id="timeZone"
                    value={formData.timeZone}
                    onChange={(e) => setFormData({...formData, timeZone: e.target.value})}
                    placeholder="e.g., EST, PST, GMT"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                  placeholder="Educational background"
                />
              </div>

              <div>
                <Label htmlFor="profileSummary">Profile Summary</Label>
                <Textarea
                  id="profileSummary"
                  value={formData.profileSummary}
                  onChange={(e) => setFormData({...formData, profileSummary: e.target.value})}
                  placeholder="Brief professional summary"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Mentorship Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-secondary-custom" />
                <span>Mentorship Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Preferred Student Disciplines</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select fields where you can provide valuable mentorship
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
                  Select areas where you can help students
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
                <Label className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Availability</span>
                </Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select when you're available for mentoring sessions
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availabilityOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={formData.availability.includes(option) ? "default" : "outline"}
                      onClick={() => toggleSelection(option, formData.availability, (list) => setFormData({...formData, availability: list}))}
                      className="justify-start h-auto py-2"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="motivation">Why do you want to be a mentor?</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                  placeholder="Describe your motivation for mentoring students"
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
                  Set as active mentor
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
              className="bg-secondary-custom hover:bg-secondary-dark"
              disabled={updateMentorMutation.isPending}
            >
              {updateMentorMutation.isPending ? "Updating..." : "Update Mentor"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}