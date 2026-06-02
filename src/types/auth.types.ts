export interface ISendOtp {
    email: string
}

export interface IVerifyOtp {
    email: string,
    otp: string
}

export interface ILogin {
    email: string,
    password: string
}

export interface IRegister {
    name: string
    email: string
    password: string
    phone?: string
    image?: string
}


export interface Auth {
    provider: "google" | "credentials"
    providerId: string
}


export interface IRegisterResponse {
    _id: string
    name: string
    email: string
    role: import("./../types").IRole
    phone?: string
    address?: string
    image?: string
    isActive: import("./../types").IsActive
    isVerified: boolean
    isDeleted: boolean
    auths: Auth[]
    emergencyContactEmail?: string[]
    createdAt: string
    updatedAt: string
    __v?: number
}

export interface ILoginResponse {
  accessToken: string
  refreshToken: string
  user: IRegisterResponse
}

export interface IRefreshTokenResponse {
  accessToken: string
}

export interface ISetPassword {
  password: string
}

export interface IChangePassword {
  oldPassword: string
  newPassword: string
}

export interface IForgotPassword {
  email: string
}

export interface IResetPassword {
  newPassword: string
  token?: string
}

