import { aiActivityTypes } from "../data/AnalyticsData.js";

import "./ActivityTypes.css";

function ActivityTypes() {
    return (
        <div className="activity-types-panel">

            <div className="activity-types-header">
                <div>
                    <h2>AI Activity Types</h2>
                    <p>Distribution of AI-generated activities</p>
                </div>
            </div>

            <div className="ai-chart-content">

                <div className="donut-chart">
                    <div className="donut-inner">
                        <strong>4.2M</strong>
                        <span>ACTIVITIES</span>
                    </div>
                </div>

                <div className="ai-legend">
                    {aiActivityTypes.map((item, index) => (
                        <div
                            className="ai-legend-item"
                            key={item.name}
                        >
                            <span>
                                <i
                                    className={`ai-dot dot-${index}`}
                                ></i>

                                {item.name}
                            </span>

                            <strong>
                                {item.value}%
                            </strong>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default ActivityTypes;