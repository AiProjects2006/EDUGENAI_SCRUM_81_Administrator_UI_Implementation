import { useState } from "react";

import {
    X,
    RotateCcw
} from "lucide-react";

import "./RevisionModal.css";

function RevisionModal({
                           content,
                           onClose,
                           onSubmit
                       }) {
    const [revisionNote, setRevisionNote] = useState("");

    if (!content) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!revisionNote.trim()) {
            return;
        }

        onSubmit({
            ...content,
            revisionNote: revisionNote.trim(),
            status: "Pending"
        });
    };

    return (
        <div className="revision-modal-overlay">

            <div className="revision-modal">

                <div className="revision-modal-header">

                    <div>
                        <span className="revision-modal-label">
                            REQUEST REVISION
                        </span>

                        <h2>Send Content for Revision</h2>
                    </div>

                    <button
                        type="button"
                        className="revision-close-btn"
                        onClick={onClose}
                        title="Close"
                    >
                        <X size={18} />
                    </button>

                </div>

                <form
                    className="revision-modal-form"
                    onSubmit={handleSubmit}
                >

                    <div className="revision-modal-body">

                        <div className="revision-content-info">
                            <span>Content</span>

                            <strong>
                                {content.title}
                            </strong>

                            <small>
                                ID: {content.id}
                            </small>
                        </div>

                        <div className="revision-note-group">

                            <label htmlFor="revision-note">
                                REVISION NOTE
                            </label>

                            <textarea
                                id="revision-note"
                                value={revisionNote}
                                onChange={(event) =>
                                    setRevisionNote(
                                        event.target.value
                                    )
                                }
                                placeholder="Explain what needs to be revised..."
                                rows="5"
                            />

                        </div>

                    </div>

                    <div className="revision-modal-footer">

                        <button
                            type="button"
                            className="revision-cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="revision-submit-btn"
                            disabled={!revisionNote.trim()}
                        >
                            <RotateCcw size={15} />
                            Request Revision
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default RevisionModal;