# AspireLink - Mentorship Platform

## Overview

AspireLink is a full-stack web application that connects students with experienced professionals through a structured 4-month mentorship program. The platform features a modern React frontend with TypeScript, Express.js backend, and is designed for easy deployment with both development and production environments.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API**: RESTful API design with JSON responses
- **Middleware**: Request logging, JSON parsing, and error handling
- **Storage**: Pluggable storage interface with in-memory implementation

### Database Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Centralized schema definitions in `/shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations
- **Connection**: Neon Database serverless PostgreSQL (via environment variable)

## Key Components

### Shared Schema (`/shared/schema.ts`)
- User management with username/password authentication
- Contact form submissions with timestamps
- Zod validation schemas for type-safe data handling
- Drizzle table definitions for PostgreSQL

### Storage Layer (`/server/storage.ts`)
- Abstract `IStorage` interface for data operations
- `MemStorage` implementation for development/testing
- CRUD operations for users and contacts
- Designed for easy swapping to database-backed storage

### Frontend Pages
- **Home**: Landing page with hero section and feature highlights
- **About**: Company information and mission statement
- **For Students**: Student application information and eligibility
- **For Mentors**: Mentor recruitment and benefits
- **FAQ**: Frequently asked questions with collapsible sections
- **Contact**: Contact form with validation and submission handling

### UI System
- shadcn/ui components for consistent design
- Custom color palette with primary, secondary, and accent colors
- Responsive design with mobile-first approach
- Dark mode support through CSS variables

## Data Flow

### Contact Form Submission
1. User fills out contact form on frontend
2. Form data validated using Zod schema
3. POST request to `/api/contact` endpoint
4. Server validates data and stores via storage interface
5. Success/error response sent back to client
6. Toast notification displayed to user

### Page Navigation
1. User clicks navigation links
2. Wouter handles client-side routing
3. Components render with React Query for data fetching
4. UI updates without full page reload

## External Dependencies

### Production Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Libraries**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Backend**: Express.js, Drizzle ORM, Neon Database client
- **Validation**: Zod for runtime type checking
- **Utilities**: date-fns, clsx for conditional classes

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full TypeScript support across stack
- **Development**: tsx for running TypeScript directly

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- tsx for running TypeScript backend directly
- In-memory storage for rapid development
- Replit-specific plugins for enhanced development experience

### Production Build
1. Vite builds optimized frontend bundle to `/dist/public`
2. esbuild bundles backend code to `/dist/index.js`
3. Single Node.js process serves both API and static files
4. Environment variables configure database connection

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required for production)
- `NODE_ENV`: Environment mode (development/production)

### Scaling Considerations
- Stateless backend design allows horizontal scaling
- Database connection pooling through Neon serverless
- CDN-ready static asset generation
- Session storage can be moved to external store (Redis/PostgreSQL)

## Changelog

Changelog:
- June 29, 2025. Initial setup
- June 29, 2025. Fixed UI/UX issues: improved button hover states, updated hero image to professional business meeting, enhanced For Students page readability with white text on colored backgrounds, replaced testimonials with program features, improved footer text contrast using inline styles with white color, fixed "Become a Mentor" button hover text disappearing issue using JavaScript event handlers
- June 29, 2025. Comprehensive text contrast improvements: replaced all gray text with high-contrast charcoal color (#2F3E46) across all pages, fixed "Learn More" buttons on For Students and For Mentors pages with proper contrast using inline styles and event handlers, corrected "Follow Us" button on FAQ page for optimal visibility
- June 29, 2025. Enhanced FAQ page with orange gradient hero background (#F18F01 to #c47301) and white text for visual consistency with other pages
- June 29, 2025. Added gradient hero backgrounds to About page (blue #2E86AB to #1e5b7a) and Contact page (magenta #A23B72 to #7d2d5a) with white text for complete visual consistency across all pages
- June 29, 2025. Made each page hero banner unique: About page updated to purple gradient (#6366f1 to #4338ca), Contact page changed to green gradient (#10b981 to #047857) ensuring all six pages have distinct color schemes
- June 29, 2025. Added navigation functionality to application buttons: "Apply Now", "Start Application", "Become a Mentor", and "Apply to Mentor" buttons now direct users to Contact page for program inquiries
- June 29, 2025. Updated About page statistics to show accurate program features (4-month duration, 100% free, 1:1 matching, 24/7 support) instead of unverified performance metrics
- June 29, 2025. Removed contact form from Contact page, simplified to show only direct contact information (info@aspirelink.org and LinkedIn @AspireLinkOrg) with clean professional layout
- June 29, 2025. Updated Home page hero image to custom AspireLink branded graphic with handshake logo on graduation cap and "Connecting ambition with experience" tagline
- June 29, 2025. Added semi-transparent white background to 'Connect. Learn. Aspire.' hero panel for better contrast with branded image
- June 29, 2025. Restructured hero section with equal-sized panels in parent container: text panel with blue gradient background, image panel with gray gradient background, both contained within semi-transparent white parent panel
- June 29, 2025. Removed 'Mentor Impact' section from For Mentors page since no mentor impact data exists yet for founding cohort
- June 30, 2025. Added comprehensive Mentor Registration feature at /register-mentor route with manual professional data entry, database schema, API endpoints, and multi-step form ensuring data integrity by collecting authentic user information. Form validated and working with PostgreSQL storage.
- June 30, 2025. Updated all mentor application buttons to link to registration form: "Become a Mentor" buttons on Home page (both hero and CTA sections) and For Mentors page, plus "Apply to Mentor" button on For Mentors page now direct users to /register-mentor route for streamlined registration process.
- June 30, 2025. Added comprehensive Student Registration feature at /register-student route with 4-step multi-step form: Basic Information (name, email, university, academic program, year of study), Nomination Verification (professor name and email), Mentorship Matching preferences (career interests, industry preferences, topics, goals), and Consent & Confirmation. Includes database schema, API endpoints, form validation, and navigation updates linking all student application buttons.
- June 30, 2025. Enhanced student registration with confirmation screen displaying success message and next steps after form submission. Updated Home page "Apply as Student" button to link directly to registration form. Removed "Register as Mentor" button from navigation header to streamline user experience.
- June 30, 2025. Simplified student registration form validation to require only Full Name and Email address fields. All other fields (university, academic program, year of study, professor nomination) are now optional. Updated University name placeholder text to "Name of University" and removed contact support button from confirmation screen.
- June 30, 2025. Updated student registration form validation: Step 1 requires only Full Name and Email, Steps 2-3 require all fields (professor nomination, career interests, industry preferences, mentoring topics, mentorship goals). Added FAQ button to registration success screen alongside Return to Home button.
- June 30, 2025. Removed contact support button from all steps of student registration form to streamline the user experience and reduce unnecessary navigation away from the registration process.
- June 30, 2025. Added email format validation to all email address fields in student registration form. Both student email and professor email fields now validate proper email format using regex pattern before allowing form progression.
- June 30, 2025. Added optional LinkedIn URL field to mentor registration form step 1. Field includes URL input type and helpful placeholder text to assist with professional profile verification.
- June 30, 2025. Updated mentor registration form validation: Made Current Job Title field mandatory in step 1, changed location placeholder to "City, Province", and made agreement and consent checkboxes mandatory in step 2 with proper validation error messages.
- June 30, 2025. Enhanced mentor registration step 2 validation: Made "Preferred Student Disciplines" and "Mentoring Topics" fields mandatory with selection validation and updated field labels and descriptions to reflect required status.
- June 30, 2025. Made "Availability" field mandatory in mentor registration step 2 with validation requiring at least one time slot selection and updated field label and description to reflect required status.
- June 30, 2025. Updated student registration form for better mentor matching: replaced "Preferred Mentor Industry" with "Academic Disciplines" field matching mentor registration structure, converted "Mentoring Topics" from textarea to selection interface matching mentor options, updated database schema to use arrays for both fields enabling precise mentor-student matching based on shared disciplines and topics.
- June 30, 2025. Created comprehensive admin dashboard system: implemented admin login page with hardcoded credentials (program.admin@aspirelink.org / @sp1reLink), built admin dashboard with overview statistics, student/mentor management with search/filter capabilities, activate/deactivate functionality, delete records, and assignment management. Added admin routes to backend with authentication and CRUD operations for managing the mentorship program.
- June 30, 2025. Implemented full admin creation and editing functionality: added Create Student, Create Mentor, and Create Assignment forms with comprehensive field validation, built Edit Student and Edit Mentor pages with full CRUD operations, connected all admin dashboard buttons to functional routes, added backend API endpoints for individual record fetching and updating, completed storage layer with update/delete methods for both DatabaseStorage and MemStorage implementations.
- June 30, 2025. Enhanced UI/UX across platform: replaced empty colored circles with relevant icons (FileText, UserCheck, Users, Trophy, Calendar, Target) on For Students and For Mentors process steps, removed all "AI-powered" references replacing with "Smart matching" for more accurate representation, updated admin login to use generic placeholder text instead of revealing credentials.
- June 30, 2025. Created comprehensive legal and policy framework: added Privacy Policy page with data collection/usage guidelines, Terms of Service with participant responsibilities and program rules, Code of Conduct with professional standards and reporting procedures, Accessibility page with WCAG compliance and accommodation details. All pages include proper routing and footer links for easy access.
- June 30, 2025. Implemented advanced bulk assignment management: added multi-select checkboxes for individual assignments, "Select All" functionality, bulk delete operations with confirmation dialogs, bulk activate/deactivate buttons, clean bulk actions interface with selection counts, and backend API endpoint for efficient bulk operations.
- June 29, 2025. Integrated custom AspireLink logo (handshake design) into navigation header and updated favicon, added SEO meta tags with proper title and description
- June 29, 2025. Added professional student collaboration image to For Students page with accurate founding cohort messaging instead of false success statistics
- July 1, 2025. Fixed all icon display issues on Home page by replacing problematic lucide-react imports with emoji characters: process steps now show 📄 (nomination), 👥 (matching), 📅 (sessions), 🏆 (recognition), and features show 🎯 (personalized matching), 📈 (structured program), 🌟 (industry networks)
- July 1, 2025. Corrected FAQ answer about program funding to accurately reflect that AspireLink is entirely volunteer-based, not funded by university partnerships or sponsors
- July 1, 2025. Cleaned up contact information across all policy pages: removed fictional Toronto addresses from Privacy Policy, Terms of Service, and Accessibility pages; removed phone numbers from Code of Conduct and Accessibility pages; all pages now only show appropriate email contact information
- July 1, 2025. Updated Accessibility page to show accurate Web Accessibility Standards (WCAG 2.1 Level AA, semantic HTML, keyboard navigation) and realistic Supported Technologies (screen readers, browser tools, high contrast) removing unverified compliance claims
- July 1, 2025. Removed "Common Accommodations" section from Accessibility page to simplify content and focus on verified capabilities
- July 1, 2025. Removed "Sign language interpretation upon request" from Program Accommodations section as this service is not available for volunteer-based program
- July 4, 2025. Implemented complete Replit Auth integration with role-based authentication system: fixed useAuth hook to properly fetch user data, updated Dashboard to show different content for completed vs incomplete registrations, enhanced authentication callback logic to distinguish between registration flows and general login, added student registration form pre-population with authenticated user name and email data
- July 4, 2025. Successfully implemented and tested role switching functionality enabling users to change roles (student/mentor) with same email address: added role intent caching system with email-based fallback to preserve role switching during OpenID Connect authentication flow, enhanced upsert logic to prioritize role intent over existing roles, added comprehensive logging for authentication debugging, created role switching API endpoint and Dashboard UI component with real-time updates, confirmed working with live user testing showing successful role change from student to mentor

## User Preferences

Preferred communication style: Simple, everyday language.