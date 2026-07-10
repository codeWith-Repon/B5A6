import config from "@/config";

export type ServerFrame =
    | { type: "connected"; userId: string; role: string }
    | { type: "pong" }
    | { type: "chat:new"; rideId: string; message: IRideMessage }
    | { type: "chat:read"; rideId: string; by: string; readAt: string }
    | { type: "notification:new"; notification: IRideNotificationFrame }
    | { type: "ride:status"; rideId: string; rideStatus: string; ride: unknown }
    | { type: "ride:otp-verified"; rideId: string }
    | {
          type: "location:update";
          rideId: string;
          driverId: string;
          lat: number;
          lng: number;
          updatedAt: string;
      }
    | { type: "error"; message: string }
    | { type: string; [key: string]: unknown };

export type ClientFrame =
    | { type: "ping" }
    | { type: "chat:send"; rideId: string; text: string }
    | { type: "chat:read"; rideId: string };

export interface IRideMessage {
    _id: string;
    ride: string;
    sender: {
        _id: string;
        name: string;
        role: "RIDER" | "DRIVER";
        image?: string;
    };
    recipient: {
        _id: string;
        name: string;
        role: string;
        image?: string;
    };
    text: string;
    readAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IRideNotificationFrame {
    _id: string;
    user: string;
    title: string;
    message: string;
    type?: string;
    isRead: boolean;
    meta?: Record<string, unknown>;
    createdAt: string;
}

type Listener = (msg: ServerFrame) => void;
type StatusListener = (status: SocketStatus) => void;

export type SocketStatus = "idle" | "connecting" | "open" | "closed";

class RideSocket {
    private ws: WebSocket | null = null;
    private listeners = new Set<Listener>();
    private statusListeners = new Set<StatusListener>();
    private retry = 0;
    private url = "";
    private status: SocketStatus = "idle";
    private intentionalClose = false;
    private reconnectTimer: number | null = null;

    connect(accessToken?: string | null) {
        if (this.ws && (this.status === "open" || this.status === "connecting")) {
            return;
        }
        // If no token is provided we still attempt to connect — the server
        // accepts the `accessToken` cookie as a fallback on same-origin.
        this.url = accessToken
            ? `${config.wsUrl}?token=${encodeURIComponent(accessToken)}`
            : config.wsUrl;
        this.intentionalClose = false;
        this.open();
    }

    private open() {
        this.setStatus("connecting");
        try {
            this.ws = new WebSocket(this.url);
        } catch {
            this.scheduleReconnect();
            return;
        }

        this.ws.onopen = () => {
            this.retry = 0;
            this.setStatus("open");
        };

        this.ws.onmessage = (e) => {
            let msg: ServerFrame | null = null;
            try {
                msg = JSON.parse(e.data) as ServerFrame;
            } catch {
                return;
            }
            this.listeners.forEach((l) => {
                try {
                    l(msg as ServerFrame);
                } catch (err) {
                    console.error("[socket] listener error", err);
                }
            });
        };

        this.ws.onclose = () => {
            this.setStatus("closed");
            if (!this.intentionalClose) {
                this.scheduleReconnect();
            }
        };

        this.ws.onerror = () => {
            // onclose will follow
            this.ws?.close();
        };
    }

    private scheduleReconnect() {
        if (this.reconnectTimer) {
            window.clearTimeout(this.reconnectTimer);
        }
        const delay = Math.min(30_000, 1_000 * 2 ** this.retry++);
        this.reconnectTimer = window.setTimeout(() => {
            this.open();
        }, delay);
    }

    private setStatus(status: SocketStatus) {
        if (this.status === status) return;
        this.status = status;
        this.statusListeners.forEach((l) => {
            try {
                l(status);
            } catch (err) {
                console.error("[socket] status listener error", err);
            }
        });
    }

    send(payload: ClientFrame) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(payload));
        }
    }

    on(fn: Listener) {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    }

    onStatus(fn: StatusListener) {
        this.statusListeners.add(fn);
        fn(this.status);
        return () => {
            this.statusListeners.delete(fn);
        };
    }

    isOpen() {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    getStatus(): SocketStatus {
        return this.status;
    }

    close() {
        this.intentionalClose = true;
        if (this.reconnectTimer) {
            window.clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.ws?.close();
        this.ws = null;
        this.retry = 0;
        this.setStatus("idle");
    }
}

export const rideSocket = new RideSocket();
