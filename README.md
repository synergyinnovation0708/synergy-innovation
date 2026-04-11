This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Admin Login

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from your Supabase project.
3. Set `SUPABASE_ADMIN_EMAIL`, `SUPABASE_ADMIN_PASSWORD`, and optionally `SUPABASE_ADMIN_NAME`.
4. Run `npm run seed:admin` to create or update the admin user in Supabase Auth.
5. Start the app with `npm run dev` and sign in at `/admin/login`.

The admin dashboard routes are protected server-side and only users carrying the Supabase `app_metadata.role = "admin"` flag can access them.

## Employer Inquiry Form

The homepage employer form submits to Supabase through `POST /api/employer-inquiries`.

1. Copy `.env.example` to `.env.local`.
2. Add your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
3. Run the SQL in [supabase/employer_inquiries.sql](./supabase/employer_inquiries.sql) inside the Supabase SQL Editor.
4. Optional: set `SUPABASE_EMPLOYER_INQUIRIES_TABLE` if you want to use a custom table name instead of `employer_inquiries`.

The API route uses the service role key on the server, so no public insert policy is required for this form.
If you already created the `employer_inquiries` table earlier, run the updated SQL again to add the `status` column and status index used by the admin dashboard.

## Job Seeker Inquiry Form

The homepage job seeker form submits through `POST /api/job-seeker-inquiries`.
The API route validates the text fields, accepts only PDF/DOC/DOCX resumes up to 5 MB, uploads the resume to Cloudinary, and stores the candidate record in Supabase.

1. Copy `.env.example` to `.env.local`.
2. Add your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
3. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
4. Optional: set `CLOUDINARY_RESUME_FOLDER` and `SUPABASE_JOB_SEEKER_INQUIRIES_TABLE`.
5. Run the SQL in [supabase/job_seeker_inquiries.sql](./supabase/job_seeker_inquiries.sql) inside the Supabase SQL Editor.

The API route uses the service role key on the server, so no public insert policy is required for this form either.

## Admin Job Listings

The admin job creation modal submits through `POST /api/admin/job-listings`, and the `/admin/job-listings` page reads live data from Supabase.

1. Copy `.env.example` to `.env.local`.
2. Add your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
3. Optional: set `SUPABASE_JOB_LISTINGS_TABLE` if you want to use a custom table name instead of `job_listings`.
4. Run the SQL in [supabase/job_listings.sql](./supabase/job_listings.sql) inside the Supabase SQL Editor.

The admin create route is protected server-side and inserts with the service role key, so no public insert policy is required.
If you already created `job_listings` earlier, run the updated SQL again to add the experience and salary min/max columns used by the admin modal.

## Admin AI Usage Tracking

The admin dashboard can show AI request volume, token usage, blocked requests, and recent AI activity from the homepage service chatbot and the intake assistant routes.

1. Copy `.env.example` to `.env.local`.
2. Add your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
3. Optional: set `SUPABASE_AI_USAGE_EVENTS_TABLE` if you want a custom table name instead of `ai_usage_events`.
4. Run the SQL in [supabase/ai_usage_events.sql](./supabase/ai_usage_events.sql) inside the Supabase SQL Editor.

The AI routes log usage on the server with the service role key, so no public insert policy is required for this table.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
