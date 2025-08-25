import type { ComponentType } from "react";
import type { IDriverResponse, IMeta } from "./driver.types";

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

export interface IDriver {
    data: IDriverResponse[]
    meta: IMeta
}