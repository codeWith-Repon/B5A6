import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { SosStatus } from "@/types/index";
import type { IMeta } from "@/types/driver.types";

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

export interface ISosReport {
    _id: string;
    ride: {
        _id: string;
        pickupLocation: string;
        dropLocation: string;
        rideStatus: string;
        user?: { _id: string; name: string; email: string; phone?: string };
        driver?: {
            _id: string;
            user?: { _id: string; name: string; email: string; phone?: string };
            vehicle?: { brand: string; model: string; vehicleLicense: string };
        };
    };
    sender: { _id: string; name: string; email: string; phone?: string; image?: string };
    location?: string;
    message?: string;
    contactEmails: string[];
    status: SosStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ISosListArgs {
    status?: SosStatus;
    page?: number;
    limit?: number;
}

export const sosApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendEmergencyMessage: builder.mutation<IResponse<null>, ISendEmergencyMessageArgs>({
            query: ({ rideId, location, message }) => ({
                url: `/sos/send-message/${rideId}`,
                method: "POST",
                data: { location, message }
            }),
            invalidatesTags: ["Sos"]
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
            }),
            invalidatesTags: ["Sos"]
        }),
        getAllSos: builder.query<
            { data: ISosReport[]; meta: IMeta },
            ISosListArgs | void
        >({
            query: (params) => ({
                url: "/sos/",
                method: "GET",
                params: params ?? undefined
            }),
            transformResponse: (res: IResponse<{ data: ISosReport[]; meta: IMeta }>) =>
                res.data,
            providesTags: ["Sos"]
        }),
    })
})

export const {
    useSendEmergencyMessageMutation,
    useAddEmergencyContactMutation,
    useUpdateSosStatusMutation,
    useGetAllSosQuery,
} = sosApi
