import {
    Check,
    RotateCcw,
    X
} from "lucide-react";

import "./ModerationDetails.css";

function ModerationDetails({
                               content,
                               onApprove,
                               onRevise,
                               onReject
                           }) {
    if (!content) {
        return (
            <div className="moderation-details">
                <div className="moderation-details-empty">
                    <p>Select content to preview</p>
                </div>
            </div>
        );
    }

    return (
        <div className="moderation-details">

            <div className="moderation-details-header">
                <div>
                    <span className="details-label">
                        PREVIEW DETAILS
                    </span>

                    <h2>{content.title}</h2>
                </div>
            </div>

            <div className="moderation-details-content">

                <div className="details-info-grid">

                    <div className="details-info-item">
                        <span>Content ID</span>
                        <strong>{content.id}</strong>
                    </div>

                    <div className="details-info-item">
                        <span>Type</span>
                        <strong>{content.type}</strong>
                    </div>

                    <div className="details-info-item">
                        <span>Subject</span>
                        <strong>{content.subject}</strong>
                    </div>

                    <div className="details-info-item">
                        <span>Grade Level</span>
                        <strong>{content.grade}</strong>
                    </div>

                    <div className="details-info-item">
                        <span>Difficulty</span>
                        <strong>{content.difficulty}</strong>
                    </div>

                    <div className="details-info-item">
                        <span>Creator</span>
                        <strong>{content.creator}</strong>
                    </div>

                </div>

                {content.question && (
                    <div className="details-question">

                        <span className="details-section-title">
                            QUESTION
                        </span>

                        <p>{content.question}</p>

                        <div className="details-options">

                            {content.options?.map((option) => (
                                <div
                                    key={option}
                                    className={
                                        option === content.correctAnswer
                                            ? "detail-option correct"
                                            : "detail-option"
                                    }
                                >
                                    {option}
                                </div>
                            ))}

                        </div>

                    </div>
                )}

            </div>

            <div className="moderation-details-footer">

                <button
                    type="button"
                    className="details-action approve"
                    onClick={() => onApprove(content)}
                    disabled={content.status === "Approved"}
                >
                    <Check size={15} />
                    Approve
                </button>

                <button
                    type="button"
                    className="details-action revise"
                    onClick={() => onRevise(content)}
                >
                    <RotateCcw size={15} />
                    Revise
                </button>

                <button
                    type="button"
                    className="details-action reject"
                    onClick={() => onReject(content)}
                    disabled={content.status === "Rejected"}
                >
                    <X size={15} />
                    Reject
                </button>

            </div>

        </div>
    );
}

export default ModerationDetails;