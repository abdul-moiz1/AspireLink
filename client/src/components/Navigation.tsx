import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import logoPath from "@assets/AspireLink-Favicon_1751236188567.png";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page after successful logout
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/students", label: "For Students" },
    { href: "/mentors", label: "For Mentors" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    return location === href || (href !== "/" && location.startsWith(href));
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img 
              src={logoPath} 
              alt="AspireLink Logo"
              className="w-10 h-10 mr-3"
            />
            <span className="font-inter font-bold text-xl text-charcoal-custom">
              AspireLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-primary-custom"
                      : "text-charcoal-custom hover:text-primary-custom"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Authentication Buttons */}
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup/student">
                    <Button size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>



          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? "text-primary-custom"
                          : "text-charcoal-custom hover:text-primary-custom"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Mobile Authentication */}
                  <div className="border-t pt-4 mt-6">
                    {currentUser ? (
                      <div className="space-y-3">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 text-base font-medium text-charcoal-custom hover:text-primary-custom"
                        >
                          Dashboard
                        </Link>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start px-3"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 text-base font-medium text-charcoal-custom hover:text-primary-custom"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/signup/student"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="w-full">
                            Get Started
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
