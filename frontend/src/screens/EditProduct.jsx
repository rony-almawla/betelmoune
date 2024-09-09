import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const EditProduct = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const user = useSelector((state) => state.authSlice.user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/users/user/products/${user._id}`);
        setProducts(response.data);
      } catch (error) {
        console.error(t('Error fetching products:'), error);
      }
    };

    fetchProducts();
  }, [user._id, t]);

  const handleEditProduct = async (formData, productId) => {
    try {
      await axios.put(`/api/users/user/products/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Optionally, refresh the products list or handle success
      const response = await axios.get(`/api/users/user/products/${user._id}`);
      setProducts(response.data);
    } catch (error) {
      console.error(t('Error updating product:'), error);
    }
  };

  const logFormData = (formData) => {
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };
  
  const handleImageChange = async (e, productId) => {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('images', e.target.files[0]);
  
    // Log FormData entries
    logFormData(formData);
  
    await handleEditProduct(formData, productId);
  };

  return (
    <div className="flex items-start justify-start min-h-screen bg-white-100 p-4 pl-32 mb-24">
      <div className="bg-white p-8 rounded-lg w-3/4">
        <h2 className="text-2xl font-bold mb-6 text-left">{t('Edit product')}</h2>
        {products.map((product) => (
          <form
            className='mb-16'
            key={product.productId}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append('productId', product.productId);
              formData.append('name', e.target.productName.value);
              formData.append('price', e.target.price.value);
              formData.append('category', e.target.category.value);
              formData.append('description', e.target.description.value);
              formData.append('quantity', e.target.quantity.value);

              const files = e.target.images?.files;
              if (files) {
                for (let i = 0; i < files.length; i++) {
                  formData.append('images', files[i]);
                }
              }

              handleEditProduct(formData, product.productId);
            }}
            encType="multipart/form-data"
          >
            <h3 className="text-xl font-semibold mb-4 text-left">{t('Product details')}</h3>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label htmlFor="productName" className="block text-gray-700 font-bold mb-4 text-left">{t('Product name')}</label>
                <input
                  type="text"
                  id="productName"
                  defaultValue={product.name}
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                />
                <label htmlFor="price" className="block text-gray-700 font-bold mb-4 text-left mt-4">{t('Price')}</label>
                <input
                  type="number"
                  id="price"
                  defaultValue={product.price}
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                />
                <label htmlFor="category" className="block text-gray-700 font-bold mb-4 text-left mt-4">{t('Category')}</label>
                <input
                  type="text"
                  id="category"
                  defaultValue={product.category}
                  className="w-96 px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                />
                <label htmlFor="description" className="block text-gray-700 font-bold mb-4 text-left mt-4">{t('Description')}</label>
                <textarea
                  id="description"
                  defaultValue={product.description}
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  rows="4"
                ></textarea>
                <label htmlFor="quantity" className="block text-gray-700 font-bold mb-4 text-left mt-4">{t('Quantity')}</label>
                <input
                  type="number"
                  id="quantity"
                  defaultValue={product.quantity}
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
              <div className="flex-2">
                <h3 className="text-xl font-semibold mb-4 text-left">{t('Product images')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="group relative flex flex-col items-center">
                      <img
                        src={`/backend/${image.replace(/\\/g, '/')}`}
                        alt={`Product ${index}`}
                        className="w-full h-[200px] object-cover rounded-md mb-4"
                      />
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <label
                          htmlFor={`image-upload-${index}`}
                          className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        >
                          {t('Edit')}
                        </label>
                        <input
                          type="file"
                          id={`image-upload-${index}`}
                          name="images"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, product.productId)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-700"
            >
              {t('Save')}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
};

export default EditProduct;




// import React from 'react';

// const EditProduct = () => {
//   return (
//     <div className="flex items-start justify-start min-h-screen bg-white-100 p-4 pl-32">
//       <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
//         <h2 className="text-2xl font-bold mb-6 text-left">Edit product</h2>
//         <form>
//           <h3 className="text-xl font-semibold mb-4 text-left">
//             Product details
//           </h3>
//           <div className="mb-4 flex space-x-4">
//             <div className="flex-1">
//               <label
//                 htmlFor="productName"
//                 className="block text-gray-700 font-bold mb-4 text-left"
//               >
//                 Product name
//               </label>
//               <input
//                 type="text"
//                 id="productName"
//                 className="w-[500px] px-3 py-2 mb-24 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//               />
//               <label
//                 htmlFor="price"
//                 className="block text-gray-700 font-bold mb-4 text-left mt-4"
//               >
//                 Price
//               </label>
//               <input
//                 type="number"
//                 id="price"
//                 className="w-[500px] px-3 py-2 mb-24 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//               />
//               <label
//                 htmlFor="category"
//                 className="block text-gray-700 font-bold mb-4 text-left mt-4 m-"
//               >
//                 Category
//               </label>
//               <input
//                 type="text"
//                 id="category"
//                 className="w-[500px] px-3 py-2 mb-24 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//               />
//               <label
//                 htmlFor="description"
//                 className="block text-gray-700 font-bold mb-4 text-left mt-4"
//               >
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 className="w-[500px] px-3 py-2 mb-24 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 rows="4"
//               ></textarea>
//             </div>
//             <div className="flex-2">
//               <h3 className="text-xl font-semibold mb-4 text-left">
//                 Product images
//               </h3>
//               <div className="flex flex-wrap space-x-4">
//                 {[...Array(4)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="group relative flex flex-col items-center mb-4"
//                   >
//                     <img
//                       src="https://zaatarandzaytoun.com/wp-content/uploads/2020/06/makdous-18.jpg"
//                       alt="Product"
//                       className="w-[200px] h-[150px] rounded-md mb-4"
//                     />
//                     <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         type="button"
//                         className="bg-blue-500 text-white font-bold py-2 px-4 rounded m-2"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         type="button"
//                         className="bg-red-500 text-white font-bold py-2 px-4 rounded m-2"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                     {/* <input type="file" className="w-full text-gray-700 mb-4" /> */}
//                   </div>
//                 ))}
//               </div>
//               <div className="flex space-x-4 mt-4">
//                 <button
//                   type="button"
//                   className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring focus:border-red-700"
//                 >
//                   Delete product
//                 </button>
//                 <button
//                   type="button"
//                   className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:ring focus:border-gray-700"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-700"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProduct;

