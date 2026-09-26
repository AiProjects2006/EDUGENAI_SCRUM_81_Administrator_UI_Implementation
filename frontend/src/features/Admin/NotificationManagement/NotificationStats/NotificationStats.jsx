import {
    Bell,
    Users,
    MailCheck,
    AlertTriangle
} from "lucide-react";

import "./NotificationStats.css";

function NotificationStats({ stats }) {
    const cards = [
        {
            id: "total",
            label: "TOTAL SENT (7D)",
            value: stats?.totalNotifications ?? 0,
            icon: Bell
        },
        {
            id: "scheduled",
            label: "SCHEDULED ALERTS",
            value: 42,
            icon: Users
        },
        {
            id: "delivery",
            label: "EMAIL DELIVERY",
            value: "92,108",
            icon: MailCheck
        },
        {
            id: "failed",
            label: "FAILED ALERTS",
            value: String(stats?.failed ?? 0).padStart(2, "0"),
            icon: AlertTriangle
        }
    ];

    return (
        <div className="notification-stats">

            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        className="notification-stat-card"
                        key={card.id}
                    >
                        <div className="notification-stat-top">

                            <div className="notification-stat-icon">
                                <Icon size={13} />
                            </div>

                            <span className="notification-stat-label">
                                {card.label}
                            </span>

                        </div>

                        <strong className="notification-stat-value">
                            {card.value}
                        </strong>

                    </div>
                );
            })}

        </div>
    );
}

export default NotificationStats;