import type { VehicleType } from "."

export interface IDriverMini {
    _id: string
    name: string
    email: string
}

export interface IVehicle {
    _id: string
    driver: IDriverMini
    vehicleType: VehicleType
    brand: string
    model: string
    images: string[]
    vehicleLicense: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}
