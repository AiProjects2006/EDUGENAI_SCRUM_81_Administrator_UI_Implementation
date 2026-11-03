import { useEffect, useState } from "react";

import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";

import { moderationContent } from "./data/ContentData";

import ModerationStats from "./ModerationStats/ModerationStats";
import ModerationFilters from "./ModerationFilters/ModerationFilters";
import ModerationTable from "./ModerationTable/ModerationTable";
import ModerationDetails from "./ModerationDetails/ModerationDetails";
import ModerationPagination from "./ModerationPagination/ModerationPagination";
import RevisionModal from "./RevisionModal/RevisionModal";
import RejectModal from "./RejectModal/RejectModal";

import "./ContentModeration.css";

function ContentModeration() {

    const [contentList, setContentList] = useState(
        moderationContent
    );

    const [selectedContent, setSelectedContent] =
        useState(moderationContent[0]);

    const [revisionContent, setRevisionContent] =
        useState(null);

    const [rejectContent, setRejectContent] =
        useState(null);

    const [filters, setFilters] = useState({
        contentType: "",
        status: "Pending",
        grade: ""
    });

    const [currentPage, setCurrentPage] = useState(1);

    const contentPerPage = 10;

    const filteredContent = contentList.filter((item) => {

        const matchesType =
            filters.contentType === "" ||
            item.type === filters.contentType;

        const matchesStatus =
            filters.status === "" ||
            item.status === filters.status;

        const matchesGrade =
            filters.grade === "" ||
            item.grade === filters.grade;

        return (
            matchesType &&
            matchesStatus &&
            matchesGrade
        );
    });

    useEffect(() => {
        setCurrentPage(1);

        if (filteredContent.length > 0) {
            setSelectedContent(filteredContent[0]);
        } else {
            setSelectedContent(null);
        }
    }, [filters, contentList]);

    const handleFilterChange = (field, value) => {
        setFilters((previousFilters) => ({
            ...previousFilters,
            [field]: value
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            contentType: "",
            status: "",
            grade: ""
        });
    };

    const totalPages = Math.ceil(
        filteredContent.length / contentPerPage
    );

    const startIndex =
        (currentPage - 1) * contentPerPage;

    const paginatedContent =
        filteredContent.slice(
            startIndex,
            startIndex + contentPerPage
        );

    const handleApprove = (content) => {

        const updatedContent = {
            ...content,
            status: "Approved"
        };

        setContentList((previousContent) =>
            previousContent.map((item) =>
                item.id === content.id
                    ? updatedContent
                    : item
            )
        );

        setSelectedContent(updatedContent);
    };

    const handleReject = (content) => {
        setRejectContent(content);
    };

    const handleRejectSubmit = (updatedContent) => {

        setContentList((previousContent) =>
            previousContent.map((item) =>
                item.id === updatedContent.id
                    ? updatedContent
                    : item
            )
        );

        setSelectedContent(updatedContent);
        setRejectContent(null);
    };

    const handleRevise = (content) => {
        setRevisionContent(content);
    };

    const handleRevisionSubmit = (updatedContent) => {

        setContentList((previousContent) =>
            previousContent.map((item) =>
                item.id === updatedContent.id
                    ? updatedContent
                    : item
            )
        );

        setSelectedContent(updatedContent);
        setRevisionContent(null);
    };

    return (
        <BackofficeLayout>

            <div className="content-moderation">

                <div className="content-moderation-header">
                    <h1>Content Moderation</h1>

                    <p>
                        Review AI activities and learning content
                        before publishing
                    </p>
                </div>

                <ModerationStats
                    content={contentList}
                />

                <div className="moderation-layout">

                    <div className="moderation-table-section">

                        <ModerationFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onReset={handleResetFilters}
                        />

                        <ModerationTable
                            content={paginatedContent}
                            selectedContent={selectedContent}
                            onSelect={setSelectedContent}
                        />

                        <ModerationPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalContent={filteredContent.length}
                            contentPerPage={contentPerPage}
                            setCurrentPage={setCurrentPage}
                        />

                    </div>

                    <ModerationDetails
                        content={selectedContent}
                        onApprove={handleApprove}
                        onRevise={handleRevise}
                        onReject={handleReject}
                    />

                </div>

            </div>

            {revisionContent && (
                <RevisionModal
                    content={revisionContent}
                    onClose={() => setRevisionContent(null)}
                    onSubmit={handleRevisionSubmit}
                />
            )}

            {rejectContent && (
                <RejectModal
                    content={rejectContent}
                    onClose={() => setRejectContent(null)}
                    onSubmit={handleRejectSubmit}
                />
            )}

        </BackofficeLayout>
    );
}

export default ContentModeration;