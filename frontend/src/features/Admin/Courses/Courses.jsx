import { useState, useEffect, useCallback } from "react";
import "./Courses.css";

import CourseModal from "./CourseModal/CourseModal";
import CoursePagination from "./CoursePagination/CoursePagination";
import Sidebar from "../../../components/layout/Sidebar/AdminSidebar";
import CourseStats from "./CourseStats";
import CourseTable from "./CourseTable";
import CourseFilters from "./CourseFilters/CourseFilters";
import CourseDetails from "./CourseDetails/CourseDetails";

import {
    fetchCoursesFromBackoffice,
    updateCourseInBackoffice,
    updateCourseStatusInBackoffice,
    deleteCourseInBackoffice,
    deduplicateCourses
} from "../../../services/backofficeService";

function Courses() {
    const [courseList, setCourseList] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [modalMode, setModalMode] = useState("view");
    const [detailsCourse, setDetailsCourse] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 10;

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        subject: "",
        grade: ""
    });

    const loadCourses = useCallback(async () => {
        try {
            const data = await fetchCoursesFromBackoffice();
            if (Array.isArray(data)) {
                setCourseList(deduplicateCourses(data));
            }
        } catch (e) {
            console.error("Failed loading admin courses:", e);
        }
    }, []);

    useEffect(() => {
        loadCourses();
        window.addEventListener("focus", loadCourses);
        window.addEventListener("storage", loadCourses);
        window.addEventListener("coursesUpdated", loadCourses);

        let channel = null;
        try {
            if (typeof BroadcastChannel !== "undefined") {
                channel = new BroadcastChannel("edugenai_channel");
                channel.onmessage = (event) => {
                    if (event.data?.type === "COURSES_UPDATED" || event.data?.type === "COURSE_PUBLISHED") {
                        loadCourses();
                    }
                };
            }
        } catch (_) {}

        const interval = setInterval(loadCourses, 3000);
        return () => {
            window.removeEventListener("focus", loadCourses);
            window.removeEventListener("storage", loadCourses);
            window.removeEventListener("coursesUpdated", loadCourses);
            clearInterval(interval);
            if (channel) channel.close();
        };
    }, [loadCourses]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const filteredCourses = courseList.filter((course) => {
        const matchesSearch = (course.title || course.name || "")
            .toLowerCase()
            .includes(filters.search.toLowerCase());

        const courseStatus = (course.status || "").toLowerCase();
        const filterStatus = filters.status.toLowerCase();

        let matchesStatus = true;
        if (filters.status !== "") {
            if (filterStatus === "approved" || filterStatus === "published") {
                matchesStatus = courseStatus === "approved" || courseStatus === "published";
            } else if (filterStatus === "pending" || filterStatus === "draft") {
                matchesStatus = courseStatus === "pending" || courseStatus === "draft";
            } else {
                matchesStatus = courseStatus === filterStatus;
            }
        }

        const matchesSubject =
            filters.subject === "" ||
            (course.subject || "").toLowerCase() === filters.subject.toLowerCase();

        const matchesGrade =
            filters.grade === "" ||
            (course.grade || "").toLowerCase().includes(filters.grade.toLowerCase());

        return (
            matchesSearch &&
            matchesStatus &&
            matchesSubject &&
            matchesGrade
        );
    });

    const handleFilterChange = (field, value) => {
        setFilters((previousFilters) => ({
            ...previousFilters,
            [field]: value
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            search: "",
            status: "",
            subject: "",
            grade: ""
        });
    };

    const handleView = (course) => {
        setDetailsCourse(course);
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setModalMode("edit");
    };

    const closeModal = () => {
        setSelectedCourse(null);
    };

    const handleApprove = async (course) => {
        const updatedCourse = {
            ...course,
            status: "Approved"
        };

        await updateCourseStatusInBackoffice(course.id, "Approved");

        setCourseList((previousCourses) =>
            previousCourses.map((item) =>
                item.id === course.id
                    ? updatedCourse
                    : item
            )
        );

        setDetailsCourse(updatedCourse);
    };

    const handleArchive = async (course) => {
        const updatedCourse = {
            ...course,
            status: "Archived"
        };

        await updateCourseStatusInBackoffice(course.id, "Archived");

        setCourseList((previousCourses) =>
            previousCourses.map((item) =>
                item.id === course.id
                    ? updatedCourse
                    : item
            )
        );

        setDetailsCourse(updatedCourse);
    };

    const handleSave = async (updatedCourse) => {
        await updateCourseInBackoffice(updatedCourse.id, updatedCourse);

        setCourseList((previousCourses) =>
            previousCourses.map((course) =>
                course.id === updatedCourse.id
                    ? updatedCourse
                    : course
            )
        );

        setSelectedCourse(null);
    };

    const handleDelete = async (course) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${course.title}?`
        );

        if (!confirmed) return;

        await deleteCourseInBackoffice(course.id);

        setCourseList((previousCourses) =>
            previousCourses.filter(
                (item) => item.id !== course.id
            )
        );

        if (detailsCourse?.id === course.id) {
            setDetailsCourse(null);
        }
    };

    const totalPages = Math.ceil(
        filteredCourses.length / coursesPerPage
    ) || 1;

    const startIndex =
        (currentPage - 1) * coursesPerPage;

    const paginatedCourses =
        filteredCourses.slice(
            startIndex,
            startIndex + coursesPerPage
        );

    return (
        <div className="admin-layout">
            <Sidebar />

            <main className="courses-page">

                <div className="courses-header">
                    <div>
                        <h1>Course Administration</h1>
                        <p>
                            Manage courses, review content, and monitor course activities.
                        </p>
                    </div>
                </div>

                <CourseStats courses={courseList} />

                <div className="courses-content">
                    <h2>Course Management</h2>
                    <p>View, manage, and approve courses.</p>

                    <div className="course-management-layout">

                        <div className="course-table-section">

                            <CourseFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onReset={handleResetFilters}
                            />

                            <CourseTable
                                courses={paginatedCourses}
                                onView={handleView}
                                onEdit={handleEdit}
                                onApprove={handleApprove}
                                onArchive={handleArchive}
                                onDelete={handleDelete}
                            />

                            <CoursePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalCourses={filteredCourses.length}
                                coursesPerPage={coursesPerPage}
                                setCurrentPage={setCurrentPage}
                            />

                        </div>

                        <CourseDetails
                            course={detailsCourse}
                            onApprove={handleApprove}
                            onArchive={handleArchive}
                        />

                    </div>

                    <CourseModal
                        course={selectedCourse}
                        mode={modalMode}
                        onClose={closeModal}
                        onSave={handleSave}
                    />
                </div>

            </main>
        </div>
    );
}

export default Courses;