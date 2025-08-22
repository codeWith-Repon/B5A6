import { baseApi } from "@/redux/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userInfo) => ({
                url: "/user/register-user",
                method: "POST",
                data: userInfo
            })
        }),
        Login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                data: userInfo
            })
        })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation
} = authApi