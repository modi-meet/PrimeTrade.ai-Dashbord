# PrimeTrade.AI - Task Management

A **production-ready**, **modular** React + Node.js task management app with professional UI patterns.

---

## Frontend Highlights

| Feature | What it demonstrates |
|---------|---------------------|
|  **Custom Hooks** | `useTasks`, `useToast`, `useAuth` - Clean separation of concerns |
|  **Modular Components** | `Header`, `Stats`, `TaskList` - Reusable, testable UI blocks |
|  **Optimistic Updates** | Instant UI feedback before API confirmation |
|  **TailwindCSS Design System** | Consistent styling with component classes |
| 📱 **Mobile-First Responsive** | Hamburger menu, adaptive layouts, touch-friendly |
| 🔄 **Loading States** | Skeleton loaders, spinners, smooth transitions |
|  **Accessibility** | Focus states, ARIA labels, keyboard navigation (⌘K search) |
| **Toast Notifications** | Success/error feedback with auto-dismiss |
| 🔐 **JWT Auth Context** | Token management with axios interceptors |

---

## 🛠 Tech Stack

**Frontend:** React 19 • TypeScript • Vite • TailwindCSS  
**Backend:** Node.js • Express • MongoDB • JWT

## 📁 Architecture

```
client/src/
├── hooks/        → useTasks, useToast, useAuth
├── components/   → Header, Stats, TaskList, Toast, Skeleton
├── pages/        → Dashboard, Login, Register
├── contexts/     → AuthContext
└── api/          → Axios with interceptors
```

## Quick Start

```bash
# Backend
cd server && npm install && npm run dev
# load mongo_URI , JWT_SECRET in .env file


# Frontend  
cd client && npm install && npm run dev
```

## 📄 Docs

- [API Documentation](./API_DOCS.md)
- [Scalability Notes](./SCALABILITY.md)

---

**MIT License** • Built with ❤️
