
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
