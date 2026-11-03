import "./UserFilter.css";
import { Filter, X } from "lucide-react";

function UserFilters({ filters, onFilterChange, onClearFilters }) {
    return (
        <div className="user-filters">
            <div className="filters-header">
                <div className="filters-title">
                    <Filter size={18} />
                    <span>Filter Users</span>
                </div>

                <button
                    type="button"
                    className="clear-filter-btn"
                    onClick={onClearFilters}
                >
                    <X size={16} />
                    Clear Filters
                </button>
            </div>

            <div className="filters-row">
                <div className="filter-group">
                    <label>User Type</label>

                    <select
                        value={filters.role}
                        onChange={(e) =>
                            onFilterChange("role", e.target.value)
                        }
                    >
                        <option value="ALL">All</option>
                        <option value="STUDENT">Student</option>
                        <option value="CONTENT_CREATOR">
                            Content Creator
                        </option>
                        <option value="ADMIN">Administrator</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Status</label>

                    <select
                        value={filters.status}
                        onChange={(e) =>
                            onFilterChange("status", e.target.value)
                        }
                    >
                        <option value="ALL">All</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PENDING_VERIFICATION">
                            Pending Verification
                        </option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="SUSPENDED">Suspended</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default UserFilters;
