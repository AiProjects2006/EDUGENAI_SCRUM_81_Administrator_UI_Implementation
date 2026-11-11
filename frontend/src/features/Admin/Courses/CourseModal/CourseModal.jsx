import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./CourseModal.css";

function CourseModal({ course, mode, onClose, onSave }) {
    const [formData, setFormData] = useState({});
    useEffect(() => {
        if (course) {
            setFormData({ ...course });
        }
    }, [course]);

    console.log("Selected Course:", course);

    if (!course) {
        return null;
    }

    const handleChange = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (onSave) {
            onSave(formData);
        }
    };

    const isViewMode = mode === "view";

    return (
        <div className="modal-overlay">
            <div className="course-modal">

                <div className="modal-header">
                    <h2>
                        {isViewMode
                            ? "Course Details"
                            : "Edit Course"}
                    </h2>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form className="course-modal-form" onSubmit={handleSubmit}>

                    <div className="modal-body">

                        <div className="form-group">
                            <label>Course Title</label>

                            <input
                                type="text"
                                value={formData.title || ""}
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Creator</label>

                            <input
                                type="text"
                                value={formData.creator || ""}
                                onChange={(e) =>
                                    handleChange("creator", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Subject</label>

                            <input
                                type="text"
                                value={formData.subject || ""}
                                onChange={(e) =>
                                    handleChange("subject", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Grade</label>

                            <input
                                type="text"
                                value={formData.grade || ""}
                                onChange={(e) =>
                                    handleChange("grade", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>

                            <input
                                type="text"
                                value={formData.status || ""}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label>Date</label>

                            <input
                                type="text"
                                value={formData.date || ""}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>

                            <textarea
                                value={formData.description || ""}
                                readOnly={isViewMode}
                                onChange={(event) =>
                                    handleChange(
                                        "description",
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Total Lessons</label>

                            <input
                                type="number"
                                value={formData.lessons || 0}
                                readOnly={isViewMode}
                                onChange={(event) =>
                                    handleChange(
                                        "lessons",
                                        Number(event.target.value)
                                    )
                                }
                            />
                        </div>

                    </div>

                    <div className="modal-footer">

                        {isViewMode ? (
                            <button
                                type="button"
                                className="close-btn"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        ) : (
                            <>
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
                                    Save Changes
                                </button>
                            </>
                        )}

                    </div>

                </form>

            </div>
        </div>
    );
}

export default CourseModal;