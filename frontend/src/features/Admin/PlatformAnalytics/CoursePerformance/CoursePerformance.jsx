import { coursePerformance } from "../data/AnalyticsData.js";

import "./CoursePerformance.css";

function CoursePerformance() {
    return (
        <div className="course-performance-panel">

            <div className="course-performance-header">
                <div>
                    <h2>Course Performance Details</h2>
                    <p>Performance overview by course</p>
                </div>
            </div>

            <div className="course-performance-table-wrapper">
                <table className="course-performance-table">

                    <thead>
                    <tr>
                        <th>Course</th>
                        <th>Students</th>
                        <th>Completion</th>
                        <th>Avg. Score</th>
                        <th>Engagement</th>
                    </tr>
                    </thead>

                    <tbody>
                    {coursePerformance.map((course) => (
                        <tr key={course.course}>

                            <td className="course-name">
                                {course.course}
                            </td>

                            <td>
                                {course.students}
                            </td>

                            <td>
                                <div className="completion-cell">
                                    <div className="completion-bar">
                                            <span
                                                style={{
                                                    width: `${course.completion}%`
                                                }}
                                            ></span>
                                    </div>

                                    <strong>
                                        {course.completion}%
                                    </strong>
                                </div>
                            </td>

                            <td>
                                {course.score}
                            </td>

                            <td>
                                    <span
                                        className={`engagement-badge ${course.engagement
                                            .toLowerCase()
                                            .replace(" ", "-")}`}
                                    >
                                        {course.engagement}
                                    </span>
                            </td>

                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}

export default CoursePerformance;