import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const AllDriver = lazy(() => import("@/pages/Admin/AllDrivers"));
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
            title: "Driver Management",
            items: [
                {
                    title: "Manage all Drivers",
                    url: "/admin/all-drivers",
                    component: AllDriver
                }
            ],
        }
    ]

