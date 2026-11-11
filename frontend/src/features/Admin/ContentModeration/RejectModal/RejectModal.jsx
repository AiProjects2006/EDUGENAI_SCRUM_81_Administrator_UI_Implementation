import { useState } from "react";

import {
    X,
    AlertCircle
} from "lucide-react";

import "./RejectModal.css";

function RejectModal({
                         content,
                         onClose,
                         onSubmit
                     }) {
    const [rejectionReason, setRejectionReason] = useState("");

    if (!content) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!rejectionReason.trim()) {
            return;
        }

        onSubmit({
            ...content,
            rejectionReason: rejectionReason.trim(),
            status: "Rejected"
        });
    };

    return (
        <div className="reject-modal-overlay">

            <div className="reject-modal">

                <div className="reject-modal-header">

                    <div className="reject-modal-title-area">

                        <div className="reject-warning-icon">
                            <AlertCircle size={18} />
                        </div>

                        <div>
                            <span className="reject-modal-label">
                                REJECT CONTENT
                            </span>

                            <h2>Reject Content</h2>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="reject-close-btn"
                        onClick={onClose}
                        title="Close"
                    >
                        <X size={18} />
                    </button>

                </div>

                <form
                    className="reject-modal-form"
                    onSubmit={handleSubmit}
                >

                    <div className="reject-modal-body">

                        <div className="reject-content-info">

                            <span>Content</span>

                            <strong>
                                {content.title}
                            </strong>

                            <small>
                                ID: {content.id}
                            </small>

                        </div>

                        <div className="reject-reason-group">

                            <label htmlFor="rejection-reason">
                                REJECTION REASON
                            </label>

                            <textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(event) =>
                                    setRejectionReason(
                                        event.target.value
                                    )
                                }
                                placeholder="Explain why this content is being rejected..."
                                rows="5"
                            />

                        </div>

                    </div>

                    <div className="reject-modal-footer">

                        <button
                            type="button"
                            className="reject-cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="reject-submit-btn"
                            disabled={!rejectionReason.trim()}
                        >
                            <AlertCircle size={15} />
                            Reject Content
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default RejectModal;