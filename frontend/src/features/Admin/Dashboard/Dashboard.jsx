import "./Dashboard.css";

import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";
import DashboardCard from "./components/DashboardCard/DashboardCard.jsx";
import RecentActivity from "./components/RecentActivity/RecentActivity.jsx";
import UserTable from "./components/UserTable/UserTable.jsx";
import {FaUser} from "react-icons/fa";
import AnalyticsChart from "./components/AnalyticsChart/AnalyticsChart.jsx";
import { Users, Sparkles, BookOpen } from "lucide-react";


function Dashboard() {

    return (

    <BackofficeLayout>

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
                    value="12,450"
                    icon={<Users size={18} />}
                />

                <DashboardCard
                    title="Active Students"
                    value="10,210"
                    icon={<FaUser size={18}/>}
                />

                <DashboardCard
                    title="Total Courses"
                    value="450"
                    icon={<BookOpen size={18} />}
                />

                <DashboardCard
                    title="AI Activities"
                    value="45,200"
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