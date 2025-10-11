# CollabBoard Deployment Guide

This guide will help you deploy CollabBoard to production.

## Prerequisites

- GitHub repository with your CollabBoard code
- Vercel account (free tier available)
- PostgreSQL database (see database options below)
- OAuth provider accounts (Google and/or GitHub)
- Resend account for email functionality

## Database Options

### 1. Vercel Postgres (Recommended)

**Pros:**
- Seamless integration with Vercel
- Automatic connection pooling
- Easy setup and management
- Free tier: 3 databases, 1GB storage

**Setup:**
1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string
4. Use this as your `DATABASE_URL`

### 2. Supabase

**Pros:**
- Generous free tier (500MB database, 2GB bandwidth)
- Built-in dashboard and real-time features
- Easy to scale

**Setup:**
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Use this as your `DATABASE_URL`

### 3. Neon

**Pros:**
- Serverless PostgreSQL
- Free tier: 3GB storage, 1 database
- Fast cold starts

**Setup:**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string
4. Use this as your `DATABASE_URL`

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://yourdomain.vercel.app/api/auth/callback/google`
7. Copy Client ID and Client Secret

### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `https://yourdomain.vercel.app/api/auth/callback/github`
4. Copy Client ID and Client Secret

## Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use the default domain for testing)
3. Get your API key from the dashboard
4. Set up DNS records for email delivery

## Vercel Deployment

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### Step 2: Environment Variables

In your Vercel project settings, add these environment variables:

```env
# Database
DATABASE_URL="your-database-connection-string"

# NextAuth
AUTH_SECRET="generate-a-random-secret-key"
AUTH_RESEND_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# App URL
NEXTAUTH_URL="https://yourdomain.vercel.app"
```

### Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://yourproject.vercel.app`

### Step 4: Database Migration

After deployment, run the database migration:

1. Go to your Vercel project dashboard
2. Open the Functions tab
3. Use the Vercel CLI to run migrations:

```bash
npx vercel env pull .env.local
npx prisma db push
```

## Post-Deployment Setup

### 1. Update OAuth Redirect URIs

Update your OAuth provider settings with the production URL:

- Google: `https://yourdomain.vercel.app/api/auth/callback/google`
- GitHub: `https://yourdomain.vercel.app/api/auth/callback/github`

### 2. Test the Application

1. Visit your deployed URL
2. Sign up with OAuth
3. Create an organization
4. Create a board
5. Add some notes
6. Test team invitations

### 3. Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Monitoring and Maintenance

### Vercel Analytics

Enable Vercel Analytics to monitor:
- Page views and performance
- User engagement
- Error rates

### Database Monitoring

Monitor your database:
- Connection usage
- Query performance
- Storage usage
- Backup status

### Error Tracking

Consider adding error tracking:
- Sentry
- LogRocket
- Bugsnag

## Scaling Considerations

### Database Scaling

- Monitor connection limits
- Consider connection pooling
- Set up read replicas for heavy read workloads
- Implement database backups

### Performance Optimization

- Enable Vercel Edge Functions for global performance
- Use CDN for static assets
- Implement caching strategies
- Monitor Core Web Vitals

### Security

- Regularly update dependencies
- Monitor for security vulnerabilities
- Implement rate limiting
- Use HTTPS everywhere
- Set up security headers

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check `DATABASE_URL` format
   - Verify database is accessible
   - Check connection limits

2. **OAuth Errors**
   - Verify redirect URIs match exactly
   - Check client ID and secret
   - Ensure OAuth app is not in development mode

3. **Email Not Working**
   - Verify Resend API key
   - Check domain verification
   - Test with a simple email first

4. **Build Failures**
   - Check environment variables
   - Verify all dependencies are installed
   - Check for TypeScript errors

### Getting Help

- Check Vercel logs in the dashboard
- Review Next.js documentation
- Check Prisma documentation
- Open an issue in the repository

## Backup Strategy

### Database Backups

Set up regular database backups:
- Daily automated backups
- Point-in-time recovery
- Test restore procedures

### Code Backups

- Use Git for version control
- Tag releases
- Keep deployment history

## Security Checklist

- [ ] Use strong, unique passwords
- [ ] Enable 2FA on all accounts
- [ ] Use HTTPS everywhere
- [ ] Set up security headers
- [ ] Regular dependency updates
- [ ] Monitor for vulnerabilities
- [ ] Implement rate limiting
- [ ] Secure environment variables
- [ ] Regular security audits

## Performance Checklist

- [ ] Enable Vercel Analytics
- [ ] Monitor Core Web Vitals
- [ ] Optimize images
- [ ] Implement caching
- [ ] Monitor database performance
- [ ] Set up error tracking
- [ ] Regular performance audits

---

For additional help, check the main README.md or open an issue in the repository.
