import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get Group which User added to them

export const getMyGroups = createAsyncThunk(
  'chats/getMyGroups',
  async (userId, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    const userInfo = localStorage.getItem('userInfo');
    let token = null;

    if (userInfo) {
      const user = JSON.parse(userInfo);
      token = user.token;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chats/mygroup/${userId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const groups = await response.data;
      if (groups) {
        return groups;
      } else {
        return;
      }
    } catch (error) {
      rejectedWithValue(error.message);
    }
  }
);

// Accept a User to join Workshop Group

export const addUserToGroup = createAsyncThunk(
  'chats/addUserToGroup',
  async (userData, thunkAPI) => {
    const { rejectedWithValue } = thunkAPI;
    const userInfo = localStorage.getItem('userInfo');
    let token = null;

    if (userInfo) {
      const user = JSON.parse(userInfo);
      token = user.token;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/chats/addUserToGroup`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `${token}`,
          },
        }
      );

      const groups = await response.data;
      if (groups) {
        return groups;
      } else {
        return false;
      }
    } catch (error) {
      rejectedWithValue(error.message);
    }
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    groups: [],
    groupSelected: [],
    messages: [],
  },
  reducers: {
    selectGroup: (state, action) => {
      state.groupSelected = action.payload;
      state.messages = action.payload.messages;
    },

    // add new message
    addMessage: (state, action) => {
      state.messages = action.payload;
    },

    // delete message
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message.messageId !== action.payload.messageId
      );
    },

    // Reset chats Feature
    resetChatsFeature: (state) => {
      state.groups = [];
      state.groupSelected = [];
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(addUserToGroup.fulfilled, (state, action) => {
        state.groups = action.payload;
      });
  },
});

export const { selectGroup, addMessage, removeMessage, resetChatsFeature } =
  chatsSlice.actions;
export default chatsSlice.reducer;
