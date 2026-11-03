import { useEffect, useState } from "react";
import {
    SlidersHorizontal,
    Sun,
    Moon,
    Monitor,
    Check
} from "lucide-react";

import {
    defaultNotifications,
    themes
} from "../data/SettingsData.js";

import "./Preferences.css";

const STORAGE_KEY = "admin-settings-preferences";

function getStoredPreferences() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return {
                theme: "Light",
                notifications: defaultNotifications
            };
        }

        const parsed = JSON.parse(stored);

        return {
            theme: parsed.theme || "Light",
            notifications: {
                ...defaultNotifications,
                ...(parsed.notifications || {})
            }
        };
    } catch {
        return {
            theme: "Light",
            notifications: defaultNotifications
        };
    }
}

function Preferences() {
    const [settings, setSettings] = useState(
        getStoredPreferences
    );

    const [saved, setSaved] = useState(false);

    const themeIcons = {
        Light: Sun,
        Dark: Moon,
        Auto: Monitor
    };

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(settings)
        );

        setSaved(true);

        const timer = setTimeout(() => {
            setSaved(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, [settings]);

    const handleThemeChange = (theme) => {
        setSettings((previous) => ({
            ...previous,
            theme
        }));
    };

    const toggleNotification = (field) => {
        setSettings((previous) => ({
            ...previous,
            notifications: {
                ...previous.notifications,
                [field]:
                    !previous.notifications[field]
            }
        }));
    };

    return (
        <section className="settings-preferences-card">

            <div className="preferences-header">

                <div className="preferences-icon">
                    <SlidersHorizontal size={14} />
                </div>

                <div>
                    <h2>Preferences</h2>

                    <p>
                        Customize your platform experience
                    </p>
                </div>

            </div>

            <span className="preferences-label">
                THEME
            </span>

            <div className="preferences-theme-options">

                {themes.map((item) => {
                    const Icon = themeIcons[item];

                    const isActive =
                        settings.theme === item;

                    return (
                        <button
                            type="button"
                            key={item}
                            className={`preferences-theme-option ${
                                isActive ? "active" : ""
                            }`}
                            onClick={() =>
                                handleThemeChange(item)
                            }
                        >
                            <Icon size={13} />

                            <span>
                                {item}
                            </span>

                        </button>
                    );
                })}

            </div>

            <span className="preferences-label notifications">
                NOTIFICATIONS
            </span>

            <div className="preferences-notification-list">

                <NotificationToggle
                    label="System Maintenance"
                    checked={
                        settings.notifications
                            .systemMaintenance
                    }
                    onChange={() =>
                        toggleNotification(
                            "systemMaintenance"
                        )
                    }
                />

                <NotificationToggle
                    label="New User Alerts"
                    checked={
                        settings.notifications
                            .newUserAlerts
                    }
                    onChange={() =>
                        toggleNotification(
                            "newUserAlerts"
                        )
                    }
                />

                <NotificationToggle
                    label="Error Reports"
                    checked={
                        settings.notifications
                            .errorReports
                    }
                    onChange={() =>
                        toggleNotification(
                            "errorReports"
                        )
                    }
                />

            </div>

            <div
                className={`preferences-saved ${
                    saved ? "visible" : ""
                }`}
            >
                <Check size={10} />
                Saved
            </div>

        </section>
    );
}

function NotificationToggle({
                                label,
                                checked,
                                onChange
                            }) {
    return (
        <label className="preferences-notification-row">

            <span>{label}</span>

            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />

            <span
                className={`preferences-checkbox ${
                    checked ? "checked" : ""
                }`}
            >
                {checked && <Check size={9} />}
            </span>

        </label>
    );
}

export default Preferences;