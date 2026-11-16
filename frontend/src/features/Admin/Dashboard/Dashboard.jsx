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
    const [usersError, setUsersError] = useState(false);
    const [totalCourses, setTotalCourses] = useState(null);
    const [totalActivities, setTotalActivities] = useState(null);
    const [studentsError, setStudentsError] = useState(false);
    const [coursesError, setCoursesError] = useState(false);
    const [activitiesError, setActivitiesError] = useState(false);

    useEffect(() => {
        const loadDashboardUsers = async () => {
            try {
                const users = await fetchUsersFromBackoffice();
                setTotalUsers(users.length);
            } catch (error) {
                console.error("Failed to load users:", error);
                setUsersError(true);
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
                setStudentsError(true);
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
                setCoursesError(true);
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
                setActivitiesError(true);
            }
        };

        loadActivityStats();
    }, []);

    return (

    <BackofficeLayout>

        <Toaster
            position="top-center"
            toastOptions={{
                duration: 4000,
                style: {
                    padding: "12px 18px",
                    fontSize: "14px",
                    fontWeight: 500,
                },
                error: {
                    style: {
                        color: "#dc2626",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                    },
                },
            }}
        />

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
                    value={
                        usersError
                            ? <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "6px 10px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#dc2626",
                                    backgroundColor: "#fef2f2",
                                    borderRadius: "6px",
                                }}
                            >
                                Unable to load
                            </span>
                            : totalUsers === null
                                ? <span style={{ fontSize: "14px", color: "#888" }}>
                                    Loading...
                                  </span>
                                : totalUsers.toLocaleString()
                    }
                    icon={<Users size={18} />}
                />

                <DashboardCard
                    title="Active Students"
                    value={
                        studentsError
                            ?
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "6px 10px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#dc2626",
                                    backgroundColor: "#fef2f2",
                                    borderRadius: "6px",
                                }}
                            >
                                Unable to load
                            </span>

                            : activeStudents === null
                                ? <span style={{ fontSize: "14px", color: "#888" }}>
                                    Loading...
                                  </span>
                                : activeStudents.toLocaleString()
                    }
                    icon={<FaUser size={18} />}
                />

                <DashboardCard
                    title="Total Courses"
                    value={
                        coursesError
                            ?
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "6px 10px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#dc2626",
                                    backgroundColor: "#fef2f2",
                                    borderRadius: "6px",
                                }}
                            >
                                Unable to load
                            </span>

                            : totalCourses === null
                                ? <span style={{ fontSize: "14px", color: "#888" }}>
                                    Loading...
                                  </span>
                                : totalCourses.toLocaleString()
                    }
                    icon={<BookOpen size={18} />}
                />

                <DashboardCard
                    title="Activities"
                    value={
                        activitiesError
                            ?
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "6px 10px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#dc2626",
                                    backgroundColor: "#fef2f2",
                                    borderRadius: "6px",
                                }}
                            >
                                Unable to load
                            </span>

                            : totalActivities === null
                                ? <span style={{ fontSize: "14px", color: "#888" }}>
                                    Loading...
                                  </span>
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