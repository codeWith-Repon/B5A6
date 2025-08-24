import type { ComponentType } from "react";

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