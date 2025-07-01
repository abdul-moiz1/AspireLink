import { Card, CardContent } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24" style={{background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-inter font-bold text-4xl md:text-5xl mb-6 text-white">
            Terms of Service
          </h1>
          <p className="text-xl text-white">
            Guidelines and agreements for participating in AspireLink
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
                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Acceptance of Terms</h2>
                  <p className="text-gray-700 mb-6">
                    By participating in the AspireLink mentorship program, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Program Overview</h2>
                  <p className="text-gray-700 mb-4">
                    AspireLink is a free mentorship program that connects students with experienced professionals for a structured 4-month mentoring relationship. The program includes:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Monthly one-on-one mentoring sessions</li>
                    <li>Goal setting and progress tracking</li>
                    <li>Professional development resources</li>
                    <li>Networking opportunities</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Participant Responsibilities</h2>
                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">All Participants</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Maintain professional and respectful communication</li>
                    <li>Attend scheduled sessions punctually</li>
                    <li>Provide accurate information during registration</li>
                    <li>Respect confidentiality and privacy</li>
                    <li>Follow our Code of Conduct</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">Students</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Come prepared to sessions with specific questions or goals</li>
                    <li>Complete pre-session preparation and follow-up actions</li>
                    <li>Be open to feedback and guidance</li>
                    <li>Maintain academic eligibility throughout the program</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">Mentors</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Provide constructive guidance and support</li>
                    <li>Share relevant professional insights and experiences</li>
                    <li>Maintain appropriate professional boundaries</li>
                    <li>Report any concerns to program administrators</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Program Rules</h2>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Sessions must be conducted through approved platforms</li>
                    <li>No monetary exchange between mentors and mentees</li>
                    <li>Professional relationship boundaries must be maintained</li>
                    <li>Discrimination or harassment of any kind is prohibited</li>
                    <li>Sharing of inappropriate content is strictly forbidden</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Intellectual Property</h2>
                  <p className="text-gray-700 mb-6">
                    All materials provided by AspireLink remain our intellectual property. Participants may use these resources for personal development but may not redistribute or commercialize them without permission.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Termination</h2>
                  <p className="text-gray-700 mb-4">
                    We reserve the right to terminate participation for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Violation of these terms or our Code of Conduct</li>
                    <li>Inappropriate behavior or communication</li>
                    <li>Failure to attend sessions without notice</li>
                    <li>Providing false information during registration</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Limitation of Liability</h2>
                  <p className="text-gray-700 mb-6">
                    AspireLink provides mentorship services on an "as is" basis. We are not liable for any outcomes, decisions, or actions taken based on mentorship advice. Participants engage at their own risk and responsibility.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Changes to Terms</h2>
                  <p className="text-gray-700 mb-6">
                    We may update these Terms of Service periodically. Continued participation after changes constitutes acceptance of the new terms.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Contact Information</h2>
                  <p className="text-gray-700">
                    For questions about these Terms of Service, please contact us at:
                    <br />
                    <strong>Email:</strong> legal@aspirelink.org
                    <br />
                    <strong>Address:</strong> AspireLink Legal Department, 123 University Ave, Toronto, ON M5S 3M2
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