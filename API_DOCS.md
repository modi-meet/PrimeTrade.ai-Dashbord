# PrimeTrade API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```
POST /auth/register
```
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Response (201):**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "token": "string"
}
```

### Login User
```
POST /auth/login
```
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response (200):**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "token": "string"
}
```

### Get Profile (Protected)
```
GET /auth/profile
```
**Response (200):**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string"
}
```

---

## Task Endpoints (All Protected)

### Get All Tasks
```
GET /tasks
```
**Response (200):**
```json
[
  {
    "_id": "string",
    "user": "string",
    "title": "string",
    "description": "string",
    "isCompleted": "boolean",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### Create Task
```
POST /tasks
```
**Body:**
```json
{
  "title": "string",
  "description": "string (optional)"
}
```
**Response (201):** Task object

### Get Task by ID
```
GET /tasks/:id
```
**Response (200):** Task object

### Update Task
```
PUT /tasks/:id
```
**Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "isCompleted": "boolean (optional)"
}
```
**Response (200):** Updated task object

### Delete Task
```
DELETE /tasks/:id
```
**Response (200):**
```json
{
  "message": "Task removed"
}
```

---

## Error Responses
```json
{
  "message": "Error description"
}
```
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
