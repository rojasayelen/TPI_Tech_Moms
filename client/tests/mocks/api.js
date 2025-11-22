// Mock para axios y API calls
import { vi } from 'vitest'

export const mockApiResponse = {
  login: {
    success: {
      data: {
        success: true,
        data: {
          token: 'mock-token-123',
          user: {
            id: 1,
            email: 'test@example.com',
            role: 'estudiante',
            firstName: 'Test',
            lastName: 'User',
            mustChangePassword: false
          }
        }
      }
    },
    error: {
      response: {
        data: {
          success: false,
          message: 'Credenciales inválidas'
        }
      }
    }
  },
  register: {
    success: {
      data: {
        success: true,
        data: {
          user: {
            id: 2,
            email: 'newuser@example.com',
            firstName: 'New',
            lastName: 'User',
            dni: '12345678',
            nivel: 'A1'
          }
        }
      }
    },
    error: {
      response: {
        data: {
          success: false,
          message: 'El email ya está registrado',
          errors: [
            { field: 'email', message: 'El email ya está registrado' }
          ]
        }
      }
    }
  }
}

// Mock de axios
export const mockAxios = {
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
}

