import { useState } from "react";
import "./BroadcastNotification.css";

function BroadcastNotification({
                                   onNotificationSent,
                                   selectedTemplate
                               }) {
    const [audience, setAudience] = useState("All Users");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    const handleTemplateSelect = () => {
        if (!selectedTemplate) return;

        setTitle(
            selectedTemplate.name ||
            selectedTemplate.title ||
            selectedTemplate.templateName ||
            ""
        );

        setMessage(
            selectedTemplate.message ||
            selectedTemplate.content ||
            selectedTemplate.body ||
            ""
        );
    };

    const handlePreview = () => {
        if (!title.trim() || !message.trim()) {
            alert("Please enter a notification title and message first.");
            return;
        }

        setShowPreview(true);
    };

    const handleSend = () => {
        if (!title.trim() || !message.trim()) {
            alert("Please enter a notification title and message.");
            return;
        }

        onNotificationSent?.({
            audience,
            title,
            message
        });

        setTitle("");
        setMessage("");
        setShowPreview(false);

        alert("Notification sent successfully.");
    };

    return (
        <>
            <div className="broadcast-notification-card">

                <div className="broadcast-notification-header">
                    <div>
                        <h2>Broadcast Notification</h2>

                        <p>
                            Send a notification to selected users
                        </p>
                    </div>

                    <span className="broadcast-live-badge">
                        LIVE BROADCAST
                    </span>
                </div>

                <div className="broadcast-notification-form">

                    <div className="broadcast-field">
                        <label>Target Audience</label>

                        <select
                            value={audience}
                            onChange={(event) =>
                                setAudience(event.target.value)
                            }
                        >
                            <option>All Users</option>
                            <option>Students</option>
                            <option>Content Creators</option>
                            <option>Administrators</option>
                        </select>
                    </div>

                    <div className="broadcast-field">
                        <label>Message Title</label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder="Enter headline for the alert..."
                        />
                    </div>

                    <div className="broadcast-field">
                        <label>Message Content</label>

                        <textarea
                            rows="4"
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            placeholder="Write your announcement here. Markdown supported."
                        />
                    </div>

                    {selectedTemplate && (
                        <button
                            type="button"
                            className="broadcast-template-btn"
                            onClick={handleTemplateSelect}
                        >
                            Use Selected Template
                        </button>
                    )}

                    <div className="broadcast-notification-actions">

                        <button
                            type="button"
                            className="broadcast-preview-btn"
                            onClick={handlePreview}
                        >
                            Preview
                        </button>

                        <button
                            type="button"
                            className="broadcast-send-btn"
                            onClick={handleSend}
                        >
                            Send Now
                        </button>

                    </div>

                </div>
            </div>

            {showPreview && (
                <div className="notification-preview-overlay">

                    <div className="notification-preview-modal">

                        <div className="notification-preview-header">
                            <div>
                                <h3>Notification Preview</h3>
                                <p>Review before sending</p>
                            </div>

                            <button
                                type="button"
                                className="notification-preview-close"
                                onClick={() =>
                                    setShowPreview(false)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <div className="notification-preview-body">

                            <div className="notification-preview-meta">
                                <span>Audience</span>
                                <strong>{audience}</strong>
                            </div>

                            <div className="notification-preview-message">
                                <span>Notification</span>

                                <div className="notification-preview-content">
                                    <h4>{title}</h4>
                                    <p>{message}</p>
                                </div>
                            </div>

                        </div>

                        <div className="notification-preview-footer">

                            <button
                                type="button"
                                className="notification-preview-cancel"
                                onClick={() =>
                                    setShowPreview(false)
                                }
                            >
                                Back to Edit
                            </button>

                            <button
                                type="button"
                                className="notification-preview-send"
                                onClick={handleSend}
                            >
                                Confirm & Send
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

export default BroadcastNotification;