import React, { useState, useEffect } from "react";
import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";
import {
    BookOpen,
    Users,
    CheckCircle2,
    Clock,
    AlertTriangle,
    UserPlus,
    Search,
    Eye,
    Check,
    Ban,
    X,
    Award,
    Briefcase,
    Globe,
    RefreshCw,
    ExternalLink,
    ShieldCheck
} from "lucide-react";
import {
    getCreators,
    updateCreatorStatus,
    addCreatorDirectly
} from "../../../services/creatorManagementService";
import "./CreatorManagement.css";

export default function CreatorManagement() {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [notification, setNotification] = useState(null);

    // Modals
    const [selectedCreator, setSelectedCreator] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // New Creator Form State
    const [newCreatorData, setNewCreatorData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contactNumber: "",
        password: "Creator@123",
        qualifications: "",
        experienceYears: "3",
        preferredSubjects: "",
        skills: "",
        portfolioUrl: "",
        bio: ""
    });

    const loadCreators = async () => {
        setLoading(true);
        try {
            const data = await getCreators();
            setCreators(data);
        } catch (err) {
            console.error("Error loading creators:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCreators();
    }, []);

    const showToast = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Calculate metrics
    const totalCount = creators.length;
    const pendingCount = creators.filter(c => c.accountStatus === "PENDING_VERIFICATION").length;
    const activeCount = creators.filter(c => c.accountStatus === "ACTIVE").length;
    const suspendedCount = creators.filter(c => c.accountStatus === "SUSPENDED").length;

    // Filter creators
    const filteredCreators = creators.filter(creator => {
        // Status filter
        if (statusFilter !== "ALL" && creator.accountStatus !== statusFilter) {
            return false;
        }
        // Search term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            const fullName = `${creator.firstName || ""} ${creator.lastName || ""}`.toLowerCase();
            const email = (creator.email || "").toLowerCase();
            const username = (creator.username || "").toLowerCase();
            const quals = (creator.qualifications || "").toLowerCase();
            const subjects = (creator.preferredSubjects || "").toLowerCase();
            const skills = (creator.skills || "").toLowerCase();

            return (
                fullName.includes(term) ||
                email.includes(term) ||
                username.includes(term) ||
                quals.includes(term) ||
                subjects.includes(term) ||
                skills.includes(term)
            );
        }
        return true;
    });

    const handleApprove = async (creator) => {
        try {
            await updateCreatorStatus(creator.id, "ACTIVE");
            setCreators(prev =>
                prev.map(c => c.id === creator.id ? { ...c, accountStatus: "ACTIVE" } : c)
            );
            if (selectedCreator && selectedCreator.id === creator.id) {
                setSelectedCreator(prev => ({ ...prev, accountStatus: "ACTIVE" }));
            }
            showToast(`Content Creator ${creator.firstName} ${creator.lastName} successfully approved & enabled!`);
        } catch (err) {
            showToast("Failed to approve creator: " + err.message, "error");
        }
    };

    const handleSuspend = async (creator) => {
        try {
            await updateCreatorStatus(creator.id, "SUSPENDED");
            setCreators(prev =>
                prev.map(c => c.id === creator.id ? { ...c, accountStatus: "SUSPENDED" } : c)
            );
            if (selectedCreator && selectedCreator.id === creator.id) {
                setSelectedCreator(prev => ({ ...prev, accountStatus: "SUSPENDED" }));
            }
            showToast(`Creator ${creator.firstName} ${creator.lastName} access suspended.`, "error");
        } catch (err) {
            showToast("Failed to update status: " + err.message, "error");
        }
    };

    const handleCreateCreatorSubmit = async (e) => {
        e.preventDefault();
        if (!newCreatorData.firstName || !newCreatorData.lastName || !newCreatorData.email) {
            showToast("Please provide name and email for the creator.", "error");
            return;
        }

        try {
            const created = await addCreatorDirectly(newCreatorData);
            setCreators(prev => [created, ...prev]);
            setShowAddModal(false);
            setNewCreatorData({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                contactNumber: "",
                password: "Creator@123",
                qualifications: "",
                experienceYears: "3",
                preferredSubjects: "",
                skills: "",
                portfolioUrl: "",
                bio: ""
            });
            showToast(`New Content Creator ${created.firstName} ${created.lastName} provisioned successfully!`);
        } catch (err) {
            showToast("Failed to add creator: " + err.message, "error");
        }
    };

    const getInitials = (first = "", last = "") => {
        const f = first ? first[0] : "C";
        const l = last ? last[0] : "";
        return `${f}${l}`.toUpperCase();
    };

    return (
        <BackofficeLayout>
            <div className="creator-mgmt-page">
                {/* Header */}
                <div className="creator-mgmt-header">
                    <div>
                        <h1>Content Creator Management</h1>
                        <p>
                            Verify educator qualifications, manage creator access, review applications, and invite verified course designers.
                        </p>
                    </div>

                    <div className="header-actions">
                        <button
                            className="btn-refresh-creators"
                            onClick={loadCreators}
                            disabled={loading}
                            title="Refresh creator records"
                        >
                            <RefreshCw size={15} className={loading ? "spin" : ""} />
                            Refresh
                        </button>

                        <button
                            className="btn-add-creator"
                            onClick={() => setShowAddModal(true)}
                        >
                            <UserPlus size={18} />
                            <span>Add Content Creator</span>
                        </button>
                    </div>
                </div>

                {/* Toast Alert */}
                {notification && (
                    <div className={`alert-toast ${notification.type}`}>
                        {notification.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                        <span>{notification.message}</span>
                    </div>
                )}

                {/* Stat Cards */}
                <div className="creator-stats-grid">
                    <div className="creator-stat-card">
                        <div className="stat-info">
                            <p>Total Creators</p>
                            <h2>{totalCount}</h2>
                        </div>
                        <div className="stat-icon-wrapper purple">
                            <BookOpen size={22} />
                        </div>
                    </div>

                    <div className={`creator-stat-card ${pendingCount > 0 ? "alert-card" : ""}`}>
                        <div className="stat-info">
                            <p>Pending Review</p>
                            <h2>{pendingCount}</h2>
                        </div>
                        <div className="stat-icon-wrapper amber">
                            <Clock size={22} />
                        </div>
                    </div>

                    <div className="creator-stat-card">
                        <div className="stat-info">
                            <p>Active Educators</p>
                            <h2>{activeCount}</h2>
                        </div>
                        <div className="stat-icon-wrapper green">
                            <CheckCircle2 size={22} />
                        </div>
                    </div>

                    <div className="creator-stat-card">
                        <div className="stat-info">
                            <p>Suspended</p>
                            <h2>{suspendedCount}</h2>
                        </div>
                        <div className="stat-icon-wrapper slate">
                            <Ban size={22} />
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="creator-filter-card">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${statusFilter === "ALL" ? "active" : ""}`}
                            onClick={() => setStatusFilter("ALL")}
                        >
                            All Creators
                            <span className="tab-badge count">{totalCount}</span>
                        </button>

                        <button
                            className={`filter-tab ${statusFilter === "PENDING_VERIFICATION" ? "active" : ""}`}
                            onClick={() => setStatusFilter("PENDING_VERIFICATION")}
                        >
                            Pending Review
                            {pendingCount > 0 && <span className="tab-badge amber">{pendingCount}</span>}
                        </button>

                        <button
                            className={`filter-tab ${statusFilter === "ACTIVE" ? "active" : ""}`}
                            onClick={() => setStatusFilter("ACTIVE")}
                        >
                            Active Educators
                        </button>

                        <button
                            className={`filter-tab ${statusFilter === "SUSPENDED" ? "active" : ""}`}
                            onClick={() => setStatusFilter("SUSPENDED")}
                        >
                            Suspended
                        </button>
                    </div>

                    <div className="filter-search-box">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, skills, subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Card */}
                <div className="creator-table-card">
                    <table className="creator-table">
                        <thead>
                            <tr>
                                <th>Creator</th>
                                <th>Contact</th>
                                <th>Qualifications & Experience</th>
                                <th>Subjects & Expertise</th>
                                <th>Status</th>
                                <th>Applied / Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCreators.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#8b7fa8" }}>
                                        No content creators found matching current filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredCreators.map((creator) => {
                                    const isPending = creator.accountStatus === "PENDING_VERIFICATION";
                                    const isActive = creator.accountStatus === "ACTIVE";
                                    const isSuspended = creator.accountStatus === "SUSPENDED";

                                    const subjectsList = creator.preferredSubjects
                                        ? creator.preferredSubjects.split(",").map(s => s.trim()).filter(Boolean)
                                        : [];

                                    return (
                                        <tr key={creator.id}>
                                            <td>
                                                <div className="creator-primary-cell">
                                                    <div className="creator-avatar-badge">
                                                        {getInitials(creator.firstName, creator.lastName)}
                                                    </div>
                                                    <div className="creator-name-group">
                                                        <h4>{creator.firstName} {creator.lastName}</h4>
                                                        <span>@{creator.username || creator.email.split("@")[0]}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="creator-contact-cell">
                                                    <p>{creator.email}</p>
                                                    <span>{creator.contactNumber || "No phone"}</span>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="qualifications-cell">
                                                    <p className="qual-text" title={creator.qualifications || "Not specified"}>
                                                        {creator.qualifications || "Educator Credential"}
                                                    </p>
                                                    <span className="exp-badge">
                                                        {creator.experienceYears ? `${creator.experienceYears} Years Exp` : "Verified"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="subjects-cell">
                                                    {subjectsList.length > 0 ? (
                                                        subjectsList.slice(0, 2).map((s, idx) => (
                                                            <span key={idx} className="subject-tag">{s}</span>
                                                        ))
                                                    ) : (
                                                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>General STEM</span>
                                                    )}
                                                    {subjectsList.length > 2 && (
                                                        <span className="subject-tag">+{subjectsList.length - 2}</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                {isPending && (
                                                    <span className="status-pill pending">
                                                        <Clock size={12} /> Pending Review
                                                    </span>
                                                )}
                                                {isActive && (
                                                    <span className="status-pill active">
                                                        <CheckCircle2 size={12} /> Active
                                                    </span>
                                                )}
                                                {isSuspended && (
                                                    <span className="status-pill suspended">
                                                        <Ban size={12} /> Suspended
                                                    </span>
                                                )}
                                            </td>

                                            <td style={{ fontSize: "13px", color: "#6b7280" }}>
                                                {creator.createdAt
                                                    ? new Date(creator.createdAt).toLocaleDateString()
                                                    : "Recent"}
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="btn-action-icon view"
                                                        title="Review Application Details"
                                                        onClick={() => setSelectedCreator(creator)}
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    {isPending && (
                                                        <button
                                                            className="btn-action-icon approve"
                                                            title="Approve Creator Application"
                                                            onClick={() => handleApprove(creator)}
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}

                                                    {isActive && (
                                                        <button
                                                            className="btn-action-icon suspend"
                                                            title="Suspend Creator Account"
                                                            onClick={() => handleSuspend(creator)}
                                                        >
                                                            <Ban size={16} />
                                                        </button>
                                                    )}

                                                    {isSuspended && (
                                                        <button
                                                            className="btn-action-icon approve"
                                                            title="Reactivate Creator"
                                                            onClick={() => handleApprove(creator)}
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MODAL 1: Review Creator Details */}
                {selectedCreator && (
                    <div className="modal-overlay" onClick={() => setSelectedCreator(null)}>
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <div>
                                    <h2>Educator Application Profile</h2>
                                    <p>Applicant: {selectedCreator.firstName} {selectedCreator.lastName} (@{selectedCreator.username})</p>
                                </div>
                                <button className="btn-close-modal" onClick={() => setSelectedCreator(null)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="review-grid">
                                <div className="review-card">
                                    <h5><Award size={14} /> Highest Qualification</h5>
                                    <p>{selectedCreator.qualifications || "Not specified"}</p>
                                </div>

                                <div className="review-card">
                                    <h5><Briefcase size={14} /> Teaching Experience</h5>
                                    <p>{selectedCreator.experienceYears ? `${selectedCreator.experienceYears} Years` : "Not provided"}</p>
                                </div>

                                <div className="review-card">
                                    <h5><BookOpen size={14} /> Preferred Subjects</h5>
                                    <p>{selectedCreator.preferredSubjects || "General Curriculum"}</p>
                                </div>

                                <div className="review-card">
                                    <h5><ShieldCheck size={14} /> Account Status</h5>
                                    <p>
                                        <span className={`status-pill ${selectedCreator.accountStatus === 'ACTIVE' ? 'active' : selectedCreator.accountStatus === 'PENDING_VERIFICATION' ? 'pending' : 'suspended'}`}>
                                            {selectedCreator.accountStatus}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {selectedCreator.skills && (
                                <div style={{ marginBottom: "20px" }}>
                                    <h5 style={{ margin: "0 0 8px 0", fontSize: "12px", textTransform: "uppercase", color: "#8b7fa8" }}>
                                        Key Skills & Specializations
                                    </h5>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                        {selectedCreator.skills.split(",").map((sk, i) => (
                                            <span key={i} className="subject-tag" style={{ background: "#f3eeff", padding: "4px 10px", fontSize: "12px" }}>
                                                {sk.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedCreator.portfolioUrl && (
                                <div style={{ marginBottom: "20px" }}>
                                    <h5 style={{ margin: "0 0 8px 0", fontSize: "12px", textTransform: "uppercase", color: "#8b7fa8" }}>
                                        Portfolio & Sample Lessons
                                    </h5>
                                    <a
                                        href={selectedCreator.portfolioUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="portfolio-link-chip"
                                    >
                                        <Globe size={14} />
                                        {selectedCreator.portfolioUrl}
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            )}

                            {selectedCreator.bio && (
                                <div>
                                    <h5 style={{ margin: "0 0 8px 0", fontSize: "12px", textTransform: "uppercase", color: "#8b7fa8" }}>
                                        Statement of Purpose / Educator Bio
                                    </h5>
                                    <div className="bio-quote-box">
                                        "{selectedCreator.bio}"
                                    </div>
                                </div>
                            )}

                            <div className="modal-footer">
                                <button className="btn-modal-cancel" onClick={() => setSelectedCreator(null)}>
                                    Close
                                </button>

                                {selectedCreator.accountStatus === "PENDING_VERIFICATION" && (
                                    <>
                                        <button
                                            className="btn-modal-suspend"
                                            onClick={() => {
                                                handleSuspend(selectedCreator);
                                                setSelectedCreator(null);
                                            }}
                                        >
                                            <Ban size={16} /> Reject Application
                                        </button>
                                        <button
                                            className="btn-modal-approve"
                                            onClick={() => {
                                                handleApprove(selectedCreator);
                                                setSelectedCreator(null);
                                            }}
                                        >
                                            <Check size={16} /> Approve & Enable Creator
                                        </button>
                                    </>
                                )}

                                {selectedCreator.accountStatus === "ACTIVE" && (
                                    <button
                                        className="btn-modal-suspend"
                                        onClick={() => {
                                            handleSuspend(selectedCreator);
                                            setSelectedCreator(null);
                                        }}
                                    >
                                        <Ban size={16} /> Suspend Creator
                                    </button>
                                )}

                                {selectedCreator.accountStatus === "SUSPENDED" && (
                                    <button
                                        className="btn-modal-approve"
                                        onClick={() => {
                                            handleApprove(selectedCreator);
                                            setSelectedCreator(null);
                                        }}
                                    >
                                        <Check size={16} /> Reactivate Creator
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 2: Add Content Creator Directly by Admin */}
                {showAddModal && (
                    <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <div>
                                    <h2>Add New Content Creator</h2>
                                    <p>Directly provision an active creator account with verified credentials.</p>
                                </div>
                                <button className="btn-close-modal" onClick={() => setShowAddModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateCreatorSubmit}>
                                <div className="creator-form-grid">
                                    <div className="form-group">
                                        <label>First Name *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. David"
                                            value={newCreatorData.firstName}
                                            onChange={(e) => setNewCreatorData({ ...newCreatorData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Last Name *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Sterling"
                                            value={newCreatorData.lastName}
                                            onChange={(e) => setNewCreatorData({ ...newCreatorData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="creator-form-grid">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            placeholder="david_sterling"
                                            value={newCreatorData.username}
                                            onChange={(e) => setNewCreatorData({ ...newCreatorData, username: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <input
                                            type="email"
                                            placeholder="david.sterling@edugenai.com"
                                            value={newCreatorData.email}
                                            onChange={(e) => setNewCreatorData({ ...newCreatorData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="creator-form-grid">
                                    <div className="form-group">
                                        <label>Contact Phone</label>
                                        <input
                                            type="tel"
                                            placeholder="0779988776"
                                            value={newCreatorData.contactNumber}
                                            onChange={(e) => setNewCreatorData({ ...newCreatorData, contactNumber: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Initial Password</label>
                                        <input
                                            type="text"
                                            placeholder="Creator@123"
                                            value={newCreatorData.password}
                                            onChange={(e) => setNewCreatorData({ ...newCreatorData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="creator-form-grid">
                                    <div className="form-group">
                                        <label>Qualifications / Degree</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. MSc in Computer Science"
                                            value={newCreatorData.qualifications}
                                            onChange={(e) => setNewCreatorData({ ...newCreatorData, qualifications: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Experience (Years)</label>
                                        <select
                                            value={newCreatorData.experienceYears}
                                            onChange={(e) => setNewCreatorData({ ...newCreatorData, experienceYears: e.target.value })}
                                        >
                                            <option value="1">1 Year</option>
                                            <option value="2">2 Years</option>
                                            <option value="3">3 Years</option>
                                            <option value="5">5 Years</option>
                                            <option value="8">8+ Years</option>
                                            <option value="10">10+ Years</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Preferred Subject Areas</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mathematics, Artificial Intelligence, Robotics"
                                        value={newCreatorData.preferredSubjects}
                                        onChange={(e) => setNewCreatorData({ ...newCreatorData, preferredSubjects: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Key Skills</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. STEM Pedagogy, Video Lessons, Interactive Labs"
                                        value={newCreatorData.skills}
                                        onChange={(e) => setNewCreatorData({ ...newCreatorData, skills: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Portfolio / LinkedIn URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/educator"
                                        value={newCreatorData.portfolioUrl}
                                        onChange={(e) => setNewCreatorData({ ...newCreatorData, portfolioUrl: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Educator Bio / Background</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Brief background and specialties..."
                                        value={newCreatorData.bio}
                                        onChange={(e) => setNewCreatorData({ ...newCreatorData, bio: e.target.value })}
                                    />
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn-modal-cancel"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-add-creator"
                                    >
                                        <UserPlus size={16} /> Provision Content Creator
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </BackofficeLayout>
    );
}

