import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getCart } from './authSlice';

// Fetch Cart

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/cart/${userId}`
      );
      const cart = await response.data;

      if (cart.message) {
        return cart.message;
      } else {
        dispatch(getCart(cart));
        return cart;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Product To Cart
export const addProductToCart = createAsyncThunk(
  'cart/addProductToCart',
  async (products, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const userInfo = localStorage.getItem('userInfo');
    let token = null;

    if (userInfo) {
      const user = JSON.parse(userInfo);
      token = user.token;
    }
    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/product',
        products,
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `${token}`,
          },
        }
      );
      const productsData = await response.data;

      if (productsData.message) {
        return productsData.message;
      } else {
        dispatch(getCart(productsData));
        return productsData;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Workshop To Cart
export const addWorkshopToCart = createAsyncThunk(
  'cart/addWorkshopToCart',
  async (workshops, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const userInfo = localStorage.getItem('userInfo');
    let token = null;

    if (userInfo) {
      const user = JSON.parse(userInfo);
      token = user.token;
    }
    try {
      const response = await axios.post(
        'http://localhost:5000/api/cart/workshop',
        workshops,
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `${token}`,
          },
        }
      );
      const workshopsData = await response.data;

      if (workshopsData.message) {
        return workshopsData.message;
      } else {
        dispatch(getCart(workshopsData));
        return workshopsData;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Change Quantity of Product
export const changeQuantity = createAsyncThunk(
  'cart/changeQuantity',
  async (product, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const userInfo = localStorage.getItem('userInfo');
    let token = null;

    if (userInfo) {
      const user = JSON.parse(userInfo);
      token = user.token;
    }
    try {
      const response = await axios.put(
        'http://localhost:5000/api/cart/quantity',
        product,
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `${token}`,
          },
        }
      );
      const updateProduct = await response.data;

      if (updateProduct.message) {
        return updateProduct.message;
      } else {
        dispatch(getCart(updateProduct));
        return updateProduct;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Item from Cart
export const deleteFromCart = createAsyncThunk(
  'cart/deleteFromCart',
  async (item, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const userInfo = localStorage.getItem('userInfo');
    let token = null;

    if (userInfo) {
      const user = JSON.parse(userInfo);
      token = user.token;
    }
    try {
      const response = await axios.put(
        'http://localhost:5000/api/cart/deleteFromCart',
        item,
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `${token}`,
          },
        }
      );
      const updatedData = await response.data;

      if (updatedData.message) {
        return updatedData.message;
      } else {
        dispatch(getCart(updatedData));
        return updatedData;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Clear Cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const userInfo = localStorage.getItem('userInfo');
    let token = null;

    if (userInfo) {
      const user = JSON.parse(userInfo);
      token = user.token;
    }
    try {
      const response = await axios.put(
        'http://localhost:5000/api/cart/clearCart',
        { userId },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `${token}`,
          },
        }
      );
      const result = response.data;
      console.log('resss', result);

      if (result.message) {
        return result.message;
      } else {
        // Clear localStorage and update state
        localStorage.removeItem('cart');
        return result;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Return Quantity of Product When Minus qunatity Or Delete From Cart

export const ReturnQuantity = createAsyncThunk(
  'cart/ReturnQuantity',
  async (product, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const userInfo = localStorage.getItem('userInfo');
    let token = null;

    if (userInfo) {
      const user = JSON.parse(userInfo);
      token = user.token;
    }
    try {
      const response = await axios.put(
        'http://localhost:5000/api/cart/returnquantity',
        product,
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `${token}`,
          },
        }
      );

      const updatedCart = await response.data;
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
    productsFilter: [],
    categories: [],
    selectedProduct: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    // builder
    //   .addCase(getCart.fulfilled, (state, action) => {
    //     state.products = action.payload;
    //     localStorage.setItem('cart', JSON.stringify(action.payload));
    //   });
  },
});

export default cartSlice.reducer;
