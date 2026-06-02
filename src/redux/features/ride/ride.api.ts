import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { IRide } from "@/types/ride.types";

export const rideApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRideHistory: builder.query<IResponse<IRide[]>, void>({
            query: () => ({
                url: "/ride/history",
                method: "GET",
            }),
            providesTags: ["RideHistory"]
        }),

        getRideDetails: builder.query<IResponse<IRide>, string>({
            query: (rideId) => ({
                url: `/ride/${rideId}`,
                method: "GET",
            })
        })
    })
})

export const {
    useGetRideHistoryQuery,
    useGetRideDetailsQuery
} = rideApi
