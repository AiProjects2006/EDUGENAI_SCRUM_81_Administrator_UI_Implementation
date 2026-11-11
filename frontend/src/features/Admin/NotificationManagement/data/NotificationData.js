export const notificationStats = {
    totalNotifications: "124,592",
    sentSuccessfully: "42",
    opened: "92,108",
    failed: "07"
};

export const automationTriggers = [
    {
        title: "Registration Trigger",
        description: "Send welcome notification after registration.",
        enabled: true
    },
    {
        title: "Course Expiry Alert",
        description: "Notify users before course access expires.",
        enabled: true
    },
    {
        title: "Inactivity Reminder",
        description: "Notify inactive users about pending activities.",
        enabled: false
    }
];

export const emailTemplates = [
    {
        icon: "user",
        title: "User Registration Welcome",
        description: "Welcome email sent after user creates an account."
    },
    {
        icon: "course",
        title: "Course Expiry Warning",
        description: "Reminder sent before course access expires."
    },
    {
        icon: "calendar",
        title: "Weekly Learning Reminder",
        description: "Automated weekly learning progress reminder."
    }
];

export const notificationLogs = [
    {
        type: "Registration",
        recipient: "John Smith",
        status: "SENT",
        timestamp: "Oct 14, 2025 - 04:35 PM",
        method: "EMAIL"
    },
    {
        type: "Course Expiry",
        recipient: "Emily Carter",
        status: "DELIVERED",
        timestamp: "Oct 15, 2025 - 09:20 AM",
        method: "PUSH"
    },
    {
        type: "System Maintenance",
        recipient: "Global Audience",
        status: "FAILED",
        timestamp: "Oct 15, 2025 - 11:02 AM",
        method: "EMAIL"
    },
    {
        type: "Learning Reminder",
        recipient: "Multiple Users",
        status: "SENT",
        timestamp: "Oct 16, 2025 - 08:45 AM",
        method: "PUSH"
    }
];