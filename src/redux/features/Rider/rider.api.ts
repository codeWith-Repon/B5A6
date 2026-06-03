import { baseApi } from "@/redux/baseApi";
import type { IResponse, RideStatus } from "@/types";
import type { IGetResponse } from "@/types/driver.types";
import type { IBookRide, IRide } from "@/types/ride.types";


export interface IUpdateRideStatusArgs {
    rideId: string;
    rideStatus: RideStatus;
}

export interface IVerifyRideOtpArgs {
    rideId: string;
    otp: string;
}

export interface IRateRideArgs {
    rideId: string;
    rating: number;
    comment?: string;
}

export const riderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        bookRide: builder.mutation<IResponse<IRide>, IBookRide>({
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
            },
            providesTags: ["RideRequest"]
        }),
        getCurrentRide: builder.query<IResponse<IRide>, unknown>({
            query: () => ({
                url: "/ride/current-ride",
                method: "GET",
            }),
            providesTags: ["CurrentRide"]
        }),
        updateRideStatus: builder.mutation<IResponse<IRide>, IUpdateRideStatusArgs>({
            query: ({ rideId, rideStatus }) => ({
                url: `/ride/update-status/${rideId}`,
                method: "POST",
                data: { rideStatus }
            }),
            invalidatesTags: ["CurrentRide", "RideRequest", "RideHistory"]
        }),
        verifyRideOtp: builder.mutation<IResponse<IRide>, IVerifyRideOtpArgs>({
            query: ({ otp, rideId }) => ({
                url: `/ride/verify-otp/${rideId}`,
                method: "POST",
                data: { otp }
            }),
            invalidatesTags: ["CurrentRide", "RideRequest"]
        }),
        rateRide: builder.mutation<IResponse<IRide>, IRateRideArgs>({
            query: ({ rideId, rating, comment }) => ({
                url: `/ride/${rideId}/rate`,
                method: "POST",
                data: { rating, comment }
            }),
            invalidatesTags: ["RideHistory", "CurrentRide"]
        }),

    }),
})

export const {
    useBookRideMutation,
    useGetRidesQuery,
    useUpdateRideStatusMutation,
    useGetCurrentRideQuery,
    useVerifyRideOtpMutation,
    useRateRideMutation,
} = riderApi
