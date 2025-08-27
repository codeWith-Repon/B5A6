import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { IGetResponse, IMeta, } from "@/types/driver.types";
import type { IRideRequestResponse } from "@/types/rideRequest";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRideRequest: builder.query<{ data: IRideRequestResponse[], meta?: IMeta }, unknown>({
            query: (params) => ({
                url: "ride/rides",
                method: "GET",
                params
            }),
            transformResponse: (response: IResponse<IGetResponse<IRideRequestResponse>>) => {
                return {
                    data: response.data.data,
                    meta: response.data.meta
                }
            },
            providesTags: ["RideRequest"]
        }),
    })
})

export const {
    useGetRideRequestQuery,
} = authApi