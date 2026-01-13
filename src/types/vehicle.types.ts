
export interface IDriverMini {
    _id: string
    name: string
    email: string
}

export interface IVehicle {
    _id: string
    driver: IDriverMini
    vehicleType: "CAR" | "BIKE"
    brand: string
    model: string
    images: string[]
    vehicleLicense: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}
