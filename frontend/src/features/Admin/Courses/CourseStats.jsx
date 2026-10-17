import {
    BookOpen,
    Clock,
    CheckCircle,
    Archive
} from "lucide-react";

function CourseStats({ courses = [] }) {

    const total = courses.length;
    const pending = courses.filter(
        c => (c.status || '').toLowerCase() === 'pending' || (c.status || '').toLowerCase() === 'draft'
    ).length;
    const approved = courses.filter(
        c => (c.status || '').toLowerCase() === 'approved' || (c.status || '').toLowerCase() === 'published'
    ).length;
    const archived = courses.filter(
        c => (c.status || '').toLowerCase() === 'archived'
    ).length;

    const stats = [
        {
            title: "Total Courses",
            value: total,
            icon: BookOpen
        },
        {
            title: "Pending Approval",
            value: pending,
            icon: Clock
        },
        {
            title: "Approved",
            value: approved,
            icon: CheckCircle
        },
        {
            title: "Archived",
            value: archived,
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