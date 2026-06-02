import { baseApi } from "@/redux/baseApi"
import type { IResponse } from "@/types"
import type { IMeta } from "@/types/driver.types"
import type { IVehicle } from "@/types/vehicle.types"

interface IPaginatedResponse<T> {
    meta: IMeta
    data: T[]
}
export const vehicleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllVehicles: builder.query<
            IPaginatedResponse<IVehicle>,
            unknown
        >({
            query: (params) => ({
                url: "/vehicle/vehicles",
                method: "GET",
                params,
            }),
            transformResponse: (
                response: IResponse<IPaginatedResponse<IVehicle>>
            ) => response.data,
            providesTags: ["Vehicle"],
        }),

        getVehicleById: builder.query<IVehicle, string>({
            query: (id) => ({
                url: `/vehicle/${id}`,
                method: "GET",
            }),
            transformResponse: (response: IResponse<IVehicle>) => response.data,
            providesTags: ["Vehicle"],
        }),
    }),
})

export const { useGetAllVehiclesQuery, useGetVehicleByIdQuery } = vehicleApi