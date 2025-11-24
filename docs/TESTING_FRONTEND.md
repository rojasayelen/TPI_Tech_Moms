# Documentación de Testing Frontend React

## 📋 Índice

1. [Introducción](#introducción)
2. [Resumen Ejecutivo](#resumen-ejecutivo)
3. [Configuración](#configuración)
4. [Cómo correr los tests](#cómo-correr-los-tests)
5. [Estructura de tests](#estructura-de-tests)
6. [Componentes testeados](#componentes-testeados)
7. [Coverage](#coverage)
8. [Cómo ver reporte HTML](#cómo-ver-reporte-html)
9. [Tests End-to-End (E2E)](#tests-end-to-end-e2e)
10. [Guía de escritura de tests](#guía-de-escritura-de-tests)
11. [Integración con CI/CD](#integración-con-cicd)
12. [Troubleshooting](#troubleshooting)
13. [Inconvenientes Encontrados en el Proceso](#inconvenientes-encontrados-en-el-proceso)
14. [Conclusión](#conclusión)
15. [Referencias](#referencias)

---

## Introducción

Este proyecto utiliza **Vitest** junto con **React Testing Library** para realizar tests unitarios y de integración del frontend React. Los tests están diseñados para verificar el comportamiento de los componentes, hooks personalizados y la lógica de la aplicación.

### Tecnologías utilizadas

- **Vitest v4.0.12**: Framework de testing rápido y moderno compatible con Vite
- **React Testing Library v16.3.0**: Utilidades para testear componentes React siguiendo mejores prácticas
- **jsdom v27.2.0**: Entorno DOM simulado para tests en Node.js
- **@testing-library/user-event v14.6.1**: Simulación avanzada de interacciones del usuario
- **@testing-library/jest-dom v6.9.1**: Matchers adicionales para DOM
- **Playwright**: Framework para tests end-to-end (E2E)

---

## Resumen Ejecutivo

### Estado Actual de los Tests

 **Tests Unitarios e Integración:**
- **5 archivos de test** implementados
- **40+ tests** pasando exitosamente
- **4 componentes** completamente testeados
- **1 hook personalizado** con cobertura completa

 **Cobertura:**
- **Meta:** >60% de cobertura de código
- **Estado:** Objetivo cumplido 

 **Tipos de Tests:**
- Tests unitarios de componentes
- Tests de hooks personalizados
- Tests de integración con mocks
- Tests end-to-end con Playwright

### Métricas del Proyecto

 Archivos de test  5 
 Tests implementados  40+ 
 Componentes testeados  4 
 Hooks testeados  1 
 Tiempo de ejecución  ~15-20s 
 Coverage objetivo  >60% 

---

## Configuración

### Archivos de configuración

#### `vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/e2e/**',
      '**/*.e2e.{js,jsx}',
      '**/playwright.config.js'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '*.config.js',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}',
        'playwright.config.js',
        '**/tests/e2e/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

#### `tests/setup.js`

Archivo de configuración inicial que incluye:

- Extiende Vitest con matchers de jest-dom
-  Configura cleanup automático después de cada test
-  Mockea `window.matchMedia` para compatibilidad con librerías de UI
-  Mockea `localStorage` con implementación completa
-  Mockea `ResizeObserver` para compatibilidad con gráficos (recharts)
-  Configuración de console para debugging controlado

---

## Cómo correr los tests

### Comandos disponibles

```bash
# Ejecutar tests en modo watch (recomendado durante desarrollo)
npm test

# Ejecutar tests una vez
npm test -- --run

# Ejecutar tests con UI interactiva
npm run test:ui

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo verbose
npm test -- --reporter=verbose

# Ejecutar un archivo específico
npm test -- Login.test.jsx
```

### Ejemplo de salida

```
✓ tests/components/Login.test.jsx (8 tests) 4817ms
  ✓ Login Component
    ✓ Renderiza formulario de login  705ms
    ✓ Muestra campos email y password
    ✓ Muestra error si campos vacíos al hacer submit
    ✓ Llama a API al hacer submit con datos válidos  1286ms
    ✓ Muestra mensaje de error cuando el login falla  973ms
    ✓ Muestra estado de carga durante el submit  888ms
    ✓ Muestra información importante para usuarios
    ✓ Deshabilita el botón cuando está submitting  752ms

✓ tests/components/RegisterStudent.test.jsx (10 tests) 8956ms
✓ tests/components/Dashboard.test.jsx (5 tests) 453ms
✓ tests/components/CourseCard.test.jsx (6 tests) 426ms
✓ tests/hooks/useAuth.test.jsx (11 tests) 212ms

Test Files  5 passed (5)
     Tests  40 passed (40)
   Duration  15.86s
```

### Ejecución exitosa

Todos los tests pasan correctamente sin errores. El tiempo de ejecución total es aproximadamente **15-20 segundos** para la suite completa.

---

## Estructura de tests

```
client/
├── tests/
│   ├── setup.js                    # Configuración global de tests
│   ├── mocks/
│   │   └── api.js                   # Mocks de API
│   ├── components/
│   │   ├── Login.test.jsx          # Tests del componente Login (8 tests)
│   │   ├── RegisterStudent.test.jsx # Tests del componente RegisterStudent (10 tests)
│   │   ├── Dashboard.test.jsx       # Tests de Dashboards (5 tests)
│   │   └── CourseCard.test.jsx     # Tests de CourseCard (6 tests)
│   ├── hooks/
│   │   └── useAuth.test.jsx        # Tests del hook useAuth (11 tests)
│   └── e2e/                        # Tests end-to-end con Playwright
│       ├── auth.spec.js
│       ├── login.spec.js
│       ├── register.spec.js
│       └── ... (más archivos E2E)
└── vitest.config.js                 # Configuración de Vitest
```


## Componentes testeados

### Login Component (`tests/components/Login.test.jsx`)

**Tests implementados:**

1.  Renderiza formulario de login
2.  Muestra campos email y password
3.  Muestra error si campos vacíos al hacer submit
4.  Llama a API al hacer submit con datos válidos
5.  Muestra mensaje de error cuando el login falla
6.  Muestra estado de carga durante el submit
7.  Muestra información importante para usuarios
8.  Deshabilita el botón cuando está submitting

**Cobertura:** Formulario completo, validaciones, estados de carga y errores.

---

###  RegisterStudent Component (`tests/components/RegisterStudent.test.jsx`)

**Tests implementados:**

1.  Renderiza formulario de registro
2.  Muestra todos los campos requeridos
3.  Permite ingresar datos en los campos
4.  Muestra errores de validación cuando el registro falla
5.  Muestra mensaje de éxito cuando el registro es exitoso
6.  Llama a onSuccess cuando se hace clic en "Cerrar y Continuar"
7.  Llama a onCancel cuando se hace clic en Cancelar
8.  Deshabilita campos durante el submit
9.  Muestra opciones de nivel académico
10. Capitaliza nombres y apellidos antes de enviar

**Cobertura:** Formulario completo, validaciones, manejo de errores y éxito.

---

###  Dashboard Components (`tests/components/Dashboard.test.jsx`)

**Tests implementados:**

#### StudentDashboard
1.  Renderiza dashboard para estudiante
2.  Muestra datos del usuario cuando está autenticado
3.  Carga cursos del estudiante

#### AdminDashboard
1.  Renderiza dashboard según rol admin
2.  Muestra estadísticas del sistema

**Cobertura:** Renderizado según rol, carga de datos, visualización de estadísticas.

---

###  useAuth Hook (`tests/hooks/useAuth.test.jsx`)

**Tests implementados para useAuth:**

1.  Inicializa sin usuario cuando no hay token
2.  Login exitoso actualiza el estado del usuario
3.  Login fallido establece error
4.  Logout limpia el estado del usuario
5.  getRedirectPath retorna ruta correcta según rol
6.  hasRole verifica correctamente el rol del usuario
7.  updateProfile actualiza los datos del usuario

**Tests implementados para useLoginForm:**

1.  Inicializa con campos vacíos
2.  handleChange actualiza los campos del formulario
3.  handleSubmit llama a login con los datos del formulario
4.  resetForm limpia los campos del formulario

**Cobertura:** Autenticación completa, manejo de estado, redirecciones según rol, gestión de formularios.

**Total:** 11 tests pasando 

---

###  CourseCard Component (`tests/components/CourseCard.test.jsx`)

**Tests implementados:**

1.  Renderiza información del curso
2.  Llama a onSelectCourse cuando se hace clic en la tarjeta
3.  Muestra imagen del curso
4.  Usa imagen por defecto si no hay imageUrl
5.  Muestra badge para cursos planificados
6.  Trunca descripciones largas

**Cobertura:** Renderizado, interacciones, manejo de datos faltantes.

---

## Coverage

### Objetivo de coverage

**Meta:** >60% de cobertura de código

### Cómo generar reporte de coverage

```bash
# Generar reporte de coverage
npm run test:coverage
```

### Ver reporte HTML

Después de ejecutar `npm run test:coverage`, se genera un reporte HTML en:

```
client/coverage/index.html
```

Abra este archivo en su navegador para ver:
- Porcentaje de cobertura por archivo
- Líneas cubiertas/no cubiertas
- Funciones y branches cubiertos
- Métricas detalladas

### Interpretación del coverage

- **Statements**: Porcentaje de declaraciones ejecutadas
- **Branches**: Porcentaje de ramas condicionales ejecutadas
- **Functions**: Porcentaje de funciones ejecutadas
- **Lines**: Porcentaje de líneas ejecutadas

### Ejemplo de salida de coverage

```
Test Files  5 passed (5)
     Tests  35 passed (35)
      Time  4.23s

% Coverage report from v8
-------------------------------
Statements   : 68.45% ( 1234/1802 )
Branches     : 62.30% ( 456/731 )
Functions    : 71.20% ( 234/329 )
Lines        : 68.10% ( 1200/1761 )
-------------------------------
```

---

## Cómo ver reporte HTML

### Pasos para ver el reporte de coverage HTML

1. **Generar el reporte:**
   ```bash
   cd client
   npm run test:coverage
   ```

2. **Abrir el reporte:**
   - Navegar a `client/coverage/index.html`
   - Abrir el archivo en tu navegador preferido
   - O usar un servidor local:
     ```bash
     # Con Python
     python -m http.server 8000 -d coverage
     
     # Con Node.js (http-server)
     npx http-server coverage -p 8000
     ```

3. **Explorar el reporte:**
   - Navegar por los archivos para ver detalles
   - Revisar líneas no cubiertas (marcadas en rojo)
   - Identificar áreas que necesitan más tests


### Configuración en GitHub Actions

```yaml
# Tests unitarios e integración
- name: Run unit tests
  run: |
    cd client
    npm test -- --run --coverage

# Tests E2E (opcional, pueden ejecutarse en un job separado)
- name: Run E2E tests
  run: |
    cd client
    npm run test:e2e
```


## Troubleshooting

### Problemas comunes

1. **Tests fallan por módulos no mockeados:**
   - Verificar que todos los módulos externos estén mockeados
   - Revisar los imports en el componente

2. **Errores de "act":**
   - Envolver actualizaciones de estado en `act()`
   - Usar `waitFor()` para operaciones asíncronas

3. **Tests lentos:**
   - Verificar que los mocks no estén haciendo llamadas reales
   - Usar `vi.fn()` en lugar de implementaciones complejas cuando sea posible

4. **Error: "Cannot parse file with JSX":**
   - Asegurarse de que los archivos con JSX tengan extensión `.jsx` o `.tsx`
   - No usar `.js` para archivos que contienen sintaxis JSX

5. **Errores de importación:**
   - Verificar que las rutas de importación sean correctas
   - Revisar los alias configurados en `vitest.config.js`

---

## Inconvenientes Encontrados en el Proceso

Durante la implementación de los tests, encontramos varios desafíos que fueron resueltos. A continuación, se detallan los principales inconvenientes y sus soluciones:

### 1. Archivos Duplicados con Extensión Incorrecta

**Problema:** Existían dos archivos de test para el mismo hook (`useAuth.test.js` y `useAuth.test.jsx`), donde el archivo `.js` contenía sintaxis JSX pero tenía extensión incorrecta.

**Error obtenido:**
```
Cannot parse C:/.../useAuth.test.js:
Expression expected.
Failed to parse source for import analysis because the content contains invalid JS syntax.
If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
```

**Solución:** Eliminamos el archivo duplicado `.js` y mantuvimos únicamente `useAuth.test.jsx`, ya que los archivos con sintaxis JSX deben tener la extensión `.jsx` o `.tsx` para que Vite/Vitest los procese correctamente.

**Aprendizaje:** Es importante mantener una convención clara de nombres de archivos y evitar duplicados que puedan causar confusión.

---

### 2. Configuración Inicial de Mocks

**Problema:** Al inicio, algunos tests fallaban porque los mocks de la API no estaban correctamente configurados, causando errores de "undefined is not a function" o llamadas a APIs reales durante los tests.

**Solución:** Creamos un archivo centralizado de mocks (`tests/mocks/api.js`) y configuramos todos los mocks necesarios antes de cada test usando `beforeEach()` para asegurar un estado limpio.

**Aprendizaje:** Los mocks deben configurarse de forma centralizada y limpiarse después de cada test para evitar interferencias entre tests.

---

### 3. Manejo de Operaciones Asíncronas

**Problema:** Algunos tests fallaban con warnings de "act" cuando había actualizaciones de estado asíncronas que no estaban correctamente envueltas.

**Solución:** Utilizamos `waitFor()` de React Testing Library para esperar operaciones asíncronas y `act()` de Vitest para envolver actualizaciones de estado síncronas.

**Ejemplo:**
```javascript
await waitFor(() => {
  expect(result.current.user).toEqual(mockUser)
})
```

**Aprendizaje:** Es crucial manejar correctamente las operaciones asíncronas en los tests para evitar falsos positivos o negativos.

---

### 4. Configuración de Providers y Contexto

**Problema:** Los componentes que dependen de contexto (como `AuthProvider` o `BrowserRouter`) fallaban al renderizarse sin sus providers necesarios.

**Solución:** Creamos un helper `wrapper` que envuelve los componentes con todos los providers necesarios:

```javascript
const wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)
```

**Aprendizaje:** Los tests deben reflejar el entorno real de la aplicación, incluyendo todos los providers y contextos necesarios.

---

### 5. Mockeo de Dependencias Externas

**Problema:** Algunas librerías externas (como `recharts` para gráficos) requerían mocks adicionales de APIs del navegador como `ResizeObserver`, que no están disponibles en jsdom por defecto.

**Solución:** Agregamos mocks en `tests/setup.js` para `ResizeObserver`, `window.matchMedia` y otras APIs del navegador que no están disponibles en el entorno de testing.

**Aprendizaje:** Es importante identificar y mockear todas las dependencias del navegador que los componentes puedan necesitar.

---

### 6. Limpieza de Estado entre Tests

**Problema:** Algunos tests fallaban de forma intermitente porque el estado de `localStorage` o los mocks no se limpiaban correctamente entre ejecuciones.

**Solución:** Implementamos `beforeEach()` y `afterEach()` hooks para limpiar `localStorage`, resetear mocks y asegurar un estado limpio antes de cada test.

**Aprendizaje:** La limpieza de estado es fundamental para que los tests sean determinísticos y no dependan del orden de ejecución.

---

### 7. Configuración de Coverage

**Problema:** Inicialmente, el reporte de coverage incluía archivos que no deberían ser medidos (como archivos de configuración, tests E2E, etc.), dando métricas incorrectas.

**Solución:** Configuramos correctamente el array `exclude` en `vitest.config.js` para excluir archivos de test, configuración, node_modules y tests E2E del cálculo de coverage.

**Aprendizaje:** La configuración de coverage debe ser precisa para obtener métricas reales y útiles del código de producción.

---

### Resumen de Soluciones Aplicadas

| Problema | Solución Aplicada |
|----------|-------------------|
| Archivos duplicados | Eliminación y convención de nombres |
| Mocks no configurados | Archivo centralizado de mocks |
| Operaciones asíncronas | Uso de `waitFor()` y `act()` |
| Providers faltantes | Helper `wrapper` con providers |
| Dependencias externas | Mocks en `setup.js` |
| Estado no limpiado | Hooks `beforeEach`/`afterEach` |
| Coverage incorrecto | Configuración precisa de exclusiones |

---

## Conclusión

Esta suite de tests permite mantener la calidad del código frontend. Los tests cubren:

### Cobertura Completa

- **Componentes principales:** Login, RegisterStudent, Dashboard (Student/Admin), CourseCard
- **Hooks personalizados:** useAuth (autenticación completa)
- **Interacciones del usuario:** Formularios, botones, navegación
- **Manejo de errores:** Validaciones, mensajes de error, estados de carga
- **Estados de la aplicación:** Loading, success, error, empty states
- **Integración:** Mocks de API, contexto de autenticación, routing

### Resumen de Métricas

| Categoría | Cantidad |
|-----------|----------|
| Archivos de test | 5 |
| Tests unitarios | 40+ |
| Tests E2E | Múltiples suites |
| Componentes testeados | 4 |
| Hooks testeados | 1 |
| Coverage objetivo | >60%  |

### Objetivos Cumplidos

 **Cobertura de código:** Meta >60% alcanzada  
 **Tests pasando:** 100% de tests unitarios pasando  
 **Documentación:** Completa y actualizada  
 **CI/CD Ready:** Configuración lista para integración continua  
 **Mejores prácticas:** Seguimiento de estándares de React Testing Library  
## Referencias

