import "./AnalyticsChart.css";

import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { LineChart } from "lucide-react";

import {
    fetchActivityStatsFromBackoffice,
    fetchActivityTrendsFromBackoffice,
} from "../../../../../services/backofficeService.js";

function AnalyticsChart() {
    const [stats, setStats] = useState(null);
    const [dateRange, setDateRange] = useState("all");
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const [statsData, activitiesData] = await Promise.all([
                    fetchActivityStatsFromBackoffice(),
                    fetchActivityTrendsFromBackoffice(),
                ]);

                setStats(statsData);
                setActivities(activitiesData);
            } catch (err) {
                console.error("Failed to load analytics:", err);
                setError("Unable to load activity analytics.");
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    // Count activities created on each date
    const dailyCounts = activities.reduce((counts, activity) => {
        if (!activity.createdAt) {
            return counts;
        }

        const date = activity.createdAt.slice(0, 10);

        counts[date] = (counts[date] || 0) + 1;

        return counts;
    }, {});

    // Convert counts into chart data, sorted by date

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filterStartDate = null;

    if (dateRange !== "all") {
        filterStartDate = new Date(today);
        filterStartDate.setDate(
            today.getDate() - (Number(dateRange) - 1)
        );
    }

    const dates = Object.keys(dailyCounts).sort();

    const chartData = [];

    if (dates.length > 0) {
        const startDate = new Date(`${dates[0]}T00:00:00`);
        const endDate = dateRange === "all"
            ? new Date(`${dates[dates.length - 1]}T00:00:00`)
            : new Date(today);

        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");

            const date = `${year}-${month}-${day}`;

            if (filterStartDate === null || currentDate >= filterStartDate) {
                chartData.push({
                    date,
                    count: dailyCounts[date] ?? 0,
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    return (
        <div className="analytics-card">
            <div className="analytics-header">
                <div className="title">
                    <LineChart size={18} color="#A855F7" />
                    <h3>Activities Analytics</h3>
                </div>

                <span className="badge">Activity Creation Trend</span>
            </div>

            <div className="analytics-metrics">
                <div>
                    <p>TOTAL ACTIVITIES</p>
                    <h2>{stats?.totalActivities ?? "—"}</h2>
                </div>

                <div>
                    <p>PUBLISHED</p>
                    <h2>{stats?.publishedActivities ?? "—"}</h2>
                </div>

                <div>
                    <p>DRAFT</p>
                    <h2>{stats?.draftActivities ?? "—"}</h2>
                </div>
            </div>

            <div className="chart-box">
                <p>Daily Activity Creation Trend</p>

                <div className="chart-date-filters">
                    <button
                        type="button"
                        className={dateRange === "7" ? "active" : ""}
                        onClick={() => setDateRange("7")}
                    >
                        Last 7 Days
                    </button>

                    <button
                        type="button"
                        className={dateRange === "30" ? "active" : ""}
                        onClick={() => setDateRange("30")}
                    >
                        Last 30 Days
                    </button>

                    <button
                        type="button"
                        className={dateRange === "all" ? "active" : ""}
                        onClick={() => setDateRange("all")}
                    >
                        All Time
                    </button>
                </div>

                {loading && <p>Loading analytics...</p>}

                {error && <p role="alert">{error}</p>}

                {!loading && !error && (
                    chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={chartData}>
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) =>
                                        new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                    tick={{ fontSize: 11 }}
                                    interval="preserveStartEnd"
                                />

                                <YAxis allowDecimals={false} />

                                <Tooltip
                                    labelFormatter={(date) =>
                                        new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                    }
                                    formatter={(value) => [value, "Activities Created"]}
                                    contentStyle={{
                                        backgroundColor: "#FFFFFF",
                                        border: "1px solid #E9D5FF",
                                        borderRadius: "10px",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                        fontSize: "12px",
                                    }}
                                    cursor={{ fill: "#F3E8FF", opacity: 0.4 }}
                                />

                                <Bar
                                    dataKey="count"
                                    name="Activities Created"
                                    fill="#EC4899"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>No activity creation data available.</p>
                    )
                )}
            </div>
        </div>
    );
}

export default AnalyticsChart;
