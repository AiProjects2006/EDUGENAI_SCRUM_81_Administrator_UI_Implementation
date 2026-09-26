import { useState } from "react";
import {
    Shield,
    LockKeyhole,
    ChevronRight,
    Smartphone,
    Monitor,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    X
} from "lucide-react";

import { recentLogins } from "../data/SettingsData.js";

import "./Security.css";

function Security() {
    const [twoFactorEnabled, setTwoFactorEnabled] =
        useState(true);

    const [showPasswordModal, setShowPasswordModal] =
        useState(false);

    const [showSignoutModal, setShowSignoutModal] =
        useState(false);

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [passwords, setPasswords] = useState({
        current: "",
        newPassword: "",
        confirm: ""
    });

    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] =
        useState(false);

    const [signoutSuccess, setSignoutSuccess] =
        useState(false);

    const handlePasswordChange = (field, value) => {
        setPasswords((previous) => ({
            ...previous,
            [field]: value
        }));

        setPasswordError("");
        setPasswordSuccess(false);
    };

    const validatePassword = () => {
        if (!passwords.current) {
            return "Enter your current password.";
        }

        if (!passwords.newPassword) {
            return "Enter a new password.";
        }

        if (passwords.newPassword.length < 8) {
            return "New password must contain at least 8 characters.";
        }

        if (passwords.newPassword === passwords.current) {
            return "New password must be different from your current password.";
        }

        if (passwords.newPassword !== passwords.confirm) {
            return "Passwords do not match.";
        }

        return "";
    };

    const handlePasswordSubmit = () => {
        const error = validatePassword();

        if (error) {
            setPasswordError(error);
            return;
        }

        setPasswordSuccess(true);

        setTimeout(() => {
            setShowPasswordModal(false);
            setPasswordSuccess(false);

            setPasswords({
                current: "",
                newPassword: "",
                confirm: ""
            });
        }, 1200);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswordError("");
        setPasswordSuccess(false);

        setPasswords({
            current: "",
            newPassword: "",
            confirm: ""
        });
    };

    const handleSignoutAll = () => {
        setSignoutSuccess(true);

        setTimeout(() => {
            setShowSignoutModal(false);
            setSignoutSuccess(false);
        }, 1200);
    };

    return (
        <>
            <section className="settings-security-card">

                <div className="security-header">

                    <div className="security-icon">
                        <Shield size={14} />
                    </div>

                    <div>
                        <h2>Security</h2>
                    </div>

                </div>

                <button
                    type="button"
                    className="security-password-button"
                    onClick={() =>
                        setShowPasswordModal(true)
                    }
                >
                    <span>
                        <LockKeyhole size={12} />
                        Change Password
                    </span>

                    <ChevronRight size={12} />
                </button>

                <div className="security-two-factor">

                    <div className="security-device-icon">
                        <Smartphone size={11} />
                    </div>

                    <div className="security-two-factor-info">
                        <strong>Two-Factor (2FA)</strong>
                        <span>SMS or Authenticator</span>
                    </div>

                    <button
                        type="button"
                        className={`security-toggle ${
                            twoFactorEnabled ? "active" : ""
                        }`}
                        onClick={() =>
                            setTwoFactorEnabled(
                                (value) => !value
                            )
                        }
                        aria-pressed={twoFactorEnabled}
                    >
                        <span />
                    </button>

                </div>

                <div className="security-recent-login">

                    <span className="security-recent-title">
                        RECENT LOGIN ACTIVITY
                    </span>

                    {recentLogins.map((login) => (
                        <div
                            className="security-login-item"
                            key={login.id}
                        >
                            {login.type === "desktop" ? (
                                <Monitor size={11} />
                            ) : (
                                <Smartphone size={11} />
                            )}

                            <div>
                                <strong>
                                    {login.device}
                                </strong>

                                <span>
                                    {login.time}
                                </span>
                            </div>
                        </div>
                    ))}

                </div>

                <button
                    type="button"
                    className="security-signout"
                    onClick={() =>
                        setShowSignoutModal(true)
                    }
                >
                    Sign out from all devices
                </button>

            </section>

            {showPasswordModal && (
                <div className="security-modal-overlay">

                    <div className="security-modal">

                        <div className="security-modal-header">

                            <div>
                                <h3>Change Password</h3>
                                <p>
                                    Update your account password
                                </p>
                            </div>

                            <button
                                type="button"
                                className="security-modal-close"
                                onClick={closePasswordModal}
                            >
                                <X size={15} />
                            </button>

                        </div>

                        <div className="security-modal-body">

                            {passwordSuccess ? (
                                <div className="security-success-state">
                                    <CheckCircle2 size={28} />

                                    <strong>
                                        Password updated successfully
                                    </strong>

                                    <span>
                                        Your new password is now active.
                                    </span>
                                </div>
                            ) : (
                                <>
                                    {passwordError && (
                                        <div className="security-error">
                                            <AlertCircle size={13} />
                                            <span>
                                                {passwordError}
                                            </span>
                                        </div>
                                    )}

                                    <div className="security-password-field">

                                        <label>
                                            CURRENT PASSWORD
                                        </label>

                                        <div>
                                            <input
                                                type={
                                                    showCurrentPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    passwords.current
                                                }
                                                onChange={(event) =>
                                                    handlePasswordChange(
                                                        "current",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        (value) =>
                                                            !value
                                                    )
                                                }
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff size={14} />
                                                ) : (
                                                    <Eye size={14} />
                                                )}
                                            </button>

                                        </div>

                                    </div>

                                    <div className="security-password-field">

                                        <label>
                                            NEW PASSWORD
                                        </label>

                                        <div>
                                            <input
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    passwords.newPassword
                                                }
                                                onChange={(event) =>
                                                    handlePasswordChange(
                                                        "newPassword",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        (value) =>
                                                            !value
                                                    )
                                                }
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff size={14} />
                                                ) : (
                                                    <Eye size={14} />
                                                )}
                                            </button>

                                        </div>

                                        <small>
                                            Minimum 8 characters
                                        </small>

                                    </div>

                                    <div className="security-password-field">

                                        <label>
                                            CONFIRM NEW PASSWORD
                                        </label>

                                        <div>
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    passwords.confirm
                                                }
                                                onChange={(event) =>
                                                    handlePasswordChange(
                                                        "confirm",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (value) =>
                                                            !value
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={14} />
                                                ) : (
                                                    <Eye size={14} />
                                                )}
                                            </button>

                                        </div>

                                    </div>
                                </>
                            )}

                        </div>

                        {!passwordSuccess && (
                            <div className="security-modal-footer">

                                <button
                                    type="button"
                                    className="security-modal-cancel"
                                    onClick={closePasswordModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="security-modal-submit"
                                    onClick={handlePasswordSubmit}
                                >
                                    Update Password
                                </button>

                            </div>
                        )}

                    </div>

                </div>
            )}

            {showSignoutModal && (
                <div className="security-modal-overlay">

                    <div className="security-confirm-modal">

                        {signoutSuccess ? (
                            <div className="security-success-state">
                                <CheckCircle2 size={28} />

                                <strong>
                                    Signed out successfully
                                </strong>

                                <span>
                                    All other active sessions have
                                    been signed out.
                                </span>
                            </div>
                        ) : (
                            <>
                                <div className="security-confirm-icon">
                                    <Shield size={18} />
                                </div>

                                <h3>
                                    Sign out from all devices?
                                </h3>

                                <p>
                                    This will end all active sessions
                                    except your current session.
                                </p>

                                <div className="security-modal-footer">

                                    <button
                                        type="button"
                                        className="security-modal-cancel"
                                        onClick={() =>
                                            setShowSignoutModal(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="security-danger-button"
                                        onClick={
                                            handleSignoutAll
                                        }
                                    >
                                        Sign Out All
                                    </button>

                                </div>
                            </>
                        )}

                    </div>

                </div>
            )}
        </>
    );
}

export default Security;