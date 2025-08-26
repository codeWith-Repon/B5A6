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
            })
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
        })
    }),
})

export const {
    useBookRideMutation,
    useGetRidesQuery
} = riderApi