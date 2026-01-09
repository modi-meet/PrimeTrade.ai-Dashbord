# PrimeTrade Development Setup

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure environment variables:**
   - Copy `.env.example` files in both `server` and `client` directories to `.env`
   - Update the values as needed (MongoDB URI, JWT secret, etc.)

3. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running locally on port 27017
   # Or update MONGO_URI in server/.env with your MongoDB connection string
   ```

4. **Run development servers:**
   ```bash
   npm run dev
   ```
   This will start both:
   - Server: http://localhost:5000
   - Client: http://localhost:5173

## Available Scripts

### Root Level
- `npm run dev` - Start both client and server in development mode
- `npm run dev:server` - Start only the server
- `npm run dev:client` - Start only the client
- `npm run build` - Build both client and server
- `npm run install:all` - Install dependencies for root, server, and client

### Server (cd server)
- `npm run dev` - Start server with nodemon (auto-reload)
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Client (cd client)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/primetrade
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## CORS Configuration

The server is configured to accept requests from the client at `http://localhost:5173` with credentials support. This can be changed via the `CLIENT_URL` environment variable.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, React Router
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose
- **Auth:** JWT with bcryptjs
