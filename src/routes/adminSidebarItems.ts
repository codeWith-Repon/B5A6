import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const AllDriver = lazy(() => import("@/pages/Admin/AllDrivers"));
import type { ISidebarItem } from "@/types";
const UserManagement = lazy(() => import("@/pages/Admin/UserManagement"));

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
            title: "User Management",
            items: [
                {
                    title: "Manage all Users",
                    url: "/admin/all-users",
                    component: UserManagement
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

