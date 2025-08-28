
export interface IVehicle {
    driver: string
    vehicleType: string
    brand: string
    model: string
    images?: string[]
    vehicleLicense: string
}

export interface IVehicleResponse {
    driver: string
    vehicleType: string
    brand: string
    model: string
    images?: string[]
    vehicleLicense: string
    isDeleted: boolean
    _id: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface IDriver {
    licenseNumber: string,
    experience: number
}

export interface IUser {
    _id: string
    name: string
    email: string
    isActive?: boolean
}

export interface Vehicle {
    _id: string
    vehicleType: string
    brand: string
    model: string
    images?: string[]
    vehicleLicense: string
}


export interface IMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}



export interface IDriverResponse {
    user: IUser
    vehicle: Vehicle
    licenseNumber: string
    experience: number
    totalRides: number
    totalEarnings: number
    availabilityStatus: string
    status: string
    _id: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface IGetResponse<T> {
    data: T[]
    meta?: IMeta
}

export interface IMeta {
    page: number
    limit: number
    total: number
    totalPage: number
}
