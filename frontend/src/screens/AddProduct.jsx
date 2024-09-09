import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PopupMessage from '../components/PopupMessage'; // Import the PopupMessage component

const AddProduct = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.authSlice.user);

  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    category: '',
    quantity: '',
    description: '',
    images: [],
  });

  const [popup, setPopup] = useState({
    isOpen: false,
    message: { title: '', body: '', buttonText: '' },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      images: [...formData.images, ...e.target.files],
    });
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      price: '',
      category: '',
      quantity: '',
      description: '',
      images: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('productName', formData.productName);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('quantity', formData.quantity);
    data.append('description', formData.description);
    formData.images.forEach((image) => {
      data.append('images', image);
    });

    try {
      await axios.post(`/api/requestProducts/addProduct/${user._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      // Open success popup
      setPopup({
        isOpen: true,
        message: {
          title: t('Success'),
          body: t('Product submitted for review successfully'),
          buttonText: t('Close'),
        },
      });

      // Reset form fields
      resetForm();
    } catch (error) {
      // Open error popup
      setPopup({
        isOpen: true,
        message: {
          title: t('Error'),
          body: t('Error submitting the product'),
          buttonText: t('Close'),
        },
      });
      console.error('Error submitting the product', error);

    }
  };

  const closePopup = () => {
    setPopup({ isOpen: false, message: { title: '', body: '', buttonText: '' } });
  };

  return (
    <div className="flex items-start justify-start min-h-screen bg-white-100 p-8 pl-32 ml-32">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-left">
          {t('Add a new product')}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap mb-4">
            <div className="w-full lg:w-1/2 pr-2 mb-4">
              <label
                htmlFor="productName"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Product Name')}
              </label>
              <input
                type="text"
                id="productName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                value={formData.productName}
                onChange={handleChange}
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
                id="price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full lg:w-1/2 pr-2 mb-4">
              <label
                htmlFor="category"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Category')}
              </label>
              <input
                type="text"
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="w-full lg:w-1/2 pl-2 mb-4">
              <label
                htmlFor="quantity"
                className="block text-gray-700 font-bold mb-2 text-left"
              >
                {t('Quantity')}
              </label>
              <input
                type="number"
                id="quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap mb-4">
            {/* Upload Image Fields */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full lg:w-1/2 pr-2 mb-4">
                <label
                  htmlFor={`uploadImage${i}`}
                  className="block text-gray-700 font-bold mb-2 text-left"
                >
                  {t(`Upload Image ${i}`)}
                </label>
                <input
                  type="file"
                  id={`uploadImage${i}`}
                  className="w-full text-gray-700"
                  onChange={handleFileChange}
                  multiple
                />
              </div>
            ))}
          </div>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2 text-left"
            >
              {t('Description')}
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              value={formData.description}
              onChange={handleChange}
              rows="4"

            ></textarea>
          </div>
          <p className="text-gray-500 text-sm mb-4 text-left">
            {t(
              "Note: Your product will be reviewed before it's published. This may take up to 24 hours."
            )}
          </p>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            {t('Submit for Review')}
          </button>
        </form>

        {popup.isOpen && (
          <PopupMessage message={popup.message} onClose={closePopup} />
        )}
      </div>
    </div>
  );
};

export default AddProduct;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { useTranslation } from 'react-i18next';

// const AddProduct = () => {
//   const { t } = useTranslation();
//   const user = useSelector((state) => state.authSlice.user);

//   const [formData, setFormData] = useState({
//     productName: '',
//     price: '',
//     category: '',
//     quantity: '',
//     description: '',
//     images: [],
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       images: [...formData.images, ...e.target.files],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     data.append('productName', formData.productName);
//     data.append('price', formData.price);
//     data.append('category', formData.category);
//     data.append('quantity', formData.quantity);
//     data.append('description', formData.description);
//     formData.images.forEach((image) => {
//       data.append('images', image);
//     });

//     try {
//       await axios.post(`/api/products/addProduct/${user._id}`, data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // Handle success - maybe a redirect or notification
//     } catch (error) {
//       console.error(t('Error uploading the product'), error);
//     }
//   };

//   return (
//     <div className="flex items-start justify-start min-h-screen bg-white-100 p-8 pl-32 ml-32">
//       <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
//         <h2 className="text-2xl font-bold mb-6 text-left">{t('Add a new product')}</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="flex flex-wrap mb-4">
//             <div className="w-full lg:w-1/2 pr-2 mb-4">
//               <label
//                 htmlFor="productName"
//                 className="block text-gray-700 font-bold mb-2 text-left"
//               >
//                 {t('Product Name')}
//               </label>
//               <input
//                 type="text"
//                 id="productName"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 value={formData.productName}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="w-full lg:w-1/2 pl-2 mb-4">
//               <label
//                 htmlFor="price"
//                 className="block text-gray-700 font-bold mb-2 text-left"
//               >
//                 {t('Price')}
//               </label>
//               <input
//                 type="number"
//                 id="price"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 value={formData.price}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//           <div className="flex flex-wrap mb-4">
//             <div className="w-full lg:w-1/2 pr-2 mb-4">
//               <label
//                 htmlFor="category"
//                 className="block text-gray-700 font-bold mb-2 text-left"
//               >
//                 {t('Category')}
//               </label>
//               <input
//                 type="text"
//                 id="category"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 value={formData.category}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="w-full lg:w-1/2 pl-2 mb-4">
//               <label
//                 htmlFor="quantity"
//                 className="block text-gray-700 font-bold mb-2 text-left"
//               >
//                 {t('Quantity')}
//               </label>
//               <input
//                 type="number"
//                 id="quantity"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 value={formData.quantity}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//           <div className="flex flex-wrap mb-4">
//             <div className="w-full lg:w-1/2 pr-2 mb-4">
//               <label
//                 htmlFor="uploadImage1"
//                 className="block text-gray-700 font-bold mb-2 text-left"
//               >
//                 {t('Upload Image 1')}
//               </label>
//               <input
//                 type="file"
//                 id="uploadImage1"
//                 className="w-full text-gray-700"
//                 onChange={handleFileChange}
//                 multiple
//               />
//             </div>
//             <div className="w-full lg:w-1/2 pl-2 mb-4">
//               <label
//                 htmlFor="uploadImage2"
//                 className="block text-gray-700 font-bold mb-2 text-left"
//               >
//                 {t('Upload Image 2')}
//               </label>
//               <input
//                 type="file"
//                 id="uploadImage2"
//                 className="w-full text-gray-700"
//                 onChange={handleFileChange}
//                 multiple
//               />
//             </div>
//             <div className="w-full lg:w-1/2 pl-2 mb-4">
//               <label
//                 htmlFor="uploadImage3"
//                 className="block text-gray-700 font-bold mb-2 text-left"
//               >
//                 {t('Upload Image 3')}
//               </label>
//               <input
//                 type="file"
//                 id="uploadImage3"
//                 className="w-full text-gray-700"
//                 onChange={handleFileChange}
//                 multiple
//               />
//             </div>
//             <div className="w-full lg:w-1/2 pl-2 mb-4">
//               <label
//                 htmlFor="uploadImage4"
//                 className="block text-gray-700 font-bold mb-2 text-left"
//               >
//                 {t('Upload Image 4')}
//               </label>
//               <input
//                 type="file"
//                 id="uploadImage4"
//                 className="w-full text-gray-700"
//                 onChange={handleFileChange}
//                 multiple
//               />
//             </div>
//           </div>
//           <div className="mb-4">
//             <label
//               htmlFor="description"
//               className="block text-gray-700 font-bold mb-2 text-left"
//             >
//               {t('Description')}
//             </label>
//             <textarea
//               id="description"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//               rows="4"
//               value={formData.description}
//               onChange={handleChange}
//             ></textarea>
//           </div>
//           <p className="text-gray-500 text-sm mb-4 text-left">
//             {t('Note: Your product will be reviewed before it\'s published. This may take up to 24 hours.')}
//           </p>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-700"
//           >
//             {t('Submit for review')}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;
