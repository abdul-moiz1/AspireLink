import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, Users, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface StudentData {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  linkedinUrl: string;
  universityName: string;
  academicProgram: string;
  yearOfStudy: string;
  nominatedBy: string;
  professorEmail: string;
  careerInterests: string;
  preferredDisciplines: string[];
  mentoringTopics: string[];
  mentorshipGoals: string;
  agreedToCommitment: boolean;
  consentToContact: boolean;
}

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
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentData, setStudentData] = useState<StudentData>({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    linkedinUrl: "",
    universityName: "",
    academicProgram: "",
    yearOfStudy: "",
    nominatedBy: "",
    professorEmail: "",
    careerInterests: "",
    preferredDisciplines: [],
    mentoringTopics: [],
    mentorshipGoals: "",
    agreedToCommitment: false,
    consentToContact: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Auto-populate form with authenticated user data
  useEffect(() => {
    if (user) {
      setStudentData(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        emailAddress: user.email || ''
      }));
    }
  }, [user]);

  const registrationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/student-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit registration");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/student-registrations"] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleDiscipline = (discipline: string) => {
    setStudentData(prev => ({
      ...prev,
      preferredDisciplines: prev.preferredDisciplines.includes(discipline)
        ? prev.preferredDisciplines.filter(d => d !== discipline)
        : [...prev.preferredDisciplines, discipline]
    }));
  };

  const removeDiscipline = (discipline: string) => {
    setStudentData(prev => ({
      ...prev,
      preferredDisciplines: prev.preferredDisciplines.filter(d => d !== discipline)
    }));
  };

  const toggleMentoringTopic = (topic: string) => {
    setStudentData(prev => ({
      ...prev,
      mentoringTopics: prev.mentoringTopics.includes(topic)
        ? prev.mentoringTopics.filter(t => t !== topic)
        : [...prev.mentoringTopics, topic]
    }));
  };

  const removeMentoringTopic = (topic: string) => {
    setStudentData(prev => ({
      ...prev,
      mentoringTopics: prev.mentoringTopics.filter(t => t !== topic)
    }));
  };

  const handleNext = () => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (step === 1) {
      if (!studentData.fullName.trim()) {
        toast({
          title: "Name Required",
          description: "Please enter your full name to continue.",
          variant: "destructive",
        });
        return;
      }
      if (!studentData.emailAddress.trim()) {
        toast({
          title: "Email Required",
          description: "Please enter your email address to continue.",
          variant: "destructive",
        });
        return;
      }
      // Email format validation
      if (!emailRegex.test(studentData.emailAddress.trim())) {
        toast({
          title: "Invalid Email Format",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }
      if (!studentData.phoneNumber.trim()) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number to continue.",
          variant: "destructive",
        });
        return;
      }
      if (!studentData.universityName.trim()) {
        toast({
          title: "University Required",
          description: "Please enter your university name to continue.",
          variant: "destructive",
        });
        return;
      }
      if (!studentData.academicProgram.trim()) {
        toast({
          title: "Academic Program Required",
          description: "Please enter your academic program to continue.",
          variant: "destructive",
        });
        return;
      }
      if (!studentData.yearOfStudy.trim()) {
        toast({
          title: "Year of Study Required",
          description: "Please select your year of study to continue.",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 2) {
      if (!studentData.nominatedBy.trim()) {
        toast({
          title: "Nominator Required",
          description: "Please enter the professor's name who nominated you.",
          variant: "destructive",
        });
        return;
      }
      if (!studentData.professorEmail.trim()) {
        toast({
          title: "Professor Email Required",
          description: "Please enter your nominating professor's email address.",
          variant: "destructive",
        });
        return;
      }
      // Professor email format validation
      if (!emailRegex.test(studentData.professorEmail.trim())) {
        toast({
          title: "Invalid Professor Email Format",
          description: "Please enter a valid email address for the professor.",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 3) {
      if (!studentData.careerInterests.trim()) {
        toast({
          title: "Career Interests Required",
          description: "Please describe your career interests and goals.",
          variant: "destructive",
        });
        return;
      }
      if (studentData.preferredDisciplines.length === 0) {
        toast({
          title: "Academic Disciplines Required",
          description: "Please select at least one academic discipline.",
          variant: "destructive",
        });
        return;
      }
      if (studentData.mentoringTopics.length === 0) {
        toast({
          title: "Mentoring Topics Required",
          description: "Please select at least one mentoring topic.",
          variant: "destructive",
        });
        return;
      }
      if (!studentData.mentorshipGoals.trim()) {
        toast({
          title: "Mentorship Goals Required",
          description: "Please describe your mentorship goals.",
          variant: "destructive",
        });
        return;
      }
    }

    setStep(step + 1);
  };

  const handleSubmit = () => {
    if (!studentData.agreedToCommitment || !studentData.consentToContact) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the program commitment and contact consent.",
        variant: "destructive",
      });
      return;
    }

    const registrationData = {
      fullName: studentData.fullName,
      emailAddress: studentData.emailAddress,
      phoneNumber: studentData.phoneNumber.trim() || null,
      universityName: studentData.universityName,
      academicProgram: studentData.academicProgram,
      yearOfStudy: studentData.yearOfStudy,
      nominatedBy: studentData.nominatedBy,
      professorEmail: studentData.professorEmail,
      careerInterests: studentData.careerInterests.trim() || null,
      preferredDisciplines: studentData.preferredDisciplines.length > 0 ? studentData.preferredDisciplines : null,
      mentoringTopics: studentData.mentoringTopics.length > 0 ? studentData.mentoringTopics : null,
      mentorshipGoals: studentData.mentorshipGoals.trim() || null,
      agreedToCommitment: studentData.agreedToCommitment,
      consentToContact: studentData.consentToContact,
    };

    registrationMutation.mutate(registrationData);
  };

  // Show confirmation screen after successful submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-light-custom py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-12">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-charcoal-custom">
                    Registration Successful!
                  </h1>
                  <p className="text-lg text-gray-600 text-center">
                    Thank you for applying to AspireLink's mentorship program. We've received your registration and will review your application carefully.
                  </p>
                  <div className="bg-blue-50 p-6 rounded-lg w-full">
                    <h3 className="font-semibold text-charcoal-custom mb-2">What happens next?</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• We'll contact your nominating professor to verify your nomination</li>
                      <li>• Our matching team will review your preferences and goals</li>
                      <li>• You'll receive an email within 2 weeks with your mentor match</li>
                      <li>• Your 4-month mentorship program will begin once both parties confirm</li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                      <Button className="bg-primary-custom hover:bg-primary-dark text-white px-8 py-3">
                        Return to Home
                      </Button>
                    </Link>
                    <Link href="/faq">
                      <Button variant="outline" className="px-8 py-3">
                        View FAQ
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-custom py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal-custom mb-4">
            Student Registration
          </h1>
          <p className="text-xl text-gray-600">
            Apply to join AspireLink's mentorship program and get matched with an industry professional
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
            <div className={`w-16 h-1 ${step >= 4 ? 'bg-primary-custom' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 4 ? 'bg-primary-custom text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              4
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="text-primary-custom" />
                <span>Step 1: Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="text-base font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={studentData.fullName}
                    onChange={(e) => setStudentData({...studentData, fullName: e.target.value})}
                    placeholder="Enter your full name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="emailAddress" className="text-base font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={studentData.emailAddress}
                    onChange={(e) => setStudentData({...studentData, emailAddress: e.target.value})}
                    placeholder="your.email@university.edu"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">University-affiliated email preferred</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phoneNumber" className="text-base font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={studentData.phoneNumber}
                    onChange={(e) => setStudentData({...studentData, phoneNumber: e.target.value})}
                    placeholder="(555) 123-4567"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedinUrl" className="text-base font-medium">
                    LinkedIn Profile URL
                  </Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={studentData.linkedinUrl}
                    onChange={(e) => setStudentData({...studentData, linkedinUrl: e.target.value})}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">Optional</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="universityName" className="text-base font-medium">
                    University Name *
                  </Label>
                  <Input
                    id="universityName"
                    value={studentData.universityName}
                    onChange={(e) => setStudentData({...studentData, universityName: e.target.value})}
                    placeholder="Name of University"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="academicProgram" className="text-base font-medium">
                    Academic Program / Major *
                  </Label>
                  <Input
                    id="academicProgram"
                    value={studentData.academicProgram}
                    onChange={(e) => setStudentData({...studentData, academicProgram: e.target.value})}
                    placeholder="Computer Science, Business, etc."
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Year of Study *</Label>
                <Select value={studentData.yearOfStudy} onValueChange={(value) => setStudentData({...studentData, yearOfStudy: value})}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your year of study" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOfStudyOptions.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-6">
                <Button onClick={handleNext} className="bg-primary-custom hover:bg-primary-dark text-white px-8 py-3">
                  Continue to Nomination Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle className="text-primary-custom" />
                <span>Step 2: Nomination Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> AspireLink requires nomination by a professor or academic advisor. 
                  We may contact your nominator to verify your application.
                </p>
              </div>

              <div>
                <Label htmlFor="nominatedBy" className="text-base font-medium">
                  Nominated By: Professor's Full Name *
                </Label>
                <Input
                  id="nominatedBy"
                  value={studentData.nominatedBy}
                  onChange={(e) => setStudentData({...studentData, nominatedBy: e.target.value})}
                  placeholder="Dr. Jane Smith"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="professorEmail" className="text-base font-medium">
                  Professor's Email Address *
                </Label>
                <Input
                  id="professorEmail"
                  type="email"
                  value={studentData.professorEmail}
                  onChange={(e) => setStudentData({...studentData, professorEmail: e.target.value})}
                  placeholder="professor@university.edu"
                  className="mt-2"
                />
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setStep(step - 1)} className="px-8 py-3">
                  Back
                </Button>
                <Button onClick={handleNext} className="bg-primary-custom hover:bg-primary-dark text-white px-8 py-3">
                  Continue to Matching Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="text-primary-custom" />
                <span>Step 3: Mentorship Matching</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="careerInterests" className="text-base font-medium">
                  Career Interests or Goals *
                </Label>
                <Textarea
                  id="careerInterests"
                  value={studentData.careerInterests}
                  onChange={(e) => setStudentData({...studentData, careerInterests: e.target.value})}
                  placeholder="Describe your career interests, goals, and what you hope to achieve..."
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-base font-medium">Academic Disciplines *</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select at least one academic discipline you're studying or interested in
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {disciplines.map((discipline) => (
                    <Button
                      key={discipline}
                      variant={studentData.preferredDisciplines.includes(discipline) ? "default" : "outline"}
                      onClick={() => toggleDiscipline(discipline)}
                      className="justify-start h-auto py-2"
                    >
                      {discipline}
                    </Button>
                  ))}
                </div>
                {studentData.preferredDisciplines.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Disciplines:</p>
                    <div className="flex flex-wrap gap-2">
                      {studentData.preferredDisciplines.map((discipline) => (
                        <Badge key={discipline} variant="secondary" className="flex items-center gap-1">
                          {discipline}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeDiscipline(discipline)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-base font-medium">Mentoring Topics *</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select topics you'd like guidance on from your mentor
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {mentoringTopics.map((topic) => (
                    <Button
                      key={topic}
                      variant={studentData.mentoringTopics.includes(topic) ? "default" : "outline"}
                      onClick={() => toggleMentoringTopic(topic)}
                      className="justify-start h-auto py-2"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
                {studentData.mentoringTopics.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {studentData.mentoringTopics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                          {topic}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeMentoringTopic(topic)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="mentorshipGoals" className="text-base font-medium">
                  What do you hope to gain from this mentorship experience? *
                </Label>
                <Textarea
                  id="mentorshipGoals"
                  value={studentData.mentorshipGoals}
                  onChange={(e) => setStudentData({...studentData, mentorshipGoals: e.target.value})}
                  placeholder="Describe your expectations and goals for the mentorship program..."
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setStep(step - 1)} className="px-8 py-3">
                  Back
                </Button>
                <Button onClick={handleNext} className="bg-primary-custom hover:bg-primary-dark text-white px-8 py-3">
                  Continue to Confirmation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock className="text-primary-custom" />
                <span>Step 4: Consent & Confirmation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Program Commitment</h3>
                <p className="text-gray-700 mb-4">
                  AspireLink's mentorship program is a structured 4-month experience designed to help you achieve your career goals. 
                  To ensure the best experience for both you and your mentor, we require active participation.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Attend at least 4 virtual mentorship sessions over one academic semester</li>
                  <li>Come prepared with questions and goals for each session</li>
                  <li>Maintain professional communication with your mentor</li>
                  <li>Provide feedback to help improve the program</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="commitment"
                    checked={studentData.agreedToCommitment}
                    onCheckedChange={(checked) => 
                      setStudentData({...studentData, agreedToCommitment: !!checked})
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="commitment" className="text-base leading-relaxed">
                    I commit to attending at least 4 virtual mentorship sessions over one academic semester 
                    and actively participating in the program.
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={studentData.consentToContact}
                    onCheckedChange={(checked) => 
                      setStudentData({...studentData, consentToContact: !!checked})
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="consent" className="text-base leading-relaxed">
                    I consent to being contacted by AspireLink regarding this program, including updates, 
                    mentor matching, and program communications.
                  </Label>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Next Steps:</strong> After submitting your application, we'll review your information 
                  and verify your nomination. You'll hear from us within 5-7 business days about your acceptance 
                  and mentor matching.
                </p>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setStep(step - 1)} className="px-8 py-3">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={registrationMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  {registrationMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}


      </div>
    </div>
  );
}