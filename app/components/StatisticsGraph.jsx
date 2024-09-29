import React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "@/app/styles/statistics.module.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { CalendarIcon as DateIcon } from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      align: "start",
      labels: {
        padding: 20,
        font: {
          size: 14,
          weight: "bold",
        },
        color: "#d3d1d1",
        usePointStyle: true,
        pointStyle: "line",
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 12,
        },
        color: "#d3d1d1",
      },
      grid: {
        color: "rgb(22, 28, 69)",
      },
    },
    x: {
      ticks: {
        font: {
          size: 12,
        },
        color: "#d3d1d1",
      },
      grid: {
        color: "rgb(22, 28, 69)",
      },
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const generateRandomData = () => {
  return labels.map(() => Math.floor(Math.random() * 2000) - 1000);
};

const data = {
  labels,

  datasets: [
    {
      label: "Bidding",
      data: generateRandomData(),
      borderColor: "#fe850d",
      backgroundColor: "rgba(243, 43, 30, 0.1)",
      tension: 0.1,
    },
    {
      label: "Referral",
      data: generateRandomData(),
      borderColor: "#ffffff",
      backgroundColor: "rgba(0, 98, 255, 0.1)",
      tension: 0.1,
    },
  ],
};

export default function StatisticGraph() {
  const [date, setDate] = useState();
  const dateInputRef = useRef(null);

  const handleDateIconClick = () => {
    dateInputRef.current?.showPicker();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.StatisticsComponent}>
      <div className={styles.StatisticsHeader}>
        <div className={styles.dateFilter}>
          <DateIcon
            className={styles.dateIcon}
            height={24}
            width={24}
            onClick={handleDateIconClick}
          />
          <input
            type="date"
            name="date"
            className={styles.dateInputFilter}
            ref={dateInputRef}
            onChange={(e) => setDate(formatDate(e.target.value))}
          />
        </div>
      </div>
      <div className={styles.lineGraph}>
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
