import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RefundsReturnsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRefundsReturnsData = async () => {
      try {
        const { data } = await axios.get('/api/charts/refunds-returns');
        setData(data);
      } catch (error) {
        console.error('Error fetching refunds and returns data:', error);
      }
    };

    fetchRefundsReturnsData();
  }, []);

  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        label: 'Total Refunds',
        data: data.map(item => item.totalRefunds),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Total Returns',
        data: data.map(item => item.totalReturns),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Refunds and Returns</h2>
      <Bar data={chartData} options={{
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.dataset.label}: $${tooltipItem.raw.toFixed(2)}`;
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      }} />
    </div>
  );
};

export default RefundsReturnsChart;
