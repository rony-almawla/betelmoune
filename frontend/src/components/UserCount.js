import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../services/chartServices.js';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { t } from 'i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);


// Display Total Users
const UserCount = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      const { count } = await fetchUserData();
      setUserCount(count);
    };
    getUserData();
  }, []);

  return (
    <div>
      <h2>{t("Total Users")}: {userCount}</h2>
    </div>
  );
};

export default UserCount;
