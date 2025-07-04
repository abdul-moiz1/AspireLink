import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TipTooltip } from "@/components/ui/help-tooltip";

export default function FAQ() {
  const faqs = [
    {
      question: "How does the matching process work?",
      answer:
        "Our smart matching system connects students with mentors based on career goals, industry interests, personality compatibility, and availability. We consider factors like communication style, professional background, and specific areas of expertise to ensure the best possible pairing.",
    },
    {
      question: "What is the time commitment for mentors?",
      answer:
        "Mentors commit to one 1-hour virtual session per month for 4 months, plus occasional email exchanges. The total time commitment is approximately 6-8 hours over the entire program duration.",
    },
    {
      question: "Is there a cost to participate?",
      answer:
        "AspireLink is completely free for both students and mentors. Our program is entirely volunteer-based, with mentors generously donating their time and expertise to help the next generation of professionals succeed.",
    },
    {
      question: "What happens after the 4-month program ends?",
      answer:
        "While the formal program ends after 4 months, many mentor-mentee pairs continue their relationship independently. We also host annual networking events to maintain connections within the AspireLink community.",
    },
    {
      question: "Can international students participate?",
      answer:
        "Yes! AspireLink welcomes international students. All sessions are conducted virtually, making the program accessible regardless of geographic location. We have mentors from around the world to provide diverse perspectives.",
    },
    {
      question: "What qualifications do mentors need?",
      answer:
        "Mentors should have a minimum of 3 years of professional experience in their field, strong communication skills, and a genuine desire to help students grow. Leadership experience is preferred but not required.",
    },
    {
      question: "How are students selected for the program?",
      answer:
        "Students must complete an application and receive a nomination from faculty, academic advisors, or peers. We look for students who demonstrate commitment, clear career goals, and the potential to benefit from mentorship.",
    },
    {
      question: "What if a mentor-mentee pairing isn't working out?",
      answer:
        "We understand that not every pairing is perfect. Our program coordinators are available to help resolve any issues or facilitate a re-matching if necessary. We want to ensure a positive experience for everyone involved.",
    },
    {
      question: "How often do cohorts start?",
      answer:
        "New cohorts begin every semester - Fall, Spring, and Summer. Application deadlines are typically 4-6 weeks before the start of each semester to allow time for the matching process.",
    },
    {
      question: "What kind of support is provided during the program?",
      answer:
        "Participants receive structured guidance materials, goal-setting templates, and access to our program coordinators. We also provide resources on effective mentoring practices and professional development.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24" style={{background: 'linear-gradient(135deg, #F18F01 0%, #c47301 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <h1 className="font-inter font-bold text-4xl md:text-5xl" style={{color: '#ffffff'}}>
              Frequently Asked Questions
            </h1>
            <TipTooltip 
              content="Can't find the answer you're looking for? Feel free to contact us at info@aspirelink.org. We're here to help you understand how our mentorship program works and how you can get involved!"
              side="bottom"
            />
          </div>
          <p className="text-xl" style={{color: '#ffffff'}}>
            Everything you need to know about AspireLink
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl shadow-md border border-gray-100 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-charcoal-custom hover:text-primary-custom">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4" style={{color: '#2F3E46'}}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-light-custom">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-inter font-bold text-3xl text-charcoal-custom mb-6">
            Still Have Questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our team is here to help you learn more about AspireLink and get
            started with the mentorship program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@aspirelink.org"
              className="inline-flex items-center justify-center bg-primary-custom hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Email Us
            </a>
            <a
              href="https://twitter.com/AspireLinkOrg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
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
              Follow Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
