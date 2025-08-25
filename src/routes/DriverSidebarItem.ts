import { lazy } from "react";

const Completed = lazy(() => import("@/pages/Driver/Completed"))
const RideRequest = lazy(() => import("@/pages/Driver/RideRequest"))

export const driverSidebarItems = [
    {
        title: "History",
        items: [
            {
                title: "All Request",
                url: "/driver/ride-request",
                component: RideRequest
            },
            {
                title: "Completed Ride",
                url: "/driver/ride-completed",
                component: Completed
            }
        ]
    }
]