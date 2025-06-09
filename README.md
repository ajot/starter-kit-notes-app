# Notes App

A modern, full-stack notes application built with Next.js, Auth.js, PostgreSQL, and Stripe.

## Features

- 🔐 **Authentication**: Email/password login with Auth.js
- 📝 **Notes Management**: Create, edit, delete, and organize notes
- ⭐ **Favorites**: Mark important notes for quick access
- 🔍 **Search**: Full-text search across all notes
- 👑 **Pro Subscriptions**: Stripe-powered subscription management
- 📧 **Email Notifications**: Transactional emails via Resend
- 🛡️ **Admin Dashboard**: User and subscription management
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **Authentication**: Auth.js (NextAuth.js)
- **Payments**: Stripe
- **Email**: Resend
- **Storage**: DigitalOcean Spaces
- **Deployment**: DigitalOcean App Platform

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account
- Resend account
- DigitalOcean Spaces (optional)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <your-repo-url>
   cd notes-app
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your actual values in `.env.local`:

   - **DATABASE_URL**: Your PostgreSQL connection string
   - **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
   - **RESEND_API_KEY**: From your Resend dashboard
   - **STRIPE_SECRET_KEY**: From your Stripe dashboard
   - **STRIPE_WEBHOOK_SECRET**: From your Stripe webhook endpoint
   - And other required variables...

4. Set up the database:
   \`\`\`bash
   # Run the SQL script to create tables
   psql $DATABASE_URL -f scripts/001-initial-schema.sql
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | Your app's URL | ✅ |
| `NEXTAUTH_SECRET` | Secret for JWT signing | ✅ |
| `RESEND_API_KEY` | Resend API key for emails | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ✅ |
| `STRIPE_PRICE_ID` | Stripe price ID for Pro plan | ✅ |
| `DO_SPACES_*` | DigitalOcean Spaces config | ⚪ |

## Deployment

### DigitalOcean App Platform

1. Connect your GitHub repository to DigitalOcean App Platform
2. Set up a managed PostgreSQL database
3. Configure environment variables in the App Platform dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your production environment:

- Update `NEXTAUTH_URL` to your production domain
- Use production Stripe keys
- Set `NODE_ENV=production`
- Configure your production database URL

## API Routes

- `GET /api/notes` - Get user's notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/[id]/role` - Update user role (admin only)
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## Database Schema

The app uses PostgreSQL with the following main tables:

- `users` - User accounts and profiles
- `accounts` - Auth.js account linking
- `sessions` - User sessions
- `notes` - User notes and content
- `subscriptions` - Stripe subscription data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
