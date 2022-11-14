import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../api'

const initialState = {
  authData: JSON.parse(localStorage.getItem('user')),
}

export const signin = createAsyncThunk(
  'auth/signin',
  async (args, thunkAPI) => {
    const { formData, navigate } = args
    try {
      // log in the user ...
      const { data } = await api.singin(formData)
      navigate('/')
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue('signing in user failed')
    }
  }
)

export const signup = createAsyncThunk(
  'auth/signin',
  async (args, thunkAPI) => {
    const { formData, navigate } = args

    try {
      // sign up the user ...
      const { data } = await api.signup(formData)
      navigate('/')
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue('signing up user failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    googleAuth: (state, { payload }) => {
      state.authData = { ...payload.userObj, token: payload.token }
      localStorage.setItem('user', JSON.stringify(state.authData))
    },
    authLogout: (state) => {
      state.authData = null
      localStorage.clear()
    },
  },

  extraReducers: {
    [signup.fulfilled]: (state, { payload }) => {
      state.authData = { ...payload.result, token: payload.token }
      localStorage.setItem('user', JSON.stringify(state.authData))
    },
    [signin.fulfilled]: (state, { payload }) => {
      state.authData = { ...payload.result, token: payload.token }
      localStorage.setItem('user', JSON.stringify(state.authData))
    },
  },
})

export const { googleAuth, authLogout } = authSlice.actions

export default authSlice.reducer
