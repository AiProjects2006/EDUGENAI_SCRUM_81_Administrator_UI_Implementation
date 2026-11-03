import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import "./ModerationPagination.css";

function ModerationPagination({
                                  currentPage,
                                  totalPages,
                                  totalContent,
                                  contentPerPage,
                                  setCurrentPage
                              }) {
    if (totalContent === 0) {
        return null;
    }

    const startItem =
        (currentPage - 1) * contentPerPage + 1;

    const endItem = Math.min(
        currentPage * contentPerPage,
        totalContent
    );

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="moderation-pagination">

            <span className="pagination-info">
                Showing {startItem}-{endItem} of {totalContent}
            </span>

            <div className="pagination-controls">

                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    title="Previous Page"
                >
                    <ChevronLeft size={15} />
                </button>

                <span className="pagination-page">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                >
                    <ChevronRight size={15} />
                </button>

            </div>

        </div>
    );
}

export default ModerationPagination;