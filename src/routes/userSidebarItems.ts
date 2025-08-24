import Completed from "@/pages/Driver/Completed";
import RideRequest from "@/pages/Driver/RideRequest";

export const userSidebarItems = [
    {
        title: "Activity",
        items: [
            {
                title: "Your Activity",
                url: "/driver/ride-request",
                component: RideRequest
            }
        ]
    },
    {
        title: "History",
        items: [
            {
                title: "Completed Ride",
                url: "/driver/ride-completed",
                component: Completed
            },
            {
                title: "Cancelled Ride",
                url: "/driver/ride-request",
                component: RideRequest
            },
            {
                title: "Payment History",
                url: "/driver/ride-request",
                component: RideRequest
            }
        ]
    }
]