// src/slices/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const lightTheme = {
  mode: 'light',
  primaryColor: '#1976d2',
  secondaryColor: '#ff4081',
  backgroundColor: '#ffffff',
  textColor: '#333333',
};

const darkTheme = {
  mode: 'dark',
  primaryColor: '#333333',
  secondaryColor: '#ff4081',
  backgroundColor: '#1e1e1e',
  textColor: '#ffffff',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: lightTheme,
  reducers: {
    toggleTheme: (state) => (state.mode === 'light' ? darkTheme : lightTheme),
    setCustomTheme: (state, action) => ({ ...state, ...action.payload }),
  },
});

export const { toggleTheme, setCustomTheme } = themeSlice.actions;
export default themeSlice.reducer;
