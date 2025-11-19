# Testing Backend - DevOps

## Descripción

Tests unitarios implementados para la entrega DevOps del sistema TPI Tech Moms.

## Estructura de Tests

```
__tests__/
├── models/
│   ├── admin.test.js      # Tests modelo Admin (16 tests)
│   ├── baseUser.test.js   # Tests modelo BaseUser (15 tests)
│   └── profesor.test.js   # Tests modelo Profesor (15 tests)
└── setup.js               # Configuración global Jest
```

## Tecnologías

- **Jest** - Framework de testing
- **MongoDB Memory Server** - Base de datos en memoria
- **Mongoose** - ODM para MongoDB

## Comandos

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:models

# Reporte HTML
npm run test:html
```

## Estadísticas

- **Total:** 46 tests unitarios
- **Coverage:** 3.81% baseline
- **Estado:** 46/46 pasando (100%)

## Tests Implementados

### BaseUser (15 tests)
- Creación de usuarios por tipo
- Validaciones de email y password
- Hash automático de contraseñas
- Métodos virtuales y serialización

### Profesor (15 tests)
- Especialidades válidas
- Validación de tarifas
- Disponibilidad por días
- Herencia de BaseUser

### Admin (16 tests)
- Permisos de administrador
- Validaciones específicas
- DNI opcional
- Herencia completa

## Configuración

Ver `jest.config.js` para configuración completa de Jest y MongoDB Memory Server.