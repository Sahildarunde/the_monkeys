import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { API } from "../../api";

const { register, login } = API();

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  error: false,
  data: [],
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, thunkAPI) => {
    try {
      let result = await register(data);
      if (result?.status === 201) {
        localStorage.setItem("SignUpAuthToken", result?.token);
        return result;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      let result = await login(data);

      if (result?.status === 200) {
        localStorage.setItem("authToken", result?.token);
      }
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // addUser(state, action) {
    //     // this state is not global state. it is only books slice
    //         state.registerData = action.payload;
    //   },
    logoutUser: (state) => {
      localStorage.removeItem("authToken");
      state.isAuthenticated = false;
      state.data = [];
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.data = [];
      state.isAuthenticated = false;
      state.error = action.error.message;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.data = [];
      state.error = false;
      state.isAuthenticated = false;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.data = payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = false;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.data = [];
      state.isAuthenticated = false;
      state.error = action.error.message;
    });

    builder.addCase(logoutUser, () => {
      return initialState;
    });
  },
});

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;
