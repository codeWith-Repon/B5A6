import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import { type IGetFreeDrivers, type IDriver, type IDriverResponse, type IDriverUpdate, type IGetResponse, type IMeta, type IVehicle, type IVehicleResponse } from "@/types/driver.types";

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
            }),
            invalidatesTags: ["Driver"]
        }),
        getVehicle: builder.query<{ data: IVehicleResponse[], meta?: IMeta }, unknown>({
            query: (params) => ({
                url: "/vehicle/vehicles",
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
                url: "/driver/drivers",
                method: "GET",
                params
            }),
            transformResponse: (response: IResponse<IGetResponse<IDriverResponse>>) => {
                return {
                    data: response.data.data,
                    meta: response.data.meta
                }
            },
            providesTags: ["Driver"]
        }),
        getDriverById: builder.query<IResponse<IDriverResponse>, string>({
            query: (id) => ({
                url: `/driver/${id}`,
                method: "GET"
            })
        }),
        updateDriver: builder.mutation<IDriverResponse, { id: string, data: IDriverUpdate }>({
            query: ({ id, data }) => ({
                url: `/driver/update/${id}`,
                method: "patch",
                data
            }),
            invalidatesTags: ["Driver"]
        }),

        logInDriver: builder.query({
            query: (driverId) => ({
                url: `/driver/${driverId}`,
                method: "GET"
            })
        }),

        updateVehicle: builder.mutation<IVehicleResponse, { id: string, data: IVehicle | FormData }>({
            query: ({ id, data }) => ({
                url: `/vehicle/update/${id}`,
                method: "PATCH",
                data
            }),
            invalidatesTags: ["Driver"]
        }),

        getFreeDrivers: builder.query<IResponse<IGetFreeDrivers[]>, void>({
            query: () => ({
                url: "/driver/free-drivers",
                method: "GET"
            })
        }),

    })
})

export const {
    useRegisterVehicleMutation,
    useRegisterDriverMutation,
    useGetVehicleQuery,
    useGetDriversQuery,
    useGetDriverByIdQuery,
    useUpdateDriverMutation,
    useLogInDriverQuery,
    useUpdateVehicleMutation,
    useGetFreeDriversQuery
} = authApi