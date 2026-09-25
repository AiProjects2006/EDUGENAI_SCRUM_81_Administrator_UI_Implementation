import { useState } from "react";
import { Calendar, X } from "lucide-react";

import "./AnalyticsFilters.css";

function AnalyticsFilters({
                              selectedPeriod,
                              onPeriodChange
                          }) {
    const [showCustomRange, setShowCustomRange] =
        useState(false);

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const [customRange, setCustomRange] =
        useState("");

    const periods = [
        "Today",
        "This Week",
        "This Month"
    ];

    const handlePeriodChange = (period) => {
        onPeriodChange(period);

        setShowCustomRange(false);
        setCustomRange("");
    };

    const handleCustomRangeClick = () => {
        onPeriodChange("Custom Range");
        setShowCustomRange(true);
    };

    const handleApplyRange = () => {
        if (!startDate || !endDate) {
            return;
        }

        setCustomRange(
            `${startDate} - ${endDate}`
        );

        setShowCustomRange(false);
    };

    const handleClearRange = () => {
        setStartDate("");
        setEndDate("");
        setCustomRange("");
        onPeriodChange("This Month");
        setShowCustomRange(false);
    };

    return (
        <div className="analytics-filter-wrapper">

            <div className="analytics-filters">

                {periods.map((period) => (
                    <button
                        key={period}
                        type="button"
                        className={
                            selectedPeriod === period
                                ? "analytics-period-btn active"
                                : "analytics-period-btn"
                        }
                        onClick={() =>
                            handlePeriodChange(period)
                        }
                    >
                        {period}
                    </button>
                ))}

                <button
                    type="button"
                    className={
                        selectedPeriod === "Custom Range"
                            ? "analytics-period-btn active custom-btn"
                            : "analytics-period-btn custom-btn"
                    }
                    onClick={handleCustomRangeClick}
                >
                    <Calendar size={12} />

                    {customRange || "Custom Range"}
                </button>

            </div>

            {showCustomRange && (
                <div className="custom-range-panel">

                    <div className="custom-range-header">
                        <div>
                            <h3>Select Date Range</h3>

                            <p>
                                Choose the start and end dates
                            </p>
                        </div>

                        <button
                            type="button"
                            className="custom-range-close"
                            onClick={handleClearRange}
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <div className="custom-range-fields">

                        <div className="date-field">
                            <label htmlFor="start-date">
                                Start Date
                            </label>

                            <input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(event.target.value)
                                }
                            />
                        </div>

                        <div className="date-field">
                            <label htmlFor="end-date">
                                End Date
                            </label>

                            <input
                                id="end-date"
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(event) =>
                                    setEndDate(event.target.value)
                                }
                            />
                        </div>

                    </div>

                    <div className="custom-range-actions">

                        <button
                            type="button"
                            className="cancel-range-btn"
                            onClick={handleClearRange}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="apply-range-btn"
                            disabled={!startDate || !endDate}
                            onClick={handleApplyRange}
                        >
                            Apply Range
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AnalyticsFilters;