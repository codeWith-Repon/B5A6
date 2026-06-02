import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { IRideMessage } from "@/lib/socket";

export interface ISendMessageArgs {
    rideId: string;
    text: string;
}

export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRideMessages: builder.query<IRideMessage[], string>({
            query: (rideId) => ({
                url: `/messages/ride/${rideId}`,
                method: "GET",
            }),
            transformResponse: (res: IResponse<IRideMessage[]>) => res.data ?? [],
            providesTags: (_result, _error, rideId) => [
                { type: "Chat", id: rideId },
            ],
        }),
        sendRideMessage: builder.mutation<IResponse<IRideMessage>, ISendMessageArgs>({
            query: ({ rideId, text }) => ({
                url: `/messages/ride/${rideId}`,
                method: "POST",
                data: { text },
            }),
        }),
        markRideMessagesRead: builder.mutation<IResponse<null>, string>({
            query: (rideId) => ({
                url: `/messages/ride/${rideId}/read`,
                method: "PATCH",
            }),
        }),
    }),
});

export const {
    useGetRideMessagesQuery,
    useSendRideMessageMutation,
    useMarkRideMessagesReadMutation,
} = chatApi;
