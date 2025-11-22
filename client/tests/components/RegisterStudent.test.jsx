import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterStudent from '../../src/components/RegisterStudent'
import apiService from '../../src/services/api'

// Mock del servicio API
vi.mock('../../src/services/api', () => {
  const mockPost = vi.fn()
  const axios = vi.fn(() => axios)
  axios.post = mockPost
  axios.get = vi.fn()
  axios.put = vi.fn()
  axios.delete = vi.fn()
  axios.create = vi.fn(() => axios)
  axios.interceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  }
  return {
    default: axios,
    authAPI: {
      login: vi.fn(),
      logout: vi.fn(),
      getProfile: vi.fn(),
      verifyToken: vi.fn(),
    },
    authUtils: {
      isAuthenticated: vi.fn(() => false),
      getCurrentUser: vi.fn(() => null),
      clearAuth: vi.fn(),
    },
  }
})

// Mock de capitalizeUserNames
vi.mock('../../src/utils/stringHelpers', () => ({
  capitalizeUserNames: (data) => ({
    firstName: data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1).toLowerCase(),
    lastName: data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1).toLowerCase(),
  }),
}))

describe('RegisterStudent Component', () => {
  const mockOnSuccess = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Renderiza formulario de registro', () => {
    render(<RegisterStudent onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
    
    expect(screen.getByText('Registrar Nuevo Estudiante')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre *')).toBeInTheDocument()
    expect(screen.getByLabelText('Apellido *')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo Electrónico *')).toBeInTheDocument()
    expect(screen.getByLabelText('DNI *')).toBeInTheDocument()
    expect(screen.getByLabelText('Nivel Académico *')).toBeInTheDocument()
  })

  it('Muestra todos los campos requeridos', () => {
    render(<RegisterStudent onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
    
    const nombreInput = screen.getByLabelText('Nombre *')
    const apellidoInput = screen.getByLabelText('Apellido *')
    const emailInput = screen.getByLabelText('Correo Electrónico *')
    const dniInput = screen.getByLabelText('DNI *')
    const nivelSelect = screen.getByLabelText('Nivel Académico *')
    
    expect(nombreInput).toBeInTheDocument()
    expect(apellidoInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(dniInput).toBeInTheDocument()
    expect(nivelSelect).toBeInTheDocument()
  })

  it('Permite ingresar datos en los campos', async () => {
    const user = userEvent.setup()
    render(<RegisterStudent onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
    
    const nombreInput = screen.getByLabelText('Nombre *')
    const apellidoInput = screen.getByLabelText('Apellido *')
    const emailInput = screen.getByLabelText('Correo Electrónico *')
    const dniInput = screen.getByLabelText('DNI *')
    
    await user.type(nombreInput, 'Juan')
    await user.type(apellidoInput, 'Pérez')
    await user.type(emailInput, 'juan@example.com')
    await user.type(dniInput, '12345678')
    
    expect(nombreInput).toHaveValue('Juan')
    expect(apellidoInput).toHaveValue('Pérez')
    expect(emailInput).toHaveValue('juan@example.com')
    expect(dniInput).toHaveValue('12345678')
  })

  it('Muestra errores de validación cuando el registro falla', async () => {
    const user = userEvent.setup()
    
    // Mock de error en la API
    apiService.post.mockRejectedValue({
      response: {
        data: {
          success: false,
          message: 'El email ya está registrado',
          errors: [
            { field: 'email', message: 'El email ya está registrado' }
          ]
        }
      }
    })

    render(<RegisterStudent onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
    
    const nombreInput = screen.getByLabelText('Nombre *')
    const apellidoInput = screen.getByLabelText('Apellido *')
    const emailInput = screen.getByLabelText('Correo Electrónico *')
    const dniInput = screen.getByLabelText('DNI *')
    const submitButton = screen.getByRole('button', { name: /registrar estudiante/i })
    
    await user.type(nombreInput, 'Juan')
    await user.type(apellidoInput, 'Pérez')
    await user.type(emailInput, 'existing@example.com')
    await user.type(dniInput, '12345678')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Error de validación: El email ya está registrado/i)).toBeInTheDocument()
    })
  })

  it('Muestra mensaje de éxito cuando el registro es exitoso', async () => {
    const user = userEvent.setup()
    
    // Mock de respuesta exitosa
    apiService.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          user: {
            id: 1,
            email: 'juan@example.com',
            firstName: 'Juan',
            lastName: 'Pérez',
            dni: '12345678',
            nivel: 'A1'
          }
        }
      }
    })

    render(<RegisterStudent onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
    
    const nombreInput = screen.getByLabelText('Nombre *')
    const apellidoInput = screen.getByLabelText('Apellido *')
    const emailInput = screen.getByLabelText('Correo Electrónico *')
    const dniInput = screen.getByLabelText('DNI *')
    const submitButton = screen.getByRole('button', { name: /registrar estudiante/i })
    
    await user.type(nombreInput, 'juan')
    await user.type(apellidoInput, 'pérez')
    await user.type(emailInput, 'juan@example.com')
    await user.type(dniInput, '12345678')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/ESTUDIANTE REGISTRADO CORRECTAMENTE/i)).toBeInTheDocument()
      expect(screen.getByText(/juan@example.com/i)).toBeInTheDocument()
      expect(screen.getByText(/12345678/i)).toBeInTheDocument()
    })
  })

  it('Llama a onSuccess cuando se hace clic en "Cerrar y Continuar"', async () => {
    const user = userEvent.setup()
    
    apiService.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          user: {
            id: 1,
            email: 'juan@example.com',
            firstName: 'Juan',
            lastName: 'Pérez',
            dni: '12345678',
            nivel: 'A1'
          }
        }
      }
    })

    render(<RegisterStudent onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
    
    const nombreInput = screen.getByLabelText('Nombre *')
    const apellidoInput = screen.getByLabelText('Apellido *')
    const emailInput = screen.getByLabelText('Correo Electrónico *')
    const dniInput = screen.getByLabelText('DNI *')
    const submitButton = screen.getByRole('button', { name: /registrar estudiante/i })
    
    await user.type(nombreInput, 'Juan')
    await user.type(apellidoInput, 'Pérez')
    await user.type(emailInput, 'juan@example.com')
    await user.type(dniInput, '12345678')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/ESTUDIANTE REGISTRADO CORRECTAMENTE/i)).toBeInTheDocument()
    })
    
    const closeButton = screen.getByRole('button', { name: /cerrar y continuar/i })
    await user.click(closeButton)
    
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
  })

  it('Llama a onCancel cuando se hace clic en Cancelar', async () => {
    const user = userEvent.setup()
    render(<RegisterStudent onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('Muestra estado de carga durante el submit', async () => {
    const user = userEvent.setup()
    
    // Mock que se resuelve después de un delay
    apiService.post.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        data: {
          success: true,
          data: { user: { id: 1, email: 'test@example.com' } }
        }
      }), 100))
    )

    render(<RegisterStudent onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
    
    const nombreInput = screen.getByLabelText('Nombre *')
    const apellidoInput = screen.getByLabelText('Apellido *')
    const emailInput = screen.getByLabelText('Correo Electrónico *')
    const dniInput = screen.getByLabelText('DNI *')
    const submitButton = screen.getByRole('button', { name: /registrar estudiante/i })
    
    await user.type(nombreInput, 'Juan')
    await user.type(apellidoInput, 'Pérez')
    await user.type(emailInput, 'juan@example.com')
    await user.type(dniInput, '12345678')
    await user.click(submitButton)
    
    // Verificar que el botón muestra el estado de carga
    await waitFor(() => {
      expect(screen.getByText('Registrando...')).toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('Muestra opciones de nivel académico', () => {
    render(<RegisterStudent onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
    
    const nivelSelect = screen.getByLabelText('Nivel Académico *')
    expect(nivelSelect).toBeInTheDocument()
    
    // Verificar que tiene las opciones correctas
    const niveles = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    niveles.forEach(nivel => {
      expect(screen.getByRole('option', { name: nivel })).toBeInTheDocument()
    })
  })

  it('Capitaliza nombres y apellidos antes de enviar', async () => {
    const user = userEvent.setup()
    
    apiService.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          user: {
            id: 1,
            email: 'juan@example.com',
            firstName: 'Juan',
            lastName: 'Pérez',
            dni: '12345678',
            nivel: 'A1'
          }
        }
      }
    })

    render(<RegisterStudent onSuccess={mockOnSuccess} onCancel={mockOnCancel} />)
    
    const nombreInput = screen.getByLabelText('Nombre *')
    const apellidoInput = screen.getByLabelText('Apellido *')
    const emailInput = screen.getByLabelText('Correo Electrónico *')
    const dniInput = screen.getByLabelText('DNI *')
    const submitButton = screen.getByRole('button', { name: /registrar estudiante/i })
    
    // Escribir en minúsculas
    await user.type(nombreInput, 'juan')
    await user.type(apellidoInput, 'pérez')
    await user.type(emailInput, 'juan@example.com')
    await user.type(dniInput, '12345678')
    await user.click(submitButton)
    
    await waitFor(() => {
      // Verificar que se llamó con datos capitalizados
      expect(apiService.post).toHaveBeenCalledWith(
        '/auth/register/estudiante-admin',
        expect.objectContaining({
          firstName: 'Juan',
          lastName: 'Pérez',
          role: 'estudiante'
        })
      )
    })
  })
})

