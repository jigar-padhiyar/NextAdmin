"use client";

import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface ThemeState {
  darkMode: boolean;
}

// Initialize state from localStorage if available (client-side only)
const getInitialState = (): ThemeState => {
  // Use system preference as default if nothing is stored
  let darkMode = false;
  
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      darkMode = savedTheme === 'dark';
    } else {
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  return { darkMode };
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState: getInitialState(),
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
      }
    },
    setDarkTheme: (state) => {
      state.darkMode = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', 'dark');
      }
    },
    setLightTheme: (state) => {
      state.darkMode = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', 'light');
      }
    },
  },
});

export const { toggleTheme, setDarkTheme, setLightTheme } = themeSlice.actions;

export const selectDarkMode = (state: RootState) => state.theme.darkMode;

export default themeSlice.reducer;