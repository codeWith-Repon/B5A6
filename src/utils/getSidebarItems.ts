import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { driverSidebarItems } from "@/routes/DriverSidebarItem";
import { userSidebarItems } from "@/routes/userSidebarItems";
import type { IRole } from "@/types";

export const getSidebarItems = (userRole: IRole) => {
    switch (userRole) {
        case role.superAdmin:
            return adminSidebarItems

        case role.admin:
            return adminSidebarItems

        case role.driver:
            return driverSidebarItems

        case role.rider:
            return userSidebarItems

        default:
            return []
    }
}