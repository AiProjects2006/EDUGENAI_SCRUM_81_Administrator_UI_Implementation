import "./DashboardCard.css";

function DashboardCard({ title, value, icon, growth }) {
    return (
        <div className="dashboard-card">

            <div className="card-icon">
                {icon}
            </div>

            <div className="card-content">

                <p className="card-title">
                    {title}
                </p>

                <h2 className="card-value">
                    {value}
                </h2>

                {growth && (
                    <p className="card-growth">
                        {growth}
                    </p>
                )}

            </div>

        </div>
    );
}

export default DashboardCard;