import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { Bar as BarChart } from 'react-chartjs-2';

import './index.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function Chart({ chartData }) {
  return (
    <div className="chart-container">
      <BarChart data={chartData} />
    </div>
  );
}

export default Chart;