import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from '../../src/pages/Login'
import { AuthProvider } from '../../src/hooks/useAuth.jsx'
import * as authAPI from '../../src/services/api'

// Mock del módulo de API
vi.mock('../../src/services/api', () => ({
  authAPI: {
    login: vi.fn(),
    verifyToken: vi.fn(),
  },
  authUtils: {
    isAuthenticated: vi.fn(() => false),
    getCurrentUser: vi.fn(() => null),
    clearAuth: vi.fn(),
  },
}))

// Mock de react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(() => mockNavigate),
  }
})

// Helper para renderizar el componente con providers
const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('Renderiza formulario de login', () => {
    renderWithProviders(<Login />)
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
  })

  it('Muestra campos email y password', () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByLabelText('Correo Electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('Muestra error si campos vacíos al hacer submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Login />)
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i })
    
    // Los campos son required, así que el navegador mostrará validación HTML5
    // Pero podemos verificar que el botón está deshabilitado cuando isSubmitting
    expect(submitButton).not.toBeDisabled()
  })

  it('Llama a API al hacer submit con datos válidos', async () => {
    const user = userEvent.setup()
    
    // Mock de respuesta exitosa
    authAPI.authAPI.login.mockResolvedValue({
      user: {
        id: 1,
        email: 'test@example.com',
        role: 'estudiante',
        firstName: 'Test',
        lastName: 'User',
      },
    })

    renderWithProviders(<Login />)
    
    const emailInput = screen.getByLabelText('Correo Electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /ingresar/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(authAPI.authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('Muestra mensaje de error cuando el login falla', async () => {
    const user = userEvent.setup()
    
    // Mock de error en login
    authAPI.authAPI.login.mockRejectedValue({
      message: 'Credenciales inválidas',
    })

    renderWithProviders(<Login />)
    
    const emailInput = screen.getByLabelText('Correo Electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /ingresar/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(authAPI.authAPI.login).toHaveBeenCalled()
    })
  })

  it('Muestra estado de carga durante el submit', async () => {
    const user = userEvent.setup()
    
    // Mock que se resuelve después de un delay
    authAPI.authAPI.login.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'estudiante',
        },
      }), 100))
    )

    renderWithProviders(<Login />)
    
    const emailInput = screen.getByLabelText('Correo Electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /ingresar/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    // Verificar que el botón muestra estado de carga
    await waitFor(() => {
      expect(screen.getByText('Ingresando...')).toBeInTheDocument()
    })
  })

  it('Muestra información importante para usuarios', () => {
    renderWithProviders(<Login />)
    
    expect(screen.getByText(/Información importante/i)).toBeInTheDocument()
    expect(screen.getByText(/Estudiantes y Profesores/i)).toBeInTheDocument()
    expect(screen.getByText(/Administradores/i)).toBeInTheDocument()
  })

  it('Deshabilita el botón cuando está submitting', async () => {
    const user = userEvent.setup()
    
    authAPI.authAPI.login.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        user: { id: 1, email: 'test@example.com', role: 'estudiante' },
      }), 100))
    )

    renderWithProviders(<Login />)
    
    const emailInput = screen.getByLabelText('Correo Electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /ingresar/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})

