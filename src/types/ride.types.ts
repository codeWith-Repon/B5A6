import type { PaymentMethod, PaymentStatus, RideStatus } from "."
import type { IDriverResponse, IUser } from "./driver.types"

export interface IRide {
  _id: string
  user: IUser
  driver: IDriverResponse
  pickupLocation: string
  pickupCoordinates?: { lat: number; lng: number }
  dropLocation: string
  rideStatus: RideStatus
  fare: number
  distance: number
  rideOtp?: number
  isOtpVerified: boolean
  startedAt?: string
  completedAt?: string
  rating?: number
  ratingComment?: string
  ratedAt?: string
  /** Rider's live position — tracked only up to pickup */
  riderCurrentLocation?: { type: 'Point'; coordinates: [number, number] }
  riderLastLocationAt?: string
  createdAt: string
  updatedAt: string
  __v?: number
  payment?: IPayment
  paymentMethod?: PaymentMethod | null
  paymentStatus?: PaymentStatus | null
}

export interface IPayment {
  _id: string
  transactionId: string
  status: string
  amount: number
}

export interface IBookRide {
  driver?: string
  pickupLocation: string
  pickupCoordinates?: { lat: number; lng: number }
  dropLocation: string
  distance?: number
  paymentMethod: PaymentMethod
}
