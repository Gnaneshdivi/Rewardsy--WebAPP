// src/slices/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const lightTheme = {
  mode: 'light',
  primaryColor: '#FBF5EB', // Seashell white
  secondaryColor: '#1D1D1D', // Eerie black
  backgroundColor: '#FBF5EB',
  textColor: '#1D1D1D',
 
};

const darkTheme = {
  mode: 'dark',
  primaryColor: '#1D1D1D', // Eerie black
  secondaryColor: '#FBF5EB', // Seashell white
  backgroundColor: '#1D1D1D',
  textColor: '#FBF5EB',
 
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
