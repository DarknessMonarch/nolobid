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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: 'bottom',
      align: 'start',
      labels: {
        padding: 20,
      }
    },
    title: {
      display: false,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const generateRandomData = () => {
  return labels.map(() => Math.floor(Math.random() * 2000) - 1000);
};

export const data = {
  labels,
  datasets: [
    {
      label: 'Bidding',
      borderColor: '#f32b1e',
      data: generateRandomData(),
      backgroundColor: '#f32b1e',
    },
    {
      label: 'Referral',
      borderColor: '#0062ff',
      data: generateRandomData(),
      backgroundColor: '#0062ff',
    },
  ],
};

export default function StatisticGraph() {
  return (
    <div className={styles.StatisticsComponent}>
           {/* <h1>Income</h1>
        <input type="date" name="graph" className={styles.dateFilter} /> */}
      <Line options={options} data={data} />
    </div>
  );
}
