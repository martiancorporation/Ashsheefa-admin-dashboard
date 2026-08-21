# Ashsheefa Admin Dashboard

Admin dashboard for hospital patient management. React + Vite single-page app,
routed with React Router, styled with Tailwind CSS v4 and shadcn/ui.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5175](http://localhost:5175).

## Scripts

| Script            | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Vite dev server on port 5175                    |
| `npm run build`   | Production build into `dist/`                   |
| `npm run preview` | Serve the built `dist/` locally to sanity-check  |
| `npm start`       | Serve `dist/` on port 5175 (used in deployment)  |

## Environment

Vite only exposes variables prefixed with `VITE_`. Create a `.env`:

```
VITE_PUBLIC_API_URL="https://backend.ashsheefahospital.com"
```

Read it in code as `import.meta.env.VITE_PUBLIC_API_URL`.

## Project structure

```
index.html                 SPA entry, loads /src/main.jsx
src/main.jsx               ReactDOM root, wraps the app in <BrowserRouter>
src/App.jsx                RootLayout + AppRouter
src/AppRouter.jsx          every route in the app
src/layouts/layout.jsx     app shell: Toaster + AuthWrapper
src/globals.css            Tailwind entry + design tokens
src/pages/                 one folder per route, `page.jsx` is the screen
  page.jsx                 "/" login
  not-found.jsx            catch-all 404
  components/              shared app-level components (Sidebar, LoginForm, ...)
  dashboard/
    layout.jsx             sidebar shell, renders <Outlet />
    page.jsx               "/dashboard"
    <section>/page.jsx     one per dashboard section
    <section>/[id]/page.jsx  detail screens, read the id with useParams()
    <section>/components/  components used only by that section
src/components/ui/         shadcn/ui primitives
src/api/                   endpoint map + one module per resource
src/store/                 zustand stores (auth, sos)
src/lib/, src/utilities/   helpers
src/hooks/                 shared hooks
```

Folders named `[id]` / `[_id]` are detail screens. The bracket name is a
leftover convention from the previous Next.js file-based router — routes are now
declared explicitly in `src/AppRouter.jsx` (`path="patient/:id"`), and the page
reads the value with `useParams()`.

## Auth

There is no server in front of the SPA, so `/dashboard` is gated on the client by
`src/pages/components/AuthWrapper.jsx`, which redirects to `/` when there is no
`access_token` in the auth store. `src/pages/page.jsx` does the reverse: an
already-logged-in admin hitting `/` is sent to `/dashboard`.

## Deploying

`npm run build` emits a static `dist/`. Because routing is client-side, the host
must fall back to `index.html` for unknown paths, or a deep link like
`/dashboard/patient/123` will 404 on refresh.

nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

`npm start` (`serve -s dist`) already does this fallback if the app is served by
Node behind a proxy.
