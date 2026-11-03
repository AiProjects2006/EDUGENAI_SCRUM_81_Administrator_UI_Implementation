import "./Dashboard.css";

import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";
import DashboardCard from "./components/DashboardCard/DashboardCard.jsx";
import RecentActivity from "./components/RecentActivity/RecentActivity.jsx";
import UserTable from "./components/UserTable/UserTable.jsx";
import {FaUser} from "react-icons/fa";
import AnalyticsChart from "./components/AnalyticsChart/AnalyticsChart.jsx";
import { Users, Sparkles, BookOpen } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchUsersFromBackoffice, fetchCourseStatsFromBackoffice,fetchActivityStatsFromBackoffice, fetchEnrollmentStatsFromBackoffice } from "../../../services/backofficeService.js";

function Dashboard() {

    const [activeStudents, setActiveStudents] = useState(null);
    const [totalUsers, setTotalUsers] = useState(null);
    const [totalCourses, setTotalCourses] = useState(null);
    const [totalActivities, setTotalActivities] = useState(null);

    useEffect(() => {
        const loadDashboardUsers = async () => {
            try {
                const users = await fetchUsersFromBackoffice();
                setTotalUsers(users.length);
            } catch (error) {
                console.error("Failed to load users:", error);
            }
        };

        loadDashboardUsers();
    }, []);

    useEffect(() => {
        const loadActiveStudents = async () => {
            try {
                const stats = await fetchEnrollmentStatsFromBackoffice();
                setActiveStudents(stats.activeStudents ?? null);
            } catch (error) {
                console.error("Failed to load active students:", error);
            }
        };

        loadActiveStudents();
    }, []);

    useEffect(() => {
        const loadCourseStats = async () => {
            try {
                const stats = await fetchCourseStatsFromBackoffice();

                setTotalCourses(stats.totalCourses ?? null);
            } catch (error) {
                console.error("Failed to load course statistics:", error);
            }
        };

        loadCourseStats();
    }, []);

    useEffect(() => {
        const loadActivityStats = async () => {
            try {
                const stats = await fetchActivityStatsFromBackoffice();

                setTotalActivities(stats.totalActivities ?? null);
            } catch (error) {
                console.error("Failed to load activity statistics:", error);
            }
        };

        loadActivityStats();
    }, []);

    return (

    <BackofficeLayout>
        <Toaster position="top-right" />

        <div className="dashboard-page">

            <h1 className="dashboard-title">
                Admin Dashboard
            </h1>

            <p className="dashboard-subtitle">
                Manage students and content creators across the ecosystem.
            </p>

            <div className="dashboard-cards">

                <DashboardCard
                    title="Total Users"
                    value={totalUsers === null ? "—" : totalUsers.toLocaleString()}
                    icon={<Users size={18} />}
                />

                <DashboardCard
                    title="Active Students"
                    value={activeStudents === null ? "—" : activeStudents.toLocaleString()}
                    icon={<FaUser size={18} />}
                />

                <DashboardCard
                    title="Total Courses"
                    value={totalCourses === null ? "—" : totalCourses.toLocaleString()}
                    icon={<BookOpen size={18} />}
                />

                <DashboardCard
                    title="Activities"
                    value={
                        totalActivities === null
                            ? "—"
                            : totalActivities.toLocaleString()
                    }
                    icon={<Sparkles size={18} />}
                />

            </div>

            <div className="dashboard-middle">

                <AnalyticsChart />

                <RecentActivity />
            </div>

            <div className="dashboard-table">

                <UserTable/>

            </div>

        </div>

    </BackofficeLayout>

    );

}

export default Dashboard;