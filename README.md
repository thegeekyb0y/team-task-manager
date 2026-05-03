# Orbit Task Manager

<div align="center">
  <h3>Team task management with role-based access control</h3>
  <p>A modern, production-ready task manager built with Next.js, Prisma, and PostgreSQL</p>
  
  <p>
    <a href="#features"><strong>Features</strong></a> •
    <a href="#demo"><strong>Demo</strong></a> •
    <a href="#tech-stack"><strong>Tech Stack</strong></a> •
    <a href="#getting-started"><strong>Getting Started</strong></a> •
    <a href="#deployment"><strong>Deployment</strong></a>
  </p>
</div>

---

## Overview

Orbit is a full-stack task management application that enables teams to collaborate on projects with granular role-based permissions. Built with modern web technologies and deployed on Railway, it demonstrates production-grade patterns for authentication, database management, and real-time collaboration.

### Key Highlights

- **🔐 Secure Authentication** - NextAuth.js with credential-based login and encrypted passwords
- **👥 Team Collaboration** - Multi-project workspaces with admin/member roles
- **📊 Project Boards** - Kanban-style boards with drag-and-drop task management
- **⚡ Real-time Updates** - Server actions with automatic revalidation
- **🎨 Modern UI** - Clean, responsive interface with dark mode support
- **🚀 Production Ready** - Deployed on Railway with PostgreSQL

---

## Features

### Authentication & Authorization

- Secure signup and login with bcrypt password hashing
- Session-based authentication using NextAuth.js
- Protected routes with middleware
- Role-based access control (Admin/Member)

### Project Management

- Create unlimited projects with descriptions
- Invite team members by email
- Assign granular roles (Admin can manage, Members can view/update)
- Track project activity and member count

### Task System

- Create tasks with title, description, and priority levels
- Assign tasks to specific team members
- Set due dates with overdue tracking
- Three status columns: Todo, In Progress, Done
- Board view for visual task management
- Table view for detailed task lists

### Dashboard

- Personal task overview with status metrics
- Overdue task highlighting
- Recent project activity
- Role-based view filtering

---

## Screenshots

### Dashboard

![Dashboard showing task metrics and assignments](./docs/dashboard.png)

### Project Board

![Kanban board with task cards organized by status](./docs/board.png)

### Task Management

![Detailed task view with assignment and status controls](./docs/tasks.png)

---

![System Design Diagram](./public/system-design.png)

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 with Server Components
- **Styling**: Tailwind CSS 4
- **Icons**: Phosphor Icons
- **Forms**: Native HTML forms with server actions

### Backend

- **Runtime**: Node.js
- **API**: Next.js API Routes + Server Actions
- **Authentication**: NextAuth.js
- **ORM**: Prisma
- **Database**: PostgreSQL (via Prisma PostgreSQL adapter)

### DevOps

- **Deployment**: Railway
- **CI/CD**: Automatic deployments from GitHub
- **Database Hosting**: Railway PostgreSQL

---

## System Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│           Client Layer (Browser)                │
│    Next.js 16 • React Server Components        │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              API Layer                          │
│    Server Actions • API Routes • NextAuth      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Data Access Layer                       │
│         Prisma ORM • Type Safety                │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│            Database Layer                       │
│          PostgreSQL • Relational                │
└─────────────────────────────────────────────────┘
```

### Data Flow

1. **Client** renders React Server Components with server-side data fetching
2. **Server Actions** handle mutations (create, update, delete) with automatic revalidation
3. **Prisma ORM** provides type-safe database queries with relationship loading
4. **PostgreSQL** stores all application data with foreign key constraints

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│    USERS     │◄───────►│ PROJECT_MEMBERS  │◄───────►│   PROJECTS   │
├──────────────┤         ├──────────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)          │         │ id (PK)      │
│ name         │         │ projectId (FK)   │         │ name         │
│ email (UK)   │         │ userId (FK)      │         │ description  │
│ passwordHash │         │ role (enum)      │         │ createdById  │
│ createdAt    │         │ joinedAt         │         │ createdAt    │
│ updatedAt    │         └──────────────────┘         │ updatedAt    │
└──────────────┘                                       └──────────────┘
       │                                                       │
       │                                                       │
       │                ┌──────────────┐                      │
       └───────────────►│    TASKS     │◄─────────────────────┘
                        ├──────────────┤
                        │ id (PK)      │
                        │ title        │
                        │ description  │
                        │ status       │
                        │ priority     │
                        │ dueDate      │
                        │ projectId    │
                        │ assignedToId │
                        │ createdById  │
                        │ createdAt    │
                        │ updatedAt    │
                        └──────────────┘
```

### Enums

**ProjectRole**: `ADMIN`, `MEMBER`  
**TaskStatus**: `TODO`, `IN_PROGRESS`, `DONE`  
**TaskPriority**: `LOW`, `MEDIUM`, `HIGH`

### Key Relationships

- Users can create multiple projects (1:N)
- Users can be members of multiple projects (N:M via PROJECT_MEMBERS)
- Projects contain multiple tasks (1:N)
- Tasks are assigned to one user (N:1, optional)
- Tasks are created by one user (N:1)

### Constraints

- Cascade deletes: Removing a project deletes all members and tasks
- Unique constraint: One membership per user-project pair
- Email uniqueness: Enforced at database level
- Foreign keys: Ensure referential integrity

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/orbit-task-manager.git
   cd orbit-task-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/orbit?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run database migrations**

   ```bash
   npm run db:migrate
   ```

5. **Seed the database (optional)**

   ```bash
   npm run db:seed
   ```

   This creates demo accounts:
   - Admin: `admin@example.com` / `password123`
   - Member: `member@example.com` / `password123`

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Railway Deployment

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will provision a database and provide `DATABASE_URL`

4. **Set environment variables**

   ```
   DATABASE_URL=<provided-by-railway>
   NEXTAUTH_SECRET=<generate-random-string>
   NEXTAUTH_URL=https://your-app.railway.app
   ```

5. **Deploy**
   - Railway automatically builds and deploys
   - Migrations run via `npm run build`
   - Access your app at the provided Railway URL

### Environment Variables

| Variable          | Description                  | Example                               |
| ----------------- | ---------------------------- | ------------------------------------- |
| `DATABASE_URL`    | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Secret for JWT signing       | `openssl rand -base64 32`             |
| `NEXTAUTH_URL`    | Application URL              | `https://your-app.railway.app`        |

---

## Project Structure

```
orbit-task-manager/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Prisma schema
│   └── seed.ts             # Database seeding script
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── login/          # Auth pages
│   │   ├── projects/       # Project pages
│   │   │   ├── [projectId]/
│   │   │   │   ├── board/  # Kanban board
│   │   │   │   └── page.tsx
│   │   │   ├── actions.ts  # Server actions
│   │   │   └── components.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── app-shell.tsx   # Layout wrapper
│   │   ├── auth-form.tsx   # Auth UI
│   │   └── ui/            # Reusable UI components
│   └── lib/
│       ├── auth.ts         # NextAuth config
│       ├── prisma.ts       # Prisma client
│       ├── session.ts      # Session helpers
│       ├── utils.ts        # Utilities
│       └── validations/    # Zod schemas
├── public/                 # Static assets
└── package.json
```

---

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`

Create a new user account.

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**:

```json
{
  "message": "Account created successfully.",
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Server Actions

#### `createProject(formData)`

Creates a new project and assigns the creator as admin.

#### `addMemberToProject(formData)`

Adds a user to a project with specified role (admin only).

#### `createTask(formData)`

Creates a task within a project (admin only).

#### `updateTaskStatus(formData)`

Updates task status (admin or assignee only).

---

## Security Considerations

- **Password Hashing**: Bcrypt with salt rounds of 10
- **Session Management**: JWT-based sessions with HttpOnly cookies
- **CSRF Protection**: Built into Next.js server actions
- **Input Validation**: Zod schemas on all forms
- **Authorization**: Role-based middleware on protected routes
- **SQL Injection**: Prevented by Prisma's parameterized queries

---

## Performance Optimizations

- Server-side rendering for initial page loads
- Automatic code splitting with Next.js
- Database query optimization with Prisma includes
- Image optimization with Next.js Image component
- Caching with React Server Components

---

## Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] File attachments for tasks
- [ ] Email notifications
- [ ] Task comments and activity log
- [ ] Advanced filtering and search
- [ ] Custom project templates
- [ ] Export to CSV/PDF
- [ ] Mobile applications

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Railway](https://railway.app/) - Deployment platform

---
