import { Card, CardContent } from "@/components/ui/card";

export default function Accessibility() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-inter font-bold text-4xl md:text-5xl mb-6 text-white">
            Accessibility
          </h1>
          <p className="text-xl text-white">
            Our commitment to inclusive design and equal access
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <Card>
              <CardContent className="p-8">
                <p className="text-sm text-gray-500 mb-6">
                  <strong>Last Updated:</strong> December 30, 2024
                </p>
                
                <div className="prose prose-charcoal max-w-none">
                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Our Commitment</h2>
                  <p className="text-gray-700 mb-6">
                    AspireLink is committed to ensuring that our mentorship program is accessible to all participants, regardless of disability or access needs. We strive to remove barriers and provide equal opportunities for professional development and mentorship.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Web Accessibility Standards</h2>
                  <p className="text-gray-700 mb-4">Our website and platform aim to meet or exceed:</p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards</li>
                    <li>Section 508 compliance for federal accessibility requirements</li>
                    <li>AODA (Accessibility for Ontarians with Disabilities Act) standards</li>
                    <li>International accessibility best practices</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Accessibility Features</h2>
                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">Website and Platform</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Keyboard navigation support for all interactive elements</li>
                    <li>Screen reader compatibility with proper heading structure</li>
                    <li>High contrast color schemes and readable fonts</li>
                    <li>Alternative text for all images and graphics</li>
                    <li>Captions and transcripts for video content</li>
                    <li>Resizable text up to 200% without loss of functionality</li>
                    <li>Clear focus indicators and navigation aids</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">Program Accommodations</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Flexible session scheduling for different time zones and schedules</li>
                    <li>Multiple communication options (video, phone, text-based)</li>
                    <li>Document formats available in various accessible formats</li>
                    <li>Sign language interpretation upon request</li>
                    <li>Extended time for program activities when needed</li>
                    <li>Alternative assessment methods</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Supported Technologies</h2>
                  <p className="text-gray-700 mb-4">Our platform is tested with:</p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>JAWS (Job Access With Speech)</li>
                    <li>NVDA (NonVisual Desktop Access)</li>
                    <li>VoiceOver (macOS and iOS)</li>
                    <li>TalkBack (Android)</li>
                    <li>Dragon NaturallySpeaking</li>
                    <li>Various browser zoom and magnification tools</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Getting Accessibility Support</h2>
                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">Before You Apply</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Contact us to discuss any accommodation needs</li>
                    <li>Request alternative application formats if needed</li>
                    <li>Ask about accessible versions of program materials</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">During the Program</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Notify us of any accessibility barriers you encounter</li>
                    <li>Request accommodations for specific sessions or activities</li>
                    <li>Provide feedback on accessibility improvements</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Common Accommodations</h2>
                  <p className="text-gray-700 mb-4">We can provide support including:</p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Extended deadlines for program requirements</li>
                    <li>Alternative formats for reading materials (large print, audio, digital)</li>
                    <li>Assistive technology support and training</li>
                    <li>Note-taking assistance during sessions</li>
                    <li>Modified communication preferences</li>
                    <li>Flexible participation options</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Ongoing Improvements</h2>
                  <p className="text-gray-700 mb-6">
                    We continuously work to improve accessibility through regular audits, user testing with disabled participants, staff training on accessibility best practices, and implementing feedback from our community.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Feedback and Issues</h2>
                  <p className="text-gray-700 mb-4">
                    If you encounter accessibility barriers or have suggestions for improvement:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Report issues immediately so we can provide workarounds</li>
                    <li>Include specific details about the barrier and your assistive technology</li>
                    <li>Suggest solutions that would improve your experience</li>
                    <li>Follow up if issues are not resolved promptly</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Third-Party Services</h2>
                  <p className="text-gray-700 mb-6">
                    We carefully evaluate all third-party platforms and services for accessibility compliance before integration. If you experience accessibility issues with any external tools we use, please contact us for alternative solutions.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Contact Our Accessibility Team</h2>
                  <p className="text-gray-700">
                    For accessibility support or to report issues:
                    <br />
                    <strong>Email:</strong> accessibility@aspirelink.org
                    <br />
                    <strong>Phone:</strong> 1-800-277-4731 (TTY available)
                    <br />
                    <strong>Address:</strong> AspireLink Accessibility Office, 123 University Ave, Toronto, ON M5S 3M2
                    <br />
                    <strong>Response Time:</strong> We aim to respond within 24 hours for urgent accessibility needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}