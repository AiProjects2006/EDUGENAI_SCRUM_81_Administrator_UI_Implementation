import { CalendarClock } from "lucide-react";

import { upcomingDeadline } from "../data/AnalyticsData.js";

import "./UpcomingDeadline.css";

function UpcomingDeadline() {
    return (
        <div className="upcoming-deadline-panel">

            <div className="upcoming-deadline-icon">
                <CalendarClock size={18} />
            </div>

            <div className="upcoming-deadline-content">

                <span className="upcoming-deadline-label">
                    PREPARE EARLY
                </span>

                <h2>{upcomingDeadline.title}</h2>

                <p>{upcomingDeadline.description}</p>

                <div className="upcoming-deadline-date">
                    <CalendarClock size={13} />
                    <span>{upcomingDeadline.date}</span>
                </div>

            </div>

        </div>
    );
}

export default UpcomingDeadline;