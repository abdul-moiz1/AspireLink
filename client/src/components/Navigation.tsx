import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, LayoutDashboard, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoPath from "@assets/AspireLink-Favicon_1751236188567.png";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

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

  const getDashboardLink = () => {
    const userRole = user?.role;
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'mentor') return '/dashboard/mentor';
    if (userRole === 'student') return '/dashboard/student';
    return '/dashboard/student';
  };

  const getEditApplicationLink = () => {
    const userRole = user?.role;
    if (userRole === 'mentor') return '/dashboard/mentor';
    if (userRole === 'student') return '/dashboard/student';
    return null;
  };

  const getUserDisplayName = () => {
    const userData = user as any;
    if (userData?.fullName) return userData.fullName;
    if (userData?.firstName && userData?.lastName) return `${userData.firstName} ${userData.lastName}`;
    if (userData?.firstName) return userData.firstName;
    const userRole = userData?.role;
    if (userRole === 'admin') return 'Admin';
    if (userRole === 'mentor') return 'Mentor';
    if (userRole === 'student') return 'Student';
    return 'Account';
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
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
            <div className="ml-10 flex items-baseline space-x-8">
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
            </div>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    {(user as any)?.profileImageUrl ? (
                      <img 
                        src={(user as any).profileImageUrl} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-custom flex items-center justify-center text-white">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {getUserDisplayName()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="flex items-center cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {getEditApplicationLink() && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href={getEditApplicationLink()!} className="flex items-center cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Application
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-primary-custom hover:bg-primary-dark">
                <Link href="/signin">Log in</Link>
              </Button>
            )}
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
                  
                  {/* Mobile Auth */}
                  <div className="border-t pt-4 mt-4">
                    {isLoading ? (
                      <div className="px-3 py-2">
                        <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ) : isAuthenticated ? (
                      <>
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          {getUserDisplayName()}
                        </div>
                        <Link
                          href={getDashboardLink()}
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 text-base font-medium text-charcoal-custom hover:text-primary-custom"
                        >
                          <LayoutDashboard className="w-4 h-4 inline mr-2" />
                          Dashboard
                        </Link>
                        {getEditApplicationLink() && (
                          <Link
                            href={getEditApplicationLink()!}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-charcoal-custom hover:text-primary-custom"
                          >
                            <Edit className="w-4 h-4 inline mr-2" />
                            Edit Application
                          </Link>
                        )}
                        <button
                          onClick={() => { handleLogout(); setIsOpen(false); }}
                          className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700"
                        >
                          <LogOut className="w-4 h-4 inline mr-2" />
                          Log out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/signin"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 text-base font-medium text-primary-custom hover:text-primary-dark"
                      >
                        Log in
                      </Link>
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
