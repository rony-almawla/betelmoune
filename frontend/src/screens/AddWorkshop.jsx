import React from 'react';
import { useTranslation } from 'react-i18next';

const AddWorkshop = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start justify-start min-h-screen bg-white-100 p-8 pl-32 ml-32">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-left">
          {t('Add a new workshop')}
        </h2>
        <form>
          <div className="flex flex-wrap mb-4">
            <div className="w-full lg:w-1/2 pr-2 mb-4">
              <label
                htmlFor="workshopName"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Workshop Name')}
              </label>
              <input
                type="text"
                id="workshopName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="w-full lg:w-1/2 pl-2 mb-4">
              <label
                htmlFor="price"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Price')}
              </label>
              <input
                type="number"
                min="0"
                id="price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full lg:w-1/2 pr-2 mb-4">
              <label
                htmlFor="slug"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Slug')}
              </label>
              <input
                type="text"
                id="slug"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="w-full lg:w-1/2 pl-2 mb-4">
              <label
                htmlFor="duration"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Duration')}
              </label>
              <input
                type="number"
                min="1"
                id="duration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="w-full lg:w-1/2 pl-2 mb-4">
              <label
                htmlFor="capacity"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Capacity')}
              </label>
              <input
                type="number"
                min="1"
                id="capacity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <div className="w-full lg:w-1/2 pl-2 mb-4">
              <label
                htmlFor="date"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Date')}
              </label>
              <input
                type="date"
                id="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full lg:w-1/2 pr-2 mb-4">
              <label
                htmlFor="uploadImage1"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Upload Image 1')}
              </label>
              <input
                type="file"
                id="uploadImage1"
                className="w-full text-gray-700"
                multiple
              />
            </div>
            <div className="w-full lg:w-1/2 pl-2 mb-4">
              <label
                htmlFor="uploadImage2"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Upload Image 2')}
              </label>
              <input
                type="file"
                id="uploadImage2"
                className="w-full text-gray-700"
                multiple
              />
            </div>
            <div className="w-full lg:w-1/2 pl-2 mb-4">
              <label
                htmlFor="uploadImage3"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Upload Image 3')}
              </label>
              <input
                type="file"
                id="uploadImage3"
                className="w-full text-gray-700"
                multiple
              />
            </div>
            <div className="w-full lg:w-1/2 pl-2 mb-4">
              <label
                htmlFor="uploadImage4"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Upload Image 4')}
              </label>
              <input
                type="file"
                id="uploadImage4"
                className="w-full text-gray-700"
                multiple
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2 text-left"
            >
              {t('Description')}
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              rows="4"
            ></textarea>
          </div>
          <p className="text-gray-500 text-sm mb-4 text-left">
            {t(
              "Note: Your workshop will be reviewed before it's published. This may take up to 24 hours."
            )}
          </p>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-700"
          >
            {t('Submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWorkshop;
