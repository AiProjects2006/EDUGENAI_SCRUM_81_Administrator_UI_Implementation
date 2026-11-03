import {
    Clock3,
    CheckCircle,
    XCircle,
    Bot
} from "lucide-react";

import "./ModerationStats.css";

function ModerationStats({ content }) {

    const pendingCount = content.filter(
        (item) => item.status === "Pending"
    ).length;

    const approvedCount = content.filter(
        (item) => item.status === "Approved"
    ).length;

    const rejectedCount = content.filter(
        (item) => item.status === "Rejected"
    ).length;

    const aiGeneratedCount = content.filter(
        (item) => item.type === "AI Activity"
    ).length;

    const stats = [
        {
            title: "Pending Review",
            value: pendingCount,
            icon: Clock3,
            className: "pending"
        },
        {
            title: "Approved",
            value: approvedCount,
            icon: CheckCircle,
            className: "approved"
        },
        {
            title: "Rejected",
            value: rejectedCount,
            icon: XCircle,
            className: "rejected"
        },
        {
            title: "AI Generated",
            value: aiGeneratedCount,
            icon: Bot,
            className: "ai-generated"
        }
    ];

    return (
        <div className="moderation-stats">

            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        className="moderation-stat-card"
                        key={stat.title}
                    >
                        <div>
                            <span className="moderation-stat-title">
                                {stat.title}
                            </span>

                            <strong className="moderation-stat-value">
                                {stat.value}
                            </strong>
                        </div>

                        <div
                            className={`moderation-stat-icon ${stat.className}`}
                        >
                            <Icon size={18} />
                        </div>
                    </div>
                );
            })}

        </div>
    );
}

export default ModerationStats;