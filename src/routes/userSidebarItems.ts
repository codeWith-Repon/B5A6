import { lazy } from "react";

const Completed = lazy(() => import("@/pages/Driver/Completed"))
const RideRequest = lazy(() => import("@/pages/Driver/RideRequest"))
const Activity = lazy(() => import("@/pages/User/Activity"))
const CurrentRide = lazy(() => import("@/pages/User/CurrentRide"))

export const userSidebarItems = [
    {
        title: "Activity",
        items: [
            {
                title: "Your Activity",
                url: "/rider/activity",
                component: Activity
            }
        ]
    },
    {
        title: "History",
        items: [
            {
                title: "Current Ride",
                url: "/rider/current-ride",
                component: CurrentRide
            },
            {
                title: "Completed Ride",
                url: "/rider/ride-completed",
                component: Completed
            },
            {
                title: "Cancelled Ride",
                url: "/rider/ride-request",
                component: RideRequest
            },
            {
                title: "Payment History",
                url: "/rider/ride-request",
                component: RideRequest
            }
        ]
    }
]