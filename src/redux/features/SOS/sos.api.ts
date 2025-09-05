import { baseApi } from "@/redux/baseApi";

export const sosApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendEmergencyMessage: builder.mutation({
            query: ({ rideId }) => ({
                url: `/sos/send-message/${rideId}`,
                method: "POST"
            })
        })
    })
})

export const { useSendEmergencyMessageMutation } = sosApi