# CollabBoard

**Real-Time Collaboration Platform for Teams**

CollabBoard is a modern, real-time collaborative task board that helps teams stay organized and productive. Create boards, add sticky notes with checklists, set due dates, and collaborate seamlessly with your team.

![CollabBoard Banner](public/logo/collabboard.svg)

## ✨ Features

- 📋 **Collaborative Boards** - Create unlimited boards with sticky notes and checklists
- 👥 **Team Workspaces** - Invite members, manage permissions, collaborate in real-time
- ⚡ **Real-Time Updates** - See changes instantly as your team works
- ⏰ **Due Dates & Reminders** - Set deadlines with visual indicators for overdue tasks
- 🔍 **Advanced Search** - Find any note or task instantly with powerful filtering
- 📊 **Activity Timeline** - Track all changes with complete audit trail
- 🎨 **Customizable** - Color-coded notes, dark mode, and more
- 🔒 **Secure** - OAuth authentication with Google and GitHub
- 📱 **Responsive** - Works beautifully on desktop, tablet, and mobile

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (Google & GitHub OAuth)
- **Styling**: TailwindCSS + shadcn/ui components
- **Email**: Resend API for invitations
- **Deployment**: Vercel

## 📦 Prerequisites

- Node.js 18+
- PostgreSQL database (Vercel Postgres, Supabase, or Neon recommended)
- GitHub/Google OAuth credentials (for authentication)
- Resend API key (for email invitations)

## 🛠️ Installation

### 1. Clone the repository

\`\`\`bash
git clone <your-repo-url>
cd collabboard
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Setup environment variables

Copy the example environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your configuration:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/collabboard"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Resend)
AUTH_RESEND_KEY="your-resend-api-key"
EMAIL_FROM="onboarding@collabboard.app"
\`\`\`

### 4. Setup the database

Generate Prisma client and run migrations:

\`\`\`bash
npx prisma generate
npx prisma migrate dev
\`\`\`

### 5. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 OAuth Setup

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

### Google OAuth

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth Client ID**
3. Choose **Web Application**
4. Add **Authorized redirect URI**: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret to `.env`

## 📁 Project Structure

\`\`\`
collabboard/
├── app/
│   ├── api/                 # API routes
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # Dashboard and boards
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── board/               # Board-related components
│   └── theme-provider.tsx   # Theme context
├── lib/
│   ├── db.ts                # Prisma client
│   ├── auth.ts              # NextAuth config
│   └── utils.ts             # Utility functions
├── prisma/
│   └── schema.prisma        # Database schema
└── public/
    └── logo/                # Logo assets
\`\`\`

## 🎯 Key Differentiators

CollabBoard enhances the base collaboration platform with:

1. **Due Dates & Reminders** - Never miss a deadline
2. **Activity Timeline** - Complete audit trail of all changes
3. **Advanced Search & Filters** - Find anything instantly
4. **Board Templates** - Quick start with pre-built templates
5. **Enhanced Mobile Experience** - Touch-optimized interface

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

Vercel will automatically:
- Build your Next.js application
- Run database migrations
- Deploy to a production URL

### Database Setup

For production, use:
- **Vercel Postgres** (easiest, integrated)
- **Supabase** (generous free tier)
- **Neon** (serverless PostgreSQL)

## 📝 Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate   # Run database migrations
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Vercel](https://vercel.com/) - Deployment platform

---

Made with ❤️ by Mayur Bijarniya
