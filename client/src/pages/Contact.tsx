import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Twitter, Clock, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // EmailJS configuration - these need to be set up in EmailJS dashboard
      const serviceId = 'service_aspirelink'; // You'll need to create this
      const templateId = 'template_contact'; // You'll need to create this
      const publicKey = 'YOUR_PUBLIC_KEY'; // You'll need to get this from EmailJS

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject || 'Contact Form Submission',
        message: formData.message,
        to_email: 'contact@aspirelink.com',
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error('EmailJS error:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly at contact@aspirelink.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
                      href="mailto:contact@aspirelink.org"
                      className="text-primary-custom hover:text-secondary-custom transition-colors duration-200"
                    >
                      contact@aspirelink.org
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary-custom bg-opacity-10 rounded-full flex items-center justify-center">
                    <Twitter className="text-secondary-custom w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-custom">
                      Follow Us
                    </h3>
                    <a
                      href="https://twitter.com/AspireLinkOrg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-custom hover:text-primary-custom transition-colors duration-200"
                    >
                      @AspireLinkOrg
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent-custom bg-opacity-10 rounded-full flex items-center justify-center">
                    <Clock className="text-accent-custom w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-custom">
                      Response Time
                    </h3>
                    <p className="text-gray-600">
                      We'll get back to you within 24 hours
                    </p>
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

            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="font-inter font-semibold text-2xl text-charcoal-custom mb-6">
                    Send us a Message
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-charcoal-custom">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-charcoal-custom">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-charcoal-custom">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-charcoal-custom">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="mt-1"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-custom hover:bg-primary-dark disabled:opacity-50 text-white py-3 font-semibold"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
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
                <p className="text-gray-600 text-sm">
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
                  Virtual First
                </h3>
                <p className="text-gray-600 text-sm">
                  All programs conducted online
                  <br />
                  Global accessibility
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-accent-custom w-8 h-8" />
                </div>
                <h3 className="font-semibold text-charcoal-custom mb-2">
                  Quick Response
                </h3>
                <p className="text-gray-600 text-sm">
                  24-hour response guarantee
                  <br />
                  Priority support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
