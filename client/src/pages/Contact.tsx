import { Card, CardContent } from "@/components/ui/card";
import { Mail, Twitter, Clock, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24" style={{background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-inter font-bold text-4xl md:text-5xl mb-6" style={{color: '#ffffff'}}>
            Get in Touch
          </h1>
          <p className="text-xl" style={{color: '#ffffff'}}>
            Have questions about AspireLink? We're here to help you start your
            mentorship journey.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <div>
              <h2 className="font-inter font-bold text-3xl text-charcoal-custom mb-8">
                Contact Information
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-custom bg-opacity-10 rounded-full flex items-center justify-center">
                    <Mail className="text-primary-custom w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-custom">
                      Email Us
                    </h3>
                    <a
                      href="mailto:contact@aspirelink.com"
                      className="text-primary-custom hover:text-secondary-custom transition-colors duration-200"
                    >
                      contact@aspirelink.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Twitter className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-custom">
                      LinkedIn
                    </h3>
                    <a
                      href="https://www.linkedin.com/company/aspirelinkorg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-custom hover:text-secondary-custom transition-colors duration-200"
                    >
                      @AspireLinkOrg
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Image */}
              <div className="hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                  alt="Professional virtual meeting session between mentor and student on laptop screen"
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
              </div>
            </div>

            {/* How to Reach Us */}
            <div>
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-inter font-bold text-2xl text-charcoal-custom mb-6">
                    How to Reach Us
                  </h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-primary-custom bg-opacity-5 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-custom bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="text-primary-custom w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-charcoal-custom mb-2">
                            Email for Applications & Inquiries
                          </h4>
                          <p style={{color: '#2F3E46'}} className="mb-3">
                            Send your student applications, mentor applications, or general inquiries directly to our team:
                          </p>
                          <a
                            href="mailto:contact@aspirelink.com"
                            className="text-primary-custom hover:text-secondary-custom transition-colors duration-200 font-medium text-lg"
                          >
                            contact@aspirelink.com
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Twitter className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-charcoal-custom mb-2">
                            Connect on LinkedIn
                          </h4>
                          <p style={{color: '#2F3E46'}} className="mb-3">
                            Follow us for program updates, success stories, and professional networking opportunities:
                          </p>
                          <a
                            href="https://www.linkedin.com/company/aspirelinkorg"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-custom hover:text-secondary-custom transition-colors duration-200 font-medium text-lg"
                          >
                            @AspireLinkOrg
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-24 bg-light-custom">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-inter font-bold text-3xl text-charcoal-custom text-center mb-12">
            Other Ways to Connect
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-primary-custom w-8 h-8" />
                </div>
                <h3 className="font-semibold text-charcoal-custom mb-2">
                  Office Hours
                </h3>
                <p style={{color: '#2F3E46'}} className="text-sm">
                  Monday - Friday
                  <br />
                  9:00 AM - 5:00 PM EST
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-secondary-custom w-8 h-8" />
                </div>
                <h3 className="font-semibold text-charcoal-custom mb-2">
                  Location
                </h3>
                <p style={{color: '#2F3E46'}} className="text-sm">
                  Virtual Program
                  <br />
                  Available Worldwide
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-accent-custom w-8 h-8" />
                </div>
                <h3 className="font-semibold text-charcoal-custom mb-2">
                  Program Duration
                </h3>
                <p style={{color: '#2F3E46'}} className="text-sm">
                  4-Month Cohorts
                  <br />
                  Year-Round Enrollment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}