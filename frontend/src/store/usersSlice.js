import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching users
export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/delete/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// update a user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData) => {
    const { id, ...userDetails } = userData;
    const response = await axios.put(`/api/users/${id}`, userDetails);
    return response.data;
  }
);

// Creating the users slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [], // Add the users array
    selectedUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Reducer to select a user
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Handling updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUserIndex = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (updatedUserIndex !== -1) {
          state.users[updatedUserIndex] = action.payload;
        }
      });
  },
});

// Exporting actions and reducer
export const { selectUser } = usersSlice.actions;
export default usersSlice.reducer;
