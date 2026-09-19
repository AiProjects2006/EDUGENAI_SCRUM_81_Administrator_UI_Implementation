import "./AddUserModal.css";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

function AddUserModal({ onClose, onSave, editingUser }) {

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        role: "Student",
        grade: "Grade 3",
        status: "Active",
        password: "",
    });

    useEffect(() => {

        if (editingUser) {

            setFormData({
                fullName: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                grade: editingUser.grade,
                status: editingUser.status,
                password: editingUser.password || "",
            });

        }

    }, [editingUser]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave({
            ...editingUser,
            ...formData,
            name: formData.fullName,
        });
    };

    return (

        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <h2>
                        {editingUser ? "Edit User" : "Add New User"}
                    </h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        <X size={20}/>
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Full Name</label>

                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>User Type</label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >

                                <option>Student</option>
                                <option>Content Creator</option>
                                <option>Administrator</option>

                            </select>

                        </div>

                        <div className="form-group">

                            <label>Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >

                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Suspended</option>

                            </select>

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Grade / Subject</label>

                        <input
                            type="text"
                            name="grade"
                            placeholder="Grade or Subject"
                            value={formData.grade}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                        >
                            {editingUser ? "Update User" : "Save User"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddUserModal;