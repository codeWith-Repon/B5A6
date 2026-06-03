import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const AllDriver = lazy(() => import("@/pages/Admin/AllDrivers"));
import type { ISidebarItem } from "@/types";
const UserManagement = lazy(() => import("@/pages/Admin/UserManagement"));
const VehiclesManagement = lazy(() => import("@/pages/Admin/VehiclesManagement"));
const SosReports = lazy(() => import("@/pages/Admin/SosReports"));

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
        },
        {
            title: "Vehicles Management",
            items: [
                {
                    title: "Manage all Vehicles",
                    url: "/admin/all-vehicles",
                    component: VehiclesManagement
                }
            ],
        },
        {
            title: "Safety",
            items: [
                {
                    title: "SOS reports",
                    url: "/admin/sos-reports",
                    component: SosReports
                }
            ],
        }
    ]

