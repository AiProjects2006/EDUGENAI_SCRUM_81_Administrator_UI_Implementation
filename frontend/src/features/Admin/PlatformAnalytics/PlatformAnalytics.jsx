import { useState } from "react";

import BackofficeLayout from "../../../components/layout/BackofficeLayout.jsx";

import AnalyticsFilters from "./AnalyticsFilters/AnalyticsFilters.jsx";
import AnalyticsStats from "./AnalyticsStats/AnalyticsStats.jsx";
import ActivityTrend from "./ActivityTrend/ActivityTrend.jsx";
import ActivityTypes from "./ActivityTypes/ActivityTypes.jsx";
import SmartInsights from "./SmartInsights/SmartInsights.jsx";
import CoursePerformance from "./CoursePerformance/CoursePerformance.jsx";
import CriticalAlerts from "./CriticalAlerts/CriticalAlerts.jsx";
import UpcomingDeadline from "./UpcomingDeadline/UpcomingDeadline.jsx";

import {
    analyticsByPeriod
} from "./data/AnalyticsData.js";

import "./PlatformAnalytics.css";

function PlatformAnalytics() {
    const [selectedPeriod, setSelectedPeriod] =
        useState("This Month");

    const currentAnalytics =
        analyticsByPeriod[selectedPeriod] ||
        analyticsByPeriod["This Month"];

    return (
        <BackofficeLayout>

            <div className="platform-analytics">

                <div className="analytics-header">

                    <div className="analytics-header-text">

                        <h1>
                            Platform Analytics
                        </h1>

                        <p>
                            Monitor system performance and user engagement
                            in real-time.
                        </p>

                    </div>

                    <AnalyticsFilters
                        selectedPeriod={selectedPeriod}
                        onPeriodChange={setSelectedPeriod}
                    />

                </div>

                <AnalyticsStats
                    stats={currentAnalytics.stats}
                />

                <div className="analytics-chart-grid">

                    <ActivityTrend
                        activityTrend={
                            currentAnalytics.activityTrend
                        }
                    />

                    <ActivityTypes />

                </div>

                <SmartInsights />

                <CoursePerformance />

                <div className="analytics-bottom-grid">

                    <CriticalAlerts />

                    <UpcomingDeadline />

                </div>

            </div>

        </BackofficeLayout>
    );
}

export default PlatformAnalytics;