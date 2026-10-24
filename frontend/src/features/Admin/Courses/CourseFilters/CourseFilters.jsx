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
                <option value="Published">Published</option>
                <option value="Pending">Pending</option>
                <option value="Draft">Draft</option>
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
                <option value="Mathematics">Mathematics</option>
                <option value="Environmental Studies">Environmental Studies</option>
                <option value="ICT">ICT</option>
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
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
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