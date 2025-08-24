import Completed from "@/pages/Driver/Completed";
import RideRequest from "@/pages/Driver/RideRequest";

export const userSidebarItems = [
    {
        title: "Activity",
        items: [
            {
                title: "Your Activity",
                url: "/rider/ride-request",
                component: RideRequest
            }
        ]
    },
    {
        title: "History",
        items: [
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