# PrimeTrade - Task Management Application

A modern, scalable web application with authentication and dashboard features.

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- TailwindCSS
- React Router DOM
- React Hook Form
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

## Features

- ✅ User Registration & Login (JWT)
- ✅ Protected Dashboard Routes
- ✅ Task CRUD Operations
- ✅ Search & Filter
- ✅ Responsive Design
- ✅ Form Validation (Client + Server)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd server
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/primetrade
# JWT_SECRET=your_secret_key
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## API Documentation
See [API_DOCS.md](./API_DOCS.md)

## Scalability
See [SCALABILITY.md](./SCALABILITY.md)

## License
MIT
