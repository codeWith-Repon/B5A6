
export interface IAuth {
    provider: string,
    providerId: string
}

export interface IUser {
    _id: string
    name: string
    email: string
    role: string
    phone?: string
    isActive: string
    isVerified: boolean
    isDeleted: boolean
    address?: string
    image?: string
    auths: IAuth[]
    createdAt: string
    updatedAt: string
    emergencyContactEmail?: string[]
    __v: number
}