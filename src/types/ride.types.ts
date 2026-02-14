import type { IDriverResponse, IUser } from "./driver.types"

export interface IRide {
  _id: string
  user: IUser
  driver: IDriverResponse
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
  paymentMethod?: string | null
  paymentStatus?: string | null
}

export interface IPayment {
  _id: string
  transactionId: string
  status: string
  amount: number
}
