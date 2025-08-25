import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const AllDriver = lazy(() => import("@/pages/Admin/AllDrivers"));
const ApproveDrivers = lazy(() => import("@/pages/Admin/ApproveDrivers"));
const PendingDrivers = lazy(() => import("@/pages/Admin/PendingDrivers"));
const SuspendedDrivers = lazy(() => import("@/pages/Admin/SuspendedDrivers"));
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

