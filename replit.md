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

### Technical Implementations
- **Frontend**: Vite for fast development and optimized builds, Wouter for client-side routing, TanStack React Query for server state management.
- **Backend**: Node.js with Express.js, TypeScript with ESM modules, RESTful API design with JSON responses.
- **Database**: Firebase Firestore for all data storage (migrated from PostgreSQL). No SQL database required.
- **Validation**: Zod for type-safe data handling and robust form validation (e.g., email format, mandatory fields for registration).
- **Storage**: FirestoreStorage implementation with auto-increment counters for numeric IDs.
- **Authentication**: Firebase Authentication for user management, Admin login with hardcoded credentials for program management.
- **Session Management**: Memory-based session store (sessions expire on server restart).

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