import {Search, RotateCcw } from "lucide-react";

import "./CourseFilters.css";

function CourseFilters({
                           filters,
                           onFilterChange,
                           onReset
                       }) {
    return (
        <div className="course-filters">

            <div className="search-box">
                <Search size={18} />

                <input
                    type="text"
                    placeholder="Search courses..."
                    value={filters.search}
                    onChange={(e) =>
                        onFilterChange(
                            "search",
                            e.target.value
                        )
                    }
                />
            </div>

            <select
                value={filters.status}
                onChange={(e) =>
                    onFilterChange(
                        "status",
                        e.target.value
                    )
                }
            >
                <option value="">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Archived">Archived</option>
            </select>

            <select
                value={filters.subject}
                onChange={(e) =>
                    onFilterChange(
                        "subject",
                        e.target.value
                    )
                }
            >
                <option value="">All Subjects</option>
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Technology">ICT</option>
            </select>

            <select
                value={filters.grade}
                onChange={(e) =>
                    onFilterChange(
                        "grade",
                        e.target.value
                    )
                }
            >
                <option value="">All Grades</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
            </select>

            <button
                className="reset-filter-btn"
                type="button"
                onClick={onReset}
            >
                <RotateCcw size={16} />
                Reset
            </button>

        </div>
    );
}

export default CourseFilters;