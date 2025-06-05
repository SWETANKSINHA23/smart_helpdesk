# smart helpdesk

> An intelligent, full-stack support ticket system powered by an **agentic triage workflow** that automatically classifies, drafts replies, and resolves tickets — or escalates them to a human agent.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [How the Agentic Workflow Works](#how-the-agentic-workflow-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Run with Docker](#run-with-docker)
  - [Run Locally (Dev Mode)](#run-locally-dev-mode)
  - [Seed the Database](#seed-the-database)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [User Roles](#user-roles)
- [License](#license)

---

## Overview

**smart helpdesk** is an end-to-end MERN application demonstrating a real-world **agentic AI workflow**. When a user submits a support ticket, an autonomous background agent:

1. **Classifies** the ticket into a category (billing, tech, shipping, other)
2. **Retrieves** the top 3 matching knowledge-base articles
3. **Drafts** a templated reply using the KB content
4. **Decides** to auto-close the ticket (if confidence is high) or assign it to a human agent

Every action is logged to an immutable **Audit Trail** with a consistent `traceId`, making the entire agent decision process transparent and inspectable.

---

## Features

| Feature | Description |
|---------|-------------|
| **Authentication & RBAC** | JWT-based login/register with role-based access control (Admin, Agent, User) |
| **Ticket Lifecycle** | Full ticket management — open, triaged, waiting_human, resolved |
| **Agentic Triage** | Autonomous background agent that classifies, retrieves KB, drafts replies |
| **Knowledge Base** | Admin CRUD for KB articles with tag-based search |
| **Agent Review** | Agents can review AI suggestions and manually resolve tickets |
| **Audit Timeline** | Every triage step logged with timestamp, actor, and metadata |
| **Admin Config** | Admin can toggle auto-close and set confidence threshold at runtime |
| **Docker Support** | Full containerized setup with Docker Compose (mongo + api + client) |
| **Responsive UI** | Mobile-friendly Bootstrap 5 interface |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| React Router v7 | Client-side routing |
| Bootstrap 5.3 | Styling & layout |
| Axios | HTTP client |
| React Toastify | Notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js 4 | REST API framework |
| Mongoose 8 | MongoDB ODM |
| jsonwebtoken | JWT auth |
| bcryptjs | Password hashing |
| uuid | Unique trace IDs for audit logs |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| MongoDB | Primary database |
| Docker + Docker Compose | Container orchestration |
| Vercel | Frontend deployment |

---

## Architecture

```
+-----------------------------------------------------------+
|                    Docker Compose                         |
|                                                           |
|  +--------------+    +--------------+   +------------+    |
|  |   Client     |    |     API      |   |   MongoDB  |    |
|  | (React/Vite) |--->|  (Express)   |-->|  :27017   |    |
|  |   :3000      |    |  :5000       |   +------------+    |
|  +--------------+    +------+-------+                     |
|                             |                             |
|                    +--------v--------+                    |
|                    |  Agent Service  |                    |
|                    |  (In-memory Q)  |                    |
|                    +--------+--------+                    |
|                             |                             |
|                    +--------v--------+                    |
|                    |  LLM Provider   |                    |
|                    |  (Stub / Real)  |                    |
|                    +-----------------+                    |
+-----------------------------------------------------------+
```

The API responds **instantly** to ticket creation, while the triage agent runs **asynchronously** in the background via an in-memory queue.

---

## How the Agentic Workflow Works

When a ticket is created, the following sequential pipeline is triggered automatically:

```
New Ticket Created
       |
       v
 +-------------+     Logs: AGENT_TRIAGE_STARTED
 |  1. CLASSIFY |---------------------------------> AuditLog
 |  (keyword   |     category + confidence score
 |  matching)  |
 +------+------+
        |
        v
 +-------------+     Logs: KB_RETRIEVED
 | 2. RETRIEVE |---------------------------------> AuditLog
 |    KB       |     top 3 matching articles
 +------+------+
        |
        v
 +-------------+     Logs: DRAFT_GENERATED
 | 3. DRAFT   |---------------------------------> AuditLog
 |   REPLY    |     templated reply with KB refs
 +------+------+
        |
        v
 +-------------+
 | 4. DECIDE  |
 +------+------+
        |
   +----+--------------------+
   |                         |
confidence >= threshold   confidence < threshold
   |                         |
   v                         v
AUTO_CLOSED           ASSIGNED_TO_HUMAN
status: resolved      status: waiting_human
```

**Classification Categories:**
- `billing` — triggered by keywords: `refund`, `invoice`, `charge`
- `tech` — triggered by keywords: `error`, `bug`, `login`
- `shipping` — triggered by keywords: `shipment`, `delivery`, `track`
- `other` — fallback (confidence: 0.0)

---

## Project Structure

```
smart_helpdesk/
├── docker-compose.yml              # Orchestrates all 3 services
├── README.md
├── .gitignore
│
├── Smart-HelpDesk-server/          # Node.js / Express backend
│   ├── server.js                   # App entry point
│   ├── seed.js                     # DB seed script
│   ├── package.json
│   ├── Dockerfile
│   ├── controllers/
│   │   ├── authController.js       # Register, login, getMe
│   │   ├── ticketController.js     # Ticket CRUD + reply
│   │   └── kbController.js         # KB article CRUD
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verify + role check
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   ├── Article.js
│   │   ├── AuditLog.js
│   │   ├── AgentSuggestion.js
│   │   └── Config.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── kbRoutes.js
│   │   ├── agentRoutes.js
│   │   └── configRoutes.js
│   └── services/
│       ├── agentService.js         # Triage queue & pipeline
│       └── llmProvider.js          # Classifier & KB retrieval
│
└── Smart-HelpDesk-client/          # React / Vite frontend
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── Dockerfile
    ├── vercel.json                  # SPA rewrite rules
    └── src/
        ├── main.jsx                 # App entry point
        ├── App.jsx                  # Routes & layout
        ├── context/
        │   └── AuthContext.jsx      # Global auth state
        ├── components/
        │   ├── Header.jsx
        │   ├── AuthForm.jsx
        │   ├── TicketCard.jsx
        │   ├── AuditTimeline.jsx
        │   ├── ProtectedRoute.jsx
        │   └── LoadingSpinner.jsx
        └── pages/
            ├── HomePage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── TicketListPage.jsx
            ├── TicketCreatePage.jsx
            ├── TicketDetailPage.jsx
            ├── KBCreatePage.jsx
            └── AdminDashboardPage.jsx
```

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- **OR** Node.js v18+ and MongoDB installed locally for dev mode
- Git

### Run with Docker

The easiest way to run the full stack is with Docker Compose.

```bash
# 1. Clone the repository
git clone https://github.com/SWETANKSINHA23/smart_helpdesk.git
cd smart_helpdesk

# 2. Start all services (mongo + api + client)
docker compose up --build
```

The app will be available at **http://localhost:3000**

### Run Locally (Dev Mode)

```bash
# Terminal 1 — Backend
cd Smart-HelpDesk-server
npm install
npm run dev          # Starts on http://localhost:5000

# Terminal 2 — Frontend
cd Smart-HelpDesk-client
npm install
npm run dev          # Starts on http://localhost:5173
```

### Seed the Database

After the app is running, populate the database with demo users, KB articles and tickets:

```bash
cd Smart-HelpDesk-server
node seed.js
```

This creates the following test accounts:

| Role | Email | Password |
|------|-------|---------|
| Admin | admin@test.com | password123 |
| Agent | agent@test.com | password123 |
| User | user@test.com | password123 |

---

## Environment Variables

### Backend (`Smart-HelpDesk-server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=your_secure_jwt_secret_here
AUTO_CLOSE_ENABLED=true
CONFIDENCE_THRESHOLD=0.78
STUB_MODE=true
```

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/helpdesk` |
| `JWT_SECRET` | Secret key for signing JWTs | — |
| `AUTO_CLOSE_ENABLED` | Allow agent to auto-resolve tickets | `true` |
| `CONFIDENCE_THRESHOLD` | Min confidence to auto-close (0.0–1.0) | `0.78` |
| `STUB_MODE` | Use keyword-based stub instead of real LLM | `true` |

### Frontend (`Smart-HelpDesk-client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive JWT |
| `GET` | `/api/auth/me` | Yes | Get current user profile |

### Tickets
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| `GET` | `/api/tickets` | Yes | List tickets (filtered by role) |
| `POST` | `/api/tickets` | Yes | Create ticket, triggers triage |
| `GET` | `/api/tickets/:id` | Yes | Get ticket details |
| `POST` | `/api/tickets/:id/reply` | Agent/Admin | Add manual reply |
| `GET` | `/api/tickets/:id/audit` | Yes | Get audit log for a ticket |

### Knowledge Base
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| `GET` | `/api/kb?query=` | No | Search articles |
| `POST` | `/api/kb` | Admin | Create new article |
| `GET` | `/api/kb/:id` | No | Get article by ID |
| `PUT` | `/api/kb/:id` | Admin | Update article |
| `DELETE` | `/api/kb/:id` | Admin | Delete article |

### Agent & Config
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| `GET` | `/api/agent/suggestion/:ticketId` | Yes | Get AI suggestion for a ticket |
| `GET` | `/api/config` | Admin | Get system config |
| `PUT` | `/api/config` | Admin | Update system config |

---

## User Roles

| Role | Permissions |
|------|------------|
| **User** | Create tickets, view own tickets, view ticket details |
| **Agent** | View all tickets, add replies, resolve tickets |
| **Admin** | All agent permissions + manage KB articles + manage system config |

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">
  <p>Built by <a href="https://github.com/SWETANKSINHA23">SWETANKSINHA23</a></p>
</div>
