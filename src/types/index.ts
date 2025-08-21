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