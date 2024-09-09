import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { t } from 'i18next';

import { AiOutlineClose } from 'react-icons/ai';

const ImageModal = ({ images, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <AiOutlineClose className="h-6 w-6 mb-4" />
        </button>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {images.map((image, index) => (
            <img
              key={index}
              src={`/backend/${image.replace(/\\/g, '/')}`}
              alt={`Product ${index}`}
              className="w-full h-auto object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RequestProducts = () => {
  const [requestProducts, setRequestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchRequestProducts = async () => {
      try {
        console.log('llllllllllllllll');
        const response = await axios.get('/api/requestProducts');
        console.log('ressss', response.data);
        setRequestProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load requested products');
        setLoading(false);
      }
    };

    fetchRequestProducts();
  }, []);

  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = requestProducts.map((product) => product.user);
      const userDetails = {};

      // Fetch user details for each userId
      await Promise.all(
        userIds.map(async (userId) => {
          try {
            const response = await axios.get(`/api/users/${userId}`);
            userDetails[userId] =
              response.data.firstName + ' ' + response.data.lastName;
          } catch (err) {
            console.error('Failed to fetch user details:', err);
          }
        })
      );

      setUserNames(userDetails);
    };

    if (requestProducts.length > 0) {
      fetchUserNames();
    }
  }, [requestProducts]);

  const handleAdmitClick = async (productId, userId) => {
    try {
      await axios.put(`/api/requestProducts/${productId}/admit`, { userId });
      setRequestProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (err) {
      console.error('Failed to admit product:', err);
    }
  };

  const handleRejectClick = async (productId, userId) => {
    try {
      // Delete the product first

      await axios.delete(`/api/requestProducts/${productId}`);
      setRequestProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );

      // Send email notification after deletion
      await axios.post(
        `/api/requestProducts/send-email/${userId}/${productId}`
      );
    } catch (err) {
      console.error('Failed to reject product or send email:', err);
    }
  };

  const handleShowImagesClick = (images) => {
    setSelectedImages(images);
    setModalOpen(true);
  };

  if (loading) {
    return <div className="text-center">{t('Loading')}...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (requestProducts.length === 0) {
    return (
      <div className="text-center">{t('No request to add products found')}</div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-left text-4xl font-bold mb-6">
          {t('Requested Products')}
        </h1>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="py-3 px-6 text-start">{t('Product Name')}</th>
              <th className="py-3 px-6 text-start">{t('Price')}</th>
              <th className="py-3 px-6 text-start">{t('Category')}</th>
              <th className="py-3 px-6 text-start">{t('Quantity')}</th>
              <th className="py-3 px-6 text-start">{t('User Name')}</th>
              <th className="py-3 px-6 text-start">{t('Action')}</th>
            </tr>
          </thead>
          <tbody>
            {requestProducts.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="py-3 px-6 text-start">{product.name}</td>
                <td className="py-3 px-6 text-start">{product.price}$</td>
                <td className="py-3 px-6 text-start">{product.category}</td>
                <td className="py-3 px-6 text-start">{product.quantity}</td>
                <td className="py-3 px-6 text-start">
                  {userNames[product.user]
                    ? userNames[product.user]
                    : 'Loading...'}
                </td>
                <td className="py-3 px-6 text-start">
                  <button
                    onClick={() => handleAdmitClick(product._id, product.user)}
                    className="text-green-500 hover:underline"
                  >
                    {t('Admit')}
                  </button>
                  <button
                    onClick={() => handleRejectClick(product._id, product.user)}
                    className="text-red-500 hover:underline ml-4"
                  >
                    {t('Reject')}
                  </button>
                  <button
                    onClick={() => handleShowImagesClick(product.images)}
                    className="text-blue-500 hover:underline ml-4"
                  >
                    {t('Show Images')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={selectedImages}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default RequestProducts;
