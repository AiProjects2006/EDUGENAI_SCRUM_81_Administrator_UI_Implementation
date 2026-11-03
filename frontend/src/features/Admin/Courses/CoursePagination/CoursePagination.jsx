import { ChevronLeft, ChevronRight } from "lucide-react";
import "./CoursePagination.css";

function CoursePagination({
                              currentPage,
                              totalPages,
                              totalCourses,
                              coursesPerPage,
                              setCurrentPage
                          }) {
    const startEntry =
        totalCourses === 0
            ? 0
            : (currentPage - 1) * coursesPerPage + 1;

    const endEntry = Math.min(
        currentPage * coursesPerPage,
        totalCourses
    );

    return (
        <div className="course-pagination">

            <div className="pagination-info">
                Showing {startEntry}–{endEntry} of {totalCourses} courses
            </div>

            <div className="pagination-buttons">

                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                        setCurrentPage(currentPage - 1)
                    }
                >
                    <ChevronLeft size={16} />
                </button>

                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                ).map((page) => (
                    <button
                        type="button"
                        key={page}
                        className={
                            currentPage === page
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setCurrentPage(page)
                        }
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() =>
                        setCurrentPage(currentPage + 1)
                    }
                >
                    <ChevronRight size={16} />
                </button>

            </div>

        </div>
    );
}

export default CoursePagination;