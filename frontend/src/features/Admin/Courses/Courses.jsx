import { useState, useEffect } from "react";
import "./Courses.css";

import CourseModal from "./CourseModal/CourseModal";
import CoursePagination from "./CoursePagination/CoursePagination";
import Sidebar from "../../../components/layout/Sidebar/AdminSidebar";
import CourseStats from "./CourseStats";
import CourseTable from "./CourseTable";
import CourseFilters from "./CourseFilters/CourseFilters";
import CourseDetails from "./CourseDetails/CourseDetails";

import { courses as initialCourses } from "./data/courseData";

function Courses() {
    const [courseList, setCourseList] = useState(initialCourses);
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

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const filteredCourses = courseList.filter((course) => {
        const matchesSearch = course.title
            .toLowerCase()
            .includes(filters.search.toLowerCase());

        const matchesStatus =
            filters.status === "" ||
            course.status === filters.status;

        const matchesSubject =
            filters.subject === "" ||
            course.subject === filters.subject;

        const matchesGrade =
            filters.grade === "" ||
            course.grade === filters.grade;

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

    const handleApprove = (course) => {
        const updatedCourse = {
            ...course,
            status: "Approved"
        };

        setCourseList((previousCourses) =>
            previousCourses.map((item) =>
                item.id === course.id
                    ? updatedCourse
                    : item
            )
        );

        setDetailsCourse(updatedCourse);
    };

    const handleArchive = (course) => {
        const updatedCourse = {
            ...course,
            status: "Archived"
        };

        setCourseList((previousCourses) =>
            previousCourses.map((item) =>
                item.id === course.id
                    ? updatedCourse
                    : item
            )
        );

        setDetailsCourse(updatedCourse);
    };

    const handleSave = (updatedCourse) => {
        setCourseList((previousCourses) =>
            previousCourses.map((course) =>
                course.id === updatedCourse.id
                    ? updatedCourse
                    : course
            )
        );

        setSelectedCourse(null);
    };

    const handleDelete = (course) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${course.title}?`
        );

        if (!confirmed) return;

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
    );

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

                <CourseStats />

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
                        onClose={() => setSelectedCourse(null)}
                        onSave={handleSave}
                    />
                </div>

            </main>
        </div>
    );
}

export default Courses;