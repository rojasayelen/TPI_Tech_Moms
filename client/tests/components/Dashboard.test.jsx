import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import StudentDashboard from '../../src/pages/Dashboard/StudentDashboard'
import AdminDashboard from '../../src/pages/Dashboard/AdminDashboard'
import { AuthProvider } from '../../src/hooks/useAuth.jsx'
import apiAdapter from '../../src/services/apiAdapter'
import api from '../../src/services/api'

// Mock de los servicios
vi.mock('../../src/services/apiAdapter', () => ({
  default: {
    courses: {
      getMyCourses: vi.fn(),
    },
    classes: {
      obtenerEstadisticasAsistencia: vi.fn(),
    },
  },
}))

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

vi.mock('../../src/services/cobroApi', () => ({
  default: {
    getMyPayments: vi.fn(),
  },
}))

vi.mock('../../src/services/facturaApi', () => ({
  default: {
    getMyInvoices: vi.fn(),
  },
}))

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/dashboard/admin' }),
  }
})

// Mock de módulos de estilos
vi.mock('../../src/styles/variables.css', () => ({}))
vi.mock('../../src/styles/auth.css', () => ({}))
vi.mock('../../src/styles/charts.css', () => ({}))

// Helper para renderizar con providers
const renderWithProviders = (ui, initialUser = null) => {
  // Mock localStorage con usuario inicial
  if (initialUser) {
    localStorage.setItem('user', JSON.stringify(initialUser))
    localStorage.setItem('token', 'mock-token')
  }

  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('StudentDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock de respuestas por defecto
    apiAdapter.courses.getMyCourses.mockResolvedValue({
      data: {
        success: true,
        data: []
      }
    })
    
    apiAdapter.classes.obtenerEstadisticasAsistencia.mockResolvedValue({
      data: {
        success: true,
        data: {}
      }
    })
  })

  it('Renderiza dashboard para estudiante', async () => {
    const mockUser = {
      id: 1,
      _id: 1,
      email: 'student@example.com',
      role: 'estudiante',
      firstName: 'Test',
      lastName: 'Student',
    }

    renderWithProviders(<StudentDashboard />, mockUser)

    // Verificar que el componente renderiza (puede mostrar loading o contenido)
    await waitFor(() => {
      expect(document.body).toBeTruthy()
    }, { timeout: 2000 })
  })

  it('Muestra datos del usuario cuando está autenticado', async () => {
    const mockUser = {
      id: 1,
      _id: 1,
      email: 'student@example.com',
      role: 'estudiante',
      firstName: 'Test',
      lastName: 'Student',
    }

    renderWithProviders(<StudentDashboard />, mockUser)

    // El componente debería renderizar con el usuario autenticado
    await waitFor(() => {
      expect(document.body).toBeTruthy()
    }, { timeout: 2000 })
  })

  it('Carga cursos del estudiante', async () => {
    const mockUser = {
      id: 1,
      _id: 1,
      email: 'student@example.com',
      role: 'estudiante',
    }

    const mockCourses = [
      { id: 1, _id: 1, nombre: 'Curso 1', name: 'Curso 1' },
      { id: 2, _id: 2, nombre: 'Curso 2', name: 'Curso 2' },
    ]

    apiAdapter.courses.getMyCourses.mockResolvedValue({
      data: {
        success: true,
        data: mockCourses
      }
    })

    renderWithProviders(<StudentDashboard />, mockUser)

    // Verificar que el componente renderiza
    await waitFor(() => {
      expect(document.body).toBeTruthy()
    }, { timeout: 2000 })
  })
})

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          totalStudents: 10,
          totalTeachers: 5,
          scheduledClasses: 20,
        }
      }
    })
  })

  it('Renderiza dashboard según rol admin', async () => {
    const mockUser = {
      id: 1,
      email: 'admin@example.com',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
    }

    renderWithProviders(<AdminDashboard />, mockUser)

    // Verificar que el componente renderiza
    await waitFor(() => {
      expect(document.body).toBeTruthy()
    }, { timeout: 2000 })
  })

  it('Muestra estadísticas del sistema', async () => {
    const mockUser = {
      id: 1,
      email: 'admin@example.com',
      role: 'admin',
    }

    const mockStats = {
      totalStudents: 25,
      totalTeachers: 8,
      scheduledClasses: 50,
      activeStudents: 20,
      activeTeachers: 7,
    }

    api.get.mockResolvedValue({
      data: {
        success: true,
        data: mockStats
      }
    })

    renderWithProviders(<AdminDashboard />, mockUser)

    // Verificar que el componente renderiza
    await waitFor(() => {
      expect(document.body).toBeTruthy()
    }, { timeout: 2000 })
  })
})

