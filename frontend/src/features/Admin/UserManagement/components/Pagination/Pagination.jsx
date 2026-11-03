
import "./Pagination.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination">
            <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft size={18} />
                Previous
            </button>

            <div className="page-numbers">
                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                ).map((page) => (
                    <button
                        key={page}
                        className={`page-number ${
                            currentPage === page ? "active" : ""
                        }`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
                <ChevronRight size={18} />
            </button>
        </div>
    );
}

export default Pagination;
