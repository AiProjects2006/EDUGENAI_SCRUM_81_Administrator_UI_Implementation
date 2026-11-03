import { useState } from "react";
import { Zap } from "lucide-react";

import { automationTriggers } from "../data/NotificationData.js";

import "./AutomationTriggers.css";

function AutomationTriggers() {
    const [triggers, setTriggers] = useState(
        automationTriggers.map((trigger, index) => ({
            ...trigger,
            id: trigger.id || trigger._id || `trigger-${index}`,
            enabled: trigger.enabled ?? true
        }))
    );

    const handleToggle = (id) => {
        setTriggers((previousTriggers) =>
            previousTriggers.map((trigger) =>
                trigger.id === id
                    ? {
                        ...trigger,
                        enabled: !trigger.enabled
                    }
                    : trigger
            )
        );
    };

    return (
        <div className="automation-triggers-card">

            <div className="automation-triggers-header">

                <div className="automation-triggers-title">
                    <div className="automation-triggers-icon">
                        <Zap size={13} />
                    </div>

                    <div>
                        <h2>Automation Triggers</h2>

                        <p>
                            Automatic notification rules
                        </p>
                    </div>
                </div>

            </div>

            <div className="automation-trigger-list">

                {triggers.map((trigger) => (
                    <div
                        className="automation-trigger"
                        key={trigger.id}
                    >
                        <div className="automation-trigger-info">

                            <strong>
                                {trigger.name ||
                                    trigger.title ||
                                    "Automation Trigger"}
                            </strong>

                            <span>
                                {trigger.description ||
                                    trigger.message ||
                                    "Automatic notification rule"}
                            </span>

                        </div>

                        <button
                            type="button"
                            className={`automation-toggle ${
                                trigger.enabled ? "active" : ""
                            }`}
                            onClick={() =>
                                handleToggle(trigger.id)
                            }
                            aria-label={`Toggle ${
                                trigger.name ||
                                trigger.title ||
                                "automation trigger"
                            }`}
                            aria-pressed={trigger.enabled}
                        >
                            <span />
                        </button>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default AutomationTriggers;