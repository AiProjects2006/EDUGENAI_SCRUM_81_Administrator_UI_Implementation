import { NavLink } from "react-router-dom";
import profile from "../../../assets/profile.jpg";
import {
    GraduationCap,
    LayoutDashboard,
    Users,
    BookOpen,
    PenSquare,
    ClipboardList,
    BarChart3,
    Settings,
    LogOut,
    ShieldCheck

} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {

    return (

        <aside className="sidebar">
            <div className="sidebar-top">

                <div className="logo">

                    <div className="logo-icon">
                        <GraduationCap size={26} />
                    </div>

                    <div className="logo-text">
                        <h2>EduGen AI</h2>
                        <p>ADMIN PORTAL</p>
                    </div>

                </div>

                <ul>

                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/users"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <Users size={20} />
                            <span>User Management</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/courses"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <BookOpen size={20} />
                            <span>Course Administration</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/content-moderation"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <ShieldCheck size={20} />
                            <span>Content Moderation</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/platform-analytics"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <BarChart3 size={20} />
                            <span>Platform Analytics</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/progress"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <BarChart3 size={20} />
                            <span>Progress Tracking</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <Settings size={20} />
                            <span>Settings</span>
                        </NavLink>
                    </li>

                </ul>
            </div>

            <div className="sidebar-bottom">
                <div className="sidebar-footer">

                    <div className="profile">

                        <img
                            src={profile}
                            alt="Profile"
                            className="profile-image"
                        />

                        <div>

                            <h4>H.W Randi</h4>

                            <p>Administrator</p>

                        </div>

                    </div>

                    <button className="logout-btn">

                        <LogOut size={18} />

                        Logout

                    </button>

                </div>
            </div>

        </aside>

    );

}

export default Sidebar;