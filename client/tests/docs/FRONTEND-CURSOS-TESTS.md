# Testing Suite - Frontend Tests

## Overview
Suite de tests para el frontend de la aplicación, incluyendo tests unitarios y de integración para componentes, hooks, servicios y utilidades.

## Estructura de Tests

```
src/test/
├── setup.js                        # Configuración global de tests
├── utils/
│   ├── testUtils.jsx              # Utilidades y helpers para tests
│   ├── formatting.test.js          # Tests para utilidades de formateo
│   └── routes.test.js              # Tests para utilidades de rutas
├── hooks/
│   └── useAuth.test.jsx            # Tests para el hook de autenticación
├── components/
│   ├── Login.test.jsx              # Tests para el componente Login
│   ├── ProtectedRoute.test.jsx     # Tests para rutas protegidas
│   ├── Modal.test.jsx              # Tests para el componente Modal
│   ├── WhatsAppButton.test.jsx     # Tests para el botón de WhatsApp
│   ├── Header.test.jsx             # Tests para el Header
│   ├── StudentsManagement.test.jsx # Tests CRUD de estudiantes
│   ├── TeachersManagement.test.jsx # Tests CRUD de profesores
│   └── CourseManagement.test.jsx   # Tests CRUD de cursos
└── services/
    └── api.test.js                 # Tests para servicios de API
```

## Ejecutar Tests

### Todos los Tests
```bash
cd client
npm test
```

### Modo Watch (re-ejecuta automáticamente al cambiar archivos)
```bash
npm run test:watch
```

### UI Interactiva
```bash
npm run test:ui
```

### Reporte de Cobertura
```bash
npm run test:coverage
```

## Resultados de Tests

### Estado Actual
- **Total de archivos de test:** 12
- **Total de tests:** 112
- **Tests pasando:** 112
- **Tests fallando:** 0

### Captura de Pantalla de Ejecución


![Resultados de Tests](../client/src/test/tests-results.png)


## Cobertura de Tests

### Hooks
- **useAuth**: Inicialización, login, logout, verificación de roles, getRedirectPath
- **useLoginForm**: Manejo de formulario, validación, submit

### Componentes de Autenticación
- **Login**: Renderizado, validación, manejo de errores, estados de carga, redirección
- **ProtectedRoute**: Control de acceso, verificación de roles, redirección

### Componentes Comunes
- **Modal**: Renderizado, cierre, interacción con overlay
- **WhatsAppButton**: Renderizado, apertura de WhatsApp
- **Header**: Navegación, menú móvil, cambio de tema, dropdowns

### Componentes CRUD
- **StudentsManagement**: 
  - Read: Listar estudiantes, estadísticas, filtros (búsqueda, estado, nivel, condición)
  - Create: Modal de registro
  - Update: Modal de edición
  - Delete: Desactivar/reactivar con confirmación
  - Paginación
  
- **TeachersManagement**:
  - Read: Listar profesores, estadísticas, filtros (búsqueda, estado)
  - Create: Modal de registro
  - Update: Modal de edición
  - Delete: Eliminar con confirmación y manejo de errores
  - Paginación
  
- **CourseManagement**:
  - Read: Listar cursos, información (profesor, vacantes), filtros (búsqueda, tipo, estado)
  - Create: Modal de creación
  - Update: Modal de edición
  - Delete: Eliminar con confirmación
  - Funcionalidades adicionales: modal de clases, información de vacantes

### Servicios
- **authAPI**: Login, logout, getProfile, verifyToken, changePasswordForced
- **authUtils**: isAuthenticated, getCurrentUser, getUserRole, hasRole, clearAuth

### Utilidades
- **formatting**: formatDate, formatCurrency
- **routes**: Definición de rutas, rutas públicas y protegidas

## Entorno de Testing

Los tests usan **mocks** para todas las dependencias externas:
- **APIs mockeadas**: No hacen llamadas reales al backend
- **localStorage mockeado**: No afecta el localStorage real
- **Router mockeado**: No afecta la navegación real
- **Sin conexión a base de datos**: 100% seguro, no puede borrar datos

### Tecnologías Utilizadas
- **Vitest**: Framework de testing rápido y moderno
- **React Testing Library**: Para testing de componentes React
- **@testing-library/user-event**: Para simular interacciones de usuario
- **jsdom**: Entorno DOM simulado para tests
- **@vitest/ui**: UI interactiva para ejecutar tests
- **@vitest/coverage-v8**: Generación de reportes de cobertura

## Objetivos de Cobertura

- **Objetivo:** 80% mínimo de cobertura
- **Áreas de enfoque:**
  - Componentes principales (Login, CRUD)
  - Hooks personalizados (useAuth)
  - Servicios de API
  - Utilidades críticas
  - Manejo de errores
  - Casos edge

## Dependencias

- `vitest`: Framework de testing
- `@testing-library/react`: Testing de componentes React
- `@testing-library/user-event`: Simulación de interacciones
- `@testing-library/jest-dom`: Matchers adicionales
- `jsdom`: Entorno DOM simulado
- `@vitest/ui`: UI interactiva
- `@vitest/coverage-v8`: Cobertura de código

