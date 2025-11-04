# Modern Next.js SaaS Starter Kit

A production-ready SaaS starter kit built with Next.js 16, featuring authentication, payments, AI integration, and full-stack type safety.

## Features

- ✅ **Next.js 16** with App Router and Server Components
- ✅ **TypeScript** with full type safety using Zod
- ✅ **Tailwind CSS v4** for styling
- ✅ **Supabase** for authentication and database
- ✅ **Prisma ORM** for type-safe database queries
- ✅ **Stripe** for payments and subscriptions
- ✅ **OpenAI** API integration
- ✅ **Server Actions** for mutations (no API routes needed)
- ✅ **Environment validation** with @t3-oss/env-nextjs
- ✅ **shadcn/ui** components

## Project Structure

```
saas-starter-kit/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── billing/
│   │   │   └── ai/
│   │   ├── api/
│   │   │   └── webhooks/    # Stripe webhooks
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── auth/            # Auth-specific components
│   │   └── dashboard/       # Dashboard components
│   ├── lib/
│   │   ├── actions/         # Server Actions
│   │   ├── db/              # Prisma client
│   │   ├── services/        # External services (Stripe, OpenAI, Supabase)
│   │   └── validations/     # Zod schemas
│   └── types/               # TypeScript types
│   └── env.mjs               # Environment validation
└── prisma/
    └── schema.prisma
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- Stripe account
- OpenAI API key

### Installation

1. **Clone and install dependencies:**

```bash
git clone <your-repo>
cd saas-starter-kit
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

- `DATABASE_URL` - Supabase database connection string
- `SUPABASE_URL` and keys - From your Supabase project
- `STRIPE_SECRET_KEY` and keys - From your Stripe dashboard
- `OPENAI_API_KEY` - From OpenAI platform
- `NEXT_PUBLIC_APP_URL` - Your app URL (http://localhost:3000 for dev)

3. **Set up the database:**

```bash
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma Client
```

4. **Set up Stripe:**

Create products and prices in Stripe dashboard, then add the price IDs to your `.env`:

- `STRIPE_PRICE_ID_BASIC` - For basic plan
- `STRIPE_PRICE_ID_PRO` - For pro plan

5. **Set up Stripe webhooks:**

Install Stripe CLI and forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`.

6. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio
```

## Testing the App

### 1. Authentication (`/login`, `/signup`)

- Create a new account at `/signup`
- Login with your credentials at `/login`
- Authentication is handled by Supabase
- User data is synced to Prisma database

### 2. Dashboard (`/dashboard`)

- View your account stats
- See AI request count
- Check subscription status
- Access quick actions

### 3. Billing (`/billing`)

- View available subscription plans
- Subscribe to a plan (redirects to Stripe Checkout)
- Manage subscription through Stripe Customer Portal
- Subscription status updates via webhooks

### 4. AI Assistant (`/ai`)

- Enter prompts to generate AI completions
- View response and token usage
- See history of recent requests
- All requests are logged to the database

## Architecture Patterns

### Server Components by Default

All pages use Server Components for data fetching:

```typescript
// Server Component (default)
export default async function DashboardPage() {
  const user = await getUser();
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### Client Components for Interactivity

Use `'use client'` only when needed:

```typescript
"use client";

export function InteractiveForm() {
  const [state, setState] = useState();
  return <form>...</form>;
}
```

### Server Actions for Mutations

Replace API routes with Server Actions:

```typescript
"use server";

export async function updateUser(formData: FormData) {
  // Validate with Zod
  // Update database
  // Revalidate cache
}
```

### Type Safety with Zod

All inputs are validated:

```typescript
import { z } from "zod";

export const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
```

## Extending for Production

### Add More Features

1. **Email notifications** - Integrate Resend or SendGrid
2. **Multi-tenancy** - Add organization/team models
3. **Advanced billing** - Usage-based pricing, credits
4. **Admin panel** - Manage users and subscriptions
5. **Analytics** - PostHog, Plausible, or Vercel Analytics

### Security Checklist

- [ ] Enable RLS (Row Level Security) in Supabase
- [ ] Add rate limiting for API routes
- [ ] Implement CSRF protection
- [ ] Add input sanitization
- [ ] Enable security headers in `next.config.js`
- [ ] Set up monitoring and logging
- [ ] Configure proper CORS policies

### Performance Optimization

- [ ] Enable Next.js caching strategies
- [ ] Implement ISR for static content
- [ ] Add database indexes for common queries
- [ ] Use Next.js Image optimization
- [ ] Implement lazy loading
- [ ] Add React Suspense boundaries
- [ ] Optimize bundle size

### Deployment

**Recommended platforms:**

1. **Vercel** (easiest)

   - Push to GitHub
   - Import to Vercel
   - Add environment variables
   - Deploy

2. **Railway/Render** (alternatives)
   - Connect repository
   - Set environment variables
   - Deploy

**Database:**

- Use Supabase (included)
- Or migrate to Neon, PlanetScale, or Railway Postgres

**Stripe Webhooks in Production:**

- Set webhook endpoint to `https://yourdomain.com/api/webhooks/stripe`
- Update `STRIPE_WEBHOOK_SECRET` with production secret

## Tech Stack Details

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety

### Database & ORM

- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database (via Supabase)

### Authentication

- **Supabase Auth** - User authentication
- **@supabase/ssr** - Server-side rendering support

### Payments

- **Stripe** - Payment processing
- **Webhooks** - Subscription management

### AI

- **OpenAI** - GPT-3.5/GPT-4 integration

### Styling

- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - Re-usable components

### Validation

- **Zod** - Schema validation
- **@t3-oss/env-nextjs** - Environment validation

## Common Issues

### Issue: Prisma Client errors

**Solution:** Run `npm run db:generate` after schema changes

### Issue: Supabase auth not working

**Solution:** Check your Supabase project URL and keys, ensure middleware is set up correctly

### Issue: Stripe webhooks failing

**Solution:** Verify webhook secret, check Stripe CLI is running, ensure endpoint is accessible

### Issue: OpenAI rate limits

**Solution:** Implement request throttling, add user limits, upgrade API tier

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this starter for your projects!

## Support

- Documentation: [Next.js Docs](https://nextjs.org/docs)
- Community: [GitHub Discussions](https://github.com/uxfris/saas-starter-kit/discussions)
- Issues: [GitHub Issues](https://github.com/uxfris/saas-starter-kit/issues)

---

Built with ❤️ using Next.js, Supabase, Stripe, and OpenAI
