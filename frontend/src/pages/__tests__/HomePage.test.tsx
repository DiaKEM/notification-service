import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { setCredentials } from '@/features/auth/authSlice'
import { authApi } from '@/features/auth/authApi'
import HomePage from '../HomePage'

function createAuthenticatedStore(username = 'testuser') {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  })
  store.dispatch(setCredentials({ token: 'fake-token', username }))
  return store
}

function renderHomePage(username?: string) {
  const store = createAuthenticatedStore(username)
  return { store, ...render(<Provider store={store}><HomePage /></Provider>) }
}

describe('HomePage', () => {
  it('renders the hello world heading', () => {
    renderHomePage()
    expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument()
  })

  it('displays the username', () => {
    renderHomePage('Alice')
    expect(screen.getByText(/welcome, alice/i)).toBeInTheDocument()
  })

  it('renders a logout button', () => {
    renderHomePage()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('dispatches logout action when logout button is clicked', async () => {
    const user = userEvent.setup()
    const { store } = renderHomePage()
    expect(store.getState().auth.isAuthenticated).toBe(true)
    await user.click(screen.getByRole('button', { name: /logout/i }))
    expect(store.getState().auth.isAuthenticated).toBe(false)
  })
})
