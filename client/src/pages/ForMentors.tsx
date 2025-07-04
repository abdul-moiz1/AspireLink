import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lightbulb, Network, Users, Clock, Target, FileText, UserCheck, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function ForMentors() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24" style={{background: 'linear-gradient(135deg, #A23B72 0%, #7d2d5a 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-inter font-bold text-4xl md:text-5xl mb-6" style={{color: '#ffffff'}}>
            For Mentors
          </h1>
          <p className="text-xl leading-relaxed" style={{color: '#ffffff'}}>
            Make a lasting impact on the next generation while growing your own
            professional network
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-light-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-inter font-bold text-3xl md:text-4xl text-charcoal-custom mb-6">
                Why Become a Mentor?
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{color: '#2F3E46'}}>
                Make a lasting impact on the next generation of professionals
                while gaining fresh perspectives and expanding your network.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-custom rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-custom mb-2">
                      Give Back to Community
                    </h3>
                    <p style={{color: '#2F3E46'}}>
                      Share your expertise and help shape future leaders in your
                      industry
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-custom rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-custom mb-2">
                      Gain Fresh Perspectives
                    </h3>
                    <p style={{color: '#2F3E46'}}>
                      Learn from eager students and stay current with emerging
                      trends
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-custom rounded-full flex items-center justify-center flex-shrink-0">
                    <Network className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-custom mb-2">
                      Expand Your Network
                    </h3>
                    <p style={{color: '#2F3E46'}}>
                      Connect with other professionals and potential future
                      colleagues
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/register-mentor">
                <Button className="bg-secondary-custom hover:bg-secondary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg">
                  Become a Mentor
                </Button>
              </Link>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Business professionals networking and discussing at a corporate event"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Requirements */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-inter font-bold text-3xl md:text-4xl text-charcoal-custom text-center mb-12">
            Mentor Requirements
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-primary-custom mb-4" />
                <h3 className="font-semibold text-xl mb-3">
                  Professional Experience
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Minimum 3 years in your field</li>
                  <li>• Leadership or management experience preferred</li>
                  <li>• Strong communication skills</li>
                  <li>• Passion for helping others grow</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Clock className="w-12 h-12 text-secondary-custom mb-4" />
                <h3 className="font-semibold text-xl mb-3">Time Commitment</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• 1 hour per month for 4 months</li>
                  <li>• Occasional email exchanges</li>
                  <li>• Flexibility in scheduling sessions</li>
                  <li>• Total commitment: 6-8 hours</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Target className="w-12 h-12 text-accent-custom mb-4" />
                <h3 className="font-semibold text-xl mb-3">
                  Mentoring Approach
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Goal-oriented guidance</li>
                  <li>• Industry insights sharing</li>
                  <li>• Career advice and planning</li>
                  <li>• Networking introductions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Heart className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="font-semibold text-xl mb-3">Personal Qualities</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Empathy and patience</li>
                  <li>• Active listening skills</li>
                  <li>• Willingness to share knowledge</li>
                  <li>• Commitment to student success</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mentor Journey */}
      <section className="py-24 bg-light-custom">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-inter font-bold text-3xl md:text-4xl text-charcoal-custom text-center mb-12">
            Your Mentoring Journey
          </h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-primary-custom text-white rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">
                  Application & Screening
                </h3>
                <p className="text-gray-600">
                  Complete our mentor application and participate in a brief
                  screening interview to ensure program fit.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-secondary-custom text-white rounded-full flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">
                  Matching & Introduction
                </h3>
                <p className="text-gray-600">
                  Get matched with a student based on industry, goals, and
                  personality compatibility. Receive mentee profile and
                  schedule first meeting.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-accent-custom text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">
                  Monthly Mentoring Sessions
                </h3>
                <p className="text-gray-600">
                  Conduct four 1-hour virtual sessions over the program
                  duration, focusing on career guidance, skill development, and
                  goal achievement.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">
                  Program Completion & Recognition
                </h3>
                <p className="text-gray-600">
                  Celebrate your mentee's achievements and receive recognition
                  for your contribution. Many relationships continue beyond the
                  formal program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-24 bg-secondary-custom text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-inter font-bold text-3xl md:text-4xl mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of dedicated mentors shaping the future of
            professional excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register-mentor">
              <Button className="bg-white text-secondary-custom hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg">
                Apply to Mentor
              </Button>
            </Link>
            <Link href="/faq">
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
                  e.currentTarget.style.color = '#A23B72';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
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
