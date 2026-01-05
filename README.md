# CollabBoard

A real-time collaborative task management application with sticky notes-style boards.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)

## Features

- **Visual Boards** — Drag-and-drop sticky notes with checklists
- **Team Collaboration** — Multi-user organizations with Admin/Member roles
- **Activity Feed** — Real-time activity logging
- **Authentication** — Email magic links, Google, and GitHub OAuth
- **Public Boards** — Share read-only views with external stakeholders
- **Slack Integration** — Webhook notifications for board updates
- **Dark/Light Themes** — Multiple VS Code-inspired themes

## Tech Stack

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI, Framer Motion  
**Backend:** Next.js API Routes, Prisma ORM, PostgreSQL  
**Auth:** NextAuth.js v5  
**Testing:** Playwright (E2E), Jest (Unit)

## Quick Start

```bash
npm install
cp .env.example .env
npm run docker:up
npm run db:push
npm run dev
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/collabboard"
AUTH_SECRET="your-secret-key"
AUTH_RESEND_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run test` | Unit tests |
| `npm run test:e2e` | E2E tests |
| `npm run db:studio` | Prisma Studio |

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mayurbijarniya/collabboard&env=DATABASE_URL,EMAIL_FROM,AUTH_RESEND_KEY,AUTH_SECRET)

## License

MIT License — Copyright (c) 2025 Mayur Bijarniya
