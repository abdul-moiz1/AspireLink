import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Users,
  Star,
  UserPlus,
  Search,
  Video,
  Award,
  Heart,
  Lightbulb,
  Network,
  FileText,
  UserCheck,
  Calendar,
  Target
} from "lucide-react";
import { Link } from "wouter";
import brandedImagePath from "@assets/AspireLink-300-1_1751236725408.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white bg-opacity-95 rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              <div className="text-center lg:text-left flex flex-col justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
                <h1 className="font-inter font-bold text-4xl md:text-5xl lg:text-6xl text-charcoal-custom leading-tight mb-6">
                  Connect. Learn.{" "}
                  <span className="text-primary-custom">Aspire.</span>
                </h1>
                <p className="text-xl mb-8 leading-relaxed" style={{color: '#2F3E46'}}>
                  Join AspireLink's free mentorship program connecting students
                  with experienced professionals through 4-month academic cohorts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Link href="/register-student">
                    <Button className="bg-primary-custom hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg">
                      Apply as Student
                    </Button>
                  </Link>
                  <Link href="/register-mentor">
                    <Button
                      variant="outline"
                      className="border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
                      style={{
                        borderColor: '#2E86AB',
                        color: '#2E86AB',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2E86AB';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#2E86AB';
                      }}
                    >
                      Become a Mentor
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm" style={{color: '#2F3E46'}}>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
                    <span>100% Free</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="text-primary-custom mr-2 w-4 h-4" />
                    <span>4-Month Program</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="text-accent-custom mr-2 w-4 h-4" />
                    <span>Expert Mentors</span>
                  </div>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl flex items-center justify-center">
                <img
                  src={brandedImagePath}
                  alt="AspireLink logo with handshake figures on graduation cap - Connecting ambition with experience"
                  className="rounded-2xl shadow-xl w-full h-auto max-w-md"
                />
                <Card className="absolute -bottom-4 -left-4 w-56 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Video className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal-custom text-sm">
                          Monthly Sessions
                        </p>
                        <p className="text-xs text-gray-500">Virtual meetings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-inter font-bold text-3xl md:text-4xl text-charcoal-custom mb-6">
              How AspireLink Works
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{color: '#2F3E46'}}>
              Our structured 4-month program guides you through every step of
              professional mentorship
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center group card-hover">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-custom group-hover:bg-opacity-20 transition-colors duration-200">
                  <FileText className="text-primary-custom w-8 h-8" />
                </div>
                <h3 className="font-inter font-semibold text-xl text-charcoal-custom mb-4">
                  1. Nomination
                </h3>
                <p style={{color: '#2F3E46'}}>
                  Students apply and get nominated by faculty or peers for the
                  program
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group card-hover">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-custom group-hover:bg-opacity-20 transition-colors duration-200">
                  <Users className="text-secondary-custom w-8 h-8" />
                </div>
                <h3 className="font-inter font-semibold text-xl text-charcoal-custom mb-4">
                  2. Matching
                </h3>
                <p style={{color: '#2F3E46'}}>
                  Smart matching connects students with compatible mentors
                  based on goals and industry
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group card-hover">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-custom group-hover:bg-opacity-20 transition-colors duration-200">
                  <Calendar className="text-accent-custom w-8 h-8" />
                </div>
                <h3 className="font-inter font-semibold text-xl text-charcoal-custom mb-4">
                  3. Sessions
                </h3>
                <p style={{color: '#2F3E46'}}>
                  Monthly virtual meetings with structured guidance and goal
                  tracking
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group card-hover">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors duration-200">
                  <Target className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="font-inter font-semibold text-xl text-charcoal-custom mb-4">
                  4. Recognition
                </h3>
                <p style={{color: '#2F3E46'}}>
                  Celebrate achievements and build lasting professional
                  relationships
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-24 bg-light-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-inter font-bold text-3xl md:text-4xl text-charcoal-custom mb-6">
              Why Choose AspireLink?
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{color: '#2F3E46'}}>
              Our platform offers unique features designed to maximize your mentorship experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="text-primary-custom w-8 h-8" />
                </div>
                <h3 className="font-semibold text-xl text-charcoal-custom mb-4">
                  Personalized Matching
                </h3>
                <p style={{color: '#2F3E46'}}>
                  Smart matching system connects you with mentors based on your career goals, 
                  interests, and compatibility for the perfect fit.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-secondary-custom w-8 h-8" />
                </div>
                <h3 className="font-semibold text-xl text-charcoal-custom mb-4">
                  Structured Program
                </h3>
                <p style={{color: '#2F3E46'}}>
                  Four-month guided journey with clear milestones, goal tracking, 
                  and resources to maximize your growth.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="text-accent-custom w-8 h-8" />
                </div>
                <h3 className="font-semibold text-xl text-charcoal-custom mb-4">
                  Industry Networks
                </h3>
                <p style={{color: '#2F3E46'}}>
                  Access to exclusive professional networks and connections 
                  that extend beyond the mentorship program.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-custom text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-inter font-bold text-3xl md:text-4xl mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students and professionals who have accelerated
            their careers through meaningful mentorship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register-student">
              <Button className="bg-white text-primary-custom hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg">
                Apply as Student
              </Button>
            </Link>
            <Link href="/register-mentor">
              <Button
                variant="outline"
                className="border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
                style={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#2E86AB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                Become a Mentor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
