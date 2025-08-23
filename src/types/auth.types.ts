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
    name: string,
    email: string,
    password: string
}


export interface Auth {
    provider: string
    providerId: string
}


export interface IRegisterResponse {
    name: string
    email: string
    role: string
    isActive: string
    isVerified: boolean
    isDeleted: boolean
    auths: Auth[]
    _id: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface ILoginResponse {
  accessToken: string
  refreshToken: string
  user: IRegisterResponse
}

