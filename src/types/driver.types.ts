import type { DriverOnlineStatus, IDriverStatus } from "."

export interface IVehicle {
    driver?: string
    vehicleType?: string
    brand?: string
    model?: string
    images?: string[]
    vehicleLicense?: string
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
    isActive?: string,
    phone?: string;
    role?: string;
    isVerified?: boolean;
    image?: string;
    address?: string;
    emergencyContactEmail?: string[]
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

export interface IDriverUpdate {
    licenseNumber?: string
    experience?: number
    status?: IDriverStatus
    availabilityStatus?: DriverOnlineStatus
}

// export interface IGetFreeDrivers {
//     _id: string
//     user: {
//         name: string
//         email: string
//         phone: string
//     }
//     vehicle: string
//     licenseNumber: string
//     experience: number
//     availabilityStatus: string
//     status: string
// }

export interface IGetFreeDrivers {
    _id: string;
    user: {
        name: string;
        email: string;
        image: string;
        phone: string;
    };
    vehicle: {
        vehicleType: string;
        brand: string;
        model: string;
        images: string[];
    };
    licenseNumber: string;
    experience: number;
    availabilityStatus: 'ONLINE' | 'OFFLINE';
    status: string;
}
