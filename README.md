# Application Manager

A Next.js app for managing applications (names, descriptions, URLs, status).

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on GitHub Pages (host the app, not just this README)

The app is built as a **static export** and deployed via GitHub Actions so the **application** is served, not the README.

1. **Enable GitHub Pages from Actions**
   - In your repo: **Settings** → **Pages**
   - Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).

2. **Push to trigger deploy**
   - Push to `main` (or `master`). The workflow `.github/workflows/deploy-pages.yml` will build and deploy the app.

3. **Open the app**
   - After the workflow finishes, open:  
     **https://\<your-username\>.github.io/Application_manager/**  
     (Replace `Application_manager` with your repo name if different.)

If you leave **Source** as “Deploy from a branch” and choose the default branch, GitHub will show the README instead of this app. Using **GitHub Actions** as the source fixes that.

## Other deployment options

### Vercel (full Next.js features)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Import this repository and deploy. Every push to `main` will redeploy.

## Scripts

| Command      | Description           |
| ------------ | --------------------- |
| `npm run dev` | Start dev server      |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint            |

## Tech stack

- Next.js 15, React 19, TypeScript, Tailwind CSS
