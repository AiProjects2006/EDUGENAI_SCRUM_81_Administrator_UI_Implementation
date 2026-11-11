import {
    CheckCircle2,
    Mail,
    Bell,
    ListChecks,
    Server
} from "lucide-react";

import "./SystemHealth.css";

function SystemHealth() {
    const services = [
        {
            id: "email",
            name: "Email Delivery",
            description: "SMTP and email services",
            status: "Operational",
            icon: Mail
        },
        {
            id: "push",
            name: "Push Notifications",
            description: "Mobile and browser delivery",
            status: "Operational",
            icon: Bell
        },
        {
            id: "queue",
            name: "Notification Queue",
            description: "Background processing",
            status: "Healthy",
            icon: ListChecks
        },
        {
            id: "smtp",
            name: "SMTP Connection",
            description: "Mail server connection",
            status: "Stable",
            icon: Server
        }
    ];

    return (
        <div className="system-health-card">

            <div className="system-health-header">

                <div>
                    <h2>System Health</h2>

                    <p>
                        Notification infrastructure status
                    </p>
                </div>

                <div className="system-health-overall">
                    <span className="system-health-overall-dot" />
                    All Systems Operational
                </div>

            </div>

            <div className="system-health-list">

                {services.map((service) => {
                    const Icon = service.icon;

                    return (
                        <div
                            className="system-health-item"
                            key={service.id}
                        >
                            <div className="system-health-service-icon">
                                <Icon size={13} />
                            </div>

                            <div className="system-health-info">

                                <strong>
                                    {service.name}
                                </strong>

                                <span>
                                    {service.description}
                                </span>

                            </div>

                            <div className="system-health-status">
                                <CheckCircle2 size={11} />
                                {service.status}
                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default SystemHealth;