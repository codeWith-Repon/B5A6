import type { IRole, IsActive } from "."

export interface IAuth {
    provider: "google" | "credentials"
    providerId: string
}

export interface IUser {
    _id: string
    name: string
    email: string
    role: IRole
    phone?: string
    isActive: IsActive
    isVerified: boolean
    isDeleted: boolean
    address?: string
    image?: string
    auths: IAuth[]
    createdAt: string
    updatedAt: string
    emergencyContactEmail?: string[]
    __v?: number
}
