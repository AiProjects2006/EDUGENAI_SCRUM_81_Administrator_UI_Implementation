import "./UserTable.css";
import { useEffect, useState } from "react";
import { fetchUsersFromBackoffice, createUserInBackoffice } from "../../../../../services/backofficeService.js";
import AddUserModal from "../../../UserManagement/components/AddUserModal/AddUserModal.jsx";
import toast from "react-hot-toast";

function UserTable() {

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsersFromBackoffice();
                setUsers(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load dashboard users:", err);
                setError("Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const search = searchTerm.toLowerCase().trim();

        const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`
            .toLowerCase();

        const email = (user.email ?? "").toLowerCase();

        return (
            fullName.includes(search) ||
            email.includes(search)
        );
    });

    const handleAddUser = async (userData) => {
        try {
            await createUserInBackoffice(userData);

            const updatedUsers = await fetchUsersFromBackoffice();
            setUsers(Array.isArray(updatedUsers) ? updatedUsers : []);

            setShowAddModal(false);
            toast.success("User created successfully!");
        } catch (err) {
            console.error("Failed to create user:", err);
            toast.error("Failed to create user.");
        }
    };

    return (

        <div className="user-table-card">

            <div className="table-header">

                <h2>User Management</h2>

                <div className="table-toolbar">

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button onClick={() => setShowAddModal(true)}>
                        Add User
                    </button>

                </div>


            </div>

            <table className="user-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                </tr>
                </thead>

                <tbody>
                {loading && (
                    <tr>
                        <td colSpan={5}>Loading users...</td>
                    </tr>
                )}

                {!loading && error && (
                    <tr>
                        <td colSpan={5}>{error}</td>
                    </tr>
                )}

                {!loading && !error && filteredUsers.length === 0 && (
                    <tr>
                        <td colSpan={5}>No users found.</td>
                    </tr>
                )}

                {!loading && !error && filteredUsers.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>

                        <td>
                            {`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()}
                        </td>

                        <td>{user.email}</td>

                        <td>
                            {user.role?.replaceAll("_", " ")}
                        </td>

                        <td>
                    <span
                        className={
                            user.accountStatus === "ACTIVE"
                                ? "status active"
                                : "status inactive"
                        }
                    >
                        {user.accountStatus?.replaceAll("_", " ")}
                    </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showAddModal && (
                <AddUserModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddUser}
                />
            )}

        </div>

    );

}

export default UserTable;