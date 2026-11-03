import { Eye, SquarePen, Check, Archive, Trash2 } from "lucide-react";

function CourseTable({ courses, onView, onEdit, onApprove, onArchive, onDelete }) {
    return (
        <div className="course-table-wrapper">
            <table className="course-table">
                <thead>
                <tr>
                    <th>Course Title</th>
                    <th>Creator</th>
                    <th>Subject</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {courses.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="no-courses">
                            No courses found.
                        </td>
                    </tr>
                ) : (
                    courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.creator}</td>
                            <td>{course.subject}</td>
                            <td>{course.grade}</td>

                            <td>
                                    <span
                                        className={`status-badge ${course.status.toLowerCase()}`}
                                    >
                                        {course.status}
                                    </span>
                            </td>

                            <td>{course.date}</td>

                            <td className="course-actions">
                                <button
                                    title="View Course"
                                    onClick={() => onView(course)}
                                >
                                    <Eye size={17} />
                                </button>

                                <button
                                    title="Edit Course"
                                    onClick={() => onEdit(course)}
                                >
                                    <SquarePen size={17} />
                                </button>

                                <button
                                    onClick={() => onDelete(course)}
                                    title="Delete Course"
                                >
                                    <Trash2 size={16} />
                                </button>

                                {course.status === "Pending" && (
                                    <button
                                        title="Approve Course"
                                        onClick={() => onApprove(course)}
                                    >
                                        <Check size={17} />
                                    </button>
                                )}

                                {course.status === "Approved" && (
                                    <button
                                        title="Archive Course"
                                        onClick={() => onArchive(course)}
                                    >
                                        <Archive size={17} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default CourseTable;