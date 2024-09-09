import React, { useState } from 'react';
import axios from 'axios';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Contactus() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    const body = {
      firstName,
      lastName,
      email,
      message,
    };

    try {
      const { data } = await axios.post('/api/messages', body);

      console.log('datasss', data);

      toast.success(t('Message sent successfully!'));
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');

      navigate('/');

    } catch (error) {
      toast.error(t('Error sending message.'));
      console.log(getError(error));
    }
  };

  return (
    <section id="contact">
      <div className="flex justify-center items-center py-24 bg-gray-100">
        <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="w-full md:w-1/2 p-8 space-y-12">
            <h2 className="text-2xl font-semibold mb-6">
              {t('Get in touch with us')}
            </h2>
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM20 18H4V8h16v10zM6 10h8v2H6v-2zm0 4h8v2H6v-2zm0 4h8v2H6v-2zm10 0h4v2h-4v-2z"></path>
              </svg>
              <a
                href="mailto:mhamad_jomaa@outlook.com"
                className="text-gray-700"
              >
                {t('Contact Email')}: mhamad_jomaa@outlook.com
              </a>
            </div>
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.62 10.79a15.72 15.72 0 006.59 6.59l2.2-2.2a1 1 0 011.17-.24c1.26.5 2.6.78 3.99.78a1 1 0 011 1V19a1 1 0 01-1 1C7.91 20 4 16.09 4 11a1 1 0 011-1h2.01a1 1 0 011 .79z"></path>
              </svg>
              <a href="tel:(916) 70583380" className="text-gray-700">
                {t('Contact Phone')}: (916) 70583380
              </a>
            </div>
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.1 2 5 5.1 5 9c0 6.1 7 13 7 13s7-6.9 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"></path>
              </svg>
              <p className="text-gray-700 mr-20 mt-4">
                {t('Contact Address')}: 500 Office Center Drive, Suite 400, Fort Washington, PA 19034
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-8 bg-gray-50">
            <form className="space-y-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('First Name')}
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('Last Name')}
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('Email (privacy policy)')}<span className="text-red-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('Message')}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  id="message"
                  name="message"
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <button
                  onClick={sendMessage}
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('Send')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
