# Learningoo 🦩

## Full-stack Online Course Platform

**Repository:** [mrkevler/learningoo](https://github.com/mrkevler/learningoo)

**Demo** 🌐 [](#)

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
  - [🔐 Security Features](#-security-features)
  - [🎯 Future Enhancements](#-future-enhancements)

---

## 🚀 Project Overview

Learningoo is a modern full-stack online course platform built as a **monorepo** with React 18, Express.js 5, MongoDB 7, and TypeScript 🎓  
Designed for educators to create, manage and monetize their courses while providing students with an engaging learning experience 🚀

Features a flexible licensing system, course management tools and Learningoo flamingo 🦩

Enjoy teaching and learning! ✌️  
[mrKevler](https://github.com/mrkevler)

---

## ✨ Key Features

- **🔐 JWT Authentication** - Secure user registration and login system
- **📚 Course Management** - Create and organize courses with chapters and lessons
- **💎 Tiered Licensing** - Free, Startup, Advanced and Professional plans
- **🎨 Modern UI** - Responsive React 18 frontend with Tailwind CSS
- **🌓 Dark Mode** - Toggle between light and dark themes
- **👥 Role-Based Access** - Student, Tutor and Admin roles
- **📊 Enrollment System** - Track student progress and course completions
- **🏷️ Category Organization** - Organize courses by categories
- **⏱️ Idle Logout** - Auto-logout after 30 minutes of inactivity
- **🐳 Docker Ready** - Complete Docker Compose setup for development
- **📦 Monorepo Structure** - Organized frontend/backend/shared packages

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

---

## 🛠️ Technologies Used

### Frontend Stack

| Technology          | Version | Purpose                      |
| ------------------- | ------- | ---------------------------- |
| **React**           | 18.2.0  | UI library                   |
| **React Router**    | 6.22.3  | Client-side routing          |
| **Redux Toolkit**   | 2.1.2   | State management             |
| **React Query**     | 5.29.3  | Server state management      |
| **Tailwind CSS**    | 3.4.4   | Styling management VoiceOver |
| **Vite**            | 7.0.2   | Build tool and dev server    |
| **TypeScript**      | 5.2.2   | Type safety                  |
| **React Hook Form** | 7.49.3  | Form handling                |
| **Zod**             | 3.22.4  | Schema validation            |

### Backend Stack

| Technology            | Version | Purpose                   |
| --------------------- | ------- | ------------------------- |
| **Express.js**        | 5.1.0   | Web application framework |
| **MongoDB**           | 7.x     | NoSQL database            |
| **Mongoose**          | 8.16.0  | MongoDB ODM               |
| **bcryptjs**          | 2.4.3   | Password hashing          |
| **jsonwebtoken**      | 9.0.2   | JWT authentication        |
| **TypeScript**        | 5.2.2   | Type safety               |
| **Express Validator** | 7.0.1   | Input validation          |

### DevOps & Tools

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| **Docker**         | Containerization              |
| **Docker Compose** | Multi-container orchestration |
| **npm Workspaces** | Monorepo management           |
| **Concurrently**   | Parallel script execution     |
| **ESLint**         | Code linting                  |
| **Prettier**       | Code formatting               |

---

## 💻 Core Functionality

### User Management

```javascript
// User roles
- Student: Can enroll in courses and track progress
- Tutor: Can create courses (with license limits)
- Admin: Full system access
```

```Postman
// Authentication flow
POST /auth/register → Create account → JWT token
POST /auth/login → Verify credentials → JWT token
```

### Course Structure

```javascript
Course
  ├── Title, Description, Price
  ├── Category
  ├── Chapters[]
  │     ├── Title, Description
  │     └── Lessons[]
  │           ├── Title
  │           └── Content Blocks[]
  └── Enrollments[]
```

### License Plans

| Plan             | Courses   | Chapters     | Lessons       | Features              |
| ---------------- | --------- | ------------ | ------------- | --------------------- |
| **Free**         | 1         | 3 per course | 2 per chapter | Basic features        |
| **Startup**      | 5         | Unlimited    | Unlimited     | Full content creation |
| **Advanced**     | 10        | Unlimited    | Unlimited     | Advanced features     |
| **Professional** | Unlimited | Unlimited    | Unlimited     | All features          |

---

## 🏗️ Project Structure

```
learningoo/
├── apps/
│   ├── frontend/                 # React application
│   │   ├── src/
│   │   │   ├── pages/            # Page components
│   │   │   │   ├── HomePage.tsx  # Landing page
│   │   │   │   ├── Login.tsx     # Login page
│   │   │   │   ├── Register.tsx  # Registration
│   │   │   │   ├── Profile.tsx   # User profile
│   │   │   │   ├── Pricing.tsx   # License plans
│   │   │   │   └── Tutorials.tsx # Course listing
│   │   │   ├── components/       # Reusable components
│   │   │   ├── store/            # Redux store
│   │   │   ├── services/         # API services
│   │   │   └── hooks/            # Custom hooks
│   │   └── public/               # Static assets
│   │
│   └── backend/                  # Express application
│       ├── src/
│       │   ├── models/           # Mongoose schemas
│       │   │   ├── user.model.ts
│       │   │   ├── course.model.ts
│       │   │   ├── chapter.model.ts
│       │   │   ├── lesson.model.ts
│       │   │   └── license.model.ts
│       │   ├── controllers/      # Route handlers
│       │   ├── routes/           # API routes
│       │   ├── config/           # Configuration
│       │   └── utils/            # Helper functions
│       └── package.json
│
├── packages/
│   └── shared/                   # Shared types
│       ├── src/types/            # TypeScript interfaces
│       └── package.json
│
├── docker-compose.yml            # Docker orchestration
├── Dockerfile                    # Container config
└── package.json                  # Root package.json
```

---

## 🚀 Getting Started

### Preconditions

- **Node.js** 18+ and npm 10+
- **MongoDB** 7+
- **Docker** and Docker Compose

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
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/learningoo

# JWT
JWT_SECRET=your_most_secret_jwt_key

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### Docker Setup

##### 💡 Note that you don't need **MongoDB** setup while working with Docker

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

**Services will be available at:**

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- MongoDB: mongodb://localhost:27017

---

## 🔧 Development

### Running Locally

**With npm scripts:**

```bash
# Run both frontend and backend
npm run dev

# Run specific workspace
npm run dev --workspace apps/backend
npm run dev --workspace apps/frontend
```

**Manual setup:**

```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev

# Terminal 3 - MongoDB
mongod
```

### API Endpoints

**Authentication Routes:**

```
POST   /api/auth/register    # User registration
POST   /api/auth/login       # User login
```

**Resource Routes:**

```
GET    /api/users           # List users
GET    /api/courses         # List courses
GET    /api/categories      # List categories
GET    /api/licenses        # List license plans
POST   /api/licenses/assign # Assign license to user

# CRUD operations available for:
- /api/users/:id
- /api/courses/:id
- /api/chapters/:id
- /api/lessons/:id
- /api/enrollments/:id
```

---

## 📱 Frontend Features

- **🏠 Home Page** - Landing page with flamingo branding
- **📝 Registration** - User signup with validation
- **🔐 Login Page** - JWT authentication
- **👤 Profile Page** - User dashboard with license info
- **💎 Pricing Page** - Interactive license selection
- **📚 Tutorials Page** - Browse courses by category
- **🌓 Theme Toggle** - Dark/light mode switch
- **📱 Responsive Design** - Mobile-first approach
- **⚡ Fast Navigation** - Client-side routing
- **🔄 State Management** - Redux Toolkit + React Query

---

## 🔐 Security Features

- **Password Security** - bcrypt hashing with salt rounds
- **JWT Tokens** - Secure token generation and validation
- **Protected Routes** - Frontend and backend route protection
- **Input Validation** - Express validator on backend
- **Schema Validation** - Zod validation on frontend
- **Auto Logout** - 30-minute idle timeout
- **Environment Variables** - Sensitive data protection
- **CORS Configuration** - Cross-origin resource sharing

---

## 🎯 Future Enhancements

- [ ] **OAuth 2.0 integration** - Google/GitHub login
- [ ] **Email verification** - Confirm user emails
- [ ] **Text editor** - Built-in rich text editor
- [ ] **Quiz system** - Interactive assessments
- [ ] **Certificates** - Course completion certificates
- [ ] **Analytics dashboard** - Detailed course analytics
- [ ] **Mobile app** - React Native companion app to put

---

**Learningo can be used for:**

- 🎓 **Educational Institutions**
- 👨‍🏫 **Independent Educators**
- 🏢 **Corporate Training**
- 💡 **Skill Development Platforms**

---

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FF8000?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://www.buymeacoffee.com/mrkevler)

Crafted with ♥ by [mrKevler](https://github.com/mrkevler)
