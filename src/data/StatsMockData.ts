/* eslint-disable @typescript-eslint/no-explicit-any */
export const MOCK_DATA_MAP: Record<string, any[]> = {
    ACTIVE: [
        { week: "Week 1", users: 42, drivers: 28 },
        { week: "Week 2", users: 55, drivers: 35 },
        { week: "Week 3", users: 49, drivers: 40 },
        { week: "Week 4", users: 63, drivers: 44 },
    ],
    INACTIVE: [
        { week: "Week 1", users: 5, drivers: 2 },
        { week: "Week 2", users: 8, drivers: 3 },
        { week: "Week 3", users: 15, drivers: 7 },
        { week: "Week 4", users: 10, drivers: 4 },
    ],
    BLOCKED: [
        { week: "Week 1", users: 2, drivers: 1 },
        { week: "Week 2", users: 5, drivers: 2 },
        { week: "Week 3", users: 3, drivers: 1 },
        { week: "Week 4", users: 4, drivers: 1 },
    ],
    DEFAULT: [
        { week: "Week 1", users: 20, drivers: 15 },
        { week: "Week 2", users: 25, drivers: 18 },
        { week: "Week 3", users: 22, drivers: 20 },
        { week: "Week 4", users: 30, drivers: 22 },
    ]
};

export const STATUS_MOCK_LINE_DATA: Record<string, any[]> = {
    ACTIVE: [
        { week: "Week 1", active: 65, inactive: 10, blocked: 2 },
        { week: "Week 2", active: 82, inactive: 12, blocked: 1 },
        { week: "Week 3", active: 78, inactive: 8, blocked: 3 },
        { week: "Week 4", active: 95, inactive: 15, blocked: 2 },
    ],
    INACTIVE: [
        { week: "Week 1", active: 20, inactive: 45, blocked: 5 },
        { week: "Week 2", active: 15, inactive: 52, blocked: 8 },
        { week: "Week 3", active: 18, inactive: 48, blocked: 6 },
        { week: "Week 4", active: 10, inactive: 61, blocked: 4 },
    ],
    BLOCKED: [
        { week: "Week 1", active: 5, inactive: 2, blocked: 25 },
        { week: "Week 2", active: 3, inactive: 5, blocked: 38 },
        { week: "Week 3", active: 4, inactive: 3, blocked: 32 },
        { week: "Week 4", active: 2, inactive: 4, blocked: 45 },
    ],
    DEFAULT: [
        { week: "Week 1", active: 40, inactive: 20, blocked: 10 },
        { week: "Week 2", active: 45, inactive: 25, blocked: 12 },
        { week: "Week 3", active: 50, inactive: 22, blocked: 15 },
        { week: "Week 4", active: 60, inactive: 30, blocked: 18 },
    ]
};