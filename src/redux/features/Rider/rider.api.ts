import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { IGetResponse } from "@/types/driver.types";
import type { IRide } from "@/types/ride.types";


export const riderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        bookRide: builder.mutation({
            query: (data) => ({
                url: "/ride/book",
                method: "POST",
                data
            }),
            invalidatesTags: ["CurrentRide", "RideRequest"]
        }),
        getRides: builder.query<IGetResponse<IRide>, unknown>({
            query: (params) => ({
                url: "/ride/rides",
                method: "GET",
                params
            }),
            transformResponse: (response: IResponse<IGetResponse<IRide>>) => {
                return {
                    data: response.data.data,
                    meta: response.data.meta
                }
            }
        }),
        getCurrentRide: builder.query<IResponse<IRide>, unknown>({
            query: () => ({
                url: "/ride/current-ride",
                method: "GET",
            }),
            providesTags: ["CurrentRide"]
        }),
        updateRideStatus: builder.mutation({
            query: ({ rideId, rideStatus }) => ({
                url: `ride/update-status/${rideId}`,
                method: "POST",
                data: { rideStatus }
            }),
            invalidatesTags: ["CurrentRide", "RideRequest"]
        })
    }),
})

export const {
    useBookRideMutation,
    useGetRidesQuery,
    useUpdateRideStatusMutation,
    useGetCurrentRideQuery
} = riderApi