import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const logIn = createAsyncThunk('auth/logIn', async (data, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const response = await axios.post(
      'http://localhost:5000/api/users/signin',
      data,
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      }
    );
    const userData = response.data;

    if (userData.message) {
      return false;
    } else {
      localStorage.setItem('userInfo', JSON.stringify(userData));
      return userData;
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profile, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const userInfo = localStorage.getItem('userInfo');
    let token = null;

    if (userInfo) {
      const user = JSON.parse(userInfo);
      token = user.token;
    }
    try {
      const response = await axios.put('/api/users/profile', profile, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: `${token}`,
        },
      });
      const updatedUserData = response.data;
      console.log('data when I update::', updatedUserData);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserData));
      return updatedUserData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/signup',
        data,
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }
      );
      const userData = response.data;

      if (userData.message) {
        return false;
      } else {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//----------------------------------------------------------------------------------

const initialState = {
  user: (() => {
    try {
      // 3m ye5ida ka array of object not object
      const userInfo = localStorage.getItem('userInfo');
      console.log('Retrieved userInfo from localStorage:', userInfo);
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (e) {
      console.error('Failed to parse userInfo:', e);
      return null;
    }
  })(),
  token: (() => {
    try {
      // 3m ye5ida ka array of object not object
      const userInfo = localStorage.getItem('userInfo');
      console.log(userInfo);
      const parsed = userInfo ? JSON.parse(userInfo) : null;
      return parsed?.token || null;
    } catch (e) {
      console.error('Failed to parse userInfo token:', e);
      return null;
    }
  })(),
  error: null,
  isLoading: false,
  cart: [],
};

// const initialState = {
//   user: null,
//   token: null,
//   error: null,
//   isLoading: null,
//   cart: [],
// };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Empty User State
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.cart = [];
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('userInfo');
    },
    // Get Cart Data
    getCart: (state, action) => {
      state.cart = action.payload; // Assuming the response structure
    },
  },
  extraReducers: (builder) => {
    // Log In Cases
    builder
      .addCase(logIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Sign Up Cases
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Profile Cases
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logOut, getCart } = authSlice.actions;
export default authSlice.reducer;
