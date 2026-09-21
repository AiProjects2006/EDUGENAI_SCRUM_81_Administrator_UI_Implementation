import "./MonitoringCard.css";

function MonitoringCard() {
    const services = [
        {
            name: "Recommendation Engine",
            status: "Running Normally",
            percentage: 96
        },
        {
            name: "AI Tutor",
            status: "Running Normally",
            percentage: 90
        },
        {
            name: "Assessment Engine",
            status: "Running Normally",
            percentage: 85
        }
    ];

    return (
        <div className="monitoring-card">

            <div className="monitoring-header">
                <h2 className="monitoring-title">
                    AI Services Monitoring
                </h2>

                <span className="monitoring-status">
                    Healthy
                </span>
            </div>

            <div className="service-list">

                {services.map((service, index) => (

                    <div key={index}>

                        <div className="service-item">

                            <div className="service-info">

                                <span className="service-name">
                                    {service.name}
                                </span>

                                <span className="service-status">
                                    {service.status}
                                </span>

                            </div>

                            <span className="service-percent">
                                {service.percentage}%
                            </span>

                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${service.percentage}%`
                                }}
                            ></div>

                        </div>

                    </div>

                ))}

            </div>

            <div className="monitoring-footer">

                <p>All AI services are running successfully.</p>

                <button>
                    View Details
                </button>

            </div>

        </div>
    );
}

export default MonitoringCard;