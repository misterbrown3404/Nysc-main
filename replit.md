# NYSC Camp Cruise & Challenge Hub

## Overview

NYSC Camp Cruise is a social platform designed for Nigerian National Youth Service Corps (NYSC) members to participate in camp challenges, share moments, and compete on a gamified leaderboard. The application features a mobile-first design with Instagram/TikTok-inspired social interactions and Duolingo-style gamification mechanics. Built as a full-stack web application with a 21-day camp countdown timer, the platform enables corps members to upload challenge submissions, give "hype" (likes) to peers, and track rankings based on engagement points.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing (alternative to React Router)
- Mobile-first responsive design optimized for camp sharing experiences

**UI Component System**
- Shadcn UI component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom color system using HSL values for light/dark mode support
- Typography system using Poppins (headers) and Inter (body/UI) from Google Fonts
- Component path aliases configured for clean imports (@/components, @/lib, etc.)

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management and caching
- React Hook Form with Zod validation for form handling
- LocalStorage-based user identity management (no authentication system)
- Optimistic UI updates with manual cache invalidation

**Key Design Patterns**
- Compound component pattern for UI components (Card, Dialog, etc.)
- Custom hooks for reusable logic (use-toast, use-mobile)
- Form validation using Zod schemas shared between client and server
- Mobile-first breakpoint system (768px threshold)

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Development and production build separation (index-dev.ts vs index-prod.ts)
- Middleware for JSON parsing with raw body preservation for webhooks
- Request/response logging with duration tracking for API calls

**API Design**
- RESTful API structure with resource-based endpoints
- Routes for challenges, submissions, hypes, and leaderboard
- Zod schema validation on incoming requests
- In-memory storage implementation (MemStorage) as default data layer
- Interface-based storage abstraction (IStorage) for future database implementations

**Data Layer Abstraction**
- Storage interface pattern allows switching between in-memory and database implementations
- Drizzle ORM configured for PostgreSQL (prepared for future migration)
- Schema definitions using Drizzle's table builders with Zod integration
- Composite key indexing for efficient hype lookup (submissionId:userId)

**Session & Identity Management**
- Client-side user identity stored in localStorage
- No server-side authentication or session management
- User identity created on first submission upload
- Persistent user data tied to submissions and hypes

### Database Schema

**Core Tables** (Drizzle ORM definitions for future PostgreSQL migration)

1. **users**
   - id (UUID primary key)
   - username, state, platoon (text fields)
   - totalHypePoints (integer, default 0)
   - Tracks corps member profiles and gamification scores

2. **challenges**
   - id (UUID primary key)
   - title, description, emoji (text fields)
   - participantCount (integer counter)
   - createdAt (timestamp)
   - Represents available camp challenges

3. **submissions**
   - id (UUID primary key)
   - challengeId, userId (foreign key references)
   - username, state, platoon (denormalized for performance)
   - caption, mediaType, mediaUrl (content fields)
   - hypeCount (cached counter)
   - createdAt (timestamp)
   - Stores user-generated challenge entries

4. **hypes**
   - id (UUID primary key)
   - submissionId, userId (composite uniqueness)
   - createdAt (timestamp)
   - Tracks "likes" from users to submissions

**Data Integrity Considerations**
- Denormalized user data in submissions for read performance
- Cached counters (participantCount, hypeCount) updated via increment operations
- No foreign key constraints enforced in current in-memory implementation
- Schema designed for eventual PostgreSQL migration via Drizzle migrations

### Key Architectural Decisions

**Why In-Memory Storage Initially**
- Rapid prototyping and development without database setup
- IStorage interface allows seamless migration to PostgreSQL later
- Memory storage implements same interface as future database layer
- Current implementation includes all CRUD operations needed

**Why Drizzle ORM**
- Type-safe schema definitions that generate TypeScript types
- Zod integration for runtime validation using same schema
- Migration generation and management built-in
- Better TypeScript experience than Prisma for this use case

**Why LocalStorage for User Identity**
- No authentication requirements in initial scope
- Simplifies onboarding (users create profile on first submission)
- Acceptable for camp duration (21 days of usage)
- Trade-off: Users lose identity if they clear browser data

**Why Mobile-First Design**
- Target audience primarily uses mobile devices at camp
- Bottom navigation pattern optimized for thumb-reach zones
- Elevated upload button for primary action emphasis
- Responsive breakpoints prioritize mobile experience first

**Why Wouter Over React Router**
- Lightweight (~1KB) for mobile performance
- Sufficient for simple page routing needs
- Hook-based API matches React patterns
- No need for advanced routing features (nested routes, loaders)

## External Dependencies

**UI & Styling**
- Tailwind CSS: Utility-first CSS framework for rapid UI development
- Shadcn UI: Accessible component library built on Radix UI primitives
- Radix UI: Unstyled, accessible component primitives (20+ components)
- Class Variance Authority: Utility for managing component variants
- Lucide React: Icon library for consistent iconography

**Data & State Management**
- TanStack Query: Server state synchronization and caching
- React Hook Form: Performant form library with validation
- Zod: TypeScript-first schema validation for forms and API
- Drizzle ORM: Type-safe database toolkit (configured for PostgreSQL)
- Drizzle Zod: Integration between Drizzle schemas and Zod validation

**Backend Services**
- Neon Database Serverless: PostgreSQL driver for serverless environments (configured but not actively used)
- Express: Minimal web framework for Node.js
- Connect-pg-simple: PostgreSQL session store (prepared for future use)

**Development Tools**
- Vite: Next-generation frontend build tool
- TypeScript: Static type checking
- ESBuild: Fast JavaScript bundler for production builds
- TSX: TypeScript execution for development server
- Replit plugins: Runtime error overlay, cartographer, dev banner

**Fonts & Assets**
- Google Fonts API: Poppins and Inter typography
- Date-fns: Date manipulation and formatting library
- Embla Carousel: Carousel component for media galleries

**Build Configuration**
- PostCSS with Autoprefixer for CSS processing
- Separate development and production server entry points
- Static asset serving in production from dist/public directory
- Environment-based configuration (NODE_ENV, DATABASE_URL)