import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24" style={{background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-inter font-bold text-4xl md:text-5xl mb-6 text-white">
            Privacy Policy
          </h1>
          <p className="text-xl text-white">
            How we protect and handle your personal information
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
                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Introduction</h2>
                  <p className="text-gray-700 mb-6">
                    AspireLink ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you participate in our mentorship program.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Information We Collect</h2>
                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">Personal Information</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Name, email address, and contact information</li>
                    <li>Academic background and educational details</li>
                    <li>Professional experience and career goals</li>
                    <li>Skills, interests, and mentorship preferences</li>
                    <li>Profile information and communication preferences</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-charcoal-custom mb-3">Usage Information</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Session attendance and participation data</li>
                    <li>Platform usage analytics and interactions</li>
                    <li>Feedback and survey responses</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">How We Use Your Information</h2>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Facilitate mentor-mentee matching based on compatibility</li>
                    <li>Coordinate and schedule mentorship sessions</li>
                    <li>Track program progress and outcomes</li>
                    <li>Improve our services and user experience</li>
                    <li>Send program updates and important communications</li>
                    <li>Ensure program safety and compliance</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Information Sharing</h2>
                  <p className="text-gray-700 mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share information only in these circumstances:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>With your matched mentor or mentee for program participation</li>
                    <li>With university partners for academic credit or reporting</li>
                    <li>When required by law or to protect safety</li>
                    <li>With service providers who assist in program operations</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Data Security</h2>
                  <p className="text-gray-700 mb-6">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                  </p>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Your Rights</h2>
                  <p className="text-gray-700 mb-4">You have the right to:</p>
                  <ul className="list-disc pl-6 text-gray-700 mb-6">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your data</li>
                    <li>Withdraw consent for data processing</li>
                    <li>Receive a copy of your data</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-charcoal-custom mb-4">Contact Us</h2>
                  <p className="text-gray-700">
                    If you have questions about this Privacy Policy or our data practices, please contact us at:
                    <br />
                    <strong>Email:</strong> privacy@aspirelink.org
                    <br />
                    <strong>Address:</strong> AspireLink Privacy Officer, 123 University Ave, Toronto, ON M5S 3M2
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