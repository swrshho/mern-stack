import { configureStore } from '@reduxjs/toolkit'
import postsSlice from './features/posts/postsSlice'
import authSlice from './features/auth/authSlice'

export const store = configureStore({
  reducer: {
    posts: postsSlice,
    auth: authSlice,
  },
})
