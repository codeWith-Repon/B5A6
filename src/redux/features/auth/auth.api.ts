import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { ILogin, ILoginResponse, IRegister, IRegisterResponse, ISendOtp, IVerifyOtp } from "@/types/auth.types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<IResponse<IRegisterResponse>, IRegister>({
            query: (userInfo) => ({
                url: "/user/register-user",
                method: "POST",
                data: userInfo
            })
        }),
        Login: builder.mutation<IResponse<ILoginResponse>, ILogin>({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                data: userInfo
            })
        }),
        LogOut: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User"]
        }),
        sendOtp: builder.mutation<IResponse<null>, ISendOtp>({
            query: (userInfo) => ({
                url: "/otp/send",
                method: "POST",
                data: userInfo
            })
        }),
        verifyOtp: builder.mutation<IResponse<null>, IVerifyOtp>({
            query: (userInfo) => ({
                url: "/otp/verify",
                method: "POST",
                data: userInfo
            })
        }),
        userInfo: builder.query({
            query: () => ({
                url: "/user/get-me",
                method: "GET",
            }),
            providesTags: ["User"]
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/user/update",
                method: "PATCH",
                data
            }),
            invalidatesTags: ["User"]
        })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogOutMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
    useUserInfoQuery,
    useUpdateProfileMutation
} = authApi