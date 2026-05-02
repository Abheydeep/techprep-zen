# TechPrep Zen

A local-first technical interview preparation app for DSA, system design, quizzes, streaks, Zen Mode, and mood-aware study pacing.

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3004`.

Seeded local admin:

- Email: `abhey@techprep.local`
- Passcode: `zen180`

## GitHub Pages

This repo deploys with GitHub Actions. The workflow builds a static Next export using:

```bash
NEXT_PUBLIC_BASE_PATH=/techprep-zen npm run build
```

The static site is published from the generated `out/` directory.
