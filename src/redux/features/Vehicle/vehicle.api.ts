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
        }),
    }),
})

export const { useGetAllVehiclesQuery } = vehicleApi