import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

// Thunk for listening to auth state changes
export const listenToAuthState = createAsyncThunk('user/listenToAuthState', async (_, { dispatch }) => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        dispatch(setUserDetails({
          uid: user.uid,
          email: user.email,
          token: token,
        }));
      } else {
        dispatch(clearUserDetails());
      }
      dispatch(setLoading(false)); // Update the loading state when auth state is determined
      resolve(); // Resolve the promise to mark the operation as complete
    });
  });
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userDetails: null,
    loading: true,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(listenToAuthState.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(listenToAuthState.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUserDetails, clearUserDetails, setLoading } = userSlice.actions;

export const logout = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(clearUserDetails());
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export default userSlice.reducer;
