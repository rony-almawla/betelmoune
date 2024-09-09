import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getError } from '../utils';
import { addWorkshopToCart } from '../store/cartSlice';
import { selectWorkshop } from '../store/workshopsSlice';
import ConfirmationPopup from '../components/ConfirmationPopup';

export default function WorkshopDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const [workshop, setWorkshop] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/workshops/slug/${params.slug}`);
        dispatch(selectWorkshop(data));
        setWorkshop(data);
      } catch (error) {
        console.log(getError(error));
      }
    };

    fetchData();
  }, [params.slug, dispatch]);

  const user = useSelector((state) => state.authSlice.user);
  const selectedWorkshop = useSelector(
    (state) => state.workshopsSlice.selectedWorkshop
  );

  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const cart = useSelector((state) => state.authSlice.cart);

  const handleAddToCart = () => {
    const isWorkshopInCart = cart.some(
      (item) =>
        item.workshopId === selectedWorkshop._id &&
        item.workshopId !== undefined
    );
    setIsAddedToCart(true);

    if (!isWorkshopInCart) {
      const workshopData = {
        userId: user._id,
        workshopId: selectedWorkshop._id,
        name: selectedWorkshop.name,
        price: selectedWorkshop.price,
        images: selectedWorkshop.images,
        description: selectedWorkshop.description,
        duration: selectedWorkshop.duration,
        date: selectedWorkshop.date,
        type: 'workshop',
      };
      dispatch(addWorkshopToCart(workshopData));
      saveToLocalStorage('cart', cart, 20);
    }
  };

  const saveToLocalStorage = (key, value, expirationInMinutes) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + expirationInMinutes * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const loadFromLocalStorage = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  useEffect(() => {
    loadFromLocalStorage('cart');
  }, []);

  const [showPopup, setShowPopup] = useState(false);

  const handleRegisterClick = () => {
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    setShowPopup(false);
    try {
      await axios.put(`/api/workshops/${workshop._id}/register`, {
        userId: user._id,
      });
      navigate(`/workshopContent/${workshop.slug}`);
    } catch (error) {
      console.log(getError(error));
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col wrap text-left mt-24 ml-32 mb-24">
      <div>
        <h3 className="text-3xl font-bold mb-4">{workshop?.name}</h3>
      </div>
      <div className="text-gray-500 mb-4">
        {t('Duration')}: <span className="font-semibold">{workshop?.duration}hr</span> {t('Capacity')}: <span className="font-semibold">{workshop?.capacity}</span>
      </div>
      <div className="text-2xl font-bold mb-6">{workshop?.price}${t('Price')}</div>
      <div className="grid grid-cols-5 gap-4 mb-6">
        {workshop?.images.map((image, index) => (
          <img
            key={index}
            className="w-full h-52 object-cover rounded-md"
            src={image}
            alt={`Workshop img ${index + 1}`}
          />
        ))}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4">{t('Workshop Details')}</h3>
      </div>
      <div className="mb-8">
        <p className="text-gray-500">{workshop?.description}</p>
      </div>
      <div className="flex justify-end space-x-4 mr-72">
        {isAddedToCart ? (
          <button
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
            onClick={() => navigate('/cart')}
          >
            {t('View in Cart')}
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleAddToCart}
          >
            {t('Add to Cart')}
          </button>
        )}
        <button
          className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-300"
          onClick={handleRegisterClick}
        >
          {t('Register')}
        </button>
      </div>

      {showPopup && (
        <ConfirmationPopup
          message={t('Are you sure you want to register for this workshop?')}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmLabel={t('Yes')}
          cancelLabel={t('No')}
        />
      )}
    </div>
  );
}
