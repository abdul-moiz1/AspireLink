import { Card, CardContent } from "@/components/ui/card";
import { Mail, Twitter, Clock, MapPin, Phone, Calendar } from "lucide-react";

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            {/* How to Reach Us */}
            <div className="w-full max-w-2xl">
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-inter font-bold text-2xl text-charcoal-custom mb-6">
                    How to Reach Us
                  </h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-custom rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-charcoal-custom mb-2">
                            Email for Applications & Inquiries
                          </h4>
                          <p style={{color: '#2F3E46'}} className="mb-3">
                            Send your student applications, mentor applications, or general inquiries directly to our team:
                          </p>
                          <a
                            href="mailto:info@aspirelink.org"
                            className="text-primary-custom hover:text-secondary-custom transition-colors duration-200 font-medium text-lg"
                          >
                            info@aspirelink.org
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-secondary-custom rounded-full flex items-center justify-center flex-shrink-0">
                          <Twitter className="w-6 h-6 text-white" />
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


    </div>
  );
}