import { useRef, useState } from "react";
import {
    UserRound,
    Save,
    Camera,
    X,
    CheckCircle2
} from "lucide-react";

import { defaultProfile } from "../data/SettingsData.js";

import "./ProfileManagement.css";

function ProfileManagement() {
    const [profile, setProfile] = useState(defaultProfile);
    const [savedProfile, setSavedProfile] = useState(defaultProfile);

    const [avatar, setAvatar] = useState(null);
    const [emailError, setEmailError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef(null);

    const handleChange = (field, value) => {
        setProfile((previous) => ({
            ...previous,
            [field]: value
        }));

        setShowSuccess(false);

        if (field === "email") {
            setEmailError("");
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSave = () => {
        if (!profile.fullName.trim()) {
            return;
        }

        if (!validateEmail(profile.email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        setIsSaving(true);
        setShowSuccess(false);

        setTimeout(() => {
            setSavedProfile(profile);
            setIsSaving(false);
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        }, 500);
    };

    const handleCancel = () => {
        setProfile(savedProfile);
        setEmailError("");
        setShowSuccess(false);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setAvatar(imageUrl);
        setShowSuccess(false);
    };

    const hasChanges =
        profile.fullName !== savedProfile.fullName ||
        profile.email !== savedProfile.email;

    return (
        <section className="profile-management-card">

            <div className="profile-management-header">

                <div className="profile-management-icon">
                    <UserRound size={14} />
                </div>

                <div>
                    <h2>Profile Management</h2>

                    <p>
                        Update your personal information and roles
                    </p>
                </div>

            </div>

            <div className="profile-management-content">

                <div className="profile-avatar-area">

                    <div className="profile-avatar">

                        {avatar ? (
                            <img
                                src={avatar}
                                alt="Profile"
                            />
                        ) : (
                            <UserRound size={38} />
                        )}

                    </div>

                    <button
                        type="button"
                        className="profile-avatar-edit"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        aria-label="Change profile picture"
                    >
                        <Camera size={10} />
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="profile-avatar-input"
                        onChange={handleAvatarChange}
                    />

                </div>

                <div className="profile-fields">

                    <div className="profile-field-row">

                        <div className="profile-field">

                            <label>FULL NAME</label>

                            <input
                                type="text"
                                value={profile.fullName}
                                onChange={(event) =>
                                    handleChange(
                                        "fullName",
                                        event.target.value
                                    )
                                }
                                placeholder="Enter full name"
                            />

                        </div>

                        <div className="profile-field">

                            <label>ADMIN ID</label>

                            <input
                                type="text"
                                value={profile.adminId}
                                readOnly
                            />

                        </div>

                    </div>

                    <div className="profile-field email-field">

                        <label>EMAIL ADDRESS</label>

                        <input
                            type="email"
                            value={profile.email}
                            onChange={(event) =>
                                handleChange(
                                    "email",
                                    event.target.value
                                )
                            }
                            className={
                                emailError
                                    ? "has-error"
                                    : ""
                            }
                        />

                        {emailError ? (
                            <small className="profile-error">
                                {emailError}
                            </small>
                        ) : (
                            <small>
                                Verify your email to receive
                                security alerts
                            </small>
                        )}

                    </div>

                </div>

            </div>

            <div className="profile-management-bottom">

                {showSuccess && (
                    <div className="profile-success">
                        <CheckCircle2 size={12} />
                        Profile changes saved successfully.
                    </div>
                )}

                <div className="profile-management-actions">

                    {hasChanges && (
                        <button
                            type="button"
                            className="profile-cancel-button"
                            onClick={handleCancel}
                        >
                            <X size={11} />
                            Cancel
                        </button>
                    )}

                    <button
                        type="button"
                        className="profile-save-button"
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                    >
                        <Save size={11} />

                        {isSaving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </div>

        </section>
    );
}

export default ProfileManagement;