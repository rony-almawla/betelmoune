import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { t } from 'i18next';

const WorkshopRegistrationsChart = () => {
  const [registrationData, setRegistrationData] = useState([]);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const { data } = await axios.get('api/charts/workshopRegistrations');
        setRegistrationData(data.data);
        console.log('dddddddddd', data);
      } catch (error) {
        console.log('Error fetching registration data:', error);
      }
    };
    fetchRegistrationData();
  }, []);

  const chartData = {
    labels: registrationData.map((data) => data.workshopName),
    datasets: [
      {
        label: t('Registrations'),
        data: registrationData.map((data) => data.registrations),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default WorkshopRegistrationsChart;
