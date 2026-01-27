# HealioAI

A full-stack healthcare AI platform with a modern web interface and scalable backend API.

## 📋 Overview

HealioAI is a comprehensive healthcare platform designed to provide AI-powered healthcare services, queue management, and patient care solutions. The project consists of two main components:

- **Backend API** (`healioaibackend`): Production-ready Node.js/TypeScript backend following modular monolith architecture
- **Web Application** (`healioAIweb`): Modern React-based frontend with Material-UI

## 🏗️ Architecture

### Backend (Modular Monolith)
- **Single deployable application** with feature-based modules
- **Strict module boundaries** - modules only expose public interfaces
- **Clean architecture layers**: Controllers → Services → Repositories → Models
- **Type-safe** with TypeScript strict mode

### Frontend
- **React 19** with modern hooks and functional components
- **Material-UI** for consistent, accessible design
- **Component-based architecture** with feature folders
- **Vite** for fast development and optimized builds

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd healioaibackend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root of `healioaibackend`:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/healioai
LOG_LEVEL=info
API_PREFIX=/api
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000/api`

API Documentation (Swagger): `http://localhost:3000/api-docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd healioAIweb
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm run preview
```

The web application will be available at `http://localhost:5173` (or the port shown in terminal)

## 📁 Project Structure

### Backend Structure

```
healioaibackend/
├── src/
│   ├── common/                    # Shared utilities and infrastructure
│   │   ├── config/               # Environment configuration
│   │   ├── db/                   # Database connection
│   │   ├── logger/               # Winston logger setup
│   │   ├── constants/            # Global constants
│   │   ├── errors/               # Error handling (AppError, codes, middleware)
│   │   ├── middlewares/          # Auth, role, and other middlewares
│   │   ├── validation/           # Joi validation utilities
│   │   ├── pagination/           # Reusable pagination logic
│   │   ├── swagger/              # OpenAPI/Swagger configuration
│   │   └── repository/           # Base repository pattern
│   │
│   ├── modules/                   # Feature modules
│   │   └── users/                # User module (example)
│   │       ├── index.ts          # Module public interface
│   │       ├── user.controller.ts # HTTP request handling
│   │       ├── user.service.ts   # Business logic
│   │       ├── user.repository.ts # Database operations
│   │       ├── user.model.ts     # Mongoose schema
│   │       ├── user.validation.ts # Joi validation schemas
│   │       └── user.routes.ts    # Route definitions
│   │
│   ├── routes.ts                  # Global route registration
│   └── main.ts                    # Application entry point
│
├── .env                           # Environment variables
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

### Frontend Structure

```
healioAIweb/
├── src/
│   ├── components/               # React components by feature
│   │   ├── navbar/              # Navigation components
│   │   ├── hero/                # Hero section with image slider
│   │   ├── features/            # Features showcase
│   │   ├── pricing/             # Pricing plans
│   │   ├── queuePriority/       # Queue management features
│   │   ├── faq/                 # FAQ section
│   │   ├── contact/             # Contact form
│   │   ├── newsletter/          # Newsletter subscription
│   │   └── footer/              # Footer components
│   │
│   ├── assets/                   # Static assets (images, icons)
│   ├── App.jsx                   # Root application component
│   └── main.jsx                  # Application entry point
│
├── public/                        # Public static files
├── index.html                     # HTML template
├── vite.config.js                # Vite configuration
└── package.json                   # Dependencies and scripts
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI 3
- **Logging**: Winston
- **Development**: ts-node-dev (hot reload)

### Frontend
- **Library**: React 19
- **Build Tool**: Vite 7
- **UI Framework**: Material-UI (MUI) 7
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Material Icons
- **Carousel**: Swiper
- **Linting**: ESLint

## 🔑 Key Features

### Backend API
- ✅ Modular monolith architecture with strict boundaries
- ✅ Type-safe TypeScript with strict mode
- ✅ Base repository pattern for consistent data access
- ✅ Global error handling with custom error codes
- ✅ Request validation with Joi
- ✅ Structured logging with Winston
- ✅ Auto-generated API documentation (Swagger)
- ✅ Authentication and role-based middleware
- ✅ Reusable pagination utilities
- ✅ MongoDB connection with health checks

### Frontend
- ✅ Modern, responsive healthcare UI
- ✅ Feature showcase with cards
- ✅ Pricing plans with family add-ons
- ✅ Queue priority management
- ✅ FAQ with accordion
- ✅ Contact form with validation
- ✅ Newsletter subscription
- ✅ Scroll spy navigation
- ✅ Image slider with Swiper
- ✅ Material Design components

## 📝 API Documentation

Once the backend is running, visit `http://localhost:3000/api-docs` to view the interactive Swagger documentation.

### Available Endpoints

#### Health Check
```
GET /api/health
```
Returns server status and timestamp.

#### Users Module
```
GET    /api/users       # List all users (with pagination)
GET    /api/users/:id   # Get user by ID
POST   /api/users       # Create new user
PATCH  /api/users/:id   # Update user
DELETE /api/users/:id   # Delete user
```

## 🔒 Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/healioai` |
| `LOG_LEVEL` | Winston log level | `info` |
| `API_PREFIX` | API route prefix | `/api` |

## 🧪 Development

### Backend Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production build
npm run lint     # Run ESLint
```

### Frontend Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📦 Module Development Guide

### Adding a New Backend Module

1. Create module folder: `src/modules/your-module/`
2. Create required files:
   - `index.ts` - Public interface exports
   - `your-module.controller.ts` - HTTP handlers
   - `your-module.service.ts` - Business logic
   - `your-module.repository.ts` - Database access
   - `your-module.model.ts` - Mongoose schema
   - `your-module.validation.ts` - Joi schemas
   - `your-module.routes.ts` - Express routes

3. Register routes in `src/routes.ts`:
```typescript
import { yourModuleRoutes } from './modules/your-module';
router.use('/your-module', yourModuleRoutes);
```

### Module Rules
- ❌ Never import internal files from other modules
- ✅ Only import from module's `index.ts`
- ✅ Keep all business logic in services
- ✅ Keep all database access in repositories
- ✅ Controllers only handle HTTP requests/responses

## 🏛️ Architecture Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Inversion**: Depend on interfaces, not implementations
3. **Module Independence**: Modules communicate through public interfaces
4. **Type Safety**: Strict TypeScript with no `any` types
5. **Error Handling**: Centralized error handling with custom error classes
6. **Validation**: Input validation at module boundaries
7. **Logging**: Structured logging for observability

## 📊 Project Status

This is a **production-ready template** with:
- ✅ Complete backend architecture
- ✅ Full frontend UI implementation
- ✅ Example user module
- ✅ Authentication middleware (ready for implementation)
- ✅ Role-based access control (ready for implementation)
- ✅ API documentation
- ✅ Error handling
- ✅ Logging system

## 🤝 Contributing

When contributing to this project:

1. Follow the existing folder structure exactly
2. Maintain TypeScript strict mode compliance
3. Add Swagger documentation for new endpoints
4. Include validation schemas for all inputs
5. Write clean, readable code with proper error handling
6. Test all endpoints before committing

For questions or issues:
- Backend API: Check `/api-docs` for endpoint documentation
- Frontend: Review component structure in `src/components/`

---

**Built with ❤️ for better healthcare**
