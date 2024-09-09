import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all workshops
export const getWorkshops = createAsyncThunk(
  'workshops/getWorkshops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/workshops');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a workshop
export const deleteWorkshop = createAsyncThunk(
  'workshops/deleteWorkshop',
  async (workshopId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/workshops/delete/${workshopId}`
      );
      return workshopId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// update a workshop
export const updateWorkshop = createAsyncThunk(
  'workshops/updateWorkshop',
  async (workshopData) => {
    const { id, ...workshopDetails } = workshopData;
    const response = await axios.put(`/api/workshops/${id}`, workshopDetails);
    return response.data;
  }
);

const workshopsSlice = createSlice({
  name: 'workshops',
  initialState: {
    workshops: [],
    selectedWorkshop: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectWorkshop: (state, action) => {
      state.selectedWorkshop = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling getWorkshops
      .addCase(getWorkshops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkshops.fulfilled, (state, action) => {
        state.loading = false;
        state.workshops = action.payload;
      })
      .addCase(getWorkshops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling deleteWorkshop
      .addCase(deleteWorkshop.fulfilled, (state, action) => {
        state.workshops = state.workshops.filter(
          (workshop) => workshop.id !== action.payload
        );
      })
      // Handling updateWorkshop
      .addCase(deleteWorkshop.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateWorkshop.fulfilled, (state, action) => {
        const updatedWorkshopIndex = state.workshops.findIndex(
          (workshop) => workshop._id === action.payload._id
        );
        if (updateWorkshop !== -1) {
          state.workshops[updatedWorkshopIndex] = action.payload;
        }
      });
  },
});

// Exporting actions and reducer
export const { selectWorkshop } = workshopsSlice.actions;
export default workshopsSlice.reducer;
