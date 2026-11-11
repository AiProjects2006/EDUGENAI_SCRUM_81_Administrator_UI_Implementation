import "./UserStats.css";
import {
    Users,
    GraduationCap,
    BookOpen,
    Zap,
} from "lucide-react";

function UserStats({ title, value, icon }) {

    const icons = {
        users: <Users size={18} />,
        students: <GraduationCap size={18} />,
        creator: <BookOpen size={18} />,
        active: <Zap size={18} />,
    };

    return (
        <div className="user-stat-card">

            <div className="user-stat-info">

                <p>{title}</p>

                <h2>{value}</h2>

            </div>

            <div className="user-stat-icon">

                {icons[icon]}

            </div>

        </div>
    );

}

export default UserStats;