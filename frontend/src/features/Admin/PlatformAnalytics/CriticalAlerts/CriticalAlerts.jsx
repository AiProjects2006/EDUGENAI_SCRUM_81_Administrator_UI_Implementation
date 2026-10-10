import { AlertTriangle } from "lucide-react";

import { criticalAlerts } from "../data/AnalyticsData.js";

import "./CriticalAlerts.css";

function CriticalAlerts() {
    return (
        <div className="critical-alerts-panel">

            <div className="critical-alerts-header">
                <div className="critical-alerts-title">
                    <div className="critical-alerts-icon">
                        <AlertTriangle size={16} />
                    </div>

                    <div>
                        <h2>Critical Alerts</h2>
                        <p>Issues that may require administrator attention</p>
                    </div>
                </div>
            </div>

            <div className="critical-alerts-list">
                {criticalAlerts.map((alert, index) => (
                    <div
                        className="critical-alert-item"
                        key={index}
                    >
                        <div className="critical-alert-indicator"></div>

                        <div className="critical-alert-content">
                            <h3>{alert.title}</h3>

                            <p>{alert.description}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default CriticalAlerts;