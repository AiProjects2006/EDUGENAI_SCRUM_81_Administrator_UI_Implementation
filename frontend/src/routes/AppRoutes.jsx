import { Routes, Route } from "react-router-dom";

import Dashboard from "../features/Admin/Dashboard/Dashboard.jsx";
import Users from "../features/Admin/UserManagement/Users.jsx";
import Courses from "../features/Admin/Courses/Courses.jsx";
import PlatformAnalytics from "../features/Admin/PlatformAnalytics/PlatformAnalytics";
import Progress from "../features/Admin/Progress/Progress";
import Settings from "../features/Admin/Settings/Settings";
import BackofficeLayout from "../components/layout/BackofficeLayout";
import ContentModeration from "../features/Admin/ContentModeration/ContentModeration";

function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route path="/users" element={<Users />} />

            <Route path="/courses" element={<Courses />} />

            <Route path="/content-moderation" element={<ContentModeration />}/>

            <Route path="/platform-analytics" element={<PlatformAnalytics />} />

            <Route path="/progress" element={<Progress />} />

            <Route path="/settings" element={<Settings />} />

        </Routes>
    );
}

export default AppRoutes;