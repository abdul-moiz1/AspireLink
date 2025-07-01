import { Link } from "wouter";
import { Users, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-16" style={{backgroundColor: '#2F3E46', color: '#ffffff'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-custom rounded-lg flex items-center justify-center mr-3">
                <Users className="text-white text-lg" />
              </div>
              <span className="font-inter font-bold text-xl">AspireLink</span>
            </div>
            <p className="mb-6" style={{color: '#ffffff'}}>
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
            <ul className="space-y-3" style={{color: '#ffffff'}}>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/students"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  For Students
                </Link>
              </li>
              <li>
                <Link
                  href="/mentors"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  For Mentors
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-inter font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-3" style={{color: '#ffffff'}}>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-inter font-semibold text-lg mb-6">Legal</h3>
            <ul className="space-y-3" style={{color: '#ffffff'}}>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/conduct"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  Code of Conduct
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="hover:text-primary-custom transition-colors duration-200"
                  style={{color: '#ffffff'}}
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p style={{color: '#ffffff'}}>
            &copy; 2024 AspireLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
