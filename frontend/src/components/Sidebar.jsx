import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 h-screen p-5">
      <div className="text-white text-2xl font-bold mb-5">Admin</div>
      <ul>
        <li className="mb-4">
          <Link
            to={`/adminDashboard`}
            className="text-gray-300 hover:text-white"
          >
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to={`/userList`} className="text-gray-300 hover:text-white">
            Users
          </Link>
        </li>
        <li className="mb-4">
          <Link to={`/productList`} className="text-gray-300 hover:text-white">
            Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to={`/workshopList`} className="text-gray-300 hover:text-white">
            Workshops
          </Link>
        </li>
        <li className="mb-4">
          <Link to={`/orderList`} className="text-gray-300 hover:text-white">
            Orders
          </Link>
        </li>
        {/* <li className="mb-4"><a href="#" className="text-gray-300 hover:text-white">Settings</a></li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
