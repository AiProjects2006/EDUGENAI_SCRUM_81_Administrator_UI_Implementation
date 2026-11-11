import {
    Users,
    TrendingUp,
    BookOpen,
    Bot
} from "lucide-react";

import "./AnalyticsStats.css";

function AnalyticsStats({ stats }) {
    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            change: "+12.4% from last month",
            icon: Users,
            className: "users"
        },
        {
            title: "Engagement Rate",
            value: stats.engagementRate,
            change: "+8.2% from last month",
            icon: TrendingUp,
            className: "engagement"
        },
        {
            title: "Total Courses",
            value: stats.totalCourses,
            change: "+6.8% from last month",
            icon: BookOpen,
            className: "courses"
        },
        {
            title: "AI Activities",
            value: stats.aiActivities,
            change: "+15.3% from last month",
            icon: Bot,
            className: "ai"
        }
    ];

    return (
        <div className="analytics-stats">

            {statCards.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        className="analytics-stat-card"
                        key={stat.title}
                    >
                        <div className="analytics-stat-content">

                            <span className="analytics-stat-title">
                                {stat.title}
                            </span>

                            <strong className="analytics-stat-value">
                                {stat.value}
                            </strong>

                            <span className="analytics-stat-change">
                                {stat.change}
                            </span>

                        </div>

                        <div
                            className={`analytics-stat-icon ${stat.className}`}
                        >
                            <Icon size={19} />
                        </div>
                    </div>
                );
            })}

        </div>
    );
}

export default AnalyticsStats;