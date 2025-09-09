import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../api/authApi'

interface AuthState {
  user: User | null
  token: string | null | undefined
  isAuthenticated: boolean
}

const storedToken = localStorage.getItem('token')

const initialState: AuthState = {
  user: null,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('token', token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
})

export const { setCredentials, logout, setUser } = authSlice.actions

export default authSlice.reducer