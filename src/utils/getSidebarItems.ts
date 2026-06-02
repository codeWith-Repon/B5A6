import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import type { IRole } from "@/types";

export const getSidebarItems = (userRole: IRole | undefined) => {
    switch (userRole) {
        case role.superAdmin:
            return adminSidebarItems

        case role.admin:
            return adminSidebarItems

        default:
            return []
    }
}