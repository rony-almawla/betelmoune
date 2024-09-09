import axios from 'axios';

export const fetchSalesData = async () => {
  const { data } = await axios.get('/api/charts/sales-data');
  console.log(data)
  return data;
};

export const fetchUserData = async () => {
  const { data } = await axios.get('/api/charts/user-data');
  return data;
};

export const fetchWorkshopData = async () => {
  const { data } = await axios.get('/api/charts/workshop-data');
  return data;
};
