import "./UserTable.css";
import { Eye, Pencil, Trash2 } from "lucide-react";

function UserTable() {



    const users = [
        {
            id: 1,
            name: "John Smith",
            role: "Student",
            course: "React Development",
            status: "Active"
        },
        {
            id: 2,
            name: "Emma Wilson",
            role: "Content Creator",
            course: "AI Fundamentals",
            status: "Active"
        },
        {
            id: 3,
            name: "Michael Brown",
            role: "Student",
            course: "Java Programming",
            status: "Inactive"
        },
        {
            id: 4,
            name: "Sophia Lee",
            role: "Student",
            course: "UI/UX Design",
            status: "Active"
        }
    ];

    return (

        <div className="user-table-card">

            <div className="table-header">

                <h2>User Management</h2>

                <div className="table-toolbar">

                    <input
                        type="text"
                        placeholder="Search users..."
                    />

                    <button>
                        Add User
                    </button>

                </div>


            </div>

            <table className="user-table">

                <thead>

                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>

                </thead>

                <tbody>

                {users.map((user) => (

                    <tr key={user.id}>

                        <td>{user.id}</td>

                        <td>{user.name}</td>

                        <td>{user.role}</td>

                        <td>{user.course}</td>

                        <td>

                            <span
                                className={
                                    user.status === "Active"
                                        ? "status active"
                                        : "status inactive"
                                }
                            >
                                {user.status}
                            </span>

                        </td>

                        <td className="action-buttons">

                            <button className="view-btn">
                                <Eye size={16}/>
                            </button>

                            <button className="edit-btn">
                                <Pencil size={16} />
                            </button>

                            <button className="delete-btn">
                                <Trash2 size={16} />
                            </button>

                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>

    );

}

export default UserTable;