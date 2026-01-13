import { baseApi } from "@/redux/baseApi"
import type { IResponse } from "@/types"
import type { IMeta } from "@/types/driver.types"
import type { IUser } from "@/types/user.types"

interface IPaginatedResponse<T> {
    meta: IMeta
    data: T[]
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query<
            IPaginatedResponse<IUser>,
            unknown
        >({
            query: (params) => ({
                url: "/user/users",
                method: "GET",
                params
            }),
            transformResponse: (
                response: IResponse<IPaginatedResponse<IUser>>
            ) => response.data,
        }),
        getUserById: builder.query<IUser, string>({
            query: (id) => ({
                url: `/user/${id}`,
                method: "GET",
            }),
            transformResponse: (response: IResponse<IUser>) => response.data,
        })
    })
})

export const { useGetAllUsersQuery, useGetUserByIdQuery } = userApi