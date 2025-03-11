"use client";
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './feature/themeSlice';
import usersReducer from './feature/userSlice';
import postsReducer from './feature/postSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    users: usersReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;