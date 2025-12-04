import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Target,
  CheckCircle,
  Loader2,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";

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

export default function RegisterStudent() {
  const { toast } = useToast();
  const [, setLocationPath] = useLocation();
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Check if user is completing their profile (came from /complete-profile)
  const isCompletingProfile = typeof window !== 'undefined' && window.location.search.includes('complete=true');

  const [studentData, setStudentData] = useState({
    fullName: "",
    emailAddress: "",
    linkedinUrl: "",
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
  });

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user && isCompletingProfile) {
      setStudentData(prev => ({
        ...prev,
        fullName: user.displayName || prev.fullName,
        emailAddress: user.email || prev.emailAddress,
      }));
    }
  }, [user, isCompletingProfile]);

  const registrationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/student-registration", "POST", data);
    },
    onSuccess: async () => {
      setIsSubmitted(true);
      toast({
        title: "Registration Successful",
        description: "Thank you for applying to AspireLink's mentorship program!",
      });
      
      // If user is completing their profile, refresh user data (no auto-redirect)
      if (isCompletingProfile && user) {
        await refreshUser();
      }
      // No auto-redirect - users will see the success page with navigation buttons
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your application. Please try again.",
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

  const handleSubmit = () => {
    // Validate all required Step 1 fields
    const requiredStep1Fields = [
      { field: studentData.fullName, name: "Full Name" },
      { field: studentData.emailAddress, name: "Email Address" },
      { field: studentData.linkedinUrl, name: "LinkedIn URL" },
      { field: studentData.phoneNumber, name: "Phone Number" },
      { field: studentData.universityName, name: "University Name" },
      { field: studentData.academicProgram, name: "Academic Program" },
      { field: studentData.yearOfStudy, name: "Year of Study" }
    ];

    const missingField = requiredStep1Fields.find(({ field }) => !field.trim());
    if (missingField) {
      toast({
        title: "Required Field Missing",
        description: `Please fill in ${missingField.name}.`,
        variant: "destructive",
      });
      return;
    }

    if (!studentData.agreedToCommitment) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the 4-month mentorship commitment.",
        variant: "destructive",
      });
      return;
    }

    if (!studentData.consentToContact) {
      toast({
        title: "Consent Required",
        description: "Please consent to being contacted by AspireLink.",
        variant: "destructive",
      });
      return;
    }

    const registrationData = {
      fullName: studentData.fullName,
      emailAddress: studentData.emailAddress,
      linkedinUrl: studentData.linkedinUrl,
      phoneNumber: studentData.phoneNumber,
      universityName: studentData.universityName,
      academicProgram: studentData.academicProgram,
      yearOfStudy: studentData.yearOfStudy,
      nominatedBy: studentData.nominatedBy || null,
      professorEmail: studentData.professorEmail || null,
      careerInterests: studentData.careerInterests.trim() || null,
      preferredDisciplines: studentData.preferredDisciplines.length > 0 ? studentData.preferredDisciplines : null,
      mentoringTopics: studentData.mentoringTopics.length > 0 ? studentData.mentoringTopics : null,
      mentorshipGoals: studentData.mentorshipGoals.trim() || null,
      agreedToCommitment: studentData.agreedToCommitment,
      consentToContact: studentData.consentToContact,
    };

    registrationMutation.mutate(registrationData);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-light-custom py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="p-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-charcoal-custom mb-4">
                Registration Successful!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for applying to AspireLink's mentorship program. We've received your application 
                and will review it carefully.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-charcoal-custom mb-2">What happens next?</h3>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Application review by our team</li>
                  <li>• Professor verification (if nominated)</li>
                  <li>• Student matching with suitable mentors</li>
                  <li>• Program onboarding and kickoff</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setLocationPath('/signup?role=student&registered=true&email=' + encodeURIComponent(studentData.emailAddress || ''))}
                  className="bg-primary-custom hover:bg-primary-dark text-white"
                  data-testid="button-signup-student"
                >
                  Sign Up Now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocationPath('/signin')}
                  className="border-gray-300"
                  data-testid="button-login-student"
                >
                  Already have an account? Log In
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocationPath('/faq')}
                  className="border-gray-300"
                  data-testid="button-faq"
                >
                  View FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-custom py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal-custom mb-4">
            Apply as a Student
          </h1>
          <p className="text-xl text-gray-600">
            Join AspireLink's mentorship program and accelerate your career development
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-primary-custom text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-custom' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-primary-custom text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-custom' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3 ? 'bg-primary-custom text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary-custom" />
                <span>Step 1: Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={studentData.fullName}
                    onChange={(e) => setStudentData(prev => ({...prev, fullName: e.target.value}))}
                    placeholder="Your full name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={studentData.emailAddress}
                    onChange={(e) => setStudentData(prev => ({...prev, emailAddress: e.target.value}))}
                    placeholder="your.email@university.edu"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={studentData.phoneNumber}
                    onChange={(e) => setStudentData(prev => ({...prev, phoneNumber: e.target.value}))}
                    placeholder="(555) 123-4567"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn Profile URL *</Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={studentData.linkedinUrl}
                    onChange={(e) => setStudentData(prev => ({...prev, linkedinUrl: e.target.value}))}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">Required for professional verification</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="universityName">University Name *</Label>
                  <Input
                    id="universityName"
                    value={studentData.universityName}
                    onChange={(e) => setStudentData(prev => ({...prev, universityName: e.target.value}))}
                    placeholder="Name of University"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="academicProgram">Academic Program *</Label>
                  <Input
                    id="academicProgram"
                    value={studentData.academicProgram}
                    onChange={(e) => setStudentData(prev => ({...prev, academicProgram: e.target.value}))}
                    placeholder="Computer Science, Business, etc."
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="yearOfStudy">Year of Study *</Label>
                <Select value={studentData.yearOfStudy} onValueChange={(value) => setStudentData(prev => ({...prev, yearOfStudy: value}))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your current year of study" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOfStudyOptions.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => {
                    // Check all required Step 1 fields
                    if (!studentData.fullName.trim()) {
                      toast({
                        title: "Required Field Missing",
                        description: "Please enter your full name to continue.",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (!studentData.emailAddress.trim()) {
                      toast({
                        title: "Required Field Missing",
                        description: "Please enter your email address to continue.",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (!studentData.linkedinUrl.trim()) {
                      toast({
                        title: "Required Field Missing",
                        description: "Please enter your LinkedIn profile URL to continue.",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (!studentData.phoneNumber.trim()) {
                      toast({
                        title: "Required Field Missing",
                        description: "Please enter your phone number to continue.",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (!studentData.universityName.trim()) {
                      toast({
                        title: "Required Field Missing",
                        description: "Please enter your university name to continue.",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (!studentData.academicProgram.trim()) {
                      toast({
                        title: "Required Field Missing",
                        description: "Please enter your academic program to continue.",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (!studentData.yearOfStudy.trim()) {
                      toast({
                        title: "Required Field Missing",
                        description: "Please select your year of study to continue.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setStep(2);
                  }}
                  className="bg-primary-custom hover:bg-primary-dark text-white"
                >
                  Continue to Nomination
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-primary-custom" />
                <span>Step 2: Nomination & Academic Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nominatedBy">Nominated By (Professor/Advisor)</Label>
                  <Input
                    id="nominatedBy"
                    value={studentData.nominatedBy}
                    onChange={(e) => setStudentData(prev => ({...prev, nominatedBy: e.target.value}))}
                    placeholder="Dr. Jane Smith"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="professorEmail">Professor Email</Label>
                  <Input
                    id="professorEmail"
                    type="email"
                    value={studentData.professorEmail}
                    onChange={(e) => setStudentData(prev => ({...prev, professorEmail: e.target.value}))}
                    placeholder="professor@university.edu"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="careerInterests">Career Interests</Label>
                <Textarea
                  id="careerInterests"
                  value={studentData.careerInterests}
                  onChange={(e) => setStudentData(prev => ({...prev, careerInterests: e.target.value}))}
                  placeholder="Describe your career interests and goals..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-gray-300"
                >
                  Back to Personal Info
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-primary-custom hover:bg-primary-dark text-white flex-1"
                >
                  Continue to Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary-custom" />
                <span>Step 3: Mentorship Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Academic Disciplines */}
              <div>
                <Label className="text-base font-medium">Academic Disciplines</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select fields where you'd like mentorship guidance
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {disciplines.map((discipline) => (
                    <div
                      key={discipline}
                      onClick={() => toggleSelection(discipline, studentData.preferredDisciplines, (list) => setStudentData(prev => ({...prev, preferredDisciplines: list})))}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        studentData.preferredDisciplines.includes(discipline)
                          ? 'border-primary-custom bg-blue-50 text-primary-custom'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{discipline}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentoring Topics */}
              <div>
                <Label className="text-base font-medium">Mentoring Topics</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select areas where you'd like guidance and support
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mentoringTopics.map((topic) => (
                    <div
                      key={topic}
                      onClick={() => toggleSelection(topic, studentData.mentoringTopics, (list) => setStudentData(prev => ({...prev, mentoringTopics: list})))}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        studentData.mentoringTopics.includes(topic)
                          ? 'border-secondary-custom bg-pink-50 text-secondary-custom'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentorship Goals */}
              <div>
                <Label htmlFor="mentorshipGoals" className="text-base font-medium">
                  What do you hope to gain from this mentorship experience?
                </Label>
                <Textarea
                  id="mentorshipGoals"
                  value={studentData.mentorshipGoals}
                  onChange={(e) => setStudentData(prev => ({...prev, mentorshipGoals: e.target.value}))}
                  placeholder="Share your expectations and goals for the mentorship program..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="commitment"
                    checked={studentData.agreedToCommitment}
                    onCheckedChange={(checked) => setStudentData(prev => ({...prev, agreedToCommitment: checked === true}))}
                  />
                  <Label htmlFor="commitment" className="text-sm leading-relaxed">
                    I agree to participate actively in the 4-month mentorship program and commit to 
                    regular meetings with my assigned mentor.
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={studentData.consentToContact}
                    onCheckedChange={(checked) => setStudentData(prev => ({...prev, consentToContact: checked === true}))}
                  />
                  <Label htmlFor="consent" className="text-sm leading-relaxed">
                    I consent to being contacted by AspireLink for program coordination, 
                    updates, and feedback purposes.
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex space-x-4 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="border-gray-300"
                >
                  Back to Nomination
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={registrationMutation.isPending}
                  className="bg-primary-custom hover:bg-primary-dark text-white flex-1"
                >
                  {registrationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}