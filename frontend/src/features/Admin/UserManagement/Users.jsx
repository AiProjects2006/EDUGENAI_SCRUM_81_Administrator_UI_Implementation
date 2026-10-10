import "./Users.css";

import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";
import UserStats from "./components/UserStats/UserStats.jsx";
import UserFilter from "./components/UserFilter/UserFilter.jsx";
import UserManagementTable from "./components/UserTable/UserManagementTable.jsx";
import Pagination from "./components/Pagination/Pagination.jsx";
import { useState } from "react";
import AddUserModal from "./components/AddUserModal/AddUserModal.jsx";
import DeleteUserModal from "./components/DeleteUserModal/DeleteUserModal.jsx";

import { userStats, users as initialUsers } from "./data/usersData.js";
import { UserPlus } from "lucide-react";


function Users() {
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState(initialUsers);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const handleAddUser = (newUser) => {

        const user = {
            id: `ID: ${Math.floor(Math.random() * 100000)}`,

            name: newUser.fullName,

            initials: newUser.fullName
                .split(" ")
                .map(name => name[0])
                .join("")
                .toUpperCase(),

            joined: new Date().toLocaleDateString(),

            ...newUser
        };

        setUsers([...users, user]);

        setShowModal(false);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleUpdateUser = (updatedUser) => {

        const updatedUsers = users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
        );

        setUsers(updatedUsers);

        setEditingUser(null);
        setShowModal(false);
    };

    const handleDeleteUser = (user) => {

        setDeleteUser(user);

    };

    const confirmDeleteUser = (id) => {

        setDeletingId(id);

        setTimeout(() => {
            setUsers(users.filter(user => user.id !== id));
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