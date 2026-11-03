import "./RecentActivity.css";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { fetchRecentActivitiesFromBackoffice } from "../../../../../services/backofficeService.js";

function RecentActivity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadActivities = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await fetchRecentActivitiesFromBackoffice();

                setActivities(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load recent activities:", err);
                setError("Unable to load recent activities.");
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
    }, []);

    return (
        <div className="recent-activity">
            <div className="activity-header">
                <h2>Recent Activity</h2>
            </div>

            <div className="activity-list">
                {loading && <p>Loading activities...</p>}

                {error && <p role="alert">{error}</p>}

                {!loading && !error && activities.length === 0 && (
                    <p>No activities found.</p>
                )}

                {!loading && !error && activities.map((activity) => (
                    <div
                        className="activity-item"
                        key={activity.activityId}
                    >
                        <div className="activity-icon">
                            <Sparkles size={18} />
                        </div>

                        <div className="activity-info">
                            <h4>{activity.title}</h4>

                            <p>
                                {activity.activityType?.replaceAll("_", " ")}
                                {" • "}
                                {activity.status}
                            </p>

                            {activity.createdAt && (
                                <p className="activity-date">
                                    {new Date(activity.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentActivity;
