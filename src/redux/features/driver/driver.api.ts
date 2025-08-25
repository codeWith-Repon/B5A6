import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { IDriver, IDriverResponse, IGetResponse, IMeta, IVehicle, IVehicleResponse } from "@/types/driver.types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        registerVehicle: builder.mutation<IResponse<IVehicleResponse>, IVehicle>({
            query: (vehicleInfo) => ({
                url: "/vehicle/register",
                method: "POST",
                data: vehicleInfo
            })
        }),

        registerDriver: builder.mutation<IResponse<IDriverResponse>, IDriver>({
            query: (driverInfo) => ({
                url: "/driver/register-driver",
                method: "POST",
                data: driverInfo
            })
        }),
        getVehicle: builder.query<{ data: IVehicleResponse[], meta?: IMeta }, unknown>({
            query: (params) => ({
                url: "vehicle/vehicles",
                method: "GET",
                params
            }),
            transformResponse: (response: IResponse<IGetResponse<IVehicleResponse>>) => {
                return {
                    data: response.data.data,
                    meta: response.data.meta
                }
            }
        }),
        getDrivers: builder.query<{ data: IDriverResponse[], meta?: IMeta }, unknown>({
            query: (params) => ({
                url: "driver/drivers",
                method: "GET",
                params
            }),
            transformResponse: (response: IResponse<IGetResponse<IDriverResponse>>) => {
                return {
                    data: response.data.data,
                    meta: response.data.meta
                }
            }
        })
    })
})

export const {
    useRegisterVehicleMutation,
    useRegisterDriverMutation,
    useGetVehicleQuery,
    useGetDriversQuery
} = authApi