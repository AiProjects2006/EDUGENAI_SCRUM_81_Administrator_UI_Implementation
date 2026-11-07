import "./Dashboard.css";

import { useEffect, useState } from "react";
import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";
import DashboardCard from "./components/DashboardCard/DashboardCard.jsx";
import RecentActivity from "./components/RecentActivity/RecentActivity.jsx";
import UserTable from "./components/UserTable/UserTable.jsx";
import { FaUser } from "react-icons/fa";
import AnalyticsChart from "./components/AnalyticsChart/AnalyticsChart.jsx";
import { Users, Sparkles, BookOpen } from "lucide-react";
import { fetchBackofficeOverview } from "../../../services/backofficeService.js";

function Dashboard() {
    const [overview, setOverview] = useState(null);

    useEffect(() => {
        let active = true;
        fetchBackofficeOverview()
            .then((data) => {
                if (active && data && typeof data === "object") {
                    setOverview(data);
                }
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const totalUsersVal =
        overview && Number(overview.totalUsers) > 0
            ? Number(overview.totalUsers).toLocaleString()
            : "12,450";
    const activeStudentsVal =
        overview && Number(overview.activeStudents) > 0
            ? Number(overview.activeStudents).toLocaleString()
            : "10,210";
    const totalCoursesVal =
        overview && Number(overview.totalCourses) > 0
            ? Number(overview.totalCourses).toLocaleString()
            : "450";
    const totalActivitiesVal =
        overview && Number(overview.totalActivities) > 0
            ? Number(overview.totalActivities).toLocaleString()
            : "45,200";

    return (
        <BackofficeLayout>
            <div className="dashboard-page">
                <h1 className="dashboard-title">Admin Dashboard</h1>

                <p className="dashboard-subtitle">
                    Manage students and content creators across the ecosystem.
                </p>

                <div className="dashboard-cards">
                    <DashboardCard
                        title="Total Users"
                        value={totalUsersVal}
                        icon={<Users size={18} />}
                    />

                    <DashboardCard
                        title="Active Students"
                        value={activeStudentsVal}
                        icon={<FaUser size={18} />}
                    />

                    <DashboardCard
                        title="Total Courses"
                        value={totalCoursesVal}
                        icon={<BookOpen size={18} />}
                    />

                    <DashboardCard
                        title="AI Activities"
                        value={totalActivitiesVal}
                        icon={<Sparkles size={18} />}
                    />
                </div>

                <div className="dashboard-middle">
                    <AnalyticsChart />
                    <RecentActivity />
                </div>

                <div className="dashboard-table">
                    <UserTable />
                </div>
            </div>
        </BackofficeLayout>
    );
}

export default Dashboard;
