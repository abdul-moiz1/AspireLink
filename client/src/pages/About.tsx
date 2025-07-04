import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip, EncouragementTooltip } from "@/components/ui/help-tooltip";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24" style={{background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <h1 className="font-inter font-bold text-4xl md:text-5xl" style={{color: '#ffffff'}}>
              About AspireLink
            </h1>
            <InfoTooltip 
              content="AspireLink was founded to bridge the gap between academic learning and real-world career success. We believe every student deserves access to professional guidance, regardless of their background or connections."
              side="bottom"
            />
          </div>
          <p className="text-xl leading-relaxed" style={{color: '#ffffff'}}>
            Bridging the gap between academic learning and professional success
            through meaningful mentorship connections.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Diverse group of students collaborating and studying together"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
            <div>
              <h2 className="font-inter font-bold text-3xl md:text-4xl text-charcoal-custom mb-6">
                Our Mission
              </h2>
              <p className="text-lg mb-6 leading-relaxed" style={{color: '#2F3E46'}}>
                AspireLink bridges the gap between academic learning and
                professional success by connecting motivated students with
                experienced industry mentors.
              </p>
              <p className="text-lg mb-8 leading-relaxed" style={{color: '#2F3E46'}}>
                We believe that mentorship is the key to unlocking potential and
                accelerating career growth. Our platform creates meaningful
                connections that last beyond the 4-month program.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary-custom mb-2">
                      4
                    </div>
                    <div style={{color: '#2F3E46'}}>Month program</div>
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-secondary-custom mb-2">
                      100%
                    </div>
                    <div style={{color: '#2F3E46'}}>Free to participate</div>
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-accent-custom mb-2">
                      1:1
                    </div>
                    <div style={{color: '#2F3E46'}}>Mentor matching</div>
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      24/7
                    </div>
                    <div style={{color: '#2F3E46'}}>Support available</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 bg-light-custom">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-inter font-bold text-3xl md:text-4xl text-charcoal-custom mb-8">
            Our Vision
          </h2>
          <p className="text-lg mb-8 leading-relaxed" style={{color: '#2F3E46'}}>
            To create a world where every student has access to meaningful
            mentorship that accelerates their professional growth and personal
            development. We envision a global community where knowledge, wisdom,
            and opportunities flow freely between generations of professionals.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold text-charcoal-custom mb-2">
                Global Reach
              </h3>
              <p className="text-gray-600">
                Connecting students and mentors across continents
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-charcoal-custom mb-2">
                Inclusive Community
              </h3>
              <p className="text-gray-600">
                Welcoming all backgrounds and experiences
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold text-charcoal-custom mb-2">
                Career Acceleration
              </h3>
              <p className="text-gray-600">
                Empowering rapid professional development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-inter font-bold text-3xl md:text-4xl text-charcoal-custom mb-8">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="text-left">
              <CardContent className="p-8">
                <h3 className="font-inter font-semibold text-xl text-charcoal-custom mb-4">
                  🎯 Purpose-Driven
                </h3>
                <p className="text-gray-700">
                  Every connection we make is intentional and focused on
                  achieving meaningful career outcomes for our participants.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left">
              <CardContent className="p-8">
                <h3 className="font-inter font-semibold text-xl text-charcoal-custom mb-4">
                  🌟 Excellence
                </h3>
                <p className="text-gray-700">
                  We maintain the highest standards in mentor selection,
                  matching algorithms, and program delivery.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left">
              <CardContent className="p-8">
                <h3 className="font-inter font-semibold text-xl text-charcoal-custom mb-4">
                  💡 Innovation
                </h3>
                <p className="text-gray-700">
                  We continuously evolve our platform using technology and data
                  to improve mentorship experiences.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left">
              <CardContent className="p-8">
                <h3 className="font-inter font-semibold text-xl text-charcoal-custom mb-4">
                  🤲 Accessibility
                </h3>
                <p className="text-gray-700">
                  We believe quality mentorship should be free and available to
                  all deserving students regardless of background.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
