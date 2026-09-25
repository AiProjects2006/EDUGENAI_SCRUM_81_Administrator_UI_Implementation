import { Lightbulb } from "lucide-react";

import { smartInsights } from "../data/AnalyticsData.js";

import "./SmartInsights.css";

function SmartInsights() {
    return (
        <div className="smart-insights-panel">

            <div className="smart-insights-header">
                <div className="smart-insights-title">
                    <div className="smart-insights-icon">
                        <Lightbulb size={16} />
                    </div>

                    <div>
                        <h2>AI Smart Insights</h2>
                        <p>Insights generated from platform activity</p>
                    </div>
                </div>
            </div>

            <div className="smart-insights-list">
                {smartInsights.map((insight, index) => (
                    <div
                        className="smart-insight-item"
                        key={index}
                    >
                        <span className="smart-insight-number">
                            {index + 1}
                        </span>

                        <div className="smart-insight-content">
                            <h3>{insight.title}</h3>

                            <p>{insight.description}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default SmartInsights;