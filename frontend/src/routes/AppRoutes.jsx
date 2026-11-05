import { Routes, Route, Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

import AdminLogin from "../features/Admin/Auth/AdminLogin";
import Dashboard from "../features/Admin/Dashboard/Dashboard.jsx";
import Users from "../features/Admin/UserManagement/Users.jsx";
import CreatorManagement from "../features/Admin/CreatorManagement/CreatorManagement.jsx";
import Courses from "../features/Admin/Courses/Courses.jsx";
import PlatformAnalytics from "../features/Admin/PlatformAnalytics/PlatformAnalytics";
import NotificationManagement from "../features/Admin/NotificationManagement/NotificationManagement";
import Settings from "../features/Admin/Settings/Settings";
import ContentModeration from "../features/Admin/ContentModeration/ContentModeration";

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAdminAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<AdminLogin />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <Users />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/creators"
                element={
                    <ProtectedRoute>
                        <CreatorManagement />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/content-creators"
                element={
                    <ProtectedRoute>
                        <CreatorManagement />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/courses"
                element={
                    <ProtectedRoute>
                        <Courses />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/content-moderation"
                element={
                    <ProtectedRoute>
                        <ContentModeration />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/platform-analytics"
                element={
                    <ProtectedRoute>
                        <PlatformAnalytics />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/notification-management"
                element={
                    <ProtectedRoute>
                        <NotificationManagement />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;
