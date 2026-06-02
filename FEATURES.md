# RideFlow — Features & Architecture

A complete walkthrough of every feature in the app and how it is wired internally. Use this as the engineering reference; use [README.md](./README.md) for the high-level overview and [INTEGRATION.md](./INTEGRATION.md) for the REST API audit.

---

## Table of contents

1. [Foundations](#1-foundations)
2. [Authentication & session](#2-authentication--session)
3. [Role-based routing](#3-role-based-routing)
4. [Booking flow (rider)](#4-booking-flow-rider)
5. [Premium map](#5-premium-map)
6. [Location autocomplete](#6-location-autocomplete)
7. [Animated route](#7-animated-route)
8. [Driver matching](#8-driver-matching)
9. [Real-time WebSocket layer](#9-real-time-websocket-layer)
10. [Live ride status](#10-live-ride-status)
11. [Pickup OTP verification](#11-pickup-otp-verification)
12. [Rider ↔ driver chat](#12-rider--driver-chat)
13. [Live driver location tracking](#13-live-driver-location-tracking)
14. [Driver workflow](#14-driver-workflow)
15. [Admin dashboards](#15-admin-dashboards)
16. [SOS / emergency](#16-sos--emergency)
17. [Notifications](#17-notifications)
18. [Design system](#18-design-system)
19. [Theming](#19-theming)
20. [Reliability patterns](#20-reliability-patterns)

---

## 1. Foundations

### HTTP client

[src/lib/axios.ts](src/lib/axios.ts) creates a single axios instance with:

- `baseURL` from `VITE_BASE_URL`
- `withCredentials: true` — every request sends the `accessToken` / `refreshToken` cookies set by the backend
- A response interceptor that catches `401`, fires `POST /auth/refresh-token` once (single-flight via a shared promise so concurrent failures don't all retry), then retries the original request

Bypass paths: `/auth/login` and `/auth/refresh-token` themselves never trigger the retry loop.

### RTK Query base

[src/redux/baseApi.ts](src/redux/baseApi.ts) creates a single `baseApi` with [axiosBaseQuery](src/redux/axiosBaseQuery.ts) so every slice shares the axios instance and its interceptors.

`tagTypes`:
`User`, `Driver`, `Vehicle`, `CurrentRide`, `RideRequest`, `RideHistory`, `Notifications`, `Sos`, `Chat`.

Slices live under `src/redux/features/<Resource>/<resource>.api.ts` and inject endpoints into `baseApi`.

### Token storage

[src/lib/tokenStorage.ts](src/lib/tokenStorage.ts) is a small `localStorage` wrapper holding the JWT access token. Why a separate copy when cookies already work?

- **Browsers**: REST uses the cookie automatically; the token in storage feeds the WebSocket `?token=` query.
- **Mobile/PWA**: same code can fall back to header auth via this helper.
- **Logout**: cleared explicitly so the next login starts fresh.

---

## 2. Authentication & session

### Credentials login

[LoginForm.tsx](src/components/modules/Authentication/LoginForm.tsx) → `useLoginMutation()` → `POST /auth/login`.

After a successful response:
1. `tokenStorage.set(response.data.accessToken)`
2. `rideSocket.connect(accessToken)` (see §9)
3. Redirect to `location.state?.from` (preserved when arriving via redirect from a protected route) or `/`

The form also exposes three demo-login buttons (Admin / User / Driver) that pre-fill and submit credentials.

### Logout

Two entry points use the same shape ([Navbar.tsx](src/components/layout/Navbar.tsx), [UserProfileDropdown.tsx](src/components/modules/Rider/UserProfileDropdown.tsx)):
1. `useLogOutMutation()` → `POST /auth/logout` — clears cookies server-side
2. `tokenStorage.clear()`
3. `rideSocket.close()`
4. `dispatch(authApi.util.resetApiState())` — wipes all RTK Query caches

### Registration & email verification

- [RegisterForm.tsx](src/components/modules/Authentication/RegisterForm.tsx) → `POST /user/register-user`
- On success, redirects to `/verify` which uses `useSendOtpMutation` + `useVerifyOtpMutation` against `/otp/send` and `/otp/verify`.

### Google OAuth

A button in the auth forms opens `${VITE_BASE_URL}/auth/google` which kicks off the server's Google flow and redirects back with cookies set.

### Password actions

The auth slice exposes hooks for `refreshToken`, `setPassword`, `changePassword`, `forgotPassword`, `resetPassword` — see [auth.api.ts](src/redux/features/auth/auth.api.ts). UI for password reset is not yet wired in this build but the endpoints are typed and ready.

---

## 3. Role-based routing

[src/routes](src/routes) wires the routes. [WithAuth.tsx](src/utils/WithAuth.tsx) wraps protected pages and checks role from `useUserInfoQuery`. Roles per [src/types/index.ts](src/types/index.ts):

```ts
type IRole = "SUPER_ADMIN" | "ADMIN" | "RIDER" | "DRIVER"
```

The sidebar shown in [DashboardLayout.tsx](src/components/layout/DashboardLayout.tsx) is built from [getSidebarItems.ts](src/utils/getSidebarItems.ts) — different items per role.

The Navbar also filters its links by role for the top-level `Dashboard` link.

---

## 4. Booking flow (rider)

The rider creates a ride in three steps, with a 3-step indicator in the page header and a sticky action bar at the bottom.

### Step 1 — Set route ([GetRide.tsx](src/pages/GetRide.tsx))

- [LocationInputSection.tsx](src/components/modules/HomePage/Ride/LocationInputSection.tsx) — combined card with a timeline rail (circle → line → square) separating Pickup and Drop fields. Side button swaps them. Inline crosshair triggers `navigator.geolocation.getCurrentPosition` + reverse-geocode via Nominatim.
- All state is mirrored to URL search params (`pickup`, `drop`, `distance`, `time`, `driver`) so the page is fully refresh-safe.

### Step 2 — Pick a driver

- [AvailableDriversSection.tsx](src/components/modules/HomePage/Ride/AvailableDriversSection.tsx) shows free drivers from `useGetFreeDriversQuery` → `GET /driver/free-drivers`.
- Empty states cover three cases: no destination, no drivers nearby, route not found.
- Selection is local state; the rider can also skip selection and let the server auto-match.

### Step 3 — Confirm

The sticky bar shows two CTAs:
- **Auto-match** (outline) — appears when the route is set but no driver is selected. Calls `/ride/book` without a driverId — the server runs the matching algorithm.
- **Continue** (primary) — enabled when both route and driver are ready.

Both navigate to `/confirm-booking` carrying the URL params. [BookingDetails.tsx](src/pages/BookingDetails.tsx) then fires `useBookRideMutation()` → `POST /ride/book` after the rider selects a payment method (CASH default; STRIPE/PAYPAL/SSLCommerz shown as "Soon").

---

## 5. Premium map

Implemented in [BookingMapSection.tsx](src/components/modules/HomePage/Ride/BookingMapSection.tsx).

### Tile choice

Instead of default OpenStreetMap (gritty look), we use **CartoDB** raster tiles which feel like Apple Maps / Stripe map demos — clean type, soft colors, no API key required.

| Theme | Tile set | URL |
|---|---|---|
| Light | Voyager | `basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png` |
| Dark  | Dark Matter | `basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png` |

The map calls `useTheme()` to resolve the active theme (including `system`), then picks the right tile set. The `TileLayer` is keyed by theme so React forces a remount when the user toggles — instant theme swap on the map.

### Custom markers

Three `L.divIcon` markers, each a styled `<div>` with CSS box-shadows for the halo:

| Marker | Visual |
|---|---|
| Pickup | Blue circle, white border, sapphire halo |
| Drop | Rose square, white border, rose halo |
| Driver (live) | Sapphire circle with car SVG inside, large soft halo, z-index +500 so it sits on top |

### Overlays

- **Top center** — a small chip appears when click-to-pick mode is active: "Tap the map to set pickup".
- **Bottom center** — once a route is computed, a chip shows distance + ETA, or "Route not found" in destructive style.
- No control buttons clutter the map; zoom is via scroll + pinch.

---

## 6. Location autocomplete

[LocationInputSection.tsx](src/components/modules/HomePage/Ride/LocationInputSection.tsx) — the `<LocationAutocomplete>` subcomponent.

### Data source

Free **Nominatim** OSM search:
`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=…`

### Behavior

- **300ms debounce** before firing the search.
- **AbortController** cancels the previous request if the user keeps typing.
- Skips the search when length < 3 chars (shown as `"Keep typing to search…"` in the popover).
- A `skipNextFetchRef` flag prevents an immediate refetch right after the user picks a suggestion (the value change would otherwise re-trigger the effect).
- Keyboard: `↑` `↓` move highlight, `Enter` picks, `Esc` closes.
- Mouse: hover highlights, click picks.
- Closes on outside `mousedown`.

### Pickup-specific extras

The pickup field's dropdown shows a permanent first item — **"Use current location"** — which calls `navigator.geolocation.getCurrentPosition` then reverse-geocodes the coords via Nominatim's `/reverse` endpoint.

### Display

Each suggestion shows the first comma-separated part bold (the place name) and the rest muted underneath — easier to scan than one long string.

---

## 7. Animated route

After Leaflet-routing-machine receives a route from OSRM, three SVG `<path>` layers are stacked, controlled by [RoutingMachine.tsx](src/components/modules/HomePage/Ride/RoutingMachine.tsx) and the CSS in [src/index.css](src/index.css).

| Layer | Class | Visual | Animation |
|---|---|---|---|
| 1. Halo | `.route-halo` | 12px translucent indigo with `drop-shadow` glow | none |
| 2. Base | `.route-base` | 5px solid indigo | `route-draw` 1.2 s ease-out — `stroke-dasharray` goes from `0 5000` to `5000 0`, making the line *draw itself* from pickup to drop |
| 3. Flow | `.route-flow` | 2.5px white dashes (`dashArray: 8,14`) | `route-march` 1.2 s linear infinite — `stroke-dashoffset` advances `-44 px`, making the dashes *flow* continuously toward the destination |

Pure CSS — no JS animation loop. Respects `prefers-reduced-motion`: dashes and draw-in both freeze for users with that preference.

---

## 8. Driver matching

Server-side weighted scoring (distance 0.55, rating 0.20, recency 0.15, experience 0.10) — see Part 1 §6 of the API guide. The frontend exposes two hooks from [matching.api.ts](src/redux/features/Matching/matching.api.ts):

| Hook | Route | Use |
|---|---|---|
| `useGetMatchCandidatesMutation` | `POST /matching/candidates` | Preview top-N drivers near a point |
| `useGetBestMatchMutation` | `POST /matching/best` | Single best candidate (for an "auto-match" preview) |

In practice, the rider can also just omit `driver` from `POST /ride/book` and the server auto-runs the same algorithm — used by the **Auto-match** button on the booking page.

---

## 9. Real-time WebSocket layer

### The singleton

[src/lib/socket.ts](src/lib/socket.ts) — `RideSocket` class:

- Connects to `VITE_WS_URL` with optional `?token=<accessToken>` query (or falls back to the `accessToken` cookie if no token is provided).
- Exponential-backoff reconnect: 1 s → 2 s → 4 s → 8 s → 16 s → 30 s cap.
- Tracks status (`idle | connecting | open | closed`) with a separate pub/sub so the UI can show "Reconnecting…" badges if needed.
- Typed client → server frames: `ping`, `chat:send`, `chat:read`.
- Typed server → client frames: `connected`, `pong`, `chat:new`, `chat:read`, `notification:new`, `ride:status`, `ride:otp-verified`, `error`.

### The bridge

[SocketBridge.tsx](src/components/SocketBridge.tsx) is mounted once in [main.tsx](src/main.tsx). It:

1. **Connects** when `useUserInfoQuery` resolves to a logged-in user, **closes** when the user logs out.
2. **Routes incoming frames** into RTK Query — see the table below.
3. **Refetches** on reconnect by invalidating tags so any subscribed query auto-refreshes.

| Frame | Action |
|---|---|
| `notification:new` | sonner toast + invalidate `Notifications` tag |
| `ride:status` | invalidate `CurrentRide`, `RideRequest`, `RideHistory` |
| `ride:otp-verified` | invalidate `CurrentRide` |
| `chat:new` | `chatApi.util.updateQueryData('getRideMessages', rideId, …)` — push the message into the cache; dedupes by `_id` (no refetch) |
| `chat:read` | `updateQueryData` to set `readAt` on my unread messages (turn ✓ into ✓✓) |
| `error` | console warn |
| reconnect | invalidate `CurrentRide` + `Notifications` + `Chat` |

The patch via `updateQueryData` is critical — it means new chat messages arrive instantly with **zero HTTP overhead**.

---

## 10. Live ride status

The rider's [CurrentRide.tsx](src/pages/CurrentRide.tsx) page subscribes to `useGetCurrentRideQuery(undefined, { pollingInterval: 3000 })` — but the polling is mostly a safety net.

In normal operation:
1. The driver fires `POST /ride/update-status/:rideId` (e.g. → `ACCEPTED`).
2. The server pushes a `ride:status` frame.
3. `SocketBridge` invalidates the `CurrentRide` tag.
4. RTK Query refetches and re-renders.

The CurrentRide UI shows status as a pill badge, plus role-dependent action buttons via [ChangeRideStatus.tsx](src/components/modules/Ride/ChangeRideStatus.tsx):

- **Rider** while `REQUESTED`: Cancel ride.
- **Driver** while `REQUESTED`: Accept / Reject.
- **Driver** while `ACCEPTED`: Mark as Picked Up (only after OTP verified).
- **Driver** while `PICKED UP`: Start Transit.
- **Driver** while `IN TRANSIT`: Finish Ride.

The `rideStatus` field is the strict union `"REQUESTED" | "ACCEPTED" | "PICKED UP" | "IN TRANSIT" | "COMPLETED" | "REJECTED" | "CANCELLED"` — note the literal spaces in `"PICKED UP"` and `"IN TRANSIT"`.

When status becomes `COMPLETED`/`CANCELLED`/`REJECTED`, the page redirects to `/ride/:id` (history detail view).

---

## 11. Pickup OTP verification

When a ride transitions to `ACCEPTED`, the server returns a 6-digit OTP visible only to the rider (on the ride object). [OtpVerification.tsx](src/components/modules/Ride/Otpverification.tsx) renders an input for the driver:

1. Driver enters the 6 digits the rider read out.
2. `useVerifyRideOtpMutation` → `POST /ride/verify-otp/:rideId`.
3. Server emits `ride:otp-verified` frame to both parties.
4. SocketBridge invalidates `CurrentRide`.
5. The Mark-as-Picked-Up action unlocks for the driver.

If the socket is down, the page's 3-second polling still picks it up via the next REST refetch — so OTP works offline-tolerant.

---

## 12. Rider ↔ driver chat

[ChatPanel.tsx](src/components/modules/Ride/Chat/ChatPanel.tsx) renders inside [CurrentRide.tsx](src/pages/CurrentRide.tsx). Available only when `rideStatus ∈ { ACCEPTED, PICKED UP, IN TRANSIT }` — disabled with a "Closed" pill otherwise.

### Initial thread load

`useGetRideMessagesQuery(rideId)` → `GET /messages/ride/:rideId`. Sender + recipient are populated.

### Sending

Preferred path is the socket — instant, no HTTP round-trip:

```ts
rideSocket.send({ type: 'chat:send', rideId, text });
```

If the socket is down, the panel transparently falls back to `useSendRideMessageMutation` → `POST /messages/ride/:rideId`.

The UI **does not append the message locally**. Instead it waits for the server's `chat:new` echo to land via `SocketBridge`, which patches the chat cache. This means the sender and recipient see exactly the same message (same `_id`, same `createdAt`) — there's never a divergence.

### Receiving / read receipts

- `chat:new` → message pushed into the chat cache (deduped by `_id`).
- On panel mount, if there are unread messages addressed to the current user, fire `chat:read` over the socket (REST fallback when down). The server emits `chat:read` to both parties; the bridge patches each unread message's `readAt` so the sender flips from `✓` to `✓✓`.

### UI details

- Avatars only on incoming messages; outgoing messages are right-aligned and sapphire.
- Timestamps + read state inline at the bottom of each bubble.
- **Auto-scroll only when the user is already near the bottom** — never yanks focus away from someone reading earlier history.
- Skeleton placeholders while loading; empty state copy adapts to "ride active" vs "ride closed".
- 2000-char limit on `<input>`.

---

## 13. Live driver location tracking

### Driver side — broadcaster

[DriverTrackingBridge.tsx](src/components/DriverTrackingBridge.tsx) — mounted globally in [main.tsx](src/main.tsx).

It runs only when:
- The signed-in user has role `DRIVER`, **and**
- Their driver record's `availabilityStatus === ONLINE` (re-checked whenever the driver toggles ONLINE/OFFLINE via [DriverStatusToggler.tsx](src/components/modules/Driver/DriverStatusToggler.tsx))

While active:
- Fires `navigator.geolocation.getCurrentPosition` immediately, then on a 12-second interval.
- Pushes `{ lat, lng }` to `useUpdateDriverLocationMutation` → `PATCH /driver/me/location`.
- Skips overlapping requests via an `inFlightRef`.
- If the user denies geolocation, the loop stops cleanly until the next status flip.

### Rider side — consumer

No extra polling needed. The CurrentRide page already polls `useGetCurrentRideQuery` every 3 s. The response includes the populated `driver` object — and the driver's `currentLocation` field is a GeoJSON `Point` (`{ type: 'Point', coordinates: [lng, lat] }`).

The page passes that to [BookingMapSection](src/components/modules/HomePage/Ride/BookingMapSection.tsx) as the `driverCoords` prop (swapping to `[lat, lng]` for Leaflet). The map renders the car icon pin on top of the route, refreshing every ~3 s. **No additional REST calls.**

### Tuning

Change `UPDATE_INTERVAL_MS` in [DriverTrackingBridge.tsx](src/components/DriverTrackingBridge.tsx) (default 12 000 ms). Battery vs freshness trade-off — 20 s is gentler on the phone.

---

## 14. Driver workflow

### Onboarding

1. Sign up as a regular user.
2. From the Driver dashboard, fill the **Vehicle** form ([VehicleForm.tsx](src/components/modules/Driver/VehicleForm.tsx)) — multipart upload, brand/model/license + images.
3. Fill the **Driver** form ([DriverForm.tsx](src/components/modules/Driver/DriverForm.tsx)) — license number + experience. The form auto-links `user` + `vehicle` from the prior step.
4. Wait for admin approval — `status` goes `PENDING` → `APPROVED`. While pending, [PendingDialog](src/components/modules/Driver/PendingDialog.tsx) is shown.

### Going online

The sidebar's [DriverStatusToggler](src/components/modules/Driver/DriverStatusToggler.tsx) flips `availabilityStatus` between `ONLINE`/`OFFLINE` via `useUpdateDriverMutation`. This is what enables the location loop and lets the driver appear in matching.

### Receiving a ride

When a ride is booked targeting this driver (or auto-matched), the server emits `notification:new` + `ride:status` frames. The bridge invalidates `CurrentRide`, the active-ride sidebar card updates, and the driver can navigate to `/current-ride` to Accept / Reject.

---

## 15. Admin dashboards

[ManagementTable.tsx](src/components/shared/ManagementTable.tsx) is a generic table with sortable columns (URL-param-driven), a dropdown actions menu (View / Edit / Approve / Suspend / Delete), and a refreshing overlay state.

- **User management** ([UserManagement.tsx](src/pages/Admin/UserManagement.tsx)) — `GET /user/users` with search/filter/pagination.
- **Driver management** ([AllDrivers.tsx](src/pages/Admin/AllDrivers.tsx)) — `GET /driver/drivers` with status/vehicle-type filters and bulk approve/suspend.
- **Vehicle management** ([VehiclesManagement.tsx](src/pages/Admin/VehiclesManagement.tsx)) — `GET /vehicle/vehicles`.
- **Analytics** ([Analytics.tsx](src/pages/Admin/Analytics.tsx)) — `GET /stats/monthly/user` + `GET /stats/monthly/user_driver` rendered with Recharts (bar + line). Filter chips for month/year/status.

All list queries support `searchTerm`, `page`, `limit`, `sort`, `fields` query params.

---

## 16. SOS / emergency

[Sos.tsx](src/components/modules/Driver/Sos.tsx) renders a red **Send SOS** button in the sidebar whenever the active ride is in `PICKED UP` or `IN TRANSIT`.

On click:
1. Grabs the driver's current GPS via `navigator.geolocation`.
2. Falls back to `"Unknown location"` if denied.
3. Fires `useSendEmergencyMessageMutation` → `POST /sos/send-message/:rideId` with `{ location, message }`.
4. The server emails all the rider's pre-saved emergency contacts.

Contact management uses `useAddEmergencyContactMutation` → `POST /sos/add-contact`.

---

## 17. Notifications

The notifications slice ([notification.api.ts](src/redux/features/Notification/notification.api.ts)) provides:

- `useGetNotificationsQuery` → `GET /notifications/`
- `useMarkAsReadMutation` → `PATCH /notifications/mark-read/:id`
- `useMarkAllAsReadMutation` → `PATCH /notifications/mark-all-read`

[NotificationDropdown.tsx](src/components/modules/HomePage/NotificationDropdown.tsx) in the navbar shows the list with an unread badge.

Live updates: whenever the server emits `notification:new`, SocketBridge:
1. Shows a **sonner toast** with `title` + `message`.
2. Invalidates the `Notifications` tag → the dropdown query auto-refetches.

Notification triggers (per the backend): ride booked → driver, ride accepted/rejected → rider, picked up → rider, completed → rider, cancelled → driver.

---

## 18. Design system

### Tokens

Defined as CSS custom properties in [src/index.css](src/index.css):

- **Sapphire primary** — `oklch(0.52 0.2 260)` light / `oklch(0.65 0.18 260)` dark.
- Background, foreground, card, popover, secondary, muted, accent, border, ring — all near-monochrome neutrals with low chroma.
- Radius: `0.75rem`.

No multi-color gradients on body, no aurora blobs, no neon shadows — restrained, product-grade.

### Primitives ([src/components/ui](src/components/ui))

shadcn/ui components themed against the tokens:

| Component | Notes |
|---|---|
| Button | Flat primary, outline, secondary, ghost, link, destructive. `transition-colors` only, no scale/glow. |
| Card | `bg-card` + `border` + `shadow-sm`. |
| Input/Select | Solid background, h-9, standard ring focus. |
| Badge | Flat primary/secondary, no gradient. |
| Table | Uppercase muted column headers, hairline row dividers. |
| Skeleton | Plain `bg-muted` pulse. |

### Utility classes

A few helpers in `index.css`:

- `gradient-brand` — a soft 2-stop sapphire gradient. Used sparingly (driver pin, hero accents).
- `gradient-brand-text` — currently resolves to plain foreground; kept as a hook for future themed accents.
- `surface-blur` — translucent backdrop blur for sticky headers.
- `aurora` — single very soft radial wash at top of an auth/landing layout (no animated blobs).

### Layout chrome

- [Navbar.tsx](src/components/layout/Navbar.tsx) — sticky, opaque `bg-background` + bottom border, picks up an extra `shadow-sm` once `scrollY > 8`. Role-aware nav links.
- [Footer.tsx](src/components/layout/Footer.tsx) — three-column link list + social icons in outline-button style.
- [DashboardLayout.tsx](src/components/layout/DashboardLayout.tsx) + [app-sidebar.tsx](src/components/app-sidebar.tsx) — sidebar with active-state gradient pill, role badge with pulsing dot. Sticky header sits inside the inset.
- [CommonLayout.tsx](src/components/layout/CommonLayout.tsx) — plain wrapper so `position: sticky` works (an earlier `overflow-x-hidden` parent was breaking it; now removed).

---

## 19. Theming

[theme.provider.tsx](src/providers/theme.provider.tsx) implements `light | dark | system` with a `localStorage` key. Default is `dark`.

- The `<html>` element gets `class="dark"` (or `"light"`); all token vars switch immediately.
- [useTheme](src/hooks/useTheme.ts) returns the current theme; [BookingMapSection](src/components/modules/HomePage/Ride/BookingMapSection.tsx) reads it to choose the right tile set (resolving `system` via `prefers-color-scheme`).
- [ModeToggler.tsx](src/components/layout/ModeToggler.tsx) shows the toggle in the navbar.

---

## 20. Reliability patterns

### 401 refresh-retry (single-flight)

In [src/lib/axios.ts](src/lib/axios.ts), a shared `refreshPromise` ensures that if 5 requests fail with 401 at once, only **one** refresh call is fired; all 5 await it and retry.

### Socket auto-reconnect

Exponential backoff (1 s → 30 s cap). The `intentionalClose` flag prevents reconnect after the user explicitly logs out.

### Cache invalidation on reconnect

[SocketBridge](src/components/SocketBridge.tsx) tracks the last status. The moment status transitions to `open` *after* a prior `open` (i.e. a reconnect, not the initial connect), it invalidates `CurrentRide`, `Notifications`, and `Chat` so the UI catches up on anything that happened while offline.

### Optimistic-less chat

By design, sent messages do **not** show locally until the `chat:new` echo arrives. This guarantees a single source of truth and avoids dedupe edge cases when the same message gets replayed on reconnect.

### Cookie + token dual auth

REST uses cookies; the WebSocket prefers the localStorage token (query param) but falls back to the cookie if the token isn't there (e.g. after a page reload before login state hydrates). Either path will satisfy the backend.

### Strict enum types

All API enums from the backend spec are mirrored in [src/types/index.ts](src/types/index.ts) — `IsActive`, `VehicleType`, `RideStatus`, `PaymentStatus`, `PaymentMethod`, `SosStatus`, `IRole`, `IDriverStatus`, `DriverOnlineStatus`. Comparing strings like `'PICKED UP'` (note the literal space!) is enforced at compile time across the app.

---

## Quick reference

| Concern | Files |
|---|---|
| HTTP client + refresh | [src/lib/axios.ts](src/lib/axios.ts) |
| WebSocket singleton | [src/lib/socket.ts](src/lib/socket.ts) |
| Token storage | [src/lib/tokenStorage.ts](src/lib/tokenStorage.ts) |
| RTK Query root | [src/redux/baseApi.ts](src/redux/baseApi.ts) |
| Socket → cache bridge | [src/components/SocketBridge.tsx](src/components/SocketBridge.tsx) |
| Driver location loop | [src/components/DriverTrackingBridge.tsx](src/components/DriverTrackingBridge.tsx) |
| Booking flow page | [src/pages/GetRide.tsx](src/pages/GetRide.tsx) |
| Map + animated route | [BookingMapSection.tsx](src/components/modules/HomePage/Ride/BookingMapSection.tsx) + [RoutingMachine.tsx](src/components/modules/HomePage/Ride/RoutingMachine.tsx) |
| Live ride page | [src/pages/CurrentRide.tsx](src/pages/CurrentRide.tsx) |
| Chat panel | [src/components/modules/Ride/Chat/ChatPanel.tsx](src/components/modules/Ride/Chat/ChatPanel.tsx) |
| Theme | [src/providers/theme.provider.tsx](src/providers/theme.provider.tsx) + [src/hooks/useTheme.ts](src/hooks/useTheme.ts) |
| Design tokens | [src/index.css](src/index.css) |

If something here drifts from the code, please open an issue — this doc should track the build.
