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
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueByCategoryChart = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const { data } = await axios.get('/api/charts/revenue-by-category');
        // console.log('dayyyysss' , data)
        setRevenueData(data);
      } catch (error) {
        console.error('Error fetching revenue by category data:', error);
      }
    };

    fetchRevenueData();
  }, []);

  const chartData = {
    labels: revenueData.map(item => item._id),
    datasets: [
      {
        label: 'Total Revenue',
        data: revenueData.map(item => item.totalRevenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ],
  };

  return (
<>
<Bar data={chartData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `Revenue: $${tooltipItem.raw.toFixed(2)}`;
                }
              }
            }
          },
        }} /></>
  );
};

export default RevenueByCategoryChart;
