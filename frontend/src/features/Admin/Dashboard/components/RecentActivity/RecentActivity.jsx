import "./RecentActivity.css";
import {
    ShieldAlert,
    UserPlus,
    BookOpenCheck,
    Wand2,
} from "lucide-react";

function RecentActivity() {

    const activities = [
        {
            icon: <UserPlus />,
            title: "New student registered: Liam J.",
            time: "5 minutes ago"
        },
        {
            icon: <BookOpenCheck />,
            title: "Course Published: Bio 101",
            time: "20 minutes ago"
        },
        {
            icon: <Wand2 />,
            title: "AI Gen: Physics Quiz",
            time: "45 minutes ago"
        },
        {
            icon: <ShieldAlert />,
            title: "Security Alert: Faild Login",
            time: "1 hour ago"
        }
    ];

    return (
        <div className="recent-activity">

            <div className="activity-header">

                <h2>Recent Activity</h2>

                <button>View All</button>

            </div>

            <div className="activity-list">

                {activities.map((activity, index) => (

                    <div
                        className="activity-item"
                        key={index}
                    >

                        <div className="activity-icon">
                            {activity.icon}
                        </div>

                        <div className="activity-info">

                            <h4>{activity.title}</h4>

                            <p>{activity.time}</p>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );

}

export default RecentActivity;