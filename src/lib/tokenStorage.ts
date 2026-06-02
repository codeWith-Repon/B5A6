const ACCESS_TOKEN_KEY = "ride-flow:accessToken";

export const tokenStorage = {
    get(): string | null {
        try {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        } catch {
            return null;
        }
    },
    set(token: string) {
        try {
            localStorage.setItem(ACCESS_TOKEN_KEY, token);
        } catch {
            /* ignore */
        }
    },
    clear() {
        try {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
        } catch {
            /* ignore */
        }
    },
};
