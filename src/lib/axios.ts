import config from '@/config';
import axios, { type AxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
    baseURL: config.baseUrl,
    withCredentials: true,
});

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<unknown> | null = null;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config as RetriableConfig | undefined;
        const status = error.response?.status;

        if (
            status !== 401 ||
            !original ||
            original._retry ||
            original.url?.includes('/auth/refresh-token') ||
            original.url?.includes('/auth/login')
        ) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            refreshPromise ??= axiosInstance
                .post('/auth/refresh-token')
                .finally(() => {
                    refreshPromise = null;
                });
            await refreshPromise;
            return axiosInstance(original);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);
