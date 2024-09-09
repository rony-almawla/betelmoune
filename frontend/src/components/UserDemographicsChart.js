import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { t } from 'i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UserDemographicsChart = () => {
  const [demographics, setDemographics] = useState({
    ageGroups: [],
    genderDistribution: [],
    locationDistribution: []
  });

  useEffect(() => {
    const fetchDemographicsData = async () => {
      try {
        const { data } = await axios.get('/api/charts/user-demographics');
        setDemographics(data[0]); // Assuming the response is an array with one object
      } catch (error) {
        console.error('Error fetching user demographics data:', error);
      }
    };

    fetchDemographicsData();
  }, []);

  const ageGroupData = {
    labels: demographics.ageGroups.map(group => `${group._id}`),
    datasets: [
      {
        label: t('Users'),
        data: demographics.ageGroups.map(group => group.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ],
  };

  const genderData = {
    labels: demographics.genderDistribution.map(group => group._id),
    datasets: [
      {
        label: t('Users'),
        data: demographics.genderDistribution.map(group => group.count),
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
      }
    ],
  };

  const locationData = {
    labels: demographics.locationDistribution.map(group => group._id),
    datasets: [
      {
        label: t('Users'),
        data: demographics.locationDistribution.map(group => group.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ],
  };

  return (
    // <div className="bg-white p-4 rounded-lg shadow-md">
    //   <h2 className="text-lg font-medium text-gray-700 mb-4">User Demographics</h2>
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    //     <div className="flex flex-col items-center">
    //       <h3 className="text-md font-medium text-gray-600 mb-2">Age Groups</h3>
    //       <div className="w-full h-64 max-w-md">
    //         <Bar data={ageGroupData} options={{
    //           responsive: true,
    //           maintainAspectRatio: false,
    //           plugins: {
    //             legend: {
    //               position: 'top',
    //             },
    //             tooltip: {
    //               callbacks: {
    //                 label: function(tooltipItem) {
    //                   return `Users: ${tooltipItem.raw}`;
    //                 }
    //               }
    //             }
    //           },
    //         }} />
    //       </div>
    //     </div>

    //     <div className="flex flex-col items-center">
    //       <h3 className="text-md font-medium text-gray-600 mb-2">Gender Distribution</h3>
    //       <div className="w-full h-64 max-w-md">
    //         <Pie data={genderData} options={{
    //           responsive: true,
    //           maintainAspectRatio: false,
    //           plugins: {
    //             legend: {
    //               position: 'top',
    //             },
    //             tooltip: {
    //               callbacks: {
    //                 label: function(tooltipItem) {
    //                   return `${tooltipItem.label}: ${tooltipItem.raw}`;
    //                 }
    //               }
    //             }
    //           },
    //         }} />
    //       </div>
    //     </div>

    //     <div className="flex flex-col items-center">
    //       <h3 className="text-md font-medium text-gray-600 mb-2">Location Distribution</h3>
    //       <div className="w-full h-64 max-w-md">
    //         <Bar data={locationData} options={{
    //           responsive: true,
    //           maintainAspectRatio: false,
    //           plugins: {
    //             legend: {
    //               position: 'top',
    //             },
    //             tooltip: {
    //               callbacks: {
    //                 label: function(tooltipItem) {
    //                   return `Users: ${tooltipItem.raw}`;
    //                 }
    //               }
    //             }
    //           },
    //         }} />
    //       </div>
    //     </div>
    //   </div>
    // </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div className="flex flex-col items-center">
          <h3 className="text-md font-medium text-gray-600 mb-2">{t("Age Groups")}</h3>
          <div className="w-full h-64 max-w-md">
            <Bar data={ageGroupData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function(tooltipItem) {
                      return `Users: ${tooltipItem.raw}`;
                    }
                  }
                }
              },
            }} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-md font-medium text-gray-600 mb-2">{t("Gender Distribution")}</h3>
          <div className="w-full h-64 max-w-md">
            <Pie data={genderData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function(tooltipItem) {
                      return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    }
                  }
                }
              },
            }} />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-md font-medium text-gray-600 mb-2">{t("Location")}</h3>
          <div className="w-full h-64 max-w-md">
            <Bar data={locationData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: function(tooltipItem) {
                      return `Users: ${tooltipItem.raw}`;
                    }
                  }
                }
              },
            }} />
          </div>
        </div>
    </div>
  );
};

export default UserDemographicsChart;
