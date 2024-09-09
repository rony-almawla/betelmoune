import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import {
  changeQuantity,
  deleteFromCart,
  fetchCart,
  ReturnQuantity,
} from '../store/cartSlice';
import {
  decrementAvailableQuantity,
  selectProduct,
} from '../store/productsSlice';

const Cart = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.authSlice.user);
  const cart = useSelector((state) => state.authSlice.cart);
  const products = useSelector((state) => state.productsSlice.products);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch Cart

  useEffect(() => {
    dispatch(fetchCart(user._id));
  }, [dispatch, user]);

  // Change Quantity of Product
  const isAvailable = useSelector((state) => state.productsSlice.isAvailable);
  const [changedQuantityData, setChangedQuantityData] = useState(false);

  const quantityHandler = (product, operator) => {
    if (operator === '-') {
      const productData = {
        userId: user._id,
        productId: product.productId,
        quantity: product.quantity - 1,
      };
      dispatch(changeQuantity(productData));

      // Increment Available Quantity
      const incrementProductData = {
        userId: user._id,
        itemId: product.productId,
        quantity: 1,
      };
      dispatch(ReturnQuantity(incrementProductData));
    } else {
      const productData = {
        userId: user._id,
        productId: product.productId,
        quantity: product.quantity + 1,
      };
      setChangedQuantityData(productData);

      // Decrement Available Quantity
      const decrementProductData = {
        userId: user._id,
        productId: product.productId,
        quantity: 1,
      };
      dispatch(decrementAvailableQuantity(decrementProductData));
    }
  };

  useEffect(() => {
    if (changedQuantityData && isAvailable !== 1 && isAvailable !== undefined) {
      dispatch(changeQuantity(changedQuantityData));
    }
  }, [dispatch, isAvailable, changedQuantityData]);

  // Delete Item from Cart

  const deleteHandler = (itemId, type, quantity) => {
    const itemData =
      type === 'product'
        ? {
            userId: user._id,
            itemId: itemId,
            quantity: quantity,
            type: type,
          }
        : {
            userId: user._id,
            itemId: itemId,
            type: type,
          };

    dispatch(deleteFromCart(itemData));
    dispatch(ReturnQuantity(itemData));
  };

  // Update quantity data if necessary
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (changedQuantityData && isAvailable !== 1) {
      dispatch(changeQuantity(changedQuantityData));
    }
  }, [dispatch, isAvailable, changedQuantityData]);

  const totalPrice = cart?.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log('cart::', cart);
  }, [cart]);

  const checkOutHandler = () => {
    navigate('/shippingAddress');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {t('Your Cart')}
      </h2>
      <div className="space-y-6">
        {cart?.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between relative ${
              item.type === 'product' ? 'bg-green-200' : 'bg-green-300'
            } p-4 rounded-lg transition-all hover:shadow-md hover:bg-green-400`}
          >
            <div
              className="w-[90%] flex items-center space-x-4"
              onClick={() => {
                dispatch(selectProduct(item));
                item.type === 'product'
                  ? navigate(`/products/${item.slug}`)
                  : navigate(`/workshop/${item.slug}`);
              }}
            >
              <img
                src={`/backend/${item.images[0].replace(/\\/g, '/')}`}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-sm text-left text-gray-500 italic">
                  {item.type === 'product' ? t('Product') : t('Workshop')}
                </p>
                <p className="text-base text-left font-semibold text-gray-700">
                  ${item.price}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {item.type === 'product' ? (
                <>
                  <button
                    className="bg-gray-300 text-gray-700 text-xl px-4 rounded-md hover:bg-gray-400 transition"
                    onClick={() => quantityHandler(item, '-')}
                  >
                    -
                  </button>
                  <span className="text-lg font-medium text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    className="bg-gray-300 text-gray-700 text-xl px-4 rounded-md hover:bg-gray-400 transition"
                    onClick={() => quantityHandler(item, '+')}
                  >
                    +
                  </button>
                </>
              ) : null}
            </div>
            <button
              className="absolute bg-red-400 text-black-600 p-2 rounded-full hover:bg-red-300 transition"
              style={{ top: '-8%', right: '-10px' }}
              onClick={() =>
                item.type === 'product'
                  ? deleteHandler(item.productId, item.type, item.quantity)
                  : deleteHandler(item.workshopId, item.type)
              }
            >
              <IoClose />
            </button>
          </div>
        ))}
      </div>

      {/* Total Price Div */}
      {cart?.length !== 0 ? (
        <div className="mt-6">
          <div className="flex items-center justify-center text-xl font-semibold text-gray-800 mb-4">
            <span>{t('Total Price:')}</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={checkOutHandler}
              className="w-1/4 bg-red-500 text-white py-3 rounded-lg text-center hover:bg-red-600 transition"
            >
              {t('Checkout')}
            </button>
          </div>
        </div>
      ) : (
        <p>{t("You Don't have any Items in Cart")}</p>
      )}

      {user !== null ? (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {t('You May Also Like')}
          </h3>
          <div className="flex space-x-4">
            {products.slice(0, 3).map((product, index) => (
              <div
                key={index}
                className="bg-white border cursor-pointer rounded-lg p-4 shadow-md w-1/3"
                onClick={() => {
                  dispatch(selectProduct(product));
                  navigate(`/products/${product.slug}`);
                }}
              >
                <img
                  src={`/backend/${product.images[0].replace(/\\/g, '/')}`}
                  alt={product.name}
                  className="w-full h-32 rounded-lg object-cover mb-4"
                />
                <h4 className="text-lg font-medium text-gray-800">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-600">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Cart;
