import AllDriver from "@/pages/Admin/AllDrivers";
import Analytics from "@/pages/Admin/Analytics";
import ApproveDrivers from "@/pages/Admin/ApproveDrivers";
import PendingDrivers from "@/pages/Admin/PendingDrivers";
import SuspendedDrivers from "@/pages/Admin/SuspendedDrivers";
import type { ISidebarItem } from "@/types";

export const adminSidebarItems: ISidebarItem[] =
    [
        {
            title: "Dashboard",
            items: [
                {
                    title: "Analytics",
                    url: "/admin/analytics",
                    component: Analytics
                }
            ],
        },
        {
            title: "Drivers",
            items: [
                {
                    title: "All Drivers",
                    url: "/admin/all-drivers",
                    component: AllDriver
                },
                {
                    title: "Approved Drivers",
                    url: "/admin/approved-drivers",
                    component: ApproveDrivers
                },
                {
                    title: "Pending Drivers",
                    url: "/admin/pending-drivers",
                    component: PendingDrivers
                },
                {
                    title: "Suspended Drivers",
                    url: "/admin/suspended-drivers",
                    component: SuspendedDrivers
                },
            ],
        }
    ]

