import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { t } from 'i18next';

const WorkshopCompletionsChart = () => {
  const [completionData, setCompletionData] = useState([]);

  useEffect(() => {
    const fetchCompletionData = async () => {
      try {
        const { data } = await axios.get('/api/charts/workshopCompletions');
        setCompletionData(data.data);
      } catch (error) {
        console.log('Error fetching completion data:', error);
      }
    };
    fetchCompletionData();
  }, []);

  const chartData = {
    labels: completionData.map((data) => data.workshopName),
    datasets: [
      {
        label: t('Completions'),
        data: completionData.map((data) => data.completions),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default WorkshopCompletionsChart;
