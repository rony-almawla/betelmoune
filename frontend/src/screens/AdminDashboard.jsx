import React, { useEffect, useState } from 'react';
import SalesChart from '../components/SalesChart';
import UserCount from '../components/UserCount';
import RevenueChart from '../components/RevenueChart';
import ProductPerformanceChart from '../components/ProductPerformanceChart';
import UserDemographicsChart from '../components/UserDemographicsChart';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getError } from '../utils';
import WorkshopRegistrationsChart from '../components/WorkshopRegistrationsChart';
import WorkshopCompletionsChart from '../components/WorkshopCompletionsChart';

import { t } from 'i18next';
// import RevenueByCategoryChart from '../components/RevenueByCategoryChart';

const AdminDashboard = () => {
  const products = useSelector((state) => state.productsSlice.products);
  console.log('prrrrr0', products);
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const { data } = await axios.get('/api/workshops');
        setWorkshops(data);
      } catch (error) {
        console.log(getError(error));
      }
    };
    fetchWorkshops();
  }, []);
  return (
    <div className="min-h-screen p-6 mb-24 mt-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          {t('Admin Dashboard')}
        </h1>
        {/* <div className="text-sm text-gray-600">Welcome, Admin</div> */}
      </div>
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Row */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            {t('Total Users')}
          </h2>
          <UserCount />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            {t('Total Products')}
          </h2>
          <h2>
            {t('Total Products')}: {products.length}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            {t('Total Workshops')}
          </h2>
          <h2>
            {t('Total Workshops')}: {workshops?.length}
          </h2>
        </div>

        {/* Middle Row */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 h-80">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            {t('Revenues')}
          </h2>
          <RevenueChart />
        </div>

        {/* <div className="bg-white p-6 rounded-lg shadow-md col-span-1 h-80">
          <h2 className="text-lg font-medium text-gray-700 mb-4">User Growth</h2>
          <UserGrowthChart />
        </div> */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 h-80">

          <h2 className="text-lg font-medium text-gray-700 mb-4">
            {t('Workshop Registrations')}
          </h2>

          <WorkshopRegistrationsChart />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 h-80">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            {t('Products Performance')}
          </h2>
          <ProductPerformanceChart />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 h-80">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            {t('Sales Data')}
          </h2>
          <SalesChart />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 h-80">
          <UserDemographicsChart />
          {/* <RevenueByCategoryChart /> */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 h-80">

          <h2 className="text-lg font-medium text-gray-700 mb-4">
            {t('Workshop Completions')}
          </h2>

          <WorkshopCompletionsChart />
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
