import { Link } from "wouter";
import { Users, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal-custom text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-custom rounded-lg flex items-center justify-center mr-3">
                <Users className="text-white text-lg" />
              </div>
              <span className="font-inter font-bold text-xl">AspireLink</span>
            </div>
            <p className="text-gray-100 mb-6">
              Connecting students with experienced professionals through
              meaningful mentorship relationships.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/AspireLinkOrg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-primary-custom rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-primary-custom rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-primary-custom rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-primary-custom rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-inter font-semibold text-lg mb-6">Program</h3>
            <ul className="space-y-3 text-gray-100">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/students"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  For Students
                </Link>
              </li>
              <li>
                <Link
                  href="/mentors"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  For Mentors
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-inter font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-3 text-gray-100">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-inter font-semibold text-lg mb-6">Legal</h3>
            <ul className="space-y-3 text-gray-100">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  Code of Conduct
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-custom transition-colors duration-200"
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-100">
          <p>
            &copy; 2024 AspireLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
