import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addProductToCart, changeQuantity } from '../store/cartSlice';
import {
  decrementAvailableQuantity,
  fetchProductBySlug,
  resetAvailableState,
} from '../store/productsSlice';
import { Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

const ProductsDetails = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.authSlice.user);
  const selectedProduct = useSelector(
    (state) => state.productsSlice.selectedProduct
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug({ slug }));
    }
  }, [dispatch, slug]);

  const [quantity, setQuantity] = useState(1);
  const [productExist, setProductExist] = useState({ quantity: 0 });
  const [productExistForQuantity, setProductExistForQuantity] = useState(null);
  const [changeQuantityData, setChangeQuantityData] = useState(null);

  const changingOfQuantity = (operator) => {
    if (operator === '+') {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const cart = useSelector((state) => state.authSlice.cart);
  const [isProductExist, setProductIsExist] = useState(false);
  const isAvailable = useSelector((state) => state.productsSlice.isAvailable);

  useEffect(() => {
    if (selectedProduct) {
      const { productId } = selectedProduct;

      for (let i = 0; i < cart.length; i++) {
        if (productId === cart[i].productId) {
          setProductIsExist(true);
          setProductExistForQuantity(cart[i]);
          break;
        }
        setProductExist({ quantity: 0 });
      }
    }
  }, [cart, isProductExist, selectedProduct]);

  const handleAddToCart = () => {
    if (user && !isProductExist) {
      const productData = {
        userId: user._id,
        productId: selectedProduct.productId,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: quantity,
        images: selectedProduct.images,
        description: selectedProduct.description,
        slug: selectedProduct.slug,
        type: 'product',
      };
      dispatch(decrementAvailableQuantity(productData));
      setProductExist(productData);
    } else if (user) {
      // Increament Quantity if Item Exist :

      // data for update quantity by available quantity of product
      const productDataForAvailable = {
        userId: user._id,
        productId: selectedProduct.productId,
        quantity: quantity,
      };

      const productDataForChangeQuantity = {
        userId: user._id,
        productId: selectedProduct.productId,
        quantity: productExistForQuantity.quantity + quantity,
      };
      dispatch(decrementAvailableQuantity(productDataForAvailable));
      setChangeQuantityData(productDataForChangeQuantity);
    }
  };

  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    if (isAvailable && productExist.quantity) {
      dispatch(addProductToCart(productExist));
      setProductExist({ quantity: 0 });
      setIsAddedToCart(true);
    } else if (isAvailable === undefined) {
      setPopUp(true);
    }
  }, [isAvailable, productExist, dispatch, selectedProduct, isAddedToCart]);

  useEffect(() => {
    if (isAvailable && changeQuantityData) {
      dispatch(changeQuantity(changeQuantityData));
      setIsAddedToCart(true);
    } else if (isAvailable === undefined) {
      setPopUp(true);
    }
  }, [dispatch, isAvailable, changeQuantityData]);

  if (!selectedProduct) {
    return <div>{t('Loading...')}</div>;
  }

  return (
    <div
      className="flex flex-col wrap text-left mt-24 ml-32 mb-24"
      onLoad={() => dispatch(resetAvailableState())}
    >
      <div>
        <h3 className="text-3xl font-bold mb-4">{selectedProduct?.name}</h3>
      </div>
      <div className="text-gray-500 mb-4">{t('Capacity')}:</div>
      <div className="text-2xl font-bold mb-6">{selectedProduct?.price}$</div>
      <div className="grid grid-cols-5 gap-4 mb-6">
        {selectedProduct.images.map((img, index) => (
          <img
            key={index}
            className="w-full h-52 object-cover rounded-md"
            src={`/backend/${img.replace(/\\/g, '/')}`}
            alt={t('Product Image')}
          ></img>
        ))}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4">{t('Product Details')}</h3>
      </div>
      <div className="mb-8">
        <p className="text-gray-500">{selectedProduct?.description}</p>
      </div>
      <div className="flex items-center space-x-4 mr-72">
        <div className="ml-auto">
          <div className="flex items-center">
            <button
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l hover:bg-gray-300"
              onClick={() => changingOfQuantity('-')}
            >
              -
            </button>
            <span className="bg-white border border-gray-300 px-4 py-1">
              {quantity}
            </span>
            <button
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r hover:bg-gray-300"
              onClick={() => changingOfQuantity('+')}
            >
              +
            </button>
          </div>
        </div>
        {isAddedToCart ? (
          <button
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
            onClick={() => navigate('/cart')}
          >
            {t('View in cart')}
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => handleAddToCart()}
          >
            {t('Add to cart')}
          </button>
        )}
      </div>
      <Transition
        show={popUp}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
            <h2 className="text-2xl font-semibold text-red-600">
              {t('Item Not Available')}
            </h2>
            <p className="mt-4 text-gray-700">
              {t(
                "We're sorry, but this item Quantity is currently not available."
              )}
            </p>
            <button
              onClick={() => {
                setPopUp(false);
                setIsAddedToCart(false);
                dispatch(resetAvailableState());
              }}
              className="m-3 px-4 py-2 bg-red-600 hover:bg-red-400 text-white rounded"
            >
              {t('Close')}
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="m-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              {t('View Cart')}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default ProductsDetails;
