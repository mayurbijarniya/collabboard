# CollabBoard

Keep on top of your team's to-dos.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start database (Docker) or use your own PostgreSQL
npm run docker:up

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run docker:up` | Start PostgreSQL database |
| `npm run docker:down` | Stop PostgreSQL database |
| `npm run db:studio` | Open Prisma Studio |

## Environment Variables

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret"
AUTH_RESEND_KEY="your-resend-key"
EMAIL_FROM="noreply@..."
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mayurbijarniya/collabboard&env=DATABASE_URL,EMAIL_FROM,AUTH_RESEND_KEY,AUTH_SECRET)

## License

MIT License

Copyright (c) 2025 Mayur Bijarniya
