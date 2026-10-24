# Anoxa

Anoxa is a social media web application built to explore and implement common social networking features, including user authentication, posts, comments, reactions, bookmarks, user profiles, and messaging.

The project focuses on application architecture, database relationships, access control, and client-server communication beyond basic CRUD operations.

## Demo

[Live Demo](https://anoxa.vercel.app)

![Screenshot](/public/screenshot-for-readme.png)

## Features

- **Authentication** — User registration, login, and session management.
- **Posts** — Create and interact with posts.
- **Comments** — Comment on posts.
- **Reactions** — React to posts.
- **Bookmarks** — Save posts for later.
- **User Profiles** — User-specific profiles and content.
- **Messaging** — Messaging functionality with a separate Socket.IO backend.
- **Access Control** — Role-based permissions.
- **Admin Panel** — Administrative functionality for managing the application.

## Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend and Data**
- Node.js
- Express
- Socket.IO
- Prisma ORM
- PostgreSQL

**Additional Tools**
- bcryptjs for password hashing
- Resend for email delivery

## Architecture

Anoxa uses Next.js for the web application and a separate Express server for Socket.IO-based communication.

Prisma handles database access and relationships, while authentication and role-based access control are used to manage access to application features.

## Getting Started

### Prerequisites

- Node.js
- pnpm
- PostgreSQL

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

Install the frontend dependencies:

```bash
pnpm install
```

Configure the environment variables required by the frontend using the project's environment configuration.

Start the development server:

```bash
pnpm dev
```

### Backend Setup

The backend is maintained in a separate `server` directory.

```bash
cd server
pnpm install
```

Configure the backend environment variables, including the database connection and any required service credentials. Generate the Prisma client and run the required database migrations according to the project configuration.

Start the backend using the development script defined in `server/package.json`.

## Project Goals

Anoxa was built as a practical project for working with:

- Authentication and session management
- Relational database modeling
- Server-side data access and validation
- Role-based access control
- Client-server communication
- Real-time communication with Socket.IO
- Organizing a full-stack application

