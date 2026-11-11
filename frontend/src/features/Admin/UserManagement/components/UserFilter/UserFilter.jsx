import "./UserFilter.css";

import { Filter, X } from "lucide-react";


function UserFilters() {

    return (

        <div className="user-filters">

            <div className="filters-header">

                <div className="filters-title">

                    <Filter size={18} />

                    <span>Filter Users</span>

                </div>

                <button className="clear-filter-btn">

                    <X size={16} />

                    Clear Filters

                </button>

            </div>

            <div className="filters-row">

                <div className="filter-group">

                    <label>User Type</label>

                    <select>
                        <option>All</option>
                        <option>Student</option>
                        <option>Content Creator</option>
                        <option>Administrator</option>
                    </select>
                </div>

                <div className="filter-group">

                    <label>Status</label>

                    <select>
                        <option>Status</option>
                        <option>All</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Suspended</option>
                    </select>

                </div>

                <div className="filter-group">

                    <label>Grade</label>

                    <select>
                        <option>Grade</option>
                        <option>All</option>
                        <option>Grade 3</option>
                        <option>Grade 4</option>
                        <option>Grade 5</option>
                        <option>Grade 6</option>
                        <option>Grade 7</option>
                        <option>Grade 8</option>
                        <option>Grade 9</option>
                    </select>
                </div>

            </div>

        </div>

    );

}


export default UserFilters;