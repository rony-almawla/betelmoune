import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../store/cartSlice';
import { getCart } from '../store/authSlice';
import PopupMessage from '../components/PopupMessage';
import PaymentPopup from '../components/PaymentPopup';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authSlice.user);
  const cart = useSelector((state) => state.authSlice.cart);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('OMT');
  const [showPopup, setShowPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false); // Add this state for payment submission loading

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (paymentMethod === 'OMT' || paymentMethod === 'Wish Money') {
      setShowPaymentPopup(true);
      setIsLoading(false);
    } else {
      handleOrderSubmission();
    }
  };

  const handlePaymentSubmit = async (details) => {
    setPaymentDetails(details);
    setIsPaymentLoading(true); // Show loading spinner when submitting payment
    await handleOrderSubmission(details);
    setIsPaymentLoading(false); // Hide loading spinner after submission
  };
  const handleOrderSubmission = async (details) => {
    const paymentInfo = details || paymentDetails;

    if (
      !paymentInfo &&
      (paymentMethod === 'OMT' || paymentMethod === 'Wish Money')
    ) {
      console.error('Payment details are missing');
      setIsLoading(false);
      return;
    }

    const orderData = {
      orderItems: cart.map((item) => ({
        slug: item.slug,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        product: item.productId,
      })),
      shippingAddress: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
      paymentMethod,
      shippingPrice: 20,
      totalPrice: cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      user: user._id,
      paymentDetails: paymentInfo,
    };

    try {
      // Save the order first
      const { data: orderResponse } = await axios.post(
        '/api/orders/save-order',
        orderData
      );

      // Dispatch actions and show popup
      dispatch(clearCart(user._id));
      dispatch(getCart([]));
      setShowPopup(true);

      // Send the email in the background
      await axios.post('/api/orders/send-email', {
        orderId: orderResponse.order._id,
        userId: user._id,
      });
    } catch (err) {
      console.error('Order submission or email sending failed', err);
    } finally {
      setIsLoading(false);
      setIsPaymentLoading(false); // Ensure loading is reset
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate('/cart');
  };

  return (
    <div>
      <div className="w-1/2 mx-auto p-4 mt-6 mb-12">
        <h1 className="text-2xl font-bold my-3">Shipping Address</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="OMT">OMT</option>
            <option value="Wish Money">Whish Money</option>
          </select>
          <div className="mb-3">
            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : 'Continue'}
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <PopupMessage
          message={{
            title: 'Order Confirmed',
            body: 'Your order has been placed successfully!',
            buttonText: 'OK',
          }}
          onClose={closePopup}
        />
      )}

      {showPaymentPopup && (
        <PaymentPopup
          method={paymentMethod}
          onSubmit={handlePaymentSubmit}
          onClose={() => setShowPaymentPopup(false)}
        >
          {isPaymentLoading && <LoadingSpinner />}{' '}
          {/* Show spinner during payment */}
        </PaymentPopup>
      )}
    </div>
  );
}
