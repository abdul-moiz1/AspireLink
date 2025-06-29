import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Rocket,
  Calendar,
  CheckCircle,
  Star,
  Clock,
} from "lucide-react";
import { Link } from "wouter";

export default function ForStudents() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24" style={{background: 'linear-gradient(135deg, #2E86AB 0%, #1e5b7a 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-inter font-bold text-4xl md:text-5xl mb-6" style={{color: '#ffffff'}}>
            For Students
          </h1>
          <p className="text-xl leading-relaxed" style={{color: '#ffffff'}}>
            Accelerate your career with personalized mentorship from industry
            leaders
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-xl" style={{background: 'linear-gradient(135deg, #2E86AB 0%, #1e5b7a 100%)'}}>
              <CardContent className="p-8">
                <GraduationCap className="w-12 h-12 mb-6" style={{color: '#ffffff'}} />
                <h3 className="font-inter font-semibold text-2xl mb-4" style={{color: '#ffffff'}}>
                  Eligibility
                </h3>
                <ul className="space-y-3" style={{color: '#ffffff'}}>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    Current undergraduate or graduate student
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    Faculty or peer nomination required
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    Commitment to 4-month program
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    Clear career goals and objectives
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-xl" style={{background: 'linear-gradient(135deg, #A23B72 0%, #7d2d5a 100%)'}}>
              <CardContent className="p-8">
                <Rocket className="w-12 h-12 mb-6" style={{color: '#ffffff'}} />
                <h3 className="font-inter font-semibold text-2xl mb-4" style={{color: '#ffffff'}}>
                  Benefits
                </h3>
                <ul className="space-y-3" style={{color: '#ffffff'}}>
                  <li className="flex items-start">
                    <Star className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    1-on-1 monthly mentorship sessions
                  </li>
                  <li className="flex items-start">
                    <Star className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    Industry insights and networking
                  </li>
                  <li className="flex items-start">
                    <Star className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    Career guidance and goal setting
                  </li>
                  <li className="flex items-start">
                    <Star className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    Professional development resources
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-xl" style={{background: 'linear-gradient(135deg, #F18F01 0%, #c47301 100%)'}}>
              <CardContent className="p-8">
                <Calendar className="w-12 h-12 mb-6" style={{color: '#ffffff'}} />
                <h3 className="font-inter font-semibold text-2xl mb-4" style={{color: '#ffffff'}}>
                  Timeline
                </h3>
                <ul className="space-y-3" style={{color: '#ffffff'}}>
                  <li className="flex items-start">
                    <Clock className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    Application & nomination period
                  </li>
                  <li className="flex items-start">
                    <Clock className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    Matching process (2 weeks)
                  </li>
                  <li className="flex items-start">
                    <Clock className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    4-month mentorship program
                  </li>
                  <li className="flex items-start">
                    <Clock className="mr-3 mt-1 w-4 h-4 flex-shrink-0" style={{color: '#ffffff'}} />
                    Recognition and networking event
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-16">
            <Link href="/contact">
              <Button className="bg-primary-custom hover:bg-primary-dark text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg">
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Application Process */}
          <div className="max-w-4xl mx-auto">
            <h2 className="font-inter font-bold text-3xl text-charcoal-custom text-center mb-12">
              Application Process
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary-custom text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    1
                  </div>
                  <h3 className="font-semibold text-xl mb-3">
                    Complete Application
                  </h3>
                  <p className="text-gray-600">
                    Fill out our comprehensive application form detailing your
                    academic background, career goals, and areas of interest.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-secondary-custom text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    2
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Get Nominated</h3>
                  <p className="text-gray-600">
                    Secure a nomination from a faculty member, academic advisor,
                    or peer who can vouch for your commitment and potential.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-accent-custom text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    3
                  </div>
                  <h3 className="font-semibold text-xl mb-3">
                    Interview & Matching
                  </h3>
                  <p className="text-gray-600">
                    Participate in a brief interview and get matched with a
                    mentor based on your goals, interests, and compatibility.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    4
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Start Program</h3>
                  <p className="text-gray-600">
                    Begin your 4-month mentorship journey with monthly sessions,
                    goal setting, and professional development activities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Student Success Image */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-inter font-bold text-3xl md:text-4xl text-charcoal-custom mb-6">
                Join Thousands of Successful Students
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our mentorship program has helped students from top universities 
                launch successful careers in technology, finance, consulting, and more.
              </p>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-custom mb-2">1,500+</div>
                  <div className="text-sm text-gray-600">Students Mentored</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary-custom mb-2">85%</div>
                  <div className="text-sm text-gray-600">Job Placement Rate</div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=700"
                alt="Diverse group of university students collaborating on laptops in modern study space"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Gain */}
      <section className="py-24 bg-light-custom">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-inter font-bold text-3xl md:text-4xl text-charcoal-custom mb-8">
            What You'll Gain
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-left">
              <h3 className="font-semibold text-xl text-charcoal-custom mb-4">
                🎯 Career Clarity
              </h3>
              <p className="text-gray-700 mb-6">
                Gain clear direction on your career path through personalized
                guidance and industry insights from experienced professionals.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-xl text-charcoal-custom mb-4">
                🌐 Professional Network
              </h3>
              <p className="text-gray-700 mb-6">
                Expand your network with connections to industry leaders,
                potential employers, and like-minded peers.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-xl text-charcoal-custom mb-4">
                💼 Practical Skills
              </h3>
              <p className="text-gray-700 mb-6">
                Develop real-world skills that complement your academic learning
                and make you more competitive in the job market.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-xl text-charcoal-custom mb-4">
                🏆 Confidence & Growth
              </h3>
              <p className="text-gray-700 mb-6">
                Build confidence through regular feedback, encouragement, and
                achieving milestones with your mentor's support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-inter font-bold text-3xl text-charcoal-custom mb-6">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of students who have transformed their professional
            trajectory through AspireLink.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-primary-custom hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg">
                Start Application
              </Button>
            </Link>
            <Link href="/faq">
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
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
