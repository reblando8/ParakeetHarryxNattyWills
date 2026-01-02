import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoginAPI, LogoutAPI, RegisterAPI, GoogleSignInAPI } from '../../api/authAPI';
import { getCurrentUserData } from '../../api/FirestoreAPI';

// Helper to merge Firebase user with Firestore data
const mergeUserData = (firebaseUser) => {
  return new Promise((resolve) => {
    let resolved = false;
    
    // Try to get Firestore user data
    getCurrentUserData((firestoreUser) => {
      if (firestoreUser && !resolved) {
        resolved = true;
        const mergedUser = { ...firebaseUser, ...firestoreUser };
        resolve(mergedUser);
      }
    });
    
    // Timeout after 2 seconds - return Firebase user if Firestore data not available
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(firebaseUser);
      }
    }, 2000);
  });
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await LoginAPI(email, password);
      if (!response || !response.user) {
        throw new Error('Login failed');
      }
      
      // Merge with Firestore user data
      const mergedUser = await mergeUserData(response.user);
      return mergedUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await RegisterAPI(email, password);
      if (!response || !response.user) {
        throw new Error('Registration failed');
      }
      // Note: Firestore user data will be created separately, so just return Firebase user for now
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GoogleSignInAPI();
      if (!response || !response.user) {
        throw new Error('Google sign in failed');
      }
      
      // Merge with Firestore user data
      const mergedUser = await mergeUserData(response.user);
      return mergedUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Google sign in failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await LogoutAPI();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("✅ STORING USER IN REDUX2:", action.payload);
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Google Sign In
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

