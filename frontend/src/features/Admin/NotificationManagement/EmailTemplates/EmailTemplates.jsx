import { useState } from "react";
import {
    UserRound,
    BookOpen,
    CalendarDays,
    Pencil
} from "lucide-react";

import { emailTemplates } from "../data/NotificationData.js";

import "./EmailTemplates.css";

function EmailTemplates({ onTemplateSelect }) {
    const [templates, setTemplates] = useState(emailTemplates);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const [templateName, setTemplateName] = useState("");
    const [message, setMessage] = useState("");

    const getTemplateTitle = (template) =>
        template.name ||
        template.title ||
        template.templateName ||
        "Email Template";

    const getTemplateMessage = (template) =>
        template.message ||
        template.content ||
        template.body ||
        "";

    const getTemplateIcon = (template) => {
        const title = getTemplateTitle(template).toLowerCase();

        if (title.includes("welcome")) {
            return UserRound;
        }

        if (title.includes("course")) {
            return BookOpen;
        }

        if (
            title.includes("deadline") ||
            title.includes("expiry")
        ) {
            return CalendarDays;
        }

        return Pencil;
    };

    const handleEdit = (template) => {
        setSelectedTemplate(template);

        setTemplateName(
            getTemplateTitle(template)
        );

        setMessage(
            getTemplateMessage(template)
        );

        onTemplateSelect?.(template);
    };

    const handleSave = () => {
        if (!templateName.trim() || !message.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        const updatedTemplate = {
            ...selectedTemplate,
            name: templateName,
            message
        };

        setTemplates((previousTemplates) =>
            previousTemplates.map((template) =>
                template === selectedTemplate
                    ? updatedTemplate
                    : template
            )
        );

        setSelectedTemplate(null);
        onTemplateSelect?.(updatedTemplate);
    };

    const handleCancel = () => {
        setSelectedTemplate(null);
    };

    return (
        <>
            <div className="email-templates-card">

                <div className="email-templates-header">

                    <div>
                        <h2>Email Templates</h2>

                        <p>
                            Manage reusable notification templates
                        </p>
                    </div>

                    <span className="email-templates-count">
                        {templates.length} Templates
                    </span>

                </div>

                <div className="email-template-list">

                    {templates.map((template, index) => {
                        const Icon = getTemplateIcon(template);

                        return (
                            <div
                                className="email-template"
                                key={
                                    template.id ||
                                    template._id ||
                                    `template-${index}`
                                }
                            >
                                <div className="email-template-icon">
                                    <Icon size={15} />
                                </div>

                                <div className="email-template-info">

                                    <strong>
                                        {getTemplateTitle(template)}
                                    </strong>

                                    <span>
                                        {getTemplateMessage(template)}
                                    </span>

                                </div>

                                <button
                                    type="button"
                                    className="email-template-edit"
                                    onClick={() =>
                                        handleEdit(template)
                                    }
                                >
                                    <Pencil size={11} />
                                    Edit
                                </button>

                            </div>
                        );
                    })}

                </div>

            </div>

            {selectedTemplate && (
                <div className="template-editor-overlay">

                    <div className="template-editor">

                        <div className="template-editor-header">

                            <div>
                                <h3>
                                    Edit Email Template
                                </h3>

                                <p>
                                    Update the template content
                                </p>
                            </div>

                            <button
                                type="button"
                                className="template-editor-close"
                                onClick={handleCancel}
                            >
                                ×
                            </button>

                        </div>

                        <div className="template-editor-body">

                            <label>
                                Template Name
                            </label>

                            <input
                                type="text"
                                value={templateName}
                                onChange={(event) =>
                                    setTemplateName(
                                        event.target.value
                                    )
                                }
                            />

                            <label>
                                Message
                            </label>

                            <textarea
                                rows="6"
                                value={message}
                                onChange={(event) =>
                                    setMessage(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="template-editor-footer">

                            <button
                                type="button"
                                className="template-cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="template-save-btn"
                                onClick={handleSave}
                            >
                                Save Template
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}

export default EmailTemplates;