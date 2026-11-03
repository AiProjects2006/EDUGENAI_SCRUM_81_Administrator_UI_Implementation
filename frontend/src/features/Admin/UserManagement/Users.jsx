import "./Users.css";

import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";
import UserStats from "./components/UserStats/UserStats.jsx";
import UserFilter from "./components/UserFilter/UserFilter.jsx";
import UserManagementTable from "./components/UserTable/UserManagementTable.jsx";
import Pagination from "./components/Pagination/Pagination.jsx";
import { useEffect, useState } from "react";
import { fetchUsersFromBackoffice, createUserInBackoffice, updateUserInBackoffice, deleteUserFromBackoffice } from "../../../services/backofficeService.js";
import AddUserModal from "./components/AddUserModal/AddUserModal.jsx";
import DeleteUserModal from "./components/DeleteUserModal/DeleteUserModal.jsx";
import toast, { Toaster } from "react-hot-toast";

import { UsersRound, GraduationCap, BookOpen, UserCheck } from "lucide-react";
import { UserPlus } from "lucide-react";


function Users() {
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [filters, setFilters] = useState({
        role: "ALL",
        status: "ALL"
    });
    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 10;

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await fetchUsersFromBackoffice();

            const formattedUsers = data.map((user) => {
                const name =
                    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

                const displayName =
                    name || user.username || "Unknown User";

                return {
                    ...user,
                    name: displayName,
                    fullName: displayName,
                    initials: displayName
                        .split(" ")
                        .filter(Boolean)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase(),
                    status: user.accountStatus || "UNKNOWN",
                    grade: "N/A",
                    joined: "N/A"
                };
            });

            setUsers(formattedUsers);

        } catch (err) {
            console.error("Failed to load users:", err);
            setError("Unable to load users from the server.");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);


    const handleAddUser = async (newUser) => {
        try {
            await createUserInBackoffice(newUser);

            setShowModal(false);

            await loadUsers();

            toast.success("User created successfully!");

        } catch (error) {
            console.error("Failed to create user:", error);
            toast.error("Failed to create user. Please try again.");
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleUpdateUser = async (updatedUser) => {
        try {
            await updateUserInBackoffice(updatedUser.id, {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                contactNumber: updatedUser.contactNumber
            });

            setShowModal(false);
            setEditingUser(null);

            await loadUsers();

            toast.success("User updated successfully!");

        } catch (error) {
            console.error("Failed to update user:", error);
            toast.error("Failed to update user. Please try again.");
        }
    };

    const handleDeleteUser = (user) => {

        setDeleteUser(user);

    };


    const confirmDeleteUser = async (id) => {
        try {
            setDeletingId(id);

            await deleteUserFromBackoffice(id);

            setDeleteUser(null);

            await loadUsers();

            toast.success("User deleted successfully!");

        } catch (error) {
            console.error("Failed to delete user:", error);
            toast.error("Failed to delete user. Please try again.");

        } finally {
            setDeletingId(null);
        }
    };

    const totalUsers = users.length;

    const totalStudents = users.filter(
        (user) => user.role === "STUDENT"
    ).length;

    const totalCreators = users.filter(
        (user) => user.role === "CONTENT_CREATOR"
    ).length;

    const activeUsers = users.filter(
        (user) => user.accountStatus === "ACTIVE"
    ).length;

    const userStats = [
        {
            title: "Total Users",
            value: totalUsers.toLocaleString(),
            icon: UsersRound
        },
        {
            title: "Total Students",
            value: totalStudents.toLocaleString(),
            icon: GraduationCap
        },
        {
            title: "Content Creators",
            value: totalCreators.toLocaleString(),
            icon: BookOpen
        },
        {
            title: "Active Users",
            value: activeUsers.toLocaleString(),
            icon: UserCheck
        }
    ];

    const handleFilterChange = (field, value) => {
        setFilters((previous) => ({
            ...previous,
            [field]: value
        }));

        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            role: "ALL",
            status: "ALL"
        });

        setCurrentPage(1);
    };

    const filteredUsers = users.filter((user) => {
        const matchesRole =
            filters.role === "ALL" ||
            user.role === filters.role;

        const matchesStatus =
            filters.status === "ALL" ||
            user.status === filters.status;

        return matchesRole && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const startIndex = (currentPage - 1) * usersPerPage;

    const paginatedUsers = filteredUsers.slice(
        startIndex,
        startIndex + usersPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        if (currentPage > Math.max(1, totalPages)) {
            setCurrentPage(Math.max(1, totalPages));
        }
    }, [currentPage, totalPages]);

    return (

        <BackofficeLayout>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: "10px",
                        padding: "14px 18px",
                        fontSize: "14px",
                    },
                }}
            />

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
                        <UserPlus size={18}/>
                        <span>Add New User</span>
                    </button>

                </div>

                <div className="users-stats">

                    {userStats.map((stat) => (

                        <UserStats
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                        />

                    ))}

                </div>

                <UserFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                {loading && <p>Loading users...</p>}

                {error && <p role="alert">{error}</p>}

                {!loading && !error && (
                    <UserManagementTable
                        users={paginatedUsers}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        deletingId={deletingId}
                    />
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

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