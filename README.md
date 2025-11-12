# Agentic Signal Survey

A tailored survey experience inspired by Design Arena's "What do you want" flow. The app helps founders and product teams translate intent into a launch-ready opportunity canvas in a few guided steps.

## Features

- Multi-step wizard that captures role, vibe, focus areas, timeline, and vision
- Real-time opportunity canvas that synthesizes responses into momentum scores and launch signals
- Summary view with actionable insights, roadmap checkpoints, and sharing prompts
- Responsive, Vercel-ready Next.js App Router implementation styled with Tailwind CSS

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- React 19 with client components
- Tailwind CSS v4
- Lucide React icons

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to explore the survey. The page reloads automatically when you edit files in `src/`.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm start` - serve the production build
- `npm run lint` - run ESLint checks

## Structure

```
src/
  app/
    layout.tsx      # App shell, metadata, global providers
    page.tsx        # Survey experience + summary
    globals.css     # Tailwind and global theming
public/
  favicon.ico       # Brand assets
```

## Deployment

When you are ready to publish, deploy to Vercel:

```bash
npm run build
npx vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-ad97c847
```

Once the deployment completes, verify the production URL: `https://agentic-ad97c847.vercel.app`.
