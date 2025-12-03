# AspireLink - Mentorship Platform

## Overview
AspireLink is a full-stack web application facilitating a 4-month mentorship program between students and experienced professionals. The platform's core purpose is to connect ambition with experience, offering a structured program that is entirely volunteer-based. Key capabilities include comprehensive student and mentor registration, an admin dashboard for managing the mentorship program, and robust user management. The vision is to empower the next generation by providing accessible, high-quality mentorship.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
- **Framework**: React 18 with TypeScript.
- **UI Components**: shadcn/ui library built on Radix UI primitives.
- **Styling**: Tailwind CSS with custom design tokens, responsive and mobile-first.
- **Theming**: Dark mode support via CSS variables, custom color palette with distinct gradients for hero sections across pages (e.g., About, Contact, FAQ) for visual consistency and branding.
- **Iconography**: Use of Lucide React icons (e.g., FileText, UserCheck, Calendar, Award) with solid colored backgrounds for process steps and features, replacing previous emoji or numbered circles for better consistency and readability.
- **Branding**: Custom AspireLink logo and favicon, consistent professional imagery, and accurate program messaging across the site.
- **Accessibility**: Focus on high-contrast text (charcoal color for all text), WCAG 2.1 Level AA compliance, semantic HTML, and keyboard navigation support.
- **Animations**: Global hover animations (hover-lift, hover-scale, hover-glow, card-hover) and keyframe animations (fadeInUp, fadeIn, slideInLeft, pulse-soft) for smooth, polished interactions throughout the app.
- **Data Visualization**: Professional charts using recharts library (AreaChart, PieChart, BarChart, RadialBarChart) with animated stat cards for engaging dashboard experiences.
- **Color Theme**: Blue-based accent color scheme (hsl 202) for better contrast and theme consistency across light/dark modes.

### Technical Implementations
- **Frontend**: Vite for fast development and optimized builds, Wouter for client-side routing, TanStack React Query for server state management.
- **Backend**: Node.js with Express.js, TypeScript with ESM modules, RESTful API design with JSON responses.
- **Database**: Firebase Firestore for all data storage (migrated from PostgreSQL). No SQL database required.
- **Validation**: Zod for type-safe data handling and robust form validation (e.g., email format, mandatory fields for registration).
- **Storage**: FirestoreStorage implementation with auto-increment counters for numeric IDs.
- **Authentication**: Firebase Authentication for user management, Admin login with hardcoded credentials for program management.
- **Session Management**: Memory-based session store (sessions expire on server restart).
- **Registration-First Flow**: 
    - Users fill out student or mentor registration forms WITHOUT needing to create an account first.
    - Registration data is stored in separate Firestore collections: `studentRegistration` and `mentorRegistration`.
    - After form submission, users are prompted to create an account to access their dashboard.
    - On signup, the system checks for existing registrations matching the user's email.
    - If a matching registration is found, it's automatically linked to the new account and the user is assigned the appropriate role.
    - Users who sign up without a prior registration are redirected to `/complete-profile` to choose their role and fill out the appropriate form.
    - A global RoleGuard ensures users without roles cannot access protected areas of the app.

## App Flow Summary

### User Journeys

**Student Journey:**
1. Visit `/students` page to learn about the program
2. Click "Apply as Student" to go to `/register-student`
3. Fill out the 3-step registration form (Personal Info, Academic Details, Preferences)
4. After submission, prompted to create account at `/signup`
5. After signup, automatically assigned "student" role and redirected to `/dashboard/student`

**Mentor Journey:**
1. Visit `/mentors` page to learn about becoming a mentor
2. Click "Become a Mentor" to go to `/register-mentor`
3. Fill out the 2-step registration form (Professional Info, Mentorship Preferences)
4. After submission, prompted to create account at `/signup`
5. After signup, automatically assigned "mentor" role and redirected to `/dashboard/mentor`

**Admin Journey:**
1. Sign in at `/signin` with admin credentials
2. Access `/admin/dashboard` to manage the platform
3. Can create cohorts, assign mentors to students, view all registrations

### Pages Overview

**Public Pages (no login required):**
- `/` - Home page with program overview
- `/about` - About AspireLink
- `/students` - Information for prospective students
- `/mentors` - Information for prospective mentors
- `/faq` - Frequently asked questions
- `/contact` - Contact information

**Registration Pages (no login required):**
- `/register-student` - Student application form
- `/register-mentor` - Mentor application form

**Auth Pages:**
- `/signin` - Login for existing users
- `/signup` - Create new account
- `/complete-profile` - For users who signed up without registering first

**Dashboard Pages (login required):**
- `/dashboard/student` - Student dashboard
- `/dashboard/mentor` - Mentor dashboard
- `/admin/dashboard` - Admin dashboard
- `/admin/cohorts` - Cohort management
- `/admin/create-student` - Create student manually
- `/admin/create-mentor` - Create mentor manually
- `/admin/create-assignment` - Assign mentor to student

**Policy Pages:**
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/conduct` - Code of conduct
- `/accessibility` - Accessibility statement
    
### Firestore Collections

**Active Collections (used by the app):**
- **users**: Stores user accounts with linked profile data and roles (student/mentor/admin).
- **studentRegistration**: Pending student applications with status tracking (pending/linked).
- **mentorRegistration**: Pending mentor applications with status tracking (pending/linked).
- **cohorts**: Mentorship cohort data.
- **assignments**: Mentor-student pairings within cohorts. Cohort membership is derived from assignments.
- **mentoringSessions**: Scheduled sessions between mentors and students.
- **contacts**: Contact form submissions.
- **counters**: Auto-increment ID counters for numeric IDs.

**Orphaned Collections (CAN BE DELETED from Firebase Console):**
- **adminUsers**: Not used in code - admins are stored in `users` with `role: 'admin'`
- **mentorRegistrations** (with 's'): Duplicate collection name - app uses `mentorRegistration` (no 's')
- **cohortMembers**: No longer needed - membership is now derived from assignments automatically

### Feature Specifications
- **Mentorship Program**: Structured 4-month program, 100% free, 1:1 matching, 24/7 support.
- **Registration**:
    - **Student Registration**: Multi-step form for basic information, nomination verification, mentorship matching preferences (academic disciplines, career interests, mentoring topics, goals), and consent. Includes mandatory fields (Full Name, Email, LinkedIn URL, Phone Number, University, Academic Program, Year of Study) and email format validation.
    - **Mentor Registration**: Multi-step form for professional data entry including mandatory fields (Full Name, Current Job Title, Company, Location, Phone Number, LinkedIn URL), preferred student disciplines, mentoring topics, and availability.
- **Admin Dashboard**: Comprehensive system for managing students, mentors, and assignments. Includes overview statistics, search/filter capabilities, activate/deactivate, delete records, and bulk assignment management.
- **Legal & Policy**: Dedicated pages for Privacy Policy, Terms of Service, Code of Conduct, and Accessibility, with clear guidelines and footer links.
- **Contact Management**: Contact form submission handling (for legacy system) and clear contact information for AspireLink (email, LinkedIn).

### System Design Choices
- **Development Environment**: Vite dev server for frontend with HMR, tsx for backend, in-memory storage for rapid development.
- **Production Environment**: Optimized frontend bundle, bundled backend code, single Node.js process serving API and static files.
- **Scalability**: Stateless backend design, database connection pooling, CDN-ready static assets.
- **Modularity**: Shared schema, abstract storage layer, component-based UI.

## External Dependencies

-   **React Ecosystem**: React, React DOM, React Query.
-   **UI Libraries**: Radix UI primitives, shadcn/ui, Lucide React icons.
-   **Styling**: Tailwind CSS, class-variance-authority.
-   **Backend**: Express.js, Firebase Admin SDK.
-   **Firebase**: firebase, firebase-admin (for authentication and Firestore database).
-   **Validation**: Zod.
-   **Utilities**: date-fns, clsx.
-   **Build Tools**: Vite, esbuild, tsx.
-   **Language**: TypeScript.