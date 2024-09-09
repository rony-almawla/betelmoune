import React, { useEffect, useState } from 'react';
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from '../store/productsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { t } from 'i18next';

const ProductList = () => {
  const products = useSelector((state) => state.productsSlice.products);

  const dispatch = useDispatch();
  const [editingProduct, setEditingProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    slug: '',
    quantity: '',
  });

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDeleteClick = (productId) => {
    const confirmDelete = window.confirm(
      t('Are you sure you want to delete this product?')
    );
    if (confirmDelete) {
      dispatch(deleteProduct(productId))
        .then(() => {
          dispatch(getProducts());
        })
        .catch((err) => {
          console.error('Failed to delete product:', err);
        });
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setFormValues({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      slug: product.slug,
      quantity: product.quantity,
    });
  };

  const handleSaveClick = () => {
    dispatch(updateProduct({ id: editingProduct, ...formValues }))
      .then(() => {
        dispatch(getProducts());
      })
      .catch((err) => {
        console.error('Failed to update product:', err);
      });
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Ensure that number inputs cannot be set to values less than 0
    const newValue = type === 'number' && value < 0 ? 0 : value;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? e.target.checked : newValue,
    });
  };

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-left text-4xl font-bold mb-6">{t('Products')}</h1>
      </header>

      <main className="p-6">
        <div className="mb-4">
          <Link to={`../addProduct`}>
            <button className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              {t('Create Product')}
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="py-2 px-4 text-start">{t('ID')}</th>
                <th className="py-2 px-4 text-start">{t('Name')}</th>
                <th className="py-2 px-4 text-start">{t('Price')}</th>
                <th className="py-2 px-4 text-start">{t('Category')}</th>
                <th className="py-2 px-4 text-start">{t('Description')}</th>
                <th className="py-2 px-4 text-start">{t('Slug')}</th>
                <th className="py-2 px-4 text-start">{t('Quantity')}</th>
                <th className="py-2 px-4 text-start">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="py-2 px-4 text-start">{product._id}</td>
                  <td className="py-2 px-4 text-start">
                    {editingProduct === product._id ? (
                      <input
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingProduct === product._id ? (
                      <input
                        type="number"
                        name="price"
                        value={formValues.price}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      `${product.price}$`
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingProduct === product._id ? (
                      <input
                        type="text"
                        name="category"
                        value={formValues.category}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      product.category
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingProduct === product._id ? (
                      <input
                        type="text"
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      product.description
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingProduct === product._id ? (
                      <input
                        type="text"
                        name="slug"
                        value={formValues.slug}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      product.slug
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingProduct === product._id ? (
                      <input
                        type="number"
                        name="quantity"
                        value={formValues.quantity}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      product.quantity
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingProduct === product._id ? (
                      <button
                        onClick={handleSaveClick}
                        className="text-green-500 hover:underline"
                      >
                        {t('Save')}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-500 hover:underline"
                        >
                          {t('Edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product._id)}
                          className="text-red-500 hover:underline"
                        >
                          {t('Delete')}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ProductList;
