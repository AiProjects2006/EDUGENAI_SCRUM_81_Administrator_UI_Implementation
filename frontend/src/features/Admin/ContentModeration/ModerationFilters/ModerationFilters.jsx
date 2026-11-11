import {
    RotateCcw
} from "lucide-react";

import "./ModerationFilters.css";

function ModerationFilters({
                               filters,
                               onFilterChange,
                               onReset
                           }) {
    return (
        <div className="moderation-filters">

            <div className="moderation-filter-group">
                <label>CONTENT TYPE</label>

                <select
                    value={filters.contentType}
                    onChange={(e) =>
                        onFilterChange(
                            "contentType",
                            e.target.value
                        )
                    }
                >
                    <option value="">All Types</option>
                    <option value="AI Activity">
                        AI Activity
                    </option>
                    <option value="Uploaded Content">
                        Uploaded Content
                    </option>
                </select>
            </div>

            <div className="moderation-filter-group">
                <label>STATUS</label>

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
                    <option value="Pending">
                        Pending
                    </option>
                    <option value="Approved">
                        Approved
                    </option>
                    <option value="Rejected">
                        Rejected
                    </option>
                </select>
            </div>

            <div className="moderation-filter-group">
                <label>GRADE LEVEL</label>

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
                    <option value="Grade 4">
                        Grade 3
                    </option>
                    <option value="Grade 4">
                        Grade 4
                    </option>
                    <option value="Grade 5">
                        Grade 5
                    </option>
                    <option value="Grade 6">
                        Grade 6
                    </option>
                    <option value="Grade 7">
                        Grade 7
                    </option>
                    <option value="Grade 8">
                        Grade 8
                    </option>
                    <option value="Grade 9">
                        Grade 9
                    </option>
                </select>
            </div>

            <button
                type="button"
                className="moderation-reset-btn"
                onClick={onReset}
            >
                <RotateCcw size={14} />
                Reset Filters
            </button>

        </div>
    );
}

export default ModerationFilters;