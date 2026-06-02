# Backend API Integration

This document describes the work done to integrate the frontend with the Ride Flow backend (`http://localhost:5000/api/v1`) following the Part 1 + Part 2 API guide.

The repository's existing scaffolding (RTK Query slices, types, pages) was audited against the API contract, then fixed and extended in three priority passes: **P0 (blocking)**, **P1 (functional gaps)**, **P2 (correctness/DX)**.

---

## 1. Environment

- Added [.env](.env) with `VITE_BASE_URL=http://localhost:5000/api/v1` and `VITE_NODE_ENV=development`. The base URL is consumed by [src/config/index.ts](src/config/index.ts) and passed to the axios instance.

---

## 2. Axios client

[src/lib/axios.ts](src/lib/axios.ts)

- `withCredentials: true` so the browser sends/receives the `accessToken` / `refreshToken` cookies.
- **401 → refresh interceptor.** When any request returns 401, the interceptor:
  1. Calls `POST /auth/refresh-token` (single-flight: concurrent failures share one refresh request).
  2. Retries the original request once.
  3. Bails out for the login and refresh routes themselves to avoid loops.

---

## 3. RTK Query base

[src/redux/baseApi.ts](src/redux/baseApi.ts)

`tagTypes` extended to:
`User`, `Driver`, `Vehicle`, `CurrentRide`, `RideRequest`, `RideHistory`, `Notifications`, `Sos`.

Tag invalidations were wired through the slices that mutate the corresponding resources (see each module below).

---

## 4. Auth module — [auth.api.ts](src/redux/features/auth/auth.api.ts)

Existing endpoints retained: `register`, `login`, `logout`, `sendOtp`, `verifyOtp`, `userInfo`, `updateProfile`.

**Added endpoints** to match the spec:

| Hook | Route |
|---|---|
| `useRefreshTokenMutation` | `POST /auth/refresh-token` |
| `useSetPasswordMutation` | `POST /auth/set-password` |
| `useChangePasswordMutation` | `POST /auth/change-password` |
| `useForgotPasswordMutation` | `POST /auth/forgot-password` |
| `useResetPasswordMutation` | `POST /auth/reset-password` |

**Type tightening** ([auth.types.ts](src/types/auth.types.ts)):
- `IRegister` now allows optional `phone`, `image`.
- `IRegisterResponse` aligned with full user shape (includes `phone`, `address`, `image`, `emergencyContactEmail`); `role` is `IRole`, `isActive` is `IsActive`.
- `Auth.provider` narrowed to `"google" | "credentials"`.
- New: `IRefreshTokenResponse`, `ISetPassword`, `IChangePassword`, `IForgotPassword`, `IResetPassword`.

`userInfo` and `updateProfile` are now explicitly typed (was `any`/`unknown`).

---

## 5. User module — [user.api.ts](src/redux/features/User/user.api.ts)

No changes (already had `getAllUsers` and `getUserById`).

---

## 6. Driver module — [driver.api.ts](src/redux/features/driver/driver.api.ts)

Existing endpoints: `registerVehicle`, `registerDriver`, `getVehicle`, `getDrivers`, `getDriverById`, `updateDriver`, `updateVehicle`, `getFreeDrivers`.

**Added:**
- `useUpdateDriverLocationMutation` → `PATCH /driver/me/location` (required by §12.5 — the driver tracking loop).

**Fixed:**
- Internal export name was misleadingly `authApi` — renamed to `driverApi`.
- `updateDriver` HTTP method `"patch"` → `"PATCH"`.
- `updateDriver` response now typed as `IResponse<IDriverResponse>`.
- `registerVehicle` accepts `IVehicle | FormData` (was rejecting multipart payloads at the type level).
- `registerVehicle` and `updateVehicle` invalidate the new `Vehicle` tag; `getVehicle` provides it.

**Types** ([driver.types.ts](src/types/driver.types.ts)):
- `IDriver` (register payload) now requires `user` and `vehicle` — fixes a silent validation failure on the server side.
- `IDriverUpdate` now allows updating `user` and `vehicle` per spec.
- `IDriverResponse` includes `rating`, `ratingCount`, `currentLocation`, `lastLocationAt`.
- `IUser`, `IVehicle`, `IVehicleResponse`, `Vehicle` use strict enums (`IRole`, `IsActive`, `VehicleType`, `DriverOnlineStatus`, `IDriverStatus`).
- Removed duplicate `IMeta` declaration.

---

## 7. Vehicle module — [vehicle.api.ts](src/redux/features/Vehicle/vehicle.api.ts)

- `getAllVehicles` and `getVehicleById` now provide the `Vehicle` tag, so they refetch after register/update.
- `IVehicle` uses `VehicleType` instead of `"CAR" | "BIKE"` (added missing enum members).

---

## 8. Ride module — [ride.api.ts](src/redux/features/ride/ride.api.ts) and [rider.api.ts](src/redux/features/Rider/rider.api.ts)

**Removed (spec mismatch / duplicates):**
- `setRideFare` — route `/ride/set-fare/:rideId` is not in the API spec.
- `getRideRequest` — duplicate of `getRides` (both hit `/ride/rides`). Kept the better-typed `getRides`.

**Kept / improved in [ride.api.ts](src/redux/features/ride/ride.api.ts):**
- `getRideHistory` → `GET /ride/history`, now provides the `RideHistory` tag (was incorrectly tagged `CurrentRide`).
- `getRideDetails` → `GET /ride/:rideId`, typed against `IRide`.

**Improved in [rider.api.ts](src/redux/features/Rider/rider.api.ts):**
- `bookRide` payload typed via new `IBookRide` interface (with `pickupCoordinates` for auto-match).
- `updateRideStatus` payload typed via `IUpdateRideStatusArgs` — `rideStatus` constrained to `RideStatus` union (handles the literal spaces in `"PICKED UP"` and `"IN TRANSIT"`).
- `verifyRideOtp` payload typed via `IVerifyRideOtpArgs` (`{ rideId, otp }`).
- `getRides` provides `RideRequest` tag.
- `updateRideStatus` invalidates `CurrentRide`, `RideRequest`, `RideHistory`.
- Normalized leading slash on `/ride/verify-otp/:rideId`.

**Types** ([ride.types.ts](src/types/ride.types.ts), [rideRequest.ts](src/types/rideRequest.ts)):
- `IRide.rideStatus`: `string` → `RideStatus`.
- `IRide` includes optional `pickupCoordinates`, `startedAt`, `completedAt`.
- `paymentMethod` and `paymentStatus` use proper enum types.
- New: `IBookRide` interface.

---

## 9. SOS module — [sos.api.ts](src/redux/features/SOS/sos.api.ts)

**Bug fix:** `sendEmergencyMessage` previously sent **no body** — it now sends `{ location, message? }` as the spec requires.

[Sos.tsx](src/components/modules/Driver/Sos.tsx) was updated to read the driver's current GPS via `navigator.geolocation`, format it as a location string, and pass it to the mutation. Falls back to `"Unknown location"` if geolocation is denied or times out.

**Added endpoints:**
- `useAddEmergencyContactMutation` → `POST /sos/add-contact`
- `useUpdateSosStatusMutation` → `PATCH /sos/update-status/:sosId`

---

## 10. Matching module — [matching.api.ts](src/redux/features/Matching/matching.api.ts) (new)

Entire module was missing. Added with two mutation endpoints (modeled as mutations because both are imperative POSTs for "preview" UIs, not auto-running queries):

| Hook | Route | Returns |
|---|---|---|
| `useGetMatchCandidatesMutation` | `POST /matching/candidates` | `IMatchCandidate[]` |
| `useGetBestMatchMutation` | `POST /matching/best` | `IMatchCandidate \| null` |

Includes `IMatchQuery` and `IMatchCandidate` interfaces matching the spec's `factors` shape (`distance`, `rating`, `experience`, `recency`).

---

## 11. Notifications module — [notification.api.ts](src/redux/features/Notification/notification.api.ts)

- All endpoints now typed with explicit generics.
- Added `INotification` interface modeling the spec's notification shape (`_id`, `user`, `title`, `message`, `type`, `isRead`, `meta`, `createdAt`).
- Path normalized to `/notifications/` (trailing slash, per spec).

---

## 12. Stats module — [stats.api.ts](src/redux/features/Stats/stats.api.ts)

- Endpoints now typed with `IStatsQuery` (`month`, `year`, `status`). Query types accept `string | null` to match what `useSearchParams` returns from the URL.

---

## 13. Type system — [src/types/index.ts](src/types/index.ts)

Added the full enum set from API guide §14:

```ts
export type IsActive = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type VehicleType = "CAR" | "BIKE" | "CNG" | "MINIVAN" | "PREMIUM" | "EV";
export type RideStatus =
  | "REQUESTED" | "ACCEPTED" | "PICKED UP" | "IN TRANSIT"
  | "COMPLETED" | "REJECTED" | "CANCELLED";
export type PaymentStatus = "PAID" | "UNPAID" | "CANCELLED" | "FAILED" | "REFUND";
export type PaymentMethod = "CASH" | "SSLCOMMERZ" | "PAYPAL" | "STRIPE";
export type SosStatus = "PENDING" | "RESOLVED" | "IGNORED";
```

These are now used throughout the slice/type files (see each module above).

---

## 14. Consumer fixes

The stricter types surfaced 12 pre-existing TypeScript errors in components. Each was fixed:

| File | Issue | Fix |
|---|---|---|
| [DriverForm.tsx](src/components/modules/Driver/DriverForm.tsx) | Submitting `user`/`vehicle` as possibly-undefined | Added guard; toast + return if no vehicle registered |
| [VehicleForm.tsx](src/components/modules/Driver/VehicleForm.tsx) | String `vehicleType` from form passed to typed payload | Cast to `VehicleType` |
| [ChangeRideStatus.tsx](src/components/modules/Ride/ChangeRideStatus.tsx) | `handleUpdate` accepted `string`, mutation requires `RideStatus` | Tightened the handler signature |
| [VerifyRideOtp.tsx](src/components/modules/Rider/VerifyRideOtp.tsx) | Missing `rideId` in payload | Added `rideId` prop (component is currently unused but no longer broken) |
| [UserProfileDropdown.tsx](src/components/modules/Rider/UserProfileDropdown.tsx) | Reading non-existent `rating`/`totalRides` on user object | Localized cast (these fields live on the Driver record, not User) |
| [EditVehicleInfo.tsx](src/components/modules/UpdateProfile/EditVehicleInfo.tsx) | Object literal not assignable to `IVehicle` | Cast on assignment |
| [BookingDetails.tsx](src/pages/BookingDetails.tsx) | `selectedPayment: string` passed as `PaymentMethod` | State typed as `PaymentMethod` |
| [RideDetails.tsx](src/pages/RideDetails.tsx) | Possibly-undefined `id` from route params | Used `skip` option |
| [EditProfileDialog.tsx](src/components/modules/UpdateProfile/EditProfileDialog.tsx) | `userInfo` required but caller passed possibly-undefined | Prop accepts `undefined`, all internal access uses optional chaining |
| [getSidebarItems.ts](src/utils/getSidebarItems.ts) | Required `IRole`, called with possibly-undefined | Param accepts `IRole \| undefined` |

---

## 15. Verification

- `npx tsc -b` — clean (0 errors).
- `npx vite build` — succeeds.

---

## 16. Deliberately deferred

- **Response-shape normalization.** Some queries return raw `IResponse<T>`, others use `transformResponse` to unwrap to `T`. 20+ consumer files depend on the current mix; standardizing would be a separate refactor pass.
- **`stats` query response shape.** Endpoints are typed as `IResponse<unknown>` — the spec doesn't define the exact response shape, and the existing chart components handle the actual payload with `any` casts.

---

## 17. Operating the integration

1. Ensure the backend is running on `http://localhost:5000`.
2. Restart the Vite dev server after the `.env` change is in place.
3. Sign in via the rider or driver account — cookies will be set and the 401-refresh path is now wired.
4. For driver flows, the `updateDriverLocation` mutation can be called on a 10–15s interval per spec §12.5 (consumer not yet wired — hook is available).
5. For matching previews before booking, call `useGetBestMatchMutation` with the rider's coords; otherwise `bookRide` will auto-match server-side when `pickupCoordinates` is supplied.
