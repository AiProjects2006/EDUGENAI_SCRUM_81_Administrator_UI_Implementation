import "./DeleteUserModal.css";
import { Trash2, X } from "lucide-react";

function DeleteUserModal({ user, onCancel, onConfirm }) {

    return (

        <div className="delete-modal-overlay">

            <div className="delete-modal">

                <button
                    className="delete-close"
                    onClick={onCancel}
                >
                    <X size={20} />
                </button>

                <div className="delete-icon">

                    <Trash2 size={34} />

                </div>

                <h2>Delete User</h2>

                <p>
                    Are you sure you want to delete
                    <strong> {user?.name}</strong>?
                </p>

                <span className="delete-warning">
                    This action cannot be undone.
                </span>

                <div className="delete-buttons">

                    <button
                        className="cancel-delete"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete"
                        onClick={() => onConfirm(user.id)}
                    >
                        Delete User
                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteUserModal;