import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type {
    IChangePassword,
    IForgotPassword,
    ILogin,
    ILoginResponse,
    IRefreshTokenResponse,
    IRegister,
    IRegisterResponse,
    IResetPassword,
    ISendOtp,
    ISetPassword,
    IVerifyOtp,
} from "@/types/auth.types";

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
        userInfo: builder.query<IResponse<IRegisterResponse>, void>({
            query: () => ({
                url: "/user/get-me",
                method: "GET",
            }),
            providesTags: ["User"]
        }),
        updateProfile: builder.mutation<IResponse<IRegisterResponse>, FormData>({
            query: (data) => ({
                url: "/user/update",
                method: "PATCH",
                data
            }),
            invalidatesTags: ["User"]
        }),
        refreshToken: builder.mutation<IResponse<IRefreshTokenResponse>, void>({
            query: () => ({
                url: "/auth/refresh-token",
                method: "POST",
            }),
        }),
        setPassword: builder.mutation<IResponse<null>, ISetPassword>({
            query: (data) => ({
                url: "/auth/set-password",
                method: "POST",
                data,
            }),
        }),
        changePassword: builder.mutation<IResponse<null>, IChangePassword>({
            query: (data) => ({
                url: "/auth/change-password",
                method: "POST",
                data,
            }),
        }),
        forgotPassword: builder.mutation<IResponse<null>, IForgotPassword>({
            query: (data) => ({
                url: "/auth/forgot-password",
                method: "POST",
                data,
            }),
        }),
        resetPassword: builder.mutation<IResponse<null>, IResetPassword>({
            query: (data) => ({
                url: "/auth/reset-password",
                method: "POST",
                data,
            }),
        }),
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogOutMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
    useUserInfoQuery,
    useUpdateProfileMutation,
    useRefreshTokenMutation,
    useSetPasswordMutation,
    useChangePasswordMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi