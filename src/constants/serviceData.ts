import { subTabImage, tabIcon } from "@/assets";
import type { IMainTabs } from "@/types";


export const mainTabs: IMainTabs[] = [
    {
        value: 'tab-1',
        icon: tabIcon.car_icon,
        label: 'Ride Sharing',
        content: [
            {
                value: 'tab-1',
                icon: tabIcon.normal_car,
                title: 'Premium Car',
                description: 'Premium, comfortable and safe car services.',
                image: subTabImage.car1,
            },
            {
                value: 'tab-2',
                icon: tabIcon.cng,
                title: 'CNG Ride',
                description: 'Affordable and eco-friendly ride services.',
                image: subTabImage.cng1,
            },
            {
                value: 'tab-3',
                icon: tabIcon.premium_car,
                title: 'Luxury Car',
                description: 'Exclusive and luxury ride services.',
                image: subTabImage.car2,
            },
        ],
    },
    {
        value: 'tab-3',
        icon: tabIcon.express_icon,
        label: 'Express',
        content: [
            {
                value: 'tab-1',
                icon: tabIcon.express_sub_icon,
                title: 'Express',
                description: 'For quick parcel delivery',
                image: subTabImage.express_1_removebg,
            },
        ],
    },
    {
        value: 'tab-4',
        icon: tabIcon.vts_icon,
        label: 'Vehicle Tracking System',
        content: [
            {
                value: 'tab-1',
                icon: tabIcon.svts_icon,
                title: 'Vehicle Tracking System',
                description: '360 degree solutions for real-time vehicle tracking.',
                image: subTabImage.vehicle_tracking,
            },
        ],
    },
];