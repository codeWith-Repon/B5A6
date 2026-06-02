import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { SosStatus } from "@/types/index";

export interface ISendEmergencyMessageArgs {
    rideId: string;
    location: string;
    message?: string;
}

export interface IAddSosContactArgs {
    emergencyContactEmail: string;
}

export interface IUpdateSosStatusArgs {
    sosId: string;
    status: SosStatus;
}

export const sosApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendEmergencyMessage: builder.mutation<IResponse<null>, ISendEmergencyMessageArgs>({
            query: ({ rideId, location, message }) => ({
                url: `/sos/send-message/${rideId}`,
                method: "POST",
                data: { location, message }
            })
        }),
        addEmergencyContact: builder.mutation<IResponse<null>, IAddSosContactArgs>({
            query: (data) => ({
                url: "/sos/add-contact",
                method: "POST",
                data
            }),
            invalidatesTags: ["User"]
        }),
        updateSosStatus: builder.mutation<IResponse<null>, IUpdateSosStatusArgs>({
            query: ({ sosId, status }) => ({
                url: `/sos/update-status/${sosId}`,
                method: "PATCH",
                data: { status }
            })
        })
    })
})

export const {
    useSendEmergencyMessageMutation,
    useAddEmergencyContactMutation,
    useUpdateSosStatusMutation
} = sosApi
