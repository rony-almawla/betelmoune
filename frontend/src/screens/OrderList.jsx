import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteOrder,
  getOrders,
  updateDeliveryStatus,
} from '../store/ordersSlice';
import { t } from 'i18next';

const OrderList = () => {
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = useSelector((state) => state.ordersSlice.orders || []);
  const loading = useSelector((state) => state.ordersSlice.loading);
  const error = useSelector((state) => state.ordersSlice.error);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleDeleteClick = (orderId) => {
    const confirmDelete = window.confirm(
      t('Are you sure you want to delete this order?')
    );
    if (confirmDelete) {
      dispatch(deleteOrder(orderId))
        .then(() => {
          dispatch(getOrders());
        })
        .catch((err) => {
          console.error('Failed to delete order:', err);
        });
    }
  };

  const handleDeliverClick = (orderId) => {
    dispatch(updateDeliveryStatus(orderId))
      .then(() => {
        dispatch(getOrders());
      })
      .catch((err) => {
        console.error('Failed to update delivery status:', err);
      });
  };

  const handleDetailClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return <div className="text-center">{t('Loading...')}</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {t('Failed to load orders:')} {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="text-center">{t('No Orders Found')}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-left text-4xl font-bold mb-6">{t('Orders')}</h1>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="py-2 px-4 text-start">{t('ID')}</th>
              <th className="py-2 px-4 text-start">{t('Customer Name')}</th>
              <th className="py-2 px-4 text-start">{t('Payment Method')}</th>
              <th className="py-2 px-4 text-start">{t('Total Price')}</th>
              <th className="py-2 px-4 text-start">{t('Shipping Price')}</th>
              {/* <th className="py-2 px-4 text-start">{t('Is Paid')}</th>
              <th className="py-2 px-4 text-start">{t('Date of Paid')}</th> */}
              <th className="py-2 px-4 text-start">{t('Action')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 text-start">{order._id}</td>
                <td className="py-2 px-4 text-start">
                  {order.shippingAddress?.fullName || 'N/A'}
                </td>
                <td className="py-2 px-4 text-start">{order.paymentMethod}</td>
                <td className="py-2 px-4 text-start">{order.totalPrice}$</td>
                <td className="py-2 px-4 text-start">{order.shippingPrice}$</td>
                {/* <td className="py-2 px-4">{order.isPaid ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4">
                  {order.paidAt
                    ? new Date(order.paidAt).toLocaleDateString()
                    : '------------'}
                </td> */}
                <td className="py-2 px-4 text-start">
                  <button
                    className="text-green-500 hover:underline ml-2"
                    onClick={() => handleDetailClick(order)}
                  >
                    {t('Detail')}
                  </button>
                  <button
                    className="text-red-500 hover:underline ml-2"
                    onClick={() => handleDeleteClick(order._id)}
                  >
                    {t('Delete')}
                  </button>
                  <button
                    className={`text-blue-500 ml-2 ${
                      order.isDelivered
                        ? 'cursor-not-allowed text-gray-400'
                        : 'hover:underline'
                    }`}
                    onClick={() => handleDeliverClick(order._id)}
                    disabled={order.isDelivered}
                  >
                    {order.isDelivered
                      ? t('Delivered')
                      : t('Mark as Delivered')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-start">
              {t('Order Details')}
            </h2>
            <table className="min-w-full bg-gray-100 rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-start">{t('Product Name')}</th>
                  <th className="py-2 px-4 text-start">{t('Quantity')}</th>
                  <th className="py-2 px-4 text-start">{t('Price')}</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 text-start">{item.name}</td>
                    <td className="py-2 px-4 text-start">{item.quantity}</td>
                    <td className="py-2 px-4 text-start">{item.price}$</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4">
              <button
                className="text-red-500 hover:underline"
                onClick={handleCloseDetails}
              >
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
