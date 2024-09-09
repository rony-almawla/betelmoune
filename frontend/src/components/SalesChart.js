import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchSalesData } from '../services/chartServices.js';

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
import axios from 'axios';
import { t } from 'i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Display Daily Sales
const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const getSalesData = async () => {
      const { data } = await axios.get('/api/charts/sales-data');
      console.log('data sales::' , data)
      setSalesData(data);
    };
    getSalesData();
  }, []);

  console.log('sss',salesData)

  const data = {
    labels: salesData?.map((item) => item._id), // Use date as label
    datasets: [
      {
        label: t('Total Sales'),
        data: salesData?.map((item) => item.totalSales),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={data} />;
};

export default SalesChart;
