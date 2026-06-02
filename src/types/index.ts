import type { ComponentType } from "react";
import type { IDriverResponse, IMeta } from "./driver.types";
import type { driverOnlineStatus } from "@/constants/driverStatus";

export interface IResponse<T> {
    statusCode: number
    success: boolean
    message: string
    data: T
}





export interface ISubTab {
    value: string;
    icon: string;
    title: string;
    description: string;
    image: string;
}

export interface IMainTabs {
    value: string;
    icon: string;
    label: string;
    content: ISubTab[];
}


export interface ISidebarItem {
    title: string,
    items: {
        title: string,
        url: string,
        component: ComponentType
    }[]
}

export type IRole =
    "SUPER_ADMIN"
    | "ADMIN"
    | "RIDER"
    | "DRIVER"

export type IDriverStatus = "PENDING" | "APPROVED" | "SUSPENDED"
export type DriverOnlineStatus =
    (typeof driverOnlineStatus)[keyof typeof driverOnlineStatus];

export type IsActive = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type VehicleType = "CAR" | "BIKE" | "CNG" | "MINIVAN" | "PREMIUM" | "EV";
export type RideStatus =
    | "REQUESTED"
    | "ACCEPTED"
    | "PICKED UP"
    | "IN TRANSIT"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELLED";
export type PaymentStatus = "PAID" | "UNPAID" | "CANCELLED" | "FAILED" | "REFUND";
export type PaymentMethod = "CASH" | "SSLCOMMERZ" | "PAYPAL" | "STRIPE";
export type SosStatus = "PENDING" | "RESOLVED" | "IGNORED";

export interface IDriver {
    data: IDriverResponse[]
    meta: IMeta
}