import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { IVehicle, IVehicleResponse } from "@/types/driver.types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        registerVehicle: builder.mutation<IResponse<IVehicleResponse>, IVehicle>({
            query: (vehicleInfo) => ({
                url: "/vehicle/register",
                method: "POST",
                data: vehicleInfo
            })
        }),

    })
})

export const {
    useRegisterVehicleMutation,
} = authApi