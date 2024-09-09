import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link ,Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import NavBarPlus from './components/NavBarPlus';
import Profile from './screens/Profile';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n'; // Import i18n configuration
import { ToastContainer } from 'react-toastify';
import {} from './App.css';
import Error404 from './screens/Error404';

// import Footer from './components/Footer'; // Uncomment if you want to use the Footer

import ProductsDetails from './screens/ProductDetails';
import WorkshopDetails from './screens/WorkshopDetails';
import AddProduct from './screens/AddProduct';
import EditProduct from './screens/EditProduct';
import Footer from './components/Footer';
import Cart from './screens/Cart';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import WorkshopContent from './screens/WorkshopContent';
import UserList from './screens/UserList';
import ProductList from './screens/ProductList';
import WorkshopList from './screens/WorkshopList';
import OrderList from './screens/OrderList';
import AdminDashboard from './screens/AdminDashboard';

import ChatGroup from './screens/ChatGroup';
// import Sidebar from './components/Sidebar';

import MyWorkshops from './screens/MyWorkshops';
import { FaLanguage } from 'react-icons/fa';
import { FaRobot } from 'react-icons/fa'; // Import chatbot icon
import { MdArrowDropDown } from 'react-icons/md';
import ChatBotComponent from './components/chatbot/ChatBot';
import 'react-chatbot-kit/build/main.css';
import { useDispatch } from 'react-redux';
import { logIn } from './store/authSlice';
import RequestProducts from './screens/RequestProducts';
import { useAuthContext } from './context/useAuthContext';
import AddWorkshop from './screens/AddWorkshop';
import Error403 from './screens/Error403';
import isLoading from './screens/isLoading';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe('pk_test_51PplmXP39Su2d6yxkGOZ9RBVTrJhS6l01P0KITPwOoS8xLPQMKquVvv21ODrDWAJ7ER44vnuyGwI0aNXM2O3ia2600jlhIoT3D');

// Lazy load components
const HomePage = lazy(() => import('./screens/HomePage'));
const SignIn = lazy(() => import('./screens/Signin'));
const SignUp = lazy(() => import('./screens/Signup'));
const Products = lazy(() => import('./screens/Products'));
const Workshops = lazy(() => import('./screens/Workshops'));

function App() {
  const { t } = useTranslation(); // Hook for translation
  const { i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatBotOpen, setChatBotOpen] = useState(false); // State for chatbot visibility
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const userInfoString = localStorage.getItem('userInfo');
      if (userInfoString) {
        // Check if userInfoString is a valid JSON string
        const userInfo = JSON.parse(userInfoString);

        // Validate the structure of userInfo if necessary
        if (userInfo && userInfo.token) {
          dispatch(logIn.fulfilled(userInfo));
        } else {
          console.error('Invalid userInfo structure:', userInfo);
        }
      }
    } catch (e) {
      console.error('Failed to parse userInfo:', e);
    }
  }, [dispatch]);

  // Language switcher function
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setDropdownOpen(false); // Close dropdown after selection
  };

  // Handle close of chatbot
  const handleChatBotClose = () => {
    setChatBotOpen(false);
  };
  

  const USER_TYPES = {
    PUBLIC: 'public',
    NORMAL_USER: 'normal',
    ADMIN_USER: 'admin',
  }
  const CURRENT_USER_TYPES = USER_TYPES.NORMAL_USER

  const PublicElement = ({children})=>{
    return <> {children} </>
  }

  const UserElement = ({ children }) => {
    const { userInfo, isLoggedIn, isAuthDataLoaded } = useAuthContext();
    // Check if authentication data is loaded
    if (!isAuthDataLoaded) {
      // If authentication data is not yet loaded, show a loading state or spinner
      return <isLoading/>; // Replace with your loading component
    }
        // Authentication data has been loaded
    let userType = isLoggedIn ? USER_TYPES.NORMAL_USER : USER_TYPES.PUBLIC;
    let adminType = userInfo && userInfo.isAdmin ? USER_TYPES.ADMIN_USER : USER_TYPES.PUBLIC;
  
    if (adminType === USER_TYPES.ADMIN_USER || userType === USER_TYPES.NORMAL_USER) {
      return <>{children}</>;
    } else {
      return <Navigate to="/error403" />;
    }
  };
  
  const AdminElement = ({children})=>{
    const { userInfo, isLoggedIn, isAuthDataLoaded } = useAuthContext();
    // Check if authentication data is loaded
    if (!isAuthDataLoaded) {
      // If authentication data is not yet loaded, show a loading state or spinner
      return <isLoading />; // Replace with your loading component
    }
    let adminType = userInfo && userInfo.isAdmin ? USER_TYPES.ADMIN_USER : USER_TYPES.PUBLIC;
    if (adminType === USER_TYPES.ADMIN_USER ) {
    return <> {children} </>

    }else{
      return <Navigate to="/error403"/>
    }
  }


  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <div
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          className="App flex flex-col min-h-screen"
        >
          <NavBarPlus />

          {/* Chatbot Icon and Toggle Button */}
          <div className="fixed bottom-4 right-4 z-50 mb-1.5">
            <button
              onClick={() => setChatBotOpen(!chatBotOpen)}
              className="p-3 bg-blue-500 rounded-full text-white shadow-lg hover:bg-blue-600 focus:outline-none"
            >
              <FaRobot className="text-2xl" />
            </button>
            {chatBotOpen && <ChatBotComponent onClose={handleChatBotClose} />}
          </div>

          {/* Language switcher */}
          <div className="fixed top-4 right-4 z-50 flex flex-col items-end mt-16">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-1 rounded bg-gray-200 text-gray-900 hover:bg-gray-300"
              >
                <FaLanguage className="text-3xl" />
                {/* <MdArrowDropDown className="text-xl" /> */}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-32">
                  <button
                    onClick={() => changeLanguage('en')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('fr')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    French
                  </button>
                  <button
                    onClick={() => changeLanguage('ar')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Arabic
                  </button>
                </div>
              )}
            </div>
          </div>

          <main className="flex-grow">
            <Suspense fallback={<CircularProgress />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductsDetails />} />
                <Route path="/workshops" element={<Workshops />} />
                <Route path="/workshop/:slug" element={<WorkshopDetails />} />
                <Route path="/addProduct" element={<AddProduct />} />
                <Route path="/addWorkshop" element={<AddWorkshop />} />
                <Route path="/editProduct" element={<EditProduct />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/shippingAddress"
                  element={<ShippingAddressScreen />}
                />
                <Route
                  path="/workshopContent/:slug"
                  element={<WorkshopContent />}
                />
                <Route path="/userList" element={<UserList />} />
                <Route path="/orderList" element={<OrderList />} />
                <Route path="/productList" element={<ProductList />} />
                <Route path="/workshopList" element={<WorkshopList />} />
                <Route path="/adminDashboard" element={<AdminElement><AdminDashboard /></AdminElement>} />
                <Route path="/myWorkshops" element={<MyWorkshops />} />
                <Route path="/chatgroup" element={<ChatGroup />} />
                <Route path='/requestProducts' element={<RequestProducts />} />
                <Route path='/*' element={<Error404 />} />
                <Route path='/error403' element={<Error403 />} />

              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
