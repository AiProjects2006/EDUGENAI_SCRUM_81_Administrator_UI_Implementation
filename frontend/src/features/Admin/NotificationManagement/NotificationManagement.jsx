import { useState } from "react";
import { Download, Plus } from "lucide-react";

import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";

import NotificationStats from "./NotificationStats/NotificationStats.jsx";
import BroadcastNotification from "./BroadcastNotification/BroadcastNotification.jsx";
import AutomationTriggers from "./AutomationTriggers/AutomationTriggers.jsx";
import EmailTemplates from "./EmailTemplates/EmailTemplates.jsx";
import SystemHealth from "./SystemHealth/SystemHealth.jsx";
import NotificationLog from "./NotificationLog/NotificationLog.jsx";

import { notificationLogs } from "./data/NotificationData.js";

import "./NotificationManagement.css";

function NotificationManagement() {
    const [logs, setLogs] = useState(notificationLogs);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const handleNotificationSent = (notification) => {
        const newLog = {
            id: Date.now(),
            type: "Broadcast",
            recipient: notification.audience,
            status: "SENT",
            timestamp: new Date().toLocaleString(),
            method: "Email"
        };

        setLogs((previousLogs) => [
            newLog,
            ...previousLogs
        ]);
    };

    const stats = {
        totalNotifications: logs.length,
        sentSuccessfully: logs.filter(
            (log) =>
                log.status === "SENT" ||
                log.status === "DELIVERED"
        ).length,
        opened: logs.filter(
            (log) => log.status === "DELIVERED"
        ).length,
        failed: logs.filter(
            (log) => log.status === "FAILED"
        ).length
    };

    return (
        <BackofficeLayout>
            <div className="notification-management">

                {/* PAGE HEADER */}
                <header className="notification-page-header">

                    <div>
                        <h1>Notification Management</h1>

                        <p>
                            Control all system notifications and automated
                            messages from a central hub.
                        </p>
                    </div>

                    <div className="notification-page-actions">

                        <button
                            type="button"
                            className="notification-export-btn"
                        >
                            <Download size={13} />
                            Log Export
                        </button>

                        <button
                            type="button"
                            className="notification-broadcast-btn"
                        >
                            <Plus size={13} />
                            Quick Broadcast
                        </button>

                    </div>

                </header>

                {/* STATISTICS */}
                <NotificationStats stats={stats} />

                {/* MAIN CONTENT */}
                <div className="notification-main-grid">

                    {/* LEFT COLUMN */}
                    <div className="notification-left-column">

                        <BroadcastNotification
                            onNotificationSent={
                                handleNotificationSent
                            }
                            selectedTemplate={
                                selectedTemplate
                            }
                        />

                        <EmailTemplates
                            onTemplateSelect={
                                setSelectedTemplate
                            }
                        />

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="notification-right-column">

                        <AutomationTriggers />

                        <SystemHealth />

                    </div>

                </div>

                {/* LOG */}
                <div className="notification-log-section">
                    <NotificationLog logs={logs} />
                </div>

            </div>
        </BackofficeLayout>
    );
}

export default NotificationManagement;