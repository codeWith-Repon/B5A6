# RideFlow — Frontend

A production-grade ride-sharing platform frontend, built with React 19, Redux Toolkit + RTK Query, Tailwind CSS v4, and a WebSocket-driven real-time layer. Supports rider, driver, and admin roles with a single sapphire-accented design system.

---

## Highlights

- **Three role-based dashboards** — Rider, Driver, Admin/Super-admin.
- **Live ride flow** — book → match → OTP-verify → in-transit → complete, with status changes pushed over WebSocket (no polling).
- **Real-time chat as a floating widget** — a Messenger-style bubble (`GlobalChatWidget`, mounted app-wide) appears on *any* page whenever you have an active ride, with an unread badge and avatars on both sides.
- **Bidirectional live tracking** — the driver's pin moves on the rider's map roughly every 12s while `ONLINE`, for the whole ride (`DriverTrackingBridge`). The rider's pin moves on the driver's map too (`RiderTrackingBridge`), but only up to pickup — it stops automatically once the ride is `PICKED UP`, since the driver has the rider by then. Both directions surface a toast if the browser denies/lacks geolocation instead of failing silently.
- **Premium map** — CartoDB Voyager (light) / Dark Matter (dark) tiles, theme-aware, with an animated route (glow + draw-in + flowing dashes), draggable pickup/drop pins, click-to-set, and a "use current location" control.
- **Autocomplete location search** (Nominatim) with keyboard nav — exact coordinates from a suggestion pick or "use current location" are passed straight through to the map instead of being re-geocoded from text, so pins land exactly where you meant.
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
- A running RideFlow backend (see [ride-flow-api](../ride-flow-api)) — for local dev, `http://localhost:5000` (HTTP) and `ws://localhost:5000/ws` (WebSocket). Note the backend's MongoDB must run as a replica set (booking uses transactions).

### Install

```bash
npm install
```

### Environment

Create a `.env` in the project root:

```bash
VITE_NODE_ENV=development
VITE_BASE_URL=http://localhost:5000/api/v1
VITE_WS_URL=ws://localhost:5000/ws

# Backend feature gates — both endpoints ship in the API
VITE_LIVE_TRACKING=true
VITE_MATCHING_ENABLED=true
```

### Run

```bash
npm run dev       # vite dev server on http://localhost:3000
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
    shared/               # Loader, ManagementTable, SearchFilter, …
    ui/                   # shadcn/ui primitives (Button, Card, Input, …)
    SocketBridge.tsx      # WS → RTK Query cache fan-out
    DriverTrackingBridge.tsx  # driver geolocation → PATCH loop (whole ride), toasts on permission denial
    RiderTrackingBridge.tsx   # rider geolocation → PATCH loop (pre-pickup only), same toast handling
    GlobalChatWidget.tsx  # app-root-mounted floating chat bubble (rider/driver only)
  pages/                 # route components
  redux/
    baseApi.ts            # RTK Query base with axios
    axiosBaseQuery.ts
    features/              # one slice per API resource
  lib/
    axios.ts               # interceptor with 401 → refresh-token retry
    socket.ts               # RideSocket singleton (auto-reconnect, typed frames)
    tokenStorage.ts          # localStorage helper for accessToken
  hooks/                  # useTheme, use-mobile, use-file-upload
  config/                  # VITE_* env wrapper
  context/, providers/      # theme provider
  routes/                  # router config + sidebar items
  types/                    # shared TypeScript types
  utils/                    # WithAuth, getSidebarItems, spinner
  index.css                 # design tokens + utilities
```

---

## Routes

| Path | Page | Notes |
|---|---|---|
| `/` | `HomePage` | Landing, hero booking widget |
| `/about`, `/contact`, `/faq`, `/support` | Static/marketing pages | |
| `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify` | Auth flow | `/verify` = OTP email verification, built on the shared `AuthShell` |
| `/get-ride` | `GetRide` | Set pickup/drop, pick a driver or auto-match |
| `/confirm-booking` | `BookingDetails` | Fare + payment confirmation |
| `/current-ride` | `CurrentRide` | Active ride: live map, OTP verification, status controls |
| `/ride-history`, `/ride/:id` | `RideHistory`, `RideDetails` | Past rides |
| `/user/profile` | `Profile` | Rider/driver profile, vehicle & driver info editing |
| `/driver/register` | `Driver` | Vehicle + driver-profile registration |
| `/driver/earnings` | `Earnings` | Driver earnings summary |
| `/notifications` | `Notifications` | In-app notification list |
| `/admin/*` | `AllDrivers`, `UserManagement`, `VehiclesManagement`, `SosReports`, `Analytics` | Admin/super-admin only, behind `DashboardLayout` |

Role gating is enforced via `WithAuth` (route wrapper) — see `routes/index.tsx`.

---

## Demo credentials (local dev)

Only the super admin is auto-seeded by the backend on first boot. Rider/driver demo accounts below assume you've seeded them yourself (see the backend README).

| Role | Email | Password |
|---|---|---|
| Super-admin | `superadmin@super.com` | `Repon@123` |
| Driver | `reponahmedofficial@gmail.com` | `Repon@123` |
| Rider | `repon7253@gmail.com` | `Repon@123` |

The login page has one-click buttons for all three.

---

## Live demo

- **Frontend:** https://ridebooking-lilac.vercel.app/
- **Backend API:** https://ride-booking-apis.vercel.app/

---

## Contributing

PRs welcome. Read [FEATURES.md](./FEATURES.md) first to understand the architecture, then [INTEGRATION.md](./INTEGRATION.md) for the API contract details.

---

## License

MIT.
