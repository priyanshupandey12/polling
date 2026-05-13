# 🗳️ PollPulse — Full-Stack Poll Platform

> Create polls, share links, collect responses, and view real-time analytics.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Features](#features)
- [WebSocket Events](#websocket-events)
- [Database Schema](#database-schema)

---

## Overview

PollPulse is a full-stack polling platform where users can:

- Create polls with multiple single-choice questions
- Share polls via public links
- Collect responses anonymously or from authenticated users
- View real-time analytics dashboard
- Publish final results publicly

---

## Tech Stack

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express 5 | Server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| Socket.io | Real-time WebSockets |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Zod | Validation |
| cookie-parser | Cookie handling |

### Frontend
| Tech | Purpose |
|------|---------|
| React + Vite | UI Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Router v6 | Routing |
| Axios | HTTP client |
| Zustand | State management |
| Socket.io-client | WebSocket client |

---

## Project Structure

```
pollpulse/
├── server/                        # Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts              # MongoDB connection
│   │   │   ├── env.ts             # Environment variables
│   │   ├── controller/
│   │   │   ├── auth.controller.ts
│   │   │   ├── poll.controller.ts
│   │   │   ├── question.controller.ts
│   │   │   ├── response.controller.ts
│   │   │   └── analytics.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── optionalAuth.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── poll.model.ts
│   │   │   ├── question.model.ts
│   │   │   └── response.model.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── poll.routes.ts
│   │   │   ├── question.routes.ts
│   │   │   ├── response.routes.ts
│   │   │   └── analytics.routes.ts
│   │   ├── services/
│   │   │   ├── auth.services.ts
│   │   │   ├── poll.services.ts
│   │   │   └── response.services.ts
│   │   ├── types/
│   │   ├── utils/
│   │   │   ├── error.ts           # ApiError class
│   │   │   └── jwt.ts             # Token utilities
|   |   |    └── response.ts
|   |   |    └── socket.ts               
│   │   └── index.ts               # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── client/                        # Frontend
    ├── src/
    │   ├── lib/
    │   │   ├── axios.ts           # Axios instance
    │   │   └── socket.ts          # Socket.io instance
    │   ├── store/
    │   │   └── auth.store.ts      # Zustand store
    │   ├── services/
    │   │   ├── auth.service.ts
    │   │   ├── poll.service.ts
    │   │   ├── question.service.ts
    │   │   ├── response.service.ts
    │   │   └── analytics.service.ts
    │   ├── routes/
    │   │   ├── ProtectedRoute.tsx
    │   │   └── PublicRoute.tsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.tsx
    │   │   │   └── Register.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── CreatePoll.tsx
    │   │   ├── PollPage.tsx
    │   │   ├── PollDetail.tsx
    │   │   ├── Analytics.tsx
    │   │   └── NotFound.tsx
    │   ├── hooks/
    │   │   └── useSocket.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- pnpm (recommended)

```bash
npm install -g pnpm
```

---

### Backend Setup

```bash
# 1. Server folder mein jao
cd server

# 2. Dependencies install karo
pnpm install

# 3. .env file banao
cp .env.example .env

# 4. .env fill karo (dekho Environment Variables section)

# 5. Development server start karo
pnpm dev
```

---

### Frontend Setup

```bash
# 1. Client folder mein jao
cd client

# 2. Dependencies install karo
pnpm install

# 3. .env file banao
cp .env.example .env

# 4. Development server start karo
pnpm dev
```

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/pollpulse
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## API Reference

### Auth Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| POST | `/api/auth/logout` | ❌ | Logout user |
| POST | `/api/auth/refresh-token` | ❌ | Refresh access token |
| GET | `/api/auth/me` | ✅ | Get current user |

#### Register Request Body
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Poll Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/polls` | ✅ | Create new poll |
| GET | `/api/polls` | ✅ | Get creator's polls |
| GET | `/api/polls/:pollId` | Optional | Get poll by ID (public) |
| GET | `/api/polls/:pollId/detail` | ✅ | Get poll detail with questions |
| PATCH | `/api/polls/:pollId/publish` | ✅ | Publish poll results |

#### Create Poll Request Body
```json
{
  "title": "Favourite Framework?",
  "desc": "Optional description",
  "isAnonymous": true,
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

---

### Question Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/questions/:pollId` | ✅ | Add question to poll |

#### Add Question Request Body
```json
{
  "questionText": "Which framework do you prefer?",
  "isRequired": true,
  "options": ["React", "Vue", "Angular", "Svelte"]
}
```

---

### Response Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/responses/:pollId` | Optional | Submit poll response |

#### Submit Response Request Body
```json
{
  "answers": [
    {
      "questionId": "64abc123...",
      "selectedOption": "React"
    }
  ]
}
```

---

### Analytics Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/:pollId` | ✅ | Get poll analytics |

#### Analytics Response
```json
{
  "success": true,
  "data": {
    "pollId": "64abc123...",
    "title": "Favourite Framework?",
    "status": "active",
    "totalResponses": 42,
    "participation": {
      "authenticated": 20,
      "anonymous": 22
    },
    "questions": [
      {
        "questionId": "64def456...",
        "questionText": "Which framework do you prefer?",
        "isRequired": true,
        "totalAnswered": 42,
        "optionCounts": {
          "React": 20,
          "Vue": 10,
          "Angular": 8,
          "Svelte": 4
        }
      }
    ]
  }
}
```

---

## Features

### Authentication
- Cookie-based JWT authentication (accessToken + refreshToken)
- Auto token refresh on expiry
- Secure httpOnly cookies
- Password hashing with bcrypt

### Poll Management
- Create polls with title, description, expiry date
- Anonymous or authenticated response modes
- Poll status: `active` → `closed` → `published`
- Auto-close on expiry

### Questions
- Multiple single-choice questions per poll
- Required or optional questions
- Min 2, Max 10 options per question

### Responses
- Anonymous users tracked by IP address
- Authenticated users tracked by userId
- Duplicate response prevention
- Required question validation

### Analytics Dashboard
- Total response count
- Authenticated vs anonymous participation
- Per-question option breakdown with counts
- Winner option highlighted

### Real-time Updates (WebSockets)
- Live response count on poll page
- Real-time analytics updates on dashboard
- Poll-room based architecture

### Public Poll Link
- Same link shows different views based on status:
  - `active` → Response form
  - `closed` → Poll closed message
  - `published` → Public results with bar charts

---

## WebSocket Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-poll` | `pollId: string` | Join poll room |
| `leave-poll` | `pollId: string` | Leave poll room |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `new-response` | `{ totalResponses: number }` | New response submitted |

---

## Database Schema

### Users
```
_id, fullName, email, password (hashed), refreshToken, timestamps
```

### Polls
```
_id, title, desc, creatorId, isAnonymous, status, expiresAt, timestamps
```

### Questions
```
_id, pollId, questionText, isRequired, options[], timestamps
```

### Responses
```
_id, pollId, userId (null if anonymous), ipAddress, answers[], timestamps
```

---

## Pages Overview

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login page |
| `/signup` | Public | Register page |
| `/dashboard` | Protected | Creator's poll list |
| `/poll/create` | Protected | Create new poll |
| `/polls/:pollId/detail` | Protected | Poll detail + questions |
| `/analytics/:pollId` | Protected | Analytics dashboard |
| `/poll/:pollId` | Public | Poll form / results |

---

## Scripts

### Backend
```bash
pnpm dev      # Development server (ts-node)
pnpm build    # TypeScript compile
pnpm start    # Production server
```

### Frontend
```bash
pnpm dev      # Development server
pnpm build    # Production build
pnpm preview  # Preview production build
```

---

Made with ❤️ for Hackathon