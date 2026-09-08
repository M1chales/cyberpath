# cyberpath

A free, self-paced cybersecurity education platform: a 20-week job-ready core curriculum, a six-track
mastery program beyond that, gamified skill drills, and a persistent hands-on hacking sandbox ("Console")
that uses real techniques (real SQL injection, real command injection, real sudo/permission-based
privilege escalation, real sandboxed JavaScript scripting) against a procedurally generated network of
hosts — evaluated deterministically, with no backend and no AI grading.

Everything runs client-side. Progress is stored in the browser's `localStorage`; there is no server and
no account system.

## Development

```
npm install
npm run dev      # dev server with HMR
npm run build    # tsc -b && vite build, output in dist/
npm run preview  # serve the production build locally
npm run lint      # oxlint
```

## Deployment

This is a static single-page app (Vite + React Router in `BrowserRouter` mode). Any static host works
(Vercel, Netlify, Cloudflare Pages, GitHub Pages with a rewrite rule, etc.) — the only requirement is
that the host rewrites unknown paths to `/index.html` so client-side routes resolve correctly on a hard
refresh or direct link.

- **Vercel / Netlify**: build command `npm run build`, output directory `dist`. Both auto-detect the
  SPA fallback for Vite projects; if not, add a rewrite of `/*` → `/index.html`.
- **GitHub Pages**: needs an explicit `404.html` that redirects to `index.html`, since GitHub Pages has
  no server-side rewrite support.

## Project structure

- `src/pages/` — course pages (curriculum, mastery track, careers, progress, portfolio).
- `src/data/` — curriculum and mastery track content.
- `src/games/` — standalone skill-drill games.
- `src/console-sim/` — the Console's terminal engine, command evaluation, and procedural world
  generator.
- `src/state/` — app-wide XP/progress state and the persistent Console world state.

