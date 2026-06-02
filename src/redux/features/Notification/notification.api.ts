import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export interface INotification {
    _id: string;
    user: string;
    title: string;
    message: string;
    type?: string;
    isRead: boolean;
    meta?: Record<string, unknown>;
    createdAt: string;
}

const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<IResponse<INotification[]>, void>({
            query: () => ({
                url: "/notifications/",
                method: "GET",
            }),
            providesTags: ["Notifications"],
        }),
        markAllAsRead: builder.mutation<IResponse<null>, void>({
            query: () => ({
                url: "/notifications/mark-all-read",
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
        markAsRead: builder.mutation<IResponse<null>, string>({
            query: (id) => ({
                url: `/notifications/mark-read/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAllAsReadMutation,
    useMarkAsReadMutation
} = notificationApi;
