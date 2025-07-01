import { Card, CardContent } from "@/components/ui/card";

export default function CodeOfConduct() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24" style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-inter font-bold text-4xl md:text-5xl mb-6 text-white">
            Code of Conduct
          </h1>
          <p className="text-xl text-white">
            Creating a safe and inclusive environment for all participants
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
                    AspireLink is committed to fostering an inclusive, respectful, and supportive environment for all participants. This Code of Conduct outlines our expectations for behavior and the consequences for unacceptable conduct.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Expected Behavior</h2>
                  <p className="text-gray-700 mb-4">All participants are expected to:</p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Treat everyone with respect, kindness, and professionalism</li>
                    <li>Use inclusive language and avoid discriminatory comments</li>
                    <li>Be punctual and prepared for scheduled sessions</li>
                    <li>Maintain confidentiality of shared information</li>
                    <li>Provide constructive and honest feedback</li>
                    <li>Support each other's learning and growth</li>
                    <li>Follow all program guidelines and policies</li>
                    <li>Report any concerns or inappropriate behavior promptly</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Unacceptable Behavior</h2>
                  <p className="text-gray-700 mb-4">The following behaviors are strictly prohibited:</p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Discrimination based on race, gender, religion, sexual orientation, age, disability, or any other protected characteristic</li>
                    <li>Harassment, bullying, or intimidation in any form</li>
                    <li>Inappropriate sexual conduct or unwelcome advances</li>
                    <li>Sharing personal contact information without consent</li>
                    <li>Using program relationships for personal financial gain</li>
                    <li>Sharing confidential or proprietary information</li>
                    <li>Disrupting sessions or program activities</li>
                    <li>Providing false or misleading information</li>
                    <li>Alcohol or substance use during program activities</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Professional Boundaries</h2>
                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">Mentor Guidelines</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Maintain appropriate professional distance</li>
                    <li>Avoid dual relationships that could create conflicts of interest</li>
                    <li>Do not offer employment or business opportunities during the program</li>
                    <li>Respect mentee autonomy in decision-making</li>
                    <li>Focus on professional development, not personal issues</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">Mentee Guidelines</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Respect mentor's time and expertise</li>
                    <li>Come prepared with specific questions and goals</li>
                    <li>Accept feedback gracefully and professionally</li>
                    <li>Do not request inappropriate favors or assistance</li>
                    <li>Maintain professional communication at all times</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Communication Standards</h2>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Use professional language in all communications</li>
                    <li>Respond to messages within 48 hours</li>
                    <li>Give 24-hour notice for session cancellations</li>
                    <li>Use approved communication platforms only</li>
                    <li>Keep conversations focused on program objectives</li>
                    <li>Report technical issues promptly to program staff</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Reporting Violations</h2>
                  <p className="text-gray-700 mb-4">
                    If you experience or witness behavior that violates this Code of Conduct:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Document the incident with dates, times, and details</li>
                    <li>Report immediately to program administrators</li>
                    <li>Use the confidential reporting system if available</li>
                    <li>Do not attempt to handle serious violations independently</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Consequences</h2>
                  <p className="text-gray-700 mb-4">Violations may result in:</p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Verbal or written warning</li>
                    <li>Required additional training or coaching</li>
                    <li>Temporary suspension from program activities</li>
                    <li>Reassignment to different mentor/mentee pairing</li>
                    <li>Permanent removal from the program</li>
                    <li>Reporting to academic or professional institutions</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Support Resources</h2>
                  <p className="text-gray-700 mb-6">
                    AspireLink provides support through program coordinators, counseling referrals, and conflict resolution services. We are committed to addressing concerns promptly and fairly while maintaining confidentiality when possible.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Contact Information</h2>
                  <p className="text-gray-700">
                    To report violations or seek guidance:
                    <br />
                    <strong>Email:</strong> conduct@aspirelink.org
                    <br />
                    <strong>Emergency Contact:</strong> safety@aspirelink.org
                    <br />
                    <strong>Phone:</strong> 1-800-ASPIRE-1 (1-800-277-4731)
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