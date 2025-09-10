import { baseApi } from "@/redux/baseApi";

export const statsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        userDriverStats: builder.query({
            query: (params) => ({
                url: "/stats/monthly/user_driver",
                method: "GET",
                params
            })
        }),
        monthlyUserStats: builder.query({
            query: (params) => ({
                url: "/stats/monthly/user",
                method: "GET",
                params
            })
        })
    })
})

export const {
    useUserDriverStatsQuery,
    useMonthlyUserStatsQuery
} = statsApi