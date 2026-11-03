export const analyticsByPeriod = {
    Today: {
        stats: {
            totalUsers: "12,482",
            engagementRate: "68.5%",
            totalCourses: "842",
            aiActivities: "4.2M"
        },

        activityTrend: [
            { month: "8 AM", activeUsers: 32 },
            { month: "10 AM", activeUsers: 48 },
            { month: "12 PM", activeUsers: 56 },
            { month: "2 PM", activeUsers: 64 },
            { month: "4 PM", activeUsers: 52 },
            { month: "6 PM", activeUsers: 71 }
        ]
    },

    "This Week": {
        stats: {
            totalUsers: "12,482",
            engagementRate: "69.2%",
            totalCourses: "842",
            aiActivities: "4.5M"
        },

        activityTrend: [
            { month: "Mon", activeUsers: 42 },
            { month: "Tue", activeUsers: 48 },
            { month: "Wed", activeUsers: 51 },
            { month: "Thu", activeUsers: 57 },
            { month: "Fri", activeUsers: 63 },
            { month: "Sat", activeUsers: 55 },
            { month: "Sun", activeUsers: 68 }
        ]
    },

    "This Month": {
        stats: {
            totalUsers: "12,482",
            engagementRate: "68.5%",
            totalCourses: "842",
            aiActivities: "4.2M"
        },

        activityTrend: [
            { month: "Jan", activeUsers: 42 },
            { month: "Feb", activeUsers: 45 },
            { month: "Mar", activeUsers: 44 },
            { month: "Apr", activeUsers: 48 },
            { month: "May", activeUsers: 61 },
            { month: "Jun", activeUsers: 67 },
            { month: "Jul", activeUsers: 53 },
            { month: "Aug", activeUsers: 48 },
            { month: "Sep", activeUsers: 67 }
        ]
    }
};

export const aiActivityTypes = [
    {
        name: "MCQ Quizzes",
        value: 45
    },
    {
        name: "Flashcards",
        value: 32
    },
    {
        name: "Essay Creator",
        value: 23
    }
];

export const smartInsights = [
    {
        title: "Mathematics has the highest engagement rate this month.",
        description:
            "Mathematics activities continue to receive strong learner engagement."
    },
    {
        title: "Students perform 42% better in visual learning activities.",
        description:
            "Visual-based activities show higher completion and engagement."
    },
    {
        title: "Engagement drops after 15 minutes of continuous text content.",
        description:
            "Shorter content sessions may improve learner engagement."
    }
];

export const coursePerformance = [
    {
        course: "Advanced Physics",
        students: 420,
        completion: 82,
        score: "86/100",
        engagement: "Very High"
    },
    {
        course: "World History II",
        students: 590,
        completion: 64,
        score: "74/100",
        engagement: "Medium"
    },
    {
        course: "Intro to Python",
        students: 310,
        completion: 47,
        score: "82/100",
        engagement: "Very High"
    }
];

export const criticalAlerts = [
    {
        title: "High drop-off detected",
        description:
            "Users are leaving the Physics learning path after the second lesson."
    },
    {
        title: "Low completion in Quizlabs Basics",
        description:
            "Completion rate has dropped below the expected threshold."
    }
];

export const upcomingDeadline = {
    title: "Next District Review",
    description:
        "Quarterly district-wide engagement report is being reviewed.",
    date: "June 12"
};