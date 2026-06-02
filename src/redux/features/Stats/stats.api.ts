import { baseApi } from "@/redux/baseApi";
import type { IResponse, IsActive } from "@/types";

export interface IStatsQuery {
    month: number | string | null;
    year: number | string | null;
    status?: IsActive | string | null;
}

export const statsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        userDriverStats: builder.query<IResponse<unknown>, IStatsQuery>({
            query: (params) => ({
                url: "/stats/monthly/user_driver",
                method: "GET",
                params
            })
        }),
        monthlyUserStats: builder.query<IResponse<unknown>, IStatsQuery>({
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
