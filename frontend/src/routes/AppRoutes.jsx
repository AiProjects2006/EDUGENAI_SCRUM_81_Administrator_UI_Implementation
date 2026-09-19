import { Routes, Route } from "react-router-dom";

import Dashboard from "../features/Admin/Dashboard/Dashboard.jsx";
import Users from "../features/Admin/UserManagement/Users.jsx";
import Courses from "../features/Admin/Courses/Courses";
import Activities from "../features/Admin/Activities/Activities";
import Progress from "../features/Admin/Progress/Progress";
import Settings from "../features/Admin/Settings/Settings";
import BackofficeLayout from "../components/layout/BackofficeLayout";
import CreatorSidebar from "../components/layout/Sidebar/CreatorSidebar";

function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route path="/users" element={<Users />} />

            <Route path="/courses" element={<Courses />} />

            <Route path="/activities" element={<Activities />} />

            <Route path="/progress" element={<Progress />} />

            <Route path="/settings" element={<Settings />} />

        </Routes>
    );
}

export default AppRoutes;