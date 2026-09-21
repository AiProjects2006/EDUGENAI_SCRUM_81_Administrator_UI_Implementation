import {
    BookOpen,
    Clock,
    CheckCircle,
    Archive
} from "lucide-react";

function CourseStats() {

    const stats = [
        {
            title: "Total Courses",
            value: 24,
            icon: BookOpen
        },
        {
            title: "Pending Approval",
            value: 6,
            icon: Clock
        },
        {
            title: "Approved",
            value: 15,
            icon: CheckCircle
        },
        {
            title: "Archived",
            value: 3,
            icon: Archive
        }
    ];

    return (
        <div className="course-stats">

            {stats.map((stat) => {

                const Icon = stat.icon;

                return (
                    <div className="course-stat-card" key={stat.title}>

                        <div className="course-stat-icon">
                            <Icon size={24} />
                        </div>

                        <div className="course-stat-info">
                            <p>{stat.title}</p>
                            <h3>{stat.value}</h3>
                        </div>

                    </div>
                );

            })}

        </div>
    );
}

export default CourseStats;