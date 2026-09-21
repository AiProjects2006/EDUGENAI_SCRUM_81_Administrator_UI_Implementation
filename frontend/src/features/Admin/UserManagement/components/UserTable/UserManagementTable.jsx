import "./UserManagementTable.css";

import { Pencil, Trash2 } from "lucide-react";

function UserManagementTable({ users, onEdit, onDelete, deletingId }) {

    return (

        <div className="user-table-card">

            <table>

                <thead>

                <tr>

                    <th>User</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Grade / Focus</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Actions</th>

                </tr>

                </thead>

                <tbody>

                {users.map((user) => (

                    <tr
                        key={user.id}
                        className={deletingId === user.id ? "deleting-row" : ""}
                    >

                        <td>

                            <div className="user-info">

                                <div className="avatar">

                                    {user.initials}

                                </div>

                                <div>

                                    <h4>{user.name || user.fullName}</h4>

                                    <p>{user.id}</p>

                                </div>

                            </div>

                        </td>

                        <td>{user.email}</td>

                        <td>

                            <span className="role-badge">

                                {user.role}

                            </span>

                        </td>

                        <td>{user.grade}</td>

                        <td>

                            <span className={`status ${user.status.toLowerCase()}`}>

                                {user.status}

                            </span>

                        </td>

                        <td>{user.joined}</td>

                        <td>

                            <button
                                className="icon-btn"
                                onClick={() => onEdit(user)}
                            >
                                <Pencil size={18}/>
                            </button>

                            <button
                                className="icon-btn delete"
                                onClick={() => onDelete(user)}
                            >
                                <Trash2 size={18}/>
                            </button>

                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>

    );

}

export default UserManagementTable;