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
- June 29, 2025. Fixed UI/UX issues: improved button hover states, updated hero image to professional business meeting, enhanced For Students page readability with white text on colored backgrounds, replaced testimonials with program features, improved footer text contrast from gray-300/400 to gray-200

## User Preferences

Preferred communication style: Simple, everyday language.