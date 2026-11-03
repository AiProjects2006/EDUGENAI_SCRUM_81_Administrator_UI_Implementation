import { useEffect, useState } from "react";
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    Search
} from "lucide-react";

import "./NotificationLog.css";

function NotificationLog({ logs = [] }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);

    const rowsPerPage = 5;

    const filteredLogs = logs.filter((log) => {
        const query = search.toLowerCase().trim();

        const type = String(log.type || "").toLowerCase();
        const recipient = String(log.recipient || "").toLowerCase();
        const method = String(log.method || "").toLowerCase();

        const matchesSearch =
            !query ||
            type.includes(query) ||
            recipient.includes(query) ||
            method.includes(query);

        const matchesStatus =
            statusFilter === "ALL" ||
            String(log.status || "").toUpperCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredLogs.length / rowsPerPage)
    );

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const startIndex = (page - 1) * rowsPerPage;

    const visibleLogs = filteredLogs.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    const getStatusClass = (status) =>
        String(status || "")
            .toLowerCase()
            .replace(/\s+/g, "-");

    return (
        <section className="notification-log-card">

            <div className="notification-log-header">

                <div>
                    <h2>Real-time Notification Log</h2>

                    <p>
                        Monitor recent notification activity and delivery
                        status.
                    </p>
                </div>

                <div className="notification-log-live">
                    <span />
                    Live
                </div>

            </div>

            <div className="notification-log-toolbar">

                <div className="notification-log-search">
                    <Search size={13} />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search logs..."
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                >
                    <option value="ALL">All Status</option>
                    <option value="SENT">Sent</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="FAILED">Failed</option>
                </select>

            </div>

            <div className="notification-log-table-wrapper">

                <table className="notification-log-table">

                    <thead>
                    <tr>
                        <th>TYPE</th>
                        <th>RECIPIENT</th>
                        <th>STATUS</th>
                        <th>TIMESTAMP</th>
                        <th>METHOD</th>
                    </tr>
                    </thead>

                    <tbody>

                    {visibleLogs.length > 0 ? (
                        visibleLogs.map((log, index) => (
                            <tr
                                key={
                                    log.id ||
                                    log._id ||
                                    `notification-${index}`
                                }
                            >
                                <td>
                                    <div className="notification-log-type">

                                        <div className="notification-log-type-icon">
                                            <Bell size={12} />
                                        </div>

                                        <span>
                                                {log.type ||
                                                    "Notification"}
                                            </span>

                                    </div>
                                </td>

                                <td>
                                    {log.recipient || "-"}
                                </td>

                                <td>
                                        <span
                                            className={`notification-status ${getStatusClass(
                                                log.status
                                            )}`}
                                        >
                                            {log.status || "UNKNOWN"}
                                        </span>
                                </td>

                                <td>
                                    {log.timestamp || "-"}
                                </td>

                                <td>
                                    {log.method || "-"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="5"
                                className="notification-log-empty"
                            >
                                No notification activity found.
                            </td>
                        </tr>
                    )}

                    </tbody>

                </table>

            </div>

            <div className="notification-log-footer">

                <span>
                    {filteredLogs.length === 0
                        ? "No results"
                        : `Showing ${startIndex + 1}-${Math.min(
                            startIndex + rowsPerPage,
                            filteredLogs.length
                        )} of ${filteredLogs.length}`}
                </span>

                <div className="notification-log-pagination">

                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() =>
                            setPage((current) =>
                                Math.max(1, current - 1)
                            )
                        }
                    >
                        <ChevronLeft size={13} />
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={page === totalPages}
                        onClick={() =>
                            setPage((current) =>
                                Math.min(
                                    totalPages,
                                    current + 1
                                )
                            )
                        }
                    >
                        <ChevronRight size={13} />
                    </button>

                </div>

            </div>

        </section>
    );
}

export default NotificationLog;