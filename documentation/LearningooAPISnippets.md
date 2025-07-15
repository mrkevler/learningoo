# Learningoo API Snippets

## Usage Guide

This document provides practical examples for interacting with the Learningoo API. Each example includes both cURL commands for terminal usage and Postman request configurations.

### Prerequisites

- API Base URL: `http://localhost:4000/api` (development) or your production URL
- JWT Token: Obtained after login/registration (required for authenticated endpoints)
- Content-Type: All requests use `application/json`

### Authentication Header Format

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Response Format

All API responses follow this structure:

- Success: `{ "data": {...}, "message": "Success message" }`
- Error: `{ "message": "Error description", "errors": [...] }`

---

## 1. Authentication

### Register New User

**cURL:**

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/auth/register",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
}
```

### Login

**cURL:**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/auth/login",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "email": "john@example.com",
    "password": "securepassword123"
  }
}
```

### Admin Login

**cURL:**

```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@learningoo.dev",
    "kvlr": "your_admin_key",
    "password": "admin_password"
  }'
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/admin/login",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "email": "admin@learningoo.dev",
    "kvlr": "your_admin_key",
    "password": "admin_password"
  }
}
```

---

## 2. User Management

### Get User Profile

**cURL:**

```bash
curl -X GET http://localhost:4000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/users/{{userId}}",
  "headers": {
    "Authorization": "Bearer {{token}}"
  }
}
```

### Update User Profile

**cURL:**

```bash
curl -X PUT http://localhost:4000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "authorName": "Professor John",
    "authorBio": "Experienced educator with 10 years in online teaching",
    "authorWebsite": "https://johndoe.com"
  }'
```

**Postman:**

```json
{
  "method": "PUT",
  "url": "{{baseUrl}}/users/{{userId}}",
  "headers": {
    "Authorization": "Bearer {{token}}",
    "Content-Type": "application/json"
  },
  "body": {
    "name": "John Updated",
    "authorName": "Professor John",
    "authorBio": "Experienced educator with 10 years in online teaching",
    "authorWebsite": "https://johndoe.com"
  }
}
```

---

## 3. Course Management

### Create a Course

**cURL:**

```bash
curl -X POST http://localhost:4000/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete JavaScript Mastery",
    "description": "Learn JavaScript from basics to advanced concepts",
    "price": 49.99,
    "category": "CATEGORY_ID",
    "coverImage": "https://example.com/js-course-cover.jpg",
    "photos": ["https://example.com/js-1.jpg", "https://example.com/js-2.jpg"],
    "welcomeEmail": {
      "subject": "Welcome to JavaScript Mastery!",
      "body": "Thank you for enrolling in our JavaScript course..."
    }
  }'
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/courses",
  "headers": {
    "Authorization": "Bearer {{token}}",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "Complete JavaScript Mastery",
    "description": "Learn JavaScript from basics to advanced concepts",
    "price": 49.99,
    "category": "{{categoryId}}",
    "coverImage": "https://example.com/js-course-cover.jpg",
    "photos": ["https://example.com/js-1.jpg", "https://example.com/js-2.jpg"],
    "welcomeEmail": {
      "subject": "Welcome to JavaScript Mastery!",
      "body": "Thank you for enrolling in our JavaScript course..."
    }
  }
}
```

### Get All Courses

**cURL:**

```bash
curl -X GET http://localhost:4000/api/courses
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/courses"
}
```

### Get Courses by Category

**cURL:**

```bash
curl -X GET "http://localhost:4000/api/courses?category=CATEGORY_ID"
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/courses",
  "params": {
    "category": "{{categoryId}}"
  }
}
```

### Get Course by Slug

**cURL:**

```bash
curl -X GET http://localhost:4000/api/courses/slug/complete-javascript-mastery
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/courses/slug/complete-javascript-mastery"
}
```

### Update Course

**cURL:**

```bash
curl -X PUT http://localhost:4000/api/courses/COURSE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete JavaScript Mastery 2024",
    "description": "Updated with latest ES2024 features",
    "price": 59.99
  }'
```

**Postman:**

```json
{
  "method": "PUT",
  "url": "{{baseUrl}}/courses/{{courseId}}",
  "headers": {
    "Authorization": "Bearer {{token}}",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "Complete JavaScript Mastery 2024",
    "description": "Updated with latest ES2024 features",
    "price": 59.99
  }
}
```

### Enroll in Course

**cURL:**

```bash
curl -X POST http://localhost:4000/api/courses/COURSE_ID/enroll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/courses/{{courseId}}/enroll",
  "headers": {
    "Authorization": "Bearer {{token}}"
  }
}
```

---

## 4. Chapter Management

### Create Chapter

**cURL:**

```bash
curl -X POST http://localhost:4000/api/chapters \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to JavaScript",
    "description": "Getting started with JavaScript programming",
    "course": "COURSE_ID",
    "coverImage": "https://example.com/chapter1-cover.jpg",
    "order": 1
  }'
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/chapters",
  "headers": {
    "Authorization": "Bearer {{token}}",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "Introduction to JavaScript",
    "description": "Getting started with JavaScript programming",
    "course": "{{courseId}}",
    "coverImage": "https://example.com/chapter1-cover.jpg",
    "order": 1
  }
}
```

### Get Chapter with Lessons

**cURL:**

```bash
curl -X GET http://localhost:4000/api/chapters/CHAPTER_ID
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/chapters/{{chapterId}}"
}
```

---

## 5. Lesson Management

### Create Lesson with Content Blocks

**cURL:**

```bash
curl -X POST http://localhost:4000/api/lessons \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Variables and Data Types",
    "chapter": "CHAPTER_ID",
    "order": 1,
    "contentBlocks": [
      {
        "type": "subtitle",
        "content": "Understanding Variables",
        "order": 1
      },
      {
        "type": "text",
        "content": "Variables are containers for storing data values...",
        "order": 2
      },
      {
        "type": "code",
        "content": "let message = \"Hello World\";\nconst PI = 3.14159;\nvar count = 0;",
        "language": "javascript",
        "order": 3
      },
      {
        "type": "youtube",
        "content": "https://www.youtube.com/watch?v=EXAMPLE",
        "order": 4
      },
      {
        "type": "image",
        "content": "https://example.com/variables-diagram.png",
        "order": 5
      }
    ]
  }'
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/lessons",
  "headers": {
    "Authorization": "Bearer {{token}}",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "Variables and Data Types",
    "chapter": "{{chapterId}}",
    "order": 1,
    "contentBlocks": [
      {
        "type": "subtitle",
        "content": "Understanding Variables",
        "order": 1
      },
      {
        "type": "text",
        "content": "Variables are containers for storing data values...",
        "order": 2
      },
      {
        "type": "code",
        "content": "let message = \"Hello World\";\nconst PI = 3.14159;\nvar count = 0;",
        "language": "javascript",
        "order": 3
      },
      {
        "type": "youtube",
        "content": "https://www.youtube.com/watch?v=EXAMPLE",
        "order": 4
      },
      {
        "type": "image",
        "content": "https://example.com/variables-diagram.png",
        "order": 5
      }
    ]
  }
}
```

### Update Lesson Content

**cURL:**

```bash
curl -X PUT http://localhost:4000/api/lessons/LESSON_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Variables and Data Types - Updated",
    "contentBlocks": [
      {
        "type": "text",
        "content": "Updated content about variables...",
        "order": 1
      }
    ]
  }'
```

**Postman:**

```json
{
  "method": "PUT",
  "url": "{{baseUrl}}/lessons/{{lessonId}}",
  "headers": {
    "Authorization": "Bearer {{token}}",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "Variables and Data Types - Updated",
    "contentBlocks": [
      {
        "type": "text",
        "content": "Updated content about variables...",
        "order": 1
      }
    ]
  }
}
```

---

## 6. Category Management

### Create Category (Admin Only)

**cURL:**

```bash
curl -X POST http://localhost:4000/api/categories \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Development",
    "description": "Courses related to web development technologies"
  }'
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/categories",
  "headers": {
    "Authorization": "Bearer {{adminToken}}",
    "Content-Type": "application/json"
  },
  "body": {
    "name": "Web Development",
    "description": "Courses related to web development technologies"
  }
}
```

### Get All Categories

**cURL:**

```bash
curl -X GET http://localhost:4000/api/categories
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/categories"
}
```

---

## 7. Enrollment Management

### Get User Enrollments

**cURL:**

```bash
curl -X GET http://localhost:4000/api/enrollments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/enrollments",
  "headers": {
    "Authorization": "Bearer {{token}}"
  }
}
```

### Update Lesson Progress

**cURL:**

```bash
curl -X PUT http://localhost:4000/api/enrollments/ENROLLMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completedLessonId": "LESSON_ID"
  }'
```

**Postman:**

```json
{
  "method": "PUT",
  "url": "{{baseUrl}}/enrollments/{{enrollmentId}}",
  "headers": {
    "Authorization": "Bearer {{token}}",
    "Content-Type": "application/json"
  },
  "body": {
    "completedLessonId": "{{lessonId}}"
  }
}
```

---

## 8. Transaction Management

### Get User Transactions

**cURL:**

```bash
curl -X GET http://localhost:4000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/transactions",
  "headers": {
    "Authorization": "Bearer {{token}}"
  }
}
```

### Record Transaction (System Use)

**cURL:**

```bash
curl -X POST http://localhost:4000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "debit",
    "amount": 49.99,
    "description": "Course purchase: JavaScript Mastery",
    "relatedCourse": "COURSE_ID"
  }'
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/transactions",
  "headers": {
    "Authorization": "Bearer {{token}}",
    "Content-Type": "application/json"
  },
  "body": {
    "type": "debit",
    "amount": 49.99,
    "description": "Course purchase: JavaScript Mastery",
    "relatedCourse": "{{courseId}}"
  }
}
```

---

## 9. License Management

### Get Available License Plans

**cURL:**

```bash
curl -X GET http://localhost:4000/api/licenses
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/licenses"
}
```

### Assign License to User

**cURL:**

```bash
curl -X POST http://localhost:4000/api/licenses/assign \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "licenseId": "LICENSE_ID"
  }'
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/licenses/assign",
  "headers": {
    "Authorization": "Bearer {{token}}",
    "Content-Type": "application/json"
  },
  "body": {
    "userId": "{{userId}}",
    "licenseId": "{{licenseId}}"
  }
}
```

---

## 10. Contact Form

### Get CAPTCHA Challenge

**cURL:**

```bash
curl -X GET http://localhost:4000/api/captcha
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/captcha"
}
```

### Submit Contact Form

**cURL:**

```bash
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I have a question about course enrollment...",
    "captchaId": "CAPTCHA_ID",
    "captchaAnswer": "42",
    "honeypot": ""
  }'
```

**Postman:**

```json
{
  "method": "POST",
  "url": "{{baseUrl}}/contact",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I have a question about course enrollment...",
    "captchaId": "{{captchaId}}",
    "captchaAnswer": "42",
    "honeypot": ""
  }
}
```

---

## 11. Admin Operations

### Get System Overview

**cURL:**

```bash
curl -X GET http://localhost:4000/api/admin/overview \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/admin/overview",
  "headers": {
    "Authorization": "Bearer {{adminToken}}"
  }
}
```

### Get All Users (Admin)

**cURL:**

```bash
curl -X GET http://localhost:4000/api/admin/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Postman:**

```json
{
  "method": "GET",
  "url": "{{baseUrl}}/admin/users",
  "headers": {
    "Authorization": "Bearer {{adminToken}}"
  }
}
```

### Update User as Admin

**cURL:**

```bash
curl -X PUT http://localhost:4000/api/admin/users/USER_ID \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "tutor",
    "balance": 200,
    "isActive": true
  }'
```

**Postman:**

```json
{
  "method": "PUT",
  "url": "{{baseUrl}}/admin/users/{{userId}}",
  "headers": {
    "Authorization": "Bearer {{adminToken}}",
    "Content-Type": "application/json"
  },
  "body": {
    "role": "tutor",
    "balance": 200,
    "isActive": true
  }
}
```

### Update System Configuration

**cURL:**

```bash
curl -X PUT http://localhost:4000/api/admin/config \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "registrationEnabled": true,
    "loginEnabled": true,
    "defaultUserCredits": 100
  }'
```

**Postman:**

```json
{
  "method": "PUT",
  "url": "{{baseUrl}}/admin/config",
  "headers": {
    "Authorization": "Bearer {{adminToken}}",
    "Content-Type": "application/json"
  },
  "body": {
    "registrationEnabled": true,
    "loginEnabled": true,
    "defaultUserCredits": 100
  }
}
```

---

## Complete Workflow Examples

### 1. Course Creation Workflow

```bash
# Step 1: Login as tutor
TOKEN=$(curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tutor@example.com", "password": "password123"}' \
  | jq -r '.token')

# Step 2: Create course
COURSE_ID=$(curl -X POST http://localhost:4000/api/courses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Mastery",
    "description": "Complete React course",
    "price": 79.99,
    "category": "CATEGORY_ID"
  }' | jq -r '.data._id')

# Step 3: Create chapter
CHAPTER_ID=$(curl -X POST http://localhost:4000/api/chapters \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Basics",
    "course": "'$COURSE_ID'",
    "order": 1
  }' | jq -r '.data._id')

# Step 4: Create lesson
curl -X POST http://localhost:4000/api/lessons \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to React",
    "chapter": "'$CHAPTER_ID'",
    "order": 1,
    "contentBlocks": [
      {
        "type": "text",
        "content": "Welcome to React!",
        "order": 1
      }
    ]
  }'
```

### 2. Student Enrollment Workflow

```bash
# Step 1: Login as student
TOKEN=$(curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student@example.com", "password": "password123"}' \
  | jq -r '.token')

# Step 2: Browse courses
curl -X GET http://localhost:4000/api/courses

# Step 3: Enroll in course
curl -X POST http://localhost:4000/api/courses/COURSE_ID/enroll \
  -H "Authorization: Bearer $TOKEN"

# Step 4: Get enrolled courses
curl -X GET http://localhost:4000/api/enrollments \
  -H "Authorization: Bearer $TOKEN"
```

---

## Postman Environment Variables

Create a Postman environment with these variables:

```json
{
  "baseUrl": "http://localhost:4000/api",
  "token": "",
  "adminToken": "",
  "userId": "",
  "courseId": "",
  "chapterId": "",
  "lessonId": "",
  "categoryId": "",
  "enrollmentId": "",
  "licenseId": "",
  "captchaId": ""
}
```

## Error Handling

All endpoints return standardized error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

Common HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error
