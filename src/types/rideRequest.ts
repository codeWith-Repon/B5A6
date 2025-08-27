import type { IUser } from "./driver.types"
import type { IPayment } from "./ride.types"

export interface IDriver {
  _id: string
  user: string
  vehicle: string
  licenseNumber: string
  experience: number
  totalRides: number
  availabilityStatus: string
}

export interface IRideRequestResponse {
    _id: string
    user: IUser
    driver: IDriver
    pickupLocation: string
    dropLocation: string
    rideStatus: string
    fare: number
    distance: number
    rideOtp: number
    isOtpVerified: boolean
    createdAt: string
    updatedAt: string
    __v: number
    payment: IPayment
} 