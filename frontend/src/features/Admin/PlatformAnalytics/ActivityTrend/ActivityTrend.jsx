import "./ActivityTrend.css";

function ActivityTrend({ activityTrend = [] }) {
    return (
        <div className="activity-trend-panel">

            <div className="activity-trend-header">

                <div>
                    <h2>User Activity Trend</h2>
                    <p>Platform activity over time</p>
                </div>

                <div className="activity-trend-legend">

                    <span>
                        <i className="trend-legend-dot active"></i>
                        Active Users
                    </span>

                    <span>
                        <i className="trend-legend-dot unique"></i>
                        Unique
                    </span>

                </div>

            </div>

            <div className="activity-chart">

                <div className="chart-y-axis">
                    <span>80</span>
                    <span>60</span>
                    <span>40</span>
                    <span>20</span>
                    <span>0</span>
                </div>

                <div className="chart-area">

                    <div className="chart-grid-lines">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <svg
                        className="activity-line-chart"
                        viewBox="0 0 600 220"
                        preserveAspectRatio="none"
                    >
                        <polyline
                            points="
                                0,145
                                75,138
                                150,142
                                225,125
                                300,70
                                375,55
                                450,100
                                525,120
                                600,48
                            "
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                    </svg>

                    <div className="chart-x-axis">

                        {activityTrend.map((item, index) => (
                            <span
                                key={`${item.month}-${index}`}
                            >
                                {item.month}
                            </span>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ActivityTrend;