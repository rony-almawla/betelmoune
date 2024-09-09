/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Aboutus() {
  const { t } = useTranslation();

  return (
    <section id="about" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {t('About Our Agency')}
          </h2>
          <p className="mt-4 text-gray-600">
            {t('We take care to understand your business properly – its trajectory, potential and what makes it unique')}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8">
          <div className="lg:w-1/2">
            <img
              src="https://www.shutterstock.com/image-photo/bunch-fresh-avocados-ripening-on-600nw-648685177.jpg"
              alt={t('About Us Image')}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="text-left lg:w-1/2 mt-8 lg:mt-16">
            <p className="text-lg text-gray-700">
              {t('Deep is a creative design agency that helps brands to reach their full potential. You\'ll get to meet and work directly with the entire team working on your project.')}
            </p>
            <p className="mt-6 text-lg text-gray-700">
              {t('This collaborative approach creates deeper insight, informed creativity, a lasting relationship and proven commercial success.')}
            </p>
            <div className="flex items-center justify-center mt-12 lg:mr-24 rtl:space-x-reverse">
              <div className="mr-4">
                <button className="relative h-12 w-40 overflow-hidden border border-indigo-600 text-indigo-600 shadow-2xl transition-all duration-200 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-indigo-600 before:duration-300 before:ease-out hover:text-white hover:shadow-indigo-600 hover:before:h-40 hover:before:w-40 hover:before:opacity-80">
                  <Link to={'/products'}>
                    <span className="relative z-10">{t('Show products')}</span>
                  </Link>
                </button>
              </div>
              <div>
                <button className="relative h-12 w-40 overflow-hidden border border-green-500 bg-green-500 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-green-500 hover:before:-translate-x-40">
                  <Link to={'/workshops'}>
                    <span className="relative z-10">{t('Show workshops')}</span>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
