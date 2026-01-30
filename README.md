# Application Manager

A Next.js app for managing applications (names, descriptions, URLs, status).

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy from GitHub

This project is set up for deployment from a GitHub repository.

### Option 1: Vercel (recommended for Next.js)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New Project** and import this repository.
4. Vercel will detect Next.js and use the default build settings. Click **Deploy**.
5. Every push to `main` (or `master`) will trigger a new deployment.

No extra configuration is required; the repo includes a `vercel.json` that matches the project setup.

### Option 2: GitHub Actions (CI only)

The `.github/workflows/ci.yml` workflow runs on every push and pull request to `main` or `master`:

- Installs dependencies
- Runs lint
- Runs build

Use this to verify that the app builds before merging. To deploy from GitHub without Vercel, you can add a deploy step to the workflow (e.g. deploy to a VPS or another host).

## Scripts

| Command      | Description           |
| ------------ | --------------------- |
| `npm run dev` | Start dev server      |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint            |

## Tech stack

- Next.js 15, React 19, TypeScript, Tailwind CSS
