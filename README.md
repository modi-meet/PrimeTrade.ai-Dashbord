# PrimeTrade - Task Management

A modern, scalable task management app with React frontend and Node.js backend.

## Tech Stack

**Frontend**: React 19, TypeScript, Vite, TailwindCSS  
**Backend**: Node.js, Express, MongoDB, JWT

## Features

- 🔐 JWT Authentication (Register/Login)
- ✅ Task CRUD with Optimistic Updates
- 🔍 Search & Filter
- 📱 Responsive Mobile Design
- 🧩 Modular Component Architecture

## Architecture

```
client/
├── src/
│   ├── hooks/          # Custom hooks (useTasks, useToast, useAuth)
│   ├── components/     # Reusable UI (Header, Stats, TaskList, etc.)
│   ├── pages/          # Page components (Dashboard, Login, Register)
│   ├── contexts/       # React contexts (AuthContext)
│   └── api/            # Axios instance & interceptors
server/
├── src/
│   ├── controllers/    # Route handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── middleware/     # Auth middleware
│   └── config/         # Database config
```

## Quick Start

```bash
# Backend
cd server && npm install
cp .env.example .env  # Configure MONGO_URI, JWT_SECRET
npm run dev

# Frontend
cd client && npm install
npm run dev
```

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=your_secret_key
```

## API Docs

See [API_DOCS.md](./API_DOCS.md)

## License

MIT
