import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { t } from 'i18next';

const ProductPerformanceChart = () => {
  const [productPerformanceData, setProductPerformanceData] = useState([]);

  useEffect(() => {
    const fetchProductPerformanceData = async () => {
      const { data } = await axios.get('/api/charts/productPerformance');
      setProductPerformanceData(data.data);
    };
    fetchProductPerformanceData();
  }, []);

  const chartData = {
    labels: productPerformanceData.map(data => data.productName),
    datasets: [
      {
        label: t('Sales'),
        data: productPerformanceData.map(data => data.sales),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default ProductPerformanceChart;
