import {
    BookOpen,
    Bot,
    CheckCircle,
    Ban
} from "lucide-react";

import "./CourseDetails.css";

function CourseDetails({ course, onApprove, onArchive }) {

    if (!course) {
        return (
            <div className="course-details empty-details">
                <div className="empty-details-content">
                    <BookOpen size={40} />
                    <h3>Select a Course</h3>
                    <p>
                        Select a course from the table to view its details.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="course-details">

            {/* Course Cover */}
            <div className="course-details-cover">
                {course.image ? (
                    <img
                        src={course.image}
                        alt={course.title}
                    />
                ) : (
                    <div className="course-cover-placeholder">
                        <BookOpen size={42} />
                    </div>
                )}

                <span className="course-details-status">
                    {course.status}
                </span>
            </div>

            {/* Course Information */}
            <div className="course-details-content">

                <h2>{course.title}</h2>

                <p className="course-details-description">
                    {course.description ||
                        "No description available for this course."}
                </p>

                {/* Grade + Creator */}
                <div className="course-info-grid">

                    <div className="course-info-item">
                        <span>Grade Level</span>
                        <strong>{course.grade}</strong>
                    </div>

                    <div className="course-info-item">
                        <span>Creator</span>
                        <strong>{course.creator}</strong>
                    </div>

                </div>

                {/* Content Overview */}
                <div className="content-overview">

                    <h3>Content Overview</h3>

                    <div className="overview-item">
                        <div className="overview-icon">
                            <BookOpen size={18} />
                        </div>

                        <div>
                            <strong>
                                {course.lessons || 0} Core Lessons
                            </strong>

                            <span>
                                Standardized Curriculum
                            </span>
                        </div>
                    </div>

                    <div className="overview-item">
                        <div className="overview-icon">
                            <Bot size={18} />
                        </div>

                        <div>
                            <strong>
                                {course.activities || 0} AI Activities
                            </strong>

                            <span>
                                Interactive Learning
                            </span>
                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div className="course-details-actions">

                    {course.status !== "Approved" && (
                        <button
                            className="approve-course-button"
                            onClick={() => onApprove(course)}
                        >
                            <CheckCircle size={17} />
                            Approve Course
                        </button>
                    )}

                    {course.status !== "Archived" && (
                        <button
                            className="archive-course-button"
                            onClick={() => onArchive(course)}
                            title="Archive Course"
                        >
                            <Ban size={17} />
                        </button>
                    )}

                </div>

            </div>
        </div>
    );
}

export default CourseDetails;