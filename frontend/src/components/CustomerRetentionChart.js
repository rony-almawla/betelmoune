import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { t } from 'i18next';

const CustomerRetentionChart = () => {
  const [retentionData, setRetentionData] = useState([]);

  useEffect(() => {
    const fetchRetentionData = async () => {
      try {
        const { data } = await axios.get('/api/charts/customer-retention');
        setRetentionData(data);
      } catch (error) {
        console.error('Error fetching customer retention data:', error);
      }
    };
    fetchRetentionData();
  }, []);

  const chartData = {
    labels: retentionData?.map(item => `Month ${item.month}`),
    datasets: [
      {
        label: t('Customer Retention Rate'),
        data: retentionData.map(item => item.retentionRate * 100),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default CustomerRetentionChart;
