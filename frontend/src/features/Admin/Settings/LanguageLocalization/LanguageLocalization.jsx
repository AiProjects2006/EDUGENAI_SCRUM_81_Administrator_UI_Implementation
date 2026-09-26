import { useEffect, useState } from "react";
import {
    Languages,
    Check,
    ChevronRight,
    X,
    Globe2
} from "lucide-react";

import { languages } from "../data/SettingsData.js";

import "./LanguageLocalization.css";

const STORAGE_KEY = "admin-settings-language";

const additionalLanguages = [
    "German",
    "Italian",
    "Portuguese",
    "Japanese",
    "Korean",
    "Chinese",
    "Hindi",
    "Sinhala"
];

const regions = [
    "United States",
    "United Kingdom",
    "Sri Lanka",
    "India",
    "Canada",
    "Australia"
];

function getStoredSettings() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return {
                language: "English",
                region: "United States",
                autoTranslate: false
            };
        }

        const parsed = JSON.parse(stored);

        return {
            language: parsed.language || "English",
            region: parsed.region || "United States",
            autoTranslate:
                parsed.autoTranslate ?? false
        };
    } catch {
        return {
            language: "English",
            region: "United States",
            autoTranslate: false
        };
    }
}

function LanguageLocalization() {
    const [settings, setSettings] = useState(
        getStoredSettings
    );

    const [showLanguages, setShowLanguages] =
        useState(false);

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(settings)
        );
    }, [settings]);

    const handleLanguageChange = (language) => {
        setSettings((previous) => ({
            ...previous,
            language
        }));

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 1200);
    };

    const handleRegionChange = (event) => {
        setSettings((previous) => ({
            ...previous,
            region: event.target.value
        }));

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 1200);
    };

    const handleAutoTranslate = () => {
        setSettings((previous) => ({
            ...previous,
            autoTranslate: !previous.autoTranslate
        }));

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 1200);
    };

    const handleAdditionalLanguage = (language) => {
        handleLanguageChange(language);
        setShowLanguages(false);
    };

    return (
        <section className="language-localization-card">

            <div className="language-localization-header">

                <div className="language-localization-icon">
                    <Languages size={14} />
                </div>

                <div>
                    <h2>
                        Language &amp; Localization
                    </h2>

                    <p>
                        Change the interface language and
                        region settings
                    </p>
                </div>

                <span className="language-current-badge">
                    Current: {settings.language} -{" "}
                    {settings.region === "United States"
                        ? "US"
                        : settings.region}
                </span>

            </div>

            <div className="language-localization-content">

                <div className="language-selector">

                    <span className="language-field-label">
                        SELECT LANGUAGE
                    </span>

                    <div className="language-options">

                        {languages.map((item) => (
                            <button
                                type="button"
                                key={item}
                                className={`language-option ${
                                    settings.language === item
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleLanguageChange(item)
                                }
                            >
                                {settings.language === item && (
                                    <Check size={11} />
                                )}

                                {item}
                            </button>
                        ))}

                    </div>

                    <button
                        type="button"
                        className="more-language-button"
                        onClick={() =>
                            setShowLanguages(true)
                        }
                    >
                        <span>
                            More Languages...
                        </span>

                        <ChevronRight size={12} />
                    </button>

                    <div className="language-region-field">

                        <label htmlFor="settings-region">
                            REGION
                        </label>

                        <select
                            id="settings-region"
                            value={settings.region}
                            onChange={handleRegionChange}
                        >
                            {regions.map((region) => (
                                <option
                                    key={region}
                                    value={region}
                                >
                                    {region}
                                </option>
                            ))}
                        </select>

                    </div>

                </div>

                <div className="language-preview">

                    <span className="language-preview-label">
                        UI PREVIEW
                    </span>

                    <div className="language-preview-box">
                        Welcome, Admin
                    </div>

                    <div className="language-preview-box">
                        System Status: Active
                    </div>

                    <div className="language-preview-box">
                        {settings.language} interface
                    </div>

                    <div className="language-translate-row">

                        <span>
                            Auto-translate alerts
                        </span>

                        <button
                            type="button"
                            className={`language-toggle ${
                                settings.autoTranslate
                                    ? "active"
                                    : ""
                            }`}
                            onClick={handleAutoTranslate}
                            aria-pressed={
                                settings.autoTranslate
                            }
                        >
                            <span />
                        </button>

                    </div>

                    <div
                        className={`language-saved ${
                            saved ? "visible" : ""
                        }`}
                    >
                        <Check size={9} />
                        Saved
                    </div>

                </div>

            </div>

            {showLanguages && (
                <div
                    className="language-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setShowLanguages(false);
                        }
                    }}
                >
                    <div className="language-modal">

                        <div className="language-modal-header">

                            <div>
                                <div className="language-modal-title">
                                    <Globe2 size={14} />
                                    More Languages
                                </div>

                                <p>
                                    Select the interface
                                    language
                                </p>
                            </div>

                            <button
                                type="button"
                                className="language-modal-close"
                                onClick={() =>
                                    setShowLanguages(false)
                                }
                                aria-label="Close"
                            >
                                <X size={14} />
                            </button>

                        </div>

                        <div className="language-modal-options">

                            {additionalLanguages.map(
                                (language) => (
                                    <button
                                        type="button"
                                        key={language}
                                        className={`language-modal-option ${
                                            settings.language ===
                                            language
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleAdditionalLanguage(
                                                language
                                            )
                                        }
                                    >
                                        <span>
                                            {language}
                                        </span>

                                        {settings.language ===
                                            language && (
                                                <Check size={11} />
                                            )}
                                    </button>
                                )
                            )}

                        </div>

                    </div>
                </div>
            )}

        </section>
    );
}

export default LanguageLocalization;