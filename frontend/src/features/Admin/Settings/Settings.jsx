import { useState } from "react";
import {
    RotateCcw,
    CheckCircle2
} from "lucide-react";

import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";

import LanguageLocalization from "./LanguageLocalization/LanguageLocalization.jsx";
import ProfileManagement from "./ProfileManagement/ProfileManagement.jsx";
import Security from "./Security/Security.jsx";
import Preferences from "./Preferences/Preferences.jsx";

import "./Settings.css";

const STORAGE_KEYS = [
    "admin-settings-language",
    "admin-settings-preferences"
];

function Settings() {
    const [resetKey, setResetKey] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleResetDefaults = () => {
        STORAGE_KEYS.forEach((key) => {
            localStorage.removeItem(key);
        });

        setResetKey((previous) => previous + 1);

        setShowSuccess(false);
    };

    const handleUpdateAllSettings = () => {
        setShowSuccess(true);

        window.setTimeout(() => {
            setShowSuccess(false);
        }, 2500);
    };

    return (
        <BackofficeLayout>

            <div className="settings-page">

                <header className="settings-page-header">

                    <div>
                        <h1>System Settings</h1>

                        <p>
                            Manage your account, security, and
                            platform preferences
                        </p>
                    </div>

                </header>

                <div className="settings-layout">

                    <div className="settings-main-column">

                        <LanguageLocalization
                            key={`language-${resetKey}`}
                        />

                        <ProfileManagement
                            key={`profile-${resetKey}`}
                        />

                    </div>

                    <div className="settings-side-column">

                        <Security
                            key={`security-${resetKey}`}
                        />

                        <Preferences
                            key={`preferences-${resetKey}`}
                        />

                    </div>

                </div>

                <footer className="settings-footer">

                    <div className="settings-footer-left">

                        {showSuccess && (
                            <div className="settings-global-success">
                                <CheckCircle2 size={11} />
                                All settings updated successfully.
                            </div>
                        )}

                    </div>

                    <div className="settings-footer-actions">

                        <button
                            type="button"
                            className="settings-reset-btn"
                            onClick={handleResetDefaults}
                        >
                            <RotateCcw size={11} />
                            Reset Defaults
                        </button>

                        <button
                            type="button"
                            className="settings-update-btn"
                            onClick={handleUpdateAllSettings}
                        >
                            Update All Settings
                        </button>

                    </div>

                </footer>

            </div>

        </BackofficeLayout>
    );
}

export default Settings;