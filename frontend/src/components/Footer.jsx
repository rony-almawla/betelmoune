/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXing,
  FaLinkedinIn,
  FaMediumM,
  FaTiktok,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex justify-center space-x-6 mb-8 rtl:space-x-reverse">
          <a href="#" className="text-gray-400 hover:text-white">
            <FaFacebookF size={30} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaInstagram size={30} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaYoutube size={30} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaXing size={30} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaLinkedinIn size={30} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaMediumM size={30} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaTiktok size={30} />
          </a>
        </div>
        <div className="text-center mb-8">
          <h1 className="font-bold text-lg">{t('Bet Elmouneh')}</h1>
          <p className="text-gray-400">
            {t('Copyright')} © 2024 {t('Bet Elmouneh')}, Inc.
          </p>
        </div>
        <div className="flex justify-center space-x-6 rtl:space-x-reverse">
          <a href="#" className="text-gray-400 hover:text-white">
            {t('Legal Stuff')}
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            {t('Privacy Policy')}
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            {t('Security')}
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            {t('Website Accessibility')}
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            {t('Manage Cookies')}
          </a>
        </div>
      </div>
    </div>
  );
}
