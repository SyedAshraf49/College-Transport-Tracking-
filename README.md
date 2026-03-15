# College Transport Tracker

A role-based React + TypeScript web app for simulating and monitoring college bus operations.

This project includes:
- Student, Driver, and Admin login flows
- Live bus movement simulation on routes
- Notifications for trip start/completion and delays
- Mock attendance and data management screens
- Light and dark theme toggle
- PWA service worker registration

## Tech Stack

- React 19
- TypeScript
- Vite 6
- React Router
- Recharts
- QRCode library

## Project Structure

```text
.
|-- App.tsx
|-- index.tsx
|-- constants.tsx
|-- types.ts
|-- pages/
|   |-- Login.tsx
|   |-- student/
|   |-- driver/
|   \-- admin/
|-- components/
|   |-- ui/
|   \-- ...
|-- lib/
|-- sw.js
|-- manifest.json
\-- vite.config.ts
```

## Features by Role

### Student
- View assigned bus details and status
- Track bus location updates in near real-time
- View route/stop information
- Receive notifications

### Driver
- Start or stop bus trip simulation
- Update trip lifecycle visible to other roles
- Generate notifications to students/admin automatically through app logic

### Admin
- Live map overview across buses
- Manage mock data records
- Monitor operational notifications and system state

## Demo Credentials

All accounts use the same password:

- Password: `password123`

Example emails are displayed directly in the login screen and sourced from mock constants.

- Admin email: `admin@example.com`
- Student emails: multiple demo users such as `anbu@example.com`
- Driver emails: multiple demo users such as `murugan@example.com`

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Default local URL:
- http://localhost:3000

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## NPM Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Build production bundle into `dist/`
- `npm run preview`: Preview production build locally

## Environment Variables

The Vite config maps `GEMINI_API_KEY` into:
- `process.env.API_KEY`
- `process.env.GEMINI_API_KEY`

If your current app features do not actively use this key, deployment still works without it. Add it when required by future integrations.

Create a `.env.local` file for local-only secrets:

```env
GEMINI_API_KEY=your_key_here
```

## Deployment on Vercel

This project is Vite-based and deploys as a static site.

### Recommended Vercel settings

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

### Steps

1. Push code to GitHub.
2. In Vercel, click **Add New Project**.
3. Import this repository.
4. Confirm build settings above.
5. Add env vars (for example `GEMINI_API_KEY`) if needed.
6. Deploy.

## Routing Note

The app uses `HashRouter`, which is friendly for static hosting and avoids server rewrite issues for client routes.

## PWA Note

`index.tsx` registers `sw.js` on page load when service workers are supported.

## Data Source

Current app behavior is powered by in-project mock datasets in `constants.tsx`.

This makes it easy to demo and test without a backend. For production use, replace mocks with API calls and persistent storage.

## Known Build Notes

- Vite may show chunk-size warnings for large bundles.
- Vite may report `/index.css` resolution message depending on import setup.

These warnings do not block successful builds in the current setup.

## GitHub Workflow

Typical workflow:

```bash
git add .
git commit -m "Your message"
git push origin main
```

## Troubleshooting

### Port already in use

Run on another port:

```bash
npm run dev -- --port 3001
```

### Node version issues

Use current LTS Node.js (18+ recommended, 20+ preferred).

### Clean install

```bash
rm -rf node_modules package-lock.json
npm install
```

(Windows PowerShell alternative)

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

## License

No license file is currently included. Add a `LICENSE` file if you want to define reuse terms.
