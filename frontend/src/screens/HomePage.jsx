import React, { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import Aboutus from '../components/Aboutus';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, selectProduct } from '../store/productsSlice';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Contactus from '../components/Contactus';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
  const [workshops, setWorkshops] = useState([]);

  const products = useSelector((state) => state.productsSlice.products);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      const { data } = await axios.get('/api/workshops');
      setWorkshops(data);
    };

    fetchWorkshops();
  }, []);

  return (
    <div>
      <div className="relative">
        <img
          src="https://www.thespruceeats.com/thmb/jQ6j_SRd4WodhxgAyvU9k-vVjiA=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/sandra-ivany-57eec6365f9b586c357c5eca.jpg"
          alt="images"
          className="w-full h-[650px]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
          <h1 className="text-4xl font-bold mb-4 text-center">
            {t('Find everything you need to make the perfect meal')}
          </h1>
          <div className="flex bg-white text-gray-800 p-2 rounded-lg">
            <CiSearch className="mr-2 mt-3" />
            <input
              type="text"
              placeholder={t('Search for products')}
              className="px-4 py-2 border-none rounded-l-lg focus:outline-none"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">
              {t('Search')}
            </button>
          </div>
        </div>
      </div>
      <Aboutus />
      <div className="container mx-auto p-16">
        <h2 className="text-3xl font-bold mb-8">{t('Daily Deals')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product?.productId}
              className="pb-4 bg-white rounded-lg shadow-md overflow-hidden relative group"
              onClick={() => {
                dispatch(selectProduct(product));
                navigate(`/products/${product.slug}`);
              }}
            >
              <img
                src={`/backend/${product?.images[0]?.replace(/\\/g, '/')}`}
                alt={product?.name}
                className="w-full h-48 object-cover cursor-pointer"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-600">
                  {t('Price')}: {product.price}
                </p>
                <button className="bg-green-500 text-white mt-6 py-1 px-3 rounded">
                  {t('Show product')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto p-4 pl-16 pr-16 mt-16 mb-16">
        <h1 className="text-center text-2xl font-bold mb-8">
          {t('#SOME_WORKSHOPS')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 cursor-pointer">
          {workshops?.slice(0, 8).map((workshop, index) => (
            <div key={index} className="relative group">
              <Link to={`/workshop/${workshop.slug}`}>
                <img
                  src={workshop?.images[1]}
                  alt={`Gallery ${index}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <p className="text-white text-center px-4">
                    {workshop.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Contactus />
    </div>
  );
}
