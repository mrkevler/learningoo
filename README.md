# Learningoo 🦩

## Full-stack Online Course Platform

**Repository:** [mrkevler/learningoo](https://github.com/mrkevler/learningoo)

**Dev Demo - soon** 🌐 [learningoo-dev.netlify.app](https://learningoo-dev.netlify.app)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-5-000000?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![Redux](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)  
![GitHub](https://img.shields.io/github/followers/mrkevler?label=Follow&style=social) ![License](https://img.shields.io/badge/License-MIT-blue)  
![Repo Size](https://img.shields.io/github/repo-size/mrkevler/learningoo) ![Last Commit](https://img.shields.io/github/last-commit/mrkevler/learningoo)
[![Buy Me a Coffee](https://img.shields.io/badge/Support-Buy%20Me%20a%20Coffee-yellow)](https://buymeacoffee.com/mrkevler)

## 🔍 Table of Contents

- [Learningoo 🦩](#learningoo-)
  - [Full-stack Online Course Platform](#full-stack-online-course-platform)
  - [🔍 Table of Contents](#-table-of-contents)
  - [🚀 Project Overview](#-project-overview)
  - [✨ Key Features](#-key-features)
  - [🌟 Architecture](#-architecture)
  - [🛠️ Technologies Used](#️-technologies-used)
    - [Frontend Stack](#frontend-stack)
    - [Backend Stack](#backend-stack)
    - [DevOps \& Tools](#devops--tools)
  - [💻 Core Functionality](#-core-functionality)
    - [User Management](#user-management)
    - [Course Structure](#course-structure)
    - [License Plans](#license-plans)
    - [Content Creation](#content-creation)
  - [🏗️ Project Structure](#️-project-structure)
  - [🚀 Getting Started](#-getting-started)
    - [Preconditions](#preconditions)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Docker Setup](#docker-setup)
      - [💡 Note that you don't need **MongoDB** setup while working with Docker](#-note-that-you-dont-need-mongodb-setup-while-working-with-docker)
  - [🔧 Development](#-development)
    - [Running Locally](#running-locally)
    - [API Endpoints](#api-endpoints)
  - [📱 Frontend Features](#-frontend-features)
  - [🛡️ Security \& Quality Features](#️-security--quality-features)
  - [👨‍💼 Admin Features](#-admin-features)
  - [🎯 Future Enhancements](#-future-enhancements)

---

## 🚀 Project Overview

Learningoo is a modern full-stack online course platform built as a **monorepo** with React 18, Express.js 5, MongoDB 7, and TypeScript 🎓

**Complete Learning Management System** featuring:

- **Course Creation & Management** - Full CRUD operations for courses, chapters, and lessons
- **Rich Content Editor** - Drag-and-drop lesson builder with multiple content blocks
- **Licensing System** - Tiered subscription plans with usage limits
- **Payment System** - Credit-based transactions between users
- **Admin Dashboard** - Complete system management and analytics
- **Multi-role Support** - Students, Tutors, and Administrators

Designed for educators to create, manage and monetize their courses while providing students with an engaging learning experience 🚀

Featuring the iconic Learningoo flamingo 🦩 and modern UI/UX design!

Enjoy teaching and learning! ✌️  
[mrKevler](https://github.com/mrkevler)

---

## ✨ Key Features

**🎓 Learning Management**

- **📚 Course Management** - Complete course creation, editing, and organization
- **📖 Chapter & Lesson System** - Hierarchical content structure
- **🎨 Rich Content Builder** - Drag-and-drop editor with multiple block types
- **📊 Progress Tracking** - Student enrollment and completion tracking
- **🏷️ Category Organization** - Organize courses by categories

**👥 User System**

- **🔐 JWT Authentication** - Secure registration and login system
- **👤 Role-Based Access** - Student, Tutor and Admin roles with specific permissions
- **💳 Credit System** - Built-in payment system using user balance credits
- **📈 Author Profiles** - Dedicated tutor pages with bio and course listings
- **⚖️ Transaction History** - Complete audit trail of all financial activities

**💎 Business Features**

- **📋 Tiered Licensing** - Free, Startup, Advanced and Professional plans
- **💰 Monetization** - Course pricing and revenue sharing
- **📧 Contact System** - CAPTCHA-protected contact forms with rate limiting
- **🛡️ Admin Dashboard** - System overview, user management, and configuration

**🎨 User Experience**

- **🌓 Dark/Light Mode** - Toggle between themes
- **📱 Responsive Design** - Mobile-first approach with modern UI
- **⏱️ Idle Logout** - Auto-logout after 30 minutes of inactivity
- **🚀 Performance** - Optimized with React Query for data fetching
- **🎯 Toast Notifications** - User-friendly feedback system

**🔧 Developer Experience**

- **🐳 Docker Ready** - Complete containerized development environment
- **📦 Monorepo Structure** - Organized frontend/backend/shared packages
- **🔒 Type Safety** - Full TypeScript coverage across the stack
- **🧪 Code Quality** - ESLint, Prettier, and validation throughout

---

## 🌟 Architecture

**Monorepo Structure**

- **Unified Codebase** - Frontend, backend and shared types in single repository
- **Shared Dependencies** - Common packages managed centrally
- **Type Safety** - Shared TypeScript types across the stack
- **Simplified Development** - Single command to run entire application
- **Consistent Tooling** - ESLint, Prettier and TypeScript throughout

**Application Architecture:**

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   React     │────▶│  Express    │────▶│   MongoDB    │
│  Frontend   │◀────│   Backend   │◀────│   Database   │
└─────────────┘     └─────────────┘     └──────────────┘
       │                    │
       │              ┌─────────────┐
       └─────────────▶│   Shared    │
                      │    Types    │
                      └─────────────┘
```

**Key Design Principles:**

- **Unified Codebase** - Frontend, backend and shared types in single repository
- **Type Safety** - Shared TypeScript interfaces across the entire stack
- **Scalable Architecture** - Modular design with clear separation of concerns
- **Modern Tooling** - Latest frameworks and best practices throughout

---

## 🛠️ Technologies Used

### Frontend Stack

| Technology          | Version | Purpose                              |
| ------------------- | ------- | ------------------------------------ |
| **React**           | 18.2.0  | UI library with modern hooks         |
| **TypeScript**      | 5.2.2   | Type safety and developer experience |
| **React Router**    | 6.22.3  | Client-side routing and navigation   |
| **Redux Toolkit**   | 2.1.2   | State management and authentication  |
| **TanStack Query**  | 5.29.3  | Server state management and caching  |
| **React Hook Form** | 7.49.3  | Form handling with validation        |
| **Zod**             | 3.22.4  | Schema validation and type inference |
| **Tailwind CSS**    | 3.4.4   | Utility-first CSS framework          |
| **Vite**            | 7.0.2   | Build tool and development server    |
| **React Helmet**    | -       | SEO and document head management     |

### Backend Stack

| Technology            | Version | Purpose                              |
| --------------------- | ------- | ------------------------------------ |
| **Express.js**        | 5.1.0   | Web application framework            |
| **TypeScript**        | 5.2.2   | Type safety and developer experience |
| **MongoDB**           | 7.x     | NoSQL database for flexibility       |
| **Mongoose**          | 8.16.0  | MongoDB ODM with schema validation   |
| **bcryptjs**          | 2.4.3   | Password hashing and security        |
| **jsonwebtoken**      | 9.0.2   | JWT authentication tokens            |
| **Express Validator** | 7.0.1   | Request validation middleware        |
| **Nodemailer**        | 6.10.1  | Email handling for contact forms     |
| **Helmet**            | 7.0.0   | Security middleware                  |
| **Morgan**            | 1.10.0  | HTTP request logger                  |

### DevOps & Tools

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| **Docker**         | Containerization and deployment |
| **Docker Compose** | Multi-container orchestration   |
| **npm Workspaces** | Monorepo dependency management  |
| **Concurrently**   | Parallel script execution       |
| **ESLint**         | Code linting and quality        |
| **Prettier**       | Code formatting and consistency |
| **ts-node-dev**    | TypeScript development server   |

---

## 💻 Core Functionality

### User Management

**Authentication & Authorization:**

```javascript
// Three distinct user roles with specific permissions
- Student: Browse courses, enroll, track progress
- Tutor: Create courses, manage content, view earnings
- Admin: Full system access, user management, configuration
```

**User Features:**

- Secure JWT-based authentication
- Profile management with author setup
- Balance and credit system ($100 starting credits)
- Transaction history and financial tracking
- Role-based UI and permissions

### Course Structure

**Hierarchical Content Organization:**

```javascript
Course
├── 📋 Metadata (title, description, price, category)
├── 🖼️ Media (cover image, photo gallery)
├── 📧 Email Templates (welcome messages)
├── 📚 Chapters[]
│   ├── 📝 Chapter Info (title, description, cover)
│   └── 📖 Lessons[]
│       ├── 🏷️ Lesson Title
│       └── 🧩 Content Blocks[]
│           ├── 📄 Text/Subtitle blocks
│           ├── 💻 Code blocks with syntax highlighting
│           ├── 🔗 URL links
│           ├── 📺 YouTube video embeds
│           └── 🖼️ Image blocks
└── 👥 Enrollments[] (student progress tracking)
```

### License Plans

| Plan             | Courses   | Chapters     | Lessons       | Price | Features                        |
| ---------------- | --------- | ------------ | ------------- | ----- | ------------------------------- |
| **Free**         | 1         | 3 per course | 2 per chapter | $0    | Basic course creation           |
| **Startup**      | 5         | Unlimited    | Unlimited     | $0\*  | Full content creation tools     |
| **Advanced**     | 10        | Unlimited    | Unlimited     | $0\*  | Advanced features & analytics   |
| **Professional** | Unlimited | Unlimited    | Unlimited     | $0\*  | All features + priority support |

\*Current pricing set to $0 for all plans - customizable in admin dashboard

### Content Creation

**Rich Content Builder:**

- **Drag & Drop Interface** - Intuitive lesson creation
- **Multiple Block Types** - Text, code, media, and interactive elements
- **Real-time Preview** - See changes as you build
- **Version Control** - Track content changes and updates
- **Media Management** - Image uploads and YouTube integration

**Course Management:**

- **CRUD Operations** - Full create, read, update, delete functionality
- **Slug Generation** - SEO-friendly URLs for all courses
- **Category System** - Organize content by topic/subject
- **Publishing Controls** - Draft and publish workflows

---

## 🏗️ Project Structure

```
learningoo/
├── apps/
│   ├── frontend/                              # React 18 Application
│   │   ├── src/
│   │   │   ├── pages/                         # Route Components
│   │   │   │   ├── HomePage.tsx               # Landing page with branding
│   │   │   │   ├── Login.tsx                  # User authentication
│   │   │   │   ├── Register.tsx               # User registration
│   │   │   │   ├── Profile.tsx                # User dashboard & transactions
│   │   │   │   ├── Pricing.tsx                # License plan selection
│   │   │   │   ├── Courses.tsx                # Course catalog with filtering
│   │   │   │   ├── CourseDetail.tsx           # Individual course pages
│   │   │   │   ├── ChapterDetail.tsx          # Chapter overview & lessons
│   │   │   │   ├── LessonDetail.tsx           # Lesson content viewer
│   │   │   │   ├── CreateCourse.tsx           # Course creation wizard
│   │   │   │   ├── EditCourse.tsx             # Course editing interface
│   │   │   │   ├── CreateLesson.tsx           # Drag-drop lesson builder
│   │   │   │   ├── EditLesson.tsx             # Lesson editing interface
│   │   │   │   ├── MyCourses.tsx              # Student/tutor course dashboard
│   │   │   │   ├── AuthorPage.tsx             # Tutor profile pages
│   │   │   │   ├── AuthorSetup.tsx            # Tutor profile configuration
│   │   │   │   ├── AdminDashboard.tsx         # System administration
│   │   │   │   ├── Privacy.tsx                # Privacy policy
│   │   │   │   └── NotFound.tsx               # 404 error page
│   │   │   ├── components/                    # Reusable UI Components
│   │   │   │   ├── Layout.tsx                 # Main app layout
│   │   │   │   ├── Navbar.tsx                 # Navigation with theme toggle
│   │   │   │   ├── Footer.tsx                 # Site footer
│   │   │   │   ├── ContactForm.tsx            # Contact form with CAPTCHA
│   │   │   │   ├── ProtectedRoute.tsx         # Authentication guard
│   │   │   │   ├── AdminRoute.tsx             # Admin authorization guard
│   │   │   │   ├── Toast.tsx                  # Notification system
│   │   │   │   └── Loader.tsx                 # Loading states
│   │   │   ├── store/                         # Redux State Management
│   │   │   │   ├── index.ts                   # Store configuration
│   │   │   │   ├── authSlice.ts               # Authentication state
│   │   │   │   └── uiSlice.ts                 # UI preferences
│   │   │   ├── services/                      # API Integration
│   │   │   │   └── api.ts                     # Axios configuration & endpoints
│   │   │   ├── hooks/                         # Custom React Hooks
│   │   │   │   └── useIdleLogout.ts           # Auto-logout functionality
│   │   │   └── main.tsx                       # App entry point
│   │   ├── public/                            # Static Assets
│   │   │   └── logo/                          # Branding assets
│   │   └── package.json                       # Frontend dependencies
│   │
│   └── backend/                               # Express.js API Server
│       ├── src/
│       │   ├── models/                        # MongoDB Schemas
│       │   │   ├── user.model.ts              # User accounts & authentication
│       │   │   ├── course.model.ts            # Course metadata & structure
│       │   │   ├── chapter.model.ts           # Course chapters
│       │   │   ├── lesson.model.ts            # Lesson content & blocks
│       │   │   ├── category.model.ts          # Course categorization
│       │   │   ├── license.model.ts           # Subscription plans
│       │   │   ├── enrollment.model.ts        # Student-course relationships
│       │   │   ├── transaction.model.ts       # Financial transaction log
│       │   │   └── config.model.ts            # System configuration
│       │   ├── controllers/                   # Request Handlers
│       │   │   ├── auth.controller.ts         # Login/register logic
│       │   │   ├── user.controller.ts         # User CRUD operations
│       │   │   ├── course.controller.ts       # Course management
│       │   │   ├── chapter.controller.ts      # Chapter operations
│       │   │   ├── lesson.controller.ts       # Lesson CRUD & content
│       │   │   ├── category.controller.ts     # Category management
│       │   │   ├── license.controller.ts      # Subscription handling
│       │   │   ├── enrollment.controller.ts   # Course enrollment
│       │   │   ├── transaction.controller.ts  # Payment processing
│       │   │   ├── contact.controller.ts      # Contact form handling
│       │   │   └── admin.controller.ts        # Administrative functions
│       │   ├── routes/                        # API Route Definitions
│       │   │   ├── index.ts                   # Route aggregation
│       │   │   ├── auth.routes.ts             # Authentication endpoints
│       │   │   ├── user.routes.ts             # User endpoints
│       │   │   ├── course.routes.ts           # Course endpoints
│       │   │   ├── chapter.routes.ts          # Chapter endpoints
│       │   │   ├── lesson.routes.ts           # Lesson endpoints
│       │   │   ├── category.routes.ts         # Category endpoints
│       │   │   ├── license.routes.ts          # License endpoints
│       │   │   ├── enrollment.routes.ts       # Enrollment endpoints
│       │   │   ├── transaction.routes.ts      # Transaction endpoints
│       │   │   ├── contact.routes.ts          # Contact form endpoints
│       │   │   └── admin.routes.ts            # Admin-only endpoints
│       │   ├── utils/                         # Helper Functions
│       │   │   ├── asyncHandler.ts            # Error handling wrapper
│       │   │   ├── adminAuth.ts               # Admin authorization
│       │   │   ├── captcha.ts                 # CAPTCHA generation
│       │   │   ├── email.ts                   # Email service integration
│       │   │   ├── rateLimiter.ts             # Rate limiting for forms
│       │   │   └── getConfig.ts               # Configuration management
│       │   ├── config/                        # Configuration
│       │   │   └── db.ts                      # MongoDB connection
│       │   └── index.ts                       # Server entry point
│       └── package.json                       # Backend dependencies
│
├── packages/
│   └── shared/                                # Shared TypeScript Types
│       ├── src/types/
│       │   └── index.ts                       # Common interfaces
│       └── package.json
│
├── docker-compose.yml                         # Multi-container setup
├── Dockerfile                                 # Container configuration
└── package.json                               # Root workspace configuration
```

---

## 🚀 Getting Started

### Preconditions

- **Node.js** 18+ and npm 10+
- **MongoDB** 7+ (or use Docker setup)
- **Docker** and Docker Compose (for containerized development)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/mrkevler/learningoo.git
cd learningoo
```

2. **Install dependencies:**

```bash
# Install all workspace dependencies
npm install
```

### Environment Variables

Create `.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/learningoo

# Authentication
JWT_SECRET=your_most_secret_jwt_key_here

# Frontend URL
CLIENT_URL=http://localhost:5173

# Admin Credentials (customize these!)
L_ADMIN_EMAIL=admin@learningoo.dev
L_ADMIN_KVLR=your_admin_key
L_PASSWORD=your_admin_password

# Email Configuration (for contact forms)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Docker Setup

##### 💡 Note that you don't need **MongoDB** setup while working with Docker

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

**Services will be available at:**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000
- **MongoDB:** mongodb://localhost:27017

---

## 🔧 Development

### Running Locally

**Recommended: Use npm scripts (runs both frontend and backend):**

```bash
# Run both frontend and backend concurrently
npm run dev
```

**Alternative: Run workspaces individually:**

```bash
# Backend only
npm run dev --workspace apps/backend

# Frontend only
npm run dev --workspace apps/frontend
```

**Manual setup (3 terminal windows):**

```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev

# Terminal 3 - MongoDB (if not using Docker)
mongod
```

### API Endpoints

**Authentication:**

```http
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
```

**Core Resources:**

```http
# Users
GET    /api/users             # List all users
GET    /api/users/:id         # Get user by ID
PUT    /api/users/:id         # Update user
DELETE /api/users/:id         # Delete user

# Courses
GET    /api/courses           # List all courses
GET    /api/courses/summary   # Course summaries for catalog
GET    /api/courses/:id       # Get course by ID
GET    /api/courses/slug/:slug# Get course by slug
POST   /api/courses           # Create course
PUT    /api/courses/:id       # Update course
DELETE /api/courses/:id       # Delete course
POST   /api/courses/:id/enroll# Enroll in course

# Chapters
GET    /api/chapters          # List chapters
GET    /api/chapters/:id      # Get chapter with lessons
POST   /api/chapters          # Create chapter
PUT    /api/chapters/:id      # Update chapter
DELETE /api/chapters/:id      # Delete chapter

# Lessons
GET    /api/lessons           # List lessons
GET    /api/lessons/:id       # Get lesson with content blocks
POST   /api/lessons           # Create lesson
PUT    /api/lessons/:id       # Update lesson content
DELETE /api/lessons/:id       # Delete lesson

# Enrollments
GET    /api/enrollments       # List enrollments
POST   /api/enrollments       # Create enrollment
PUT    /api/enrollments/:id   # Update progress
DELETE /api/enrollments/:id   # Remove enrollment

# Categories & Organization
GET    /api/categories        # List course categories
POST   /api/categories        # Create category (admin only)
PUT    /api/categories/:id    # Update category (admin only)
DELETE /api/categories/:id    # Delete category (admin only)

# Licensing System
GET    /api/licenses          # List available plans
POST   /api/licenses/assign   # Assign license to user
PUT    /api/licenses/:id      # Update license (admin only)

# Financial System
GET    /api/transactions      # List user transactions
POST   /api/transactions      # Record transaction

# Contact & Communication
GET    /api/captcha           # Get CAPTCHA challenge
POST   /api/contact           # Submit contact form

# Admin Panel
POST   /api/admin/login       # Admin authentication
GET    /api/admin/users       # User management
GET    /api/admin/overview    # System statistics
GET    /api/admin/config      # System configuration
PUT    /api/admin/config      # Update system settings
PUT    /api/admin/users/:id   # Update user (admin)
```

---

## 📱 Frontend Features

**🏠 Landing & Navigation**

- **Home Page** - Flamingo-branded landing with feature highlights
- **Responsive Navbar** - Theme toggle, user menu, role-based navigation
- **Footer** - Links and branding consistency

**👤 User Experience**

- **Registration/Login** - Form validation with error handling
- **Profile Dashboard** - User info, balance, transaction history
- **Author Setup** - Tutor profile configuration with bio
- **Theme Toggle** - Dark/light mode with localStorage persistence

**📚 Course Interaction**

- **Course Catalog** - Category filtering with responsive grid
- **Course Details** - Rich course pages with enrollment
- **Chapter Navigation** - Organized lesson structure
- **Lesson Viewer** - Rich content rendering with code syntax highlighting
- **Progress Tracking** - Visual progress indicators

**✏️ Content Creation (Tutors)**

- **Course Builder** - Multi-step course creation wizard
- **Chapter Management** - Organize course structure
- **Lesson Editor** - Drag-and-drop content block builder
- **Media Upload** - Image and video integration
- **Publishing Controls** - Draft and publish workflows

**💳 Financial Features**

- **Pricing Page** - Interactive license plan selection
- **Credit System** - Balance display and transaction history
- **Enrollment Flow** - Secure course purchasing with balance deduction

**🛡️ Administrative**

- **Admin Dashboard** - System overview with analytics
- **User Management** - Role assignment and account control
- **System Configuration** - Feature toggles and settings

---

## 🛡️ Security & Quality Features

**🔐 Authentication & Authorization**

- **JWT Tokens** - Secure token generation with 7-day expiry
- **Password Security** - bcrypt hashing with 10 salt rounds
- **Role-Based Access** - Route protection for students, tutors, and admins
- **Protected Routes** - Frontend and backend authorization guards

**🛡️ Security Measures**

- **Input Validation** - Express Validator on all API endpoints
- **Schema Validation** - Zod validation on frontend forms
- **CAPTCHA Protection** - Contact forms with math-based challenges
- **Rate Limiting** - IP-based rate limiting for contact submissions
- **Honeypot Detection** - Spam prevention in contact forms
- **CORS Configuration** - Proper cross-origin resource sharing
- **Helmet Security** - Security headers for Express.js

**💻 Code Quality**

- **TypeScript Coverage** - 100% TypeScript across frontend and backend
- **ESLint Configuration** - Consistent code style and error detection
- **Prettier Formatting** - Automated code formatting
- **Environment Variables** - Secure configuration management
- **Error Handling** - Comprehensive async error handling with try-catch wrappers

**🔍 Monitoring & Logging**

- **Request Logging** - Morgan HTTP request logger
- **Database Indexing** - Optimized MongoDB queries
- **Auto Logout** - 30-minute idle timeout for security

---

## 👨‍💼 Admin Features

**📊 System Overview Dashboard**

- **User Statistics** - Total users, tutors, students breakdown
- **License Distribution** - Plan usage analytics
- **Revenue Tracking** - Transaction summaries by category
- **Top Performers** - Highest earning tutors
- **System Health** - Course and category counts

**👥 User Management**

- **User List** - Searchable table with all user accounts
- **Role Assignment** - Convert students to tutors, assign licenses
- **Account Control** - Activate/deactivate user accounts
- **Balance Management** - Adjust user credit balances
- **Password Reset** - Administrative password updates

**⚙️ System Configuration**

- **Feature Toggles** - Enable/disable registration and login
- **Default Settings** - Set starting credit amounts for new users
- **License Management** - Modify plan pricing and limits
- **Category Management** - Create and organize course categories

**📈 Analytics & Reporting**

- **Transaction Logs** - Complete financial audit trail
- **User Activity** - Registration and login patterns
- **Content Statistics** - Course and lesson creation metrics

**🔧 Content Moderation**

- **Course Overview** - Monitor all published courses
- **User Content** - Review and manage user-generated content
- **Category Organization** - Maintain content taxonomy

---

## 🎯 Future Enhancements

**🔐 Authentication & Security**

- [ ] **OAuth 2.0 Integration** - Google/GitHub social login
- [ ] **Email Verification** - Confirm user email addresses
- [ ] **Two-Factor Authentication** - Enhanced account security
- [ ] **Password Reset Flow** - Self-service password recovery

**📚 Content & Learning**

- [ ] **Rich Text Editor** - Built-in WYSIWYG content editor
- [ ] **Quiz System** - Interactive assessments and knowledge checks
- [ ] **Assignment Submissions** - Student work submission system
- [ ] **Video Hosting** - Native video upload and streaming
- [ ] **PDF Generation** - Course material downloads
- [ ] **Certificates** - Automated completion certificates

**💰 Business Features**

- [ ] **Payment Gateway** - Stripe/PayPal integration
- [ ] **Subscription Billing** - Recurring payment processing
- [ ] **Coupon System** - Discount codes and promotions
- [ ] **Affiliate Program** - Revenue sharing for referrals
- [ ] **Marketplace** - Public course marketplace

**📊 Analytics & Reporting**

- [ ] **Advanced Analytics** - Detailed course performance metrics
- [ ] **Student Progress** - Granular learning analytics
- [ ] **Revenue Reports** - Financial reporting and insights
- [ ] **A/B Testing** - Experimentation framework

**🎨 User Experience**

- [ ] **Mobile Application** - React Native companion app
- [ ] **Offline Support** - Progressive Web App features
- [ ] **Advanced Search** - Full-text search with filters
- [ ] **Recommendation Engine** - Personalized course suggestions
- [ ] **Social Features** - Comments, ratings, and discussions

**🛠️ Technical Improvements**

- [ ] **Microservices** - Service decomposition for scalability
- [ ] **CDN Integration** - Global content delivery
- [ ] **Caching Layer** - Redis for performance optimization
- [ ] **API Documentation** - Swagger/OpenAPI integration
- [ ] **Automated Testing** - Unit and integration test suites

---

**🎯 Learningoo is perfect for:**

- 🎓 **Educational Institutions** - Schools and universities
- 👨‍🏫 **Independent Educators** - Teachers and subject matter experts
- 🏢 **Corporate Training** - Employee development programs
- 💡 **Skill Development** - Professional certification platforms
- 🚀 **Startups** - MVP learning platform development
- 🌍 **Global Education** - International online course delivery

---

**🔗 Quick Links:**

- [Getting Started](#-getting-started) - Set up your development environment
- [API Documentation](#api-endpoints) - Complete API reference
- [Project Structure](#️-project-structure) - Understand the codebase
- [Admin Features](#-admin-features) - System administration guide

---

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FF8000?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://www.buymeacoffee.com/mrkevler)

**🦩 Crafted with passion by [mrKevler](https://github.com/mrkevler)**

_Building the future of online education, one course at a time._
