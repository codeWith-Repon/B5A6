import { baseApi } from "@/redux/baseApi";
import type { IDriverStatus, IResponse } from "@/types";
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

        updateDriver: builder.mutation<IDriverResponse, { id: string, data: { status: IDriverStatus } }>({
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
        })

    })
})

export const {
    useRegisterVehicleMutation,
    useRegisterDriverMutation,
    useGetVehicleQuery,
    useGetDriversQuery,
    useUpdateDriverMutation,
    useLogInDriverQuery
} = authApi