import "./AnalyticsChart.css";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Tooltip,
    XAxis,
} from "recharts";

import { LineChart } from "lucide-react";

import { chartData } from "../../data/dashboardData.js";

function AnalyticsChart() {

    return (

        <div className="analytics-card">

            <div className="analytics-header">

                <div className="title">

                    <LineChart size={18} color="#A855F7"/>

                    <h3>AI Services Monitoring</h3>

                </div>

                <span className="badge">

                    Last 24 Hours

                </span>

            </div>

            <div className="analytics-metrics">

                <div>

                    <p>AVG GEN TIME</p>

                    <h2>1.2s</h2>

                </div>

                <div>

                    <p>SUCCESS RATE</p>

                    <h2>98.5%</h2>

                </div>

                <div>

                    <p>TOP SUBJECT</p>

                    <h2>Biology</h2>

                </div>

            </div>

            <div className="chart-box">

                <p>AI Requests Real-time</p>

                <ResponsiveContainer width="100%" height={220}>

                    <BarChart data={chartData}>

                        <XAxis dataKey="t" />

                        <Tooltip />

                        <Bar
                            dataKey="v"
                            fill="#EC4899"
                            radius={[6,6,0,0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default AnalyticsChart;