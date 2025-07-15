# Learningoo API – Admin & General Usage Guide

## Overview

This guide provides practical examples and explanations for using the Learningoo API. For a full, formal reference, see the [OpenAPI specification](./openapi.yaml).

---

## Environment & Setup

- **Base URL (development):** `http://localhost:4000/api`
- **Base URL (production):** `https://api.learningoo.com/api`
- **Get a dev token:** Register/login via `/auth/register` or `/auth/login` to receive a JWT.
- **Authentication:** Most endpoints require a Bearer token in the `Authorization` header.

---

## Authentication

### User Login

```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "********"
}
```

**Response:**

```json
{
  "token": "<JWT>",
  "user": { "_id": "...", "name": "...", ... }
}
```

**Use the token:**

```
Authorization: Bearer <token>
```

### Admin Login

```bash
POST /admin/login
{
  "email": "$L_ADMIN_EMAIL",
  "password": "$L_PASSWORD"
}
```

Or with secret key:

```bash
{
  "key": "$L_ADMIN_KVLR",
  "password": "$L_PASSWORD"
}
```

**Response:**

```json
{
  "token": "<JWT>",
  "user": { "_id": "...", "role": "admin", ... }
}
```

---

## Role-based Access

- **Public routes:** Open for anyone.
- **Authenticated routes:** Require JWT (students, tutors, admins).
- **Admin-only routes:** Require `role: "admin"` in JWT. Non-admins get 403 Forbidden.

---

## Common Error Responses

| Status | Meaning          | Example Response                  |
| ------ | ---------------- | --------------------------------- |
| 401    | Unauthorized     | `{ "error": "Invalid token" }`    |
| 403    | Forbidden        | `{ "error": "Not allowed" }`      |
| 404    | Not Found        | `{ "error": "Not found" }`        |
| 422    | Validation Error | `{ "error": "Missing field..." }` |

---

## Endpoint Quick Reference

| Method | Endpoint            | Description            | Auth       |
| ------ | ------------------- | ---------------------- | ---------- |
| POST   | /auth/login         | User login             | No         |
| POST   | /auth/register      | User registration      | No         |
| GET    | /courses            | List all courses       | No         |
| GET    | /courses/:id        | Get course details     | No         |
| POST   | /courses            | Create new course      | User/Tutor |
| POST   | /enrollments        | Enroll in a course     | User       |
| GET    | /enrollments        | List user enrollments  | User       |
| POST   | /admin/login        | Obtain admin JWT       | No         |
| GET    | /admin/summary      | Quick counts overview  | Admin      |
| GET    | /admin/users        | List every user        | Admin      |
| GET    | /admin/transactions | List every transaction | Admin      |
| POST   | /categories         | Create new category    | Admin      |
| POST   | /licenses/assign    | Assign license to user | Admin      |

---

## Example Usage

### Register a New User

```bash
curl -X POST http://localhost:4000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
```

**Response:**

```json
{
  "token": "<JWT>",
  "user": { "_id": "...", "name": "Alice", ... }
}
```

### Login as User

```bash
curl -X POST http://localhost:4000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email":"alice@example.com","password":"secret123"}'
```

**Response:**

```json
{
  "token": "<JWT>",
  "user": { "_id": "...", "name": "Alice", ... }
}
```

### List All Courses

```bash
curl http://localhost:4000/api/courses
```

**Response:**

```json
[
  { "_id": "...", "title": "Course 1", ... },
  { "_id": "...", "title": "Course 2", ... }
]
```

### Get Course Details

```bash
curl http://localhost:4000/api/courses/<courseId>
```

**Response:**

```json
{
  "_id": "...",
  "title": "Course 1",
  "description": "...",
  ...
}
```

### Enroll in a Course

```bash
curl -X POST http://localhost:4000/api/enrollments \
 -H "Authorization: Bearer $TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"courseId":"..."}'
```

**Response:**

```json
{
  "_id": "...",
  "user": "...",
  "course": "...",
  ...
}
```

### Create Category (Admin)

```bash
curl -X POST http://localhost:4000/api/categories \
 -H "Authorization: Bearer $ADMIN_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"name":"Productivity"}'
```

**Response:**

```json
{
  "_id": "...",
  "name": "Productivity",
  ...
}
```

### Get All Users (Admin)

```bash
curl http://localhost:4000/api/admin/users \
 -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response:**

```json
[
  { "_id": "...", "name": "Alice", ... },
  { "_id": "...", "name": "Bob", ... }
]
```

### Fetch Transactions (Admin)

```bash
curl http://localhost:4000/api/admin/transactions \
 -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response:**

```json
[
  { "_id": "...", "amount": 10, ... },
  { "_id": "...", "amount": 20, ... }
]
```

---

## Parameters & Request Details

- **Path parameters:** Indicated as `:param` or `<param>` in endpoints (e.g., `/courses/:id`).
- **Query parameters:** Add to URL after `?` (e.g., `/courses?category=math`).
- **Body parameters:** Sent as JSON in POST/PUT requests.

---

## More Information

- For a full, up-to-date API reference, see the [OpenAPI spec](./openapi.yaml).
