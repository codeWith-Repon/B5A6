import { baseApi } from "@/redux/baseApi";


const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => ({
                url: "/notifications",
                method: "GET",
            }),
            providesTags: ["Notifications"],
        }),
        markAllAsRead: builder.mutation({
            query: () => ({
                url: "/notifications/mark-all-read",
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
        markAsRead: builder.mutation({
            query: (id: string) => ({
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