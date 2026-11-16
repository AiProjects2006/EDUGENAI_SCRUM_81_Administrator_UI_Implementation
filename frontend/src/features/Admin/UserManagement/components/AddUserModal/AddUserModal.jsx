import "./AddUserModal.css";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

function AddUserModal({ onClose, onSave, editingUser }) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contactNumber: "",
        role: "STUDENT",
        password: "",
    });

    useEffect(() => {
        if (editingUser) {
            const nameParts = (editingUser.name || "").trim().split(/\s+/);

            setFormData({
                firstName: editingUser.firstName || nameParts[0] || "",
                lastName: editingUser.lastName || nameParts.slice(1).join(" ") || "",
                username: editingUser.username || "",
                email: editingUser.email || "",
                contactNumber: editingUser.contactNumber || "",
                password: "",
                role: editingUser.role || "STUDENT",
            });
        }
    }, [editingUser]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSaving) return;

        setIsSaving(true);

        try {
            if (editingUser) {
                await onSave({
                    id: editingUser.id,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    contactNumber: formData.contactNumber,
                });
            } else {
                await onSave({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username,
                    email: formData.email,
                    contactNumber: formData.contactNumber,
                    password: formData.password,
                    role: formData.role,
                });
            }
        } finally {
            setIsSaving(false);
        }
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
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={formData.username}
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

                    <div className="form-group">
                        <label>Contact Number</label>
                        <input
                            type="tel"
                            name="contactNumber"
                            placeholder="Enter contact number"
                            value={formData.contactNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 10) {
                                    handleChange({
                                        target: {
                                            name: "contactNumber",
                                            value: value,
                                        },
                                    });
                                }
                            }}
                            inputMode="numeric"
                            pattern="0[0-9]{9}"
                            maxLength={10}
                            minLength={10}
                            title="Enter a valid 10-digit Sri Lankan phone number starting with 0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>User Type</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="CONTENT_CREATOR">Content Creator</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>

                    {!editingUser && (
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                        </div>
                    )}

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
                            disabled={isSaving}
                        >
                            {isSaving
                                ? (editingUser ? "Updating..." : "Saving...")
                                : (editingUser ? "Update User" : "Save User")}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddUserModal;