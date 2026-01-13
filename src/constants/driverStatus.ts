
export const driverStatus = {
    pending: "PENDING",
    approved: "APPROVED",
    suspended: "SUSPENDED"
}

export const driverOnlineStatus = {
    online: "ONLINE",
    offline: "OFFLINE"
} as const

export const VEHICLE_OPTIONS = [
    { label: 'Car', value: 'car' },
    { label: 'Motorbike', value: 'motorbike' },
];