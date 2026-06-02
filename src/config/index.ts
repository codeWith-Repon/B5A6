const asBool = (v: unknown) => v === "true" || v === true;

const config = {
    environment: import.meta.env.VITE_NODE_ENV,
    baseUrl: import.meta.env.VITE_BASE_URL,
    wsUrl: import.meta.env.VITE_WS_URL ?? "ws://localhost:5000/ws",
    /** Backend has PATCH /driver/me/location — flip on once it ships. */
    liveTracking: asBool(import.meta.env.VITE_LIVE_TRACKING),
    /** Backend has /matching/* — flip on once it ships. */
    matchingEnabled: asBool(import.meta.env.VITE_MATCHING_ENABLED),
};

export default config;
