import Completed from "@/pages/Driver/Completed";
import RideRequest from "@/pages/Driver/RideRequest";

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