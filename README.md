# RideFlow — Frontend

A production-grade ride-sharing platform frontend, built with React 19, Redux Toolkit + RTK Query, Tailwind CSS v4, and a WebSocket-driven real-time layer. Supports rider, driver, and admin roles with a single sapphire-accented design system.

---

## Highlights

- **Three role-based dashboards** — Rider, Driver, Admin/Super-admin.
- **Live ride flow** — book → match → OTP-verify → in-transit → complete, with status changes pushed over WebSocket (no polling).
- **Real-time chat** between rider and driver during an active ride.
- **Live driver tracking** — the driver's pin moves on the rider's map every ~3 s while ONLINE.
- **Premium map** — CartoDB Voyager (light) / Dark Matter (dark) tiles, theme-aware, with an animated route (glow + draw-in + flowing dashes).
- **Autocomplete location search** (Nominatim) with keyboard nav.
- **Cookie-based JWT auth** with automatic 401 → refresh-token retry.
- **Native dark mode** — every primitive, layout, and map tile flips with the theme.
- **Clean design system** — neutral surfaces, single sapphire accent, restrained typography. Linear/Stripe direction, no synthwave.

See **[FEATURES.md](./FEATURES.md)** for an in-depth walkthrough of every feature and how it is wired.
See **[INTEGRATION.md](./INTEGRATION.md)** for the REST API audit and integration history.

---

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19, Tailwind CSS v4, shadcn/ui primitives |
| State | Redux Toolkit + RTK Query (`axiosBaseQuery`) |
| Routing | react-router 7 |
| Maps | react-leaflet 5, leaflet-routing-machine, CartoDB tiles, Nominatim geocoding |
| Real-time | Native `WebSocket` with auto-reconnect singleton |
| Forms | react-hook-form + zod |
| Notifications | sonner |
| Build | Vite 7, TypeScript 5.8 |

---

## Getting started

### Prerequisites

- Node.js 18+
- A running RideFlow backend on `http://localhost:5000` (HTTP) and `ws://localhost:5000/ws` (WebSocket)

### Install

```bash
git clone https://github.com/codeWith-Repon/ride-management-frontend
cd ride-management-frontend
npm install
```

### Environment

Create a `.env` in the project root:

```bash
VITE_NODE_ENV=development
VITE_BASE_URL=http://localhost:5000/api/v1
VITE_WS_URL=ws://localhost:5000/ws
```

For production, replace with your deployed origins (use `wss://` for the socket).

### Run

```bash
npm run dev       # vite dev server on http://localhost:5173
npm run build     # tsc + vite production build
npm run lint      # ESLint
```

---

## Project structure

```
src/
  components/
    layout/              # Navbar, Footer, CommonLayout, DashboardLayout
    modules/             # feature components (HomePage, Authentication, Ride, Driver, Admin, …)
    shared/              # Loader, ManagementTable, SearchFilter, …
    ui/                  # shadcn/ui primitives (Button, Card, Input, …)
    SocketBridge.tsx     # WS → RTK Query cache fan-out
    DriverTrackingBridge.tsx  # driver geolocation → PATCH loop
  pages/                 # route components
  redux/
    baseApi.ts           # RTK Query base with axios
    axiosBaseQuery.ts
    features/            # one slice per API resource
  lib/
    axios.ts             # interceptor with 401 → refresh-token retry
    socket.ts            # RideSocket singleton (auto-reconnect, typed frames)
    tokenStorage.ts      # localStorage helper for accessToken
  hooks/                 # useTheme, use-mobile, use-file-upload
  config/                # VITE_* env wrapper
  context/, providers/   # theme provider
  routes/                # router config + sidebar items
  types/                 # shared TypeScript types
  utils/                 # WithAuth, getSidebarItems, spinner
  index.css              # design tokens + utilities
```

---

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Super-admin | `superadmin@super.com` | `Repon@123` |
| Driver | `reponahmedofficial@gmail.com` | `Repon@123` |
| Rider | `repon7253@gmail.com` | `Repon@123` |

---

## Live demo

- **Frontend:** https://ridebooking-lilac.vercel.app/
- **Backend API:** https://ride-booking-apis.vercel.app/

---

## Screenshots

![Home Page](./public/screenshot/Screenshot1.png)
![Admin Dashboard](./public/screenshot/Screenshot2.png)
![Rider Dashboard](./public/screenshot/Screenshot3.png)

---

## Contributing

PRs welcome. Read [FEATURES.md](./FEATURES.md) first to understand the architecture, then [INTEGRATION.md](./INTEGRATION.md) for the API contract details.

---

## License

MIT.
