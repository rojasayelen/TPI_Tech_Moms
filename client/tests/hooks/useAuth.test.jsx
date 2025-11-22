import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth, useLoginForm } from '../../src/hooks/useAuth.jsx'
import * as authAPI from '../../src/services/api'

// Mock del módulo de API
vi.mock('../../src/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  authAPI: {
    login: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
    verifyToken: vi.fn(),
    changePasswordForced: vi.fn(),
  },
  authUtils: {
    isAuthenticated: vi.fn(() => false),
    getCurrentUser: vi.fn(() => null),
    clearAuth: vi.fn(),
  },
}))

// Helper para wrapper con providers
const wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    authAPI.authUtils.isAuthenticated.mockReturnValue(false)
    authAPI.authUtils.getCurrentUser.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Inicializa sin usuario cuando no hay token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  it('Login exitoso actualiza el estado del usuario', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'estudiante',
      firstName: 'Test',
      lastName: 'User',
    }

    authAPI.authAPI.login.mockResolvedValue({
      user: mockUser,
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(authAPI.authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('Login fallido establece error', async () => {
    const errorMessage = 'Credenciales inválidas'
    authAPI.authAPI.login.mockRejectedValue({
      message: errorMessage,
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      try {
        await result.current.login('test@example.com', 'wrongpassword')
      } catch (error) {
        // Error esperado
      }
    })

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage)
    })
  })

  it('Logout limpia el estado del usuario', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'estudiante',
    }

    authAPI.authAPI.login.mockResolvedValue({ user: mockUser })
    authAPI.authAPI.logout.mockResolvedValue({})

    const { result } = renderHook(() => useAuth(), { wrapper })

    // Login primero
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    // Logout
    await act(async () => {
      await result.current.logout()
    })

    await waitFor(() => {
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(authAPI.authAPI.logout).toHaveBeenCalled()
    })
  })

  it('getRedirectPath retorna ruta correcta según rol', async () => {
    const mockUser = {
      id: 1,
      email: 'admin@example.com',
      role: 'admin',
    }

    authAPI.authAPI.login.mockResolvedValue({ user: mockUser })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('admin@example.com', 'password123')
    })

    await waitFor(() => {
      expect(result.current.getRedirectPath()).toBe('/dashboard/admin')
    })
  })

  it('hasRole verifica correctamente el rol del usuario', async () => {
    const mockUser = {
      id: 1,
      email: 'student@example.com',
      role: 'estudiante',
    }

    authAPI.authAPI.login.mockResolvedValue({ user: mockUser })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('student@example.com', 'password123')
    })

    await waitFor(() => {
      expect(result.current.hasRole('estudiante')).toBe(true)
      expect(result.current.hasRole('admin')).toBe(false)
      expect(result.current.isStudent()).toBe(true)
      expect(result.current.isAdmin()).toBe(false)
    })
  })

  it('updateProfile actualiza los datos del usuario', async () => {
    const initialUser = {
      id: 1,
      email: 'test@example.com',
      role: 'estudiante',
    }

    const updatedUser = {
      ...initialUser,
      firstName: 'Updated',
      lastName: 'Name',
    }

    authAPI.authAPI.login.mockResolvedValue({ user: initialUser })
    authAPI.authAPI.getProfile.mockResolvedValue({
      user: updatedUser,
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    // Login primero
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    // Update profile
    await act(async () => {
      await result.current.updateProfile()
    })

    await waitFor(() => {
      expect(result.current.user).toEqual(updatedUser)
      expect(authAPI.authAPI.getProfile).toHaveBeenCalled()
    })
  })
})

describe('useLoginForm Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('Inicializa con campos vacíos', () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper })

    expect(result.current.formData.email).toBe('')
    expect(result.current.formData.password).toBe('')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('handleChange actualiza los campos del formulario', async () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper })

    act(() => {
      const mockEvent = {
        target: {
          name: 'email',
          value: 'test@example.com',
        },
      }
      result.current.handleChange(mockEvent)
    })

    expect(result.current.formData.email).toBe('test@example.com')
  })

  it('handleSubmit llama a login con los datos del formulario', async () => {
    authAPI.authAPI.login.mockResolvedValue({
      user: {
        id: 1,
        email: 'test@example.com',
        role: 'estudiante',
      },
    })

    const { result } = renderHook(() => useLoginForm(), { wrapper })

    // Actualizar formulario
    act(() => {
      const emailEvent = {
        target: { name: 'email', value: 'test@example.com' },
      }
      result.current.handleChange(emailEvent)
    })

    act(() => {
      const passwordEvent = {
        target: { name: 'password', value: 'password123' },
      }
      result.current.handleChange(passwordEvent)
    })

    // Verificar que los valores están actualizados
    expect(result.current.formData.email).toBe('test@example.com')
    expect(result.current.formData.password).toBe('password123')

    // Submit
    const mockEvent = {
      preventDefault: vi.fn(),
    }
    
    await act(async () => {
      await result.current.handleSubmit(mockEvent)
    })

    await waitFor(() => {
      expect(authAPI.authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })
  })

  it('resetForm limpia los campos del formulario', async () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper })

    // Llenar formulario
    act(() => {
      const emailEvent = {
        target: { name: 'email', value: 'test@example.com' },
      }
      result.current.handleChange(emailEvent)
    })

    act(() => {
      const passwordEvent = {
        target: { name: 'password', value: 'password123' },
      }
      result.current.handleChange(passwordEvent)
    })

    // Esperar a que el estado se actualice
    await waitFor(() => {
      expect(result.current.formData.email).toBe('test@example.com')
      expect(result.current.formData.password).toBe('password123')
    })

    // Reset
    act(() => {
      result.current.resetForm()
    })

    await waitFor(() => {
      expect(result.current.formData.email).toBe('')
      expect(result.current.formData.password).toBe('')
    })
  })
})

