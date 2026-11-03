
import "./UserStats.css";

function UserStats({ title, value, icon: Icon }) {
    return (
        <div className="user-stat-card">
            <div className="user-stat-info">
                <p>{title}</p>
                <h2>{value}</h2>
            </div>

            <div className="user-stat-icon">
                {Icon && <Icon size={18} />}
            </div>
        </div>
    );
}

export default UserStats;
