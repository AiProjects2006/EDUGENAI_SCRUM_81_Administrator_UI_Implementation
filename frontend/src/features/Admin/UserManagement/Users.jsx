import "./Users.css";

import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";
import UserStats from "./components/UserStats/UserStats.jsx";
import UserFilter from "./components/UserFilter/UserFilter.jsx";
import UserManagementTable from "./components/UserTable/UserManagementTable.jsx";
import Pagination from "./components/Pagination/Pagination.jsx";
import { useState, useEffect, useCallback } from "react";
import AddUserModal from "./components/AddUserModal/AddUserModal.jsx";
import DeleteUserModal from "./components/DeleteUserModal/DeleteUserModal.jsx";

import { userStats as fallbackUserStats, users as initialUsers } from "./data/usersData.js";
import {
    fetchBackofficeUsers,
    registerBackofficeUser,
    updateBackofficeUser,
    updateBackofficeUserStatus,
    deleteBackofficeUser
} from "../../../services/backofficeService.js";
import { UserPlus } from "lucide-react";

const mapBackendUserToRow = (u) => {
    const firstName = u.firstName || "";
    const lastName = u.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || u.username || u.email || "Platform User";
    const initials = fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U";

    const rawRole = String(u.role || "STUDENT").toUpperCase();
    const roleLabel =
        rawRole === "CONTENT_CREATOR"
            ? "Content Creator"
            : rawRole === "ADMIN"
            ? "Administrator"
            : "Student";

    const rawStatus = String(u.accountStatus || "ACTIVE").toUpperCase();
    const statusLabel =
        rawStatus === "SUSPENDED"
            ? "Suspended"
            : rawStatus === "PENDING_VERIFICATION"
            ? "Pending"
            : rawStatus === "INACTIVE"
            ? "Inactive"
            : "Active";

    const joinedDate = u.createdAt
        ? new Date(u.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric"
          })
        : new Date().toLocaleDateString();

    return {
        id: `ID: ${u.id}`,
        rawId: u.id,
        name: fullName,
        fullName,
        email: u.email || "",
        role: roleLabel,
        grade: u.preferredSubjects || (rawRole === "STUDENT" ? "Student Portal" : "Curriculum"),
        status: statusLabel,
        joined: joinedDate,
        initials
    };
};

const toBackendRole = (uiRole) => {
    const r = String(uiRole || "").toLowerCase();
    if (r.includes("creator")) return "CONTENT_CREATOR";
    if (r.includes("admin")) return "ADMIN";
    return "STUDENT";
};

const toBackendStatus = (uiStatus) => {
    const s = String(uiStatus || "").toLowerCase();
    if (s.includes("suspend")) return "SUSPENDED";
    if (s.includes("pending")) return "PENDING_VERIFICATION";
    if (s.includes("inactive")) return "INACTIVE";
    return "ACTIVE";
};

function Users() {
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState(initialUsers);
    const [stats, setStats] = useState(fallbackUserStats);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadUsersFromBackoffice = useCallback(async () => {
        try {
            const backendUsers = await fetchBackofficeUsers();
            if (Array.isArray(backendUsers) && backendUsers.length > 0) {
                const mapped = backendUsers.map(mapBackendUserToRow);
                setUsers(mapped);

                const total = mapped.length;
                const students = mapped.filter((u) => u.role === "Student").length;
                const creators = mapped.filter((u) => u.role === "Content Creator").length;
                const active = mapped.filter((u) => u.status === "Active").length;

                setStats([
                    { title: "Total Users", value: total.toLocaleString(), icon: "users" },
                    { title: "Total Students", value: students.toLocaleString(), icon: "students" },
                    { title: "Content Creators", value: creators.toLocaleString(), icon: "creator" },
                    { title: "Active Users", value: active.toLocaleString(), icon: "active" }
                ]);
            }
        } catch (err) {
            console.warn("Using fallback user table (Backoffice API offline):", err.message);
        }
    }, []);

    useEffect(() => {
        loadUsersFromBackoffice();
    }, [loadUsersFromBackoffice]);

    const handleAddUser = async (newUser) => {
        const parts = (newUser.fullName || "New User").trim().split(/\s+/);
        const firstName = parts[0] || "New";
        const lastName = parts.slice(1).join(" ") || "User";
        const cleanEmail = (newUser.email || "").trim().toLowerCase();

        try {
            const resp = await registerBackofficeUser({
                firstName,
                lastName,
                username: cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9_]/g, ""),
                email: cleanEmail,
                password: newUser.password || "User@1234",
                contactNumber: "0770000000",
                role: toBackendRole(newUser.role),
                accountStatus: toBackendStatus(newUser.status),
                preferredSubjects: newUser.grade || ""
            });
            if (resp && resp.user) {
                setUsers((prev) => [mapBackendUserToRow(resp.user), ...prev]);
                setShowModal(false);
                return;
            }
        } catch (err) {
            console.warn("Backoffice user registration fallback to local state:", err.message);
        }

        const localUser = {
            id: `ID: ${Math.floor(Math.random() * 100000)}`,
            name: newUser.fullName,
            initials: newUser.fullName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase(),
            joined: new Date().toLocaleDateString(),
            ...newUser
        };
        setUsers((prev) => [localUser, ...prev]);
        setShowModal(false);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleUpdateUser = async (updatedUser) => {
        const rawId = updatedUser.rawId || Number(String(updatedUser.id || "").replace(/\D+/g, ""));
        if (rawId) {
            const parts = (updatedUser.fullName || updatedUser.name || "").trim().split(/\s+/);
            const firstName = parts[0] || "User";
            const lastName = parts.slice(1).join(" ") || "Account";
            try {
                await updateBackofficeUser(rawId, {
                    firstName,
                    lastName,
                    email: updatedUser.email,
                    contactNumber: "0770000000"
                });
                await updateBackofficeUserStatus(rawId, toBackendStatus(updatedUser.status));
            } catch (err) {
                console.warn("Backoffice user update fallback:", err.message);
            }
        }

        setUsers((prev) =>
            prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setEditingUser(null);
        setShowModal(false);
    };

    const handleDeleteUser = (user) => {
        setDeleteUser(user);
    };

    const confirmDeleteUser = async (id) => {
        setDeletingId(id);
        const target = users.find((u) => u.id === id);
        const rawId = target?.rawId || Number(String(id || "").replace(/\D+/g, ""));

        if (rawId) {
            try {
                await deleteBackofficeUser(rawId);
            } catch (err) {
                console.warn("Backoffice user delete fallback:", err.message);
            }
        }

        setTimeout(() => {
            setUsers((prev) => prev.filter((user) => user.id !== id));
            setDeletingId(null);
        }, 300);

        setDeleteUser(null);
    };

    return (
        <BackofficeLayout>
            <div className="users-page">
                <div className="users-header">
                    <div>
                        <h1>User Management</h1>
                        <p>
                            Manage students and content creators across the ecosystem.
                        </p>
                    </div>

                    <button
                        className="add-user-btn"
                        onClick={() => setShowModal(true)}
                    >
                        <UserPlus size={18} />
                        <span>Add New User</span>
                    </button>
                </div>

                <div className="users-stats">
                    {stats.map((stat) => (
                        <UserStats
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                        />
                    ))}
                </div>

                <UserFilter />

                <UserManagementTable
                    users={users}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    deletingId={deletingId}
                />

                <Pagination />
            </div>

            {showModal && (
                <AddUserModal
                    onClose={() => {
                        setShowModal(false);
                        setEditingUser(null);
                    }}
                    onSave={editingUser ? handleUpdateUser : handleAddUser}
                    editingUser={editingUser}
                />
            )}

            {deleteUser && (
                <DeleteUserModal
                    user={deleteUser}
                    onCancel={() => setDeleteUser(null)}
                    onConfirm={confirmDeleteUser}
                />
            )}
        </BackofficeLayout>
    );
}

export default Users;
