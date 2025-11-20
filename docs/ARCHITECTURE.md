# Arquitectura del Sistema - Consultora de Idiomas

## Diagrama de Arquitectura General

![Arquitectura del Sistema](images/arquitectura.png)

*Nota: Para generar el diagrama PNG, usar el código Mermaid siguiente o las herramientas mencionadas en `images/README.md`*

```mermaid
graph TB
    subgraph "Frontend"
        A[React + Vite<br/>Puerto 3000]
        A1[Componentes UI]
        A2[React Router]
        A3[Axios HTTP Client]
        A4[Playwright E2E Tests]
        
        A --> A1
        A --> A2
        A --> A3
        A --> A4
    end
    
    subgraph "Backend"
        B[Node.js + Express<br/>Puerto 5000]
        B1[Controllers]
        B2[Services]
        B3[Middleware Auth]
        B4[Winston Logger]
        B5[Routes API]
        
        B --> B1
        B --> B2
        B --> B3
        B --> B4
        B --> B5
    end
    
    subgraph "Base de Datos"
        C[MongoDB Atlas]
        C1[Users Collection]
        C2[Courses Collection]
        C3[Classes Collection]
        C4[Payments Collection]
        C5[Reports Collection]
        
        C --> C1
        C --> C2
        C --> C3
        C --> C4
        C --> C5
    end
    
    subgraph "Infraestructura"
        D[Docker Containers]
        D1[Frontend Container]
        D2[Backend Container]
        D3[MongoDB Container]
        
        D --> D1
        D --> D2
        D --> D3
    end
    
    subgraph "CI/CD"
        E[GitHub Actions]
        E1[Tests Backend]
        E2[Tests Frontend]
        E3[Build Docker]
        E4[Deploy]
        
        E --> E1
        E --> E2
        E --> E3
        E --> E4
    end
    
    A3 -->|HTTP/HTTPS| B5
    B2 -->|Mongoose ODM| C
    B4 -->|Logs| F[Log Files]
    
    style A fill:#61dafb
    style B fill:#68a063
    style C fill:#4db33d
    style D fill:#0db7ed
    style E fill:#f05032
```

## Diagrama de Pipeline CI/CD

![Pipeline CI/CD](images/pipeline.png)

*Nota: Aye puede mejorar/actualizar este diagrama después*

```mermaid
graph LR
    A[Push/PR to GitHub] --> B[GitHub Actions Trigger]
    B --> C[Install Dependencies]
    C --> D[Backend Tests]
    C --> E[Frontend Tests]
    D --> F{Tests Pass?}
    E --> F
    F -->|Yes| G[Build Docker Images]
    F -->|No| H[❌ Pipeline Fails]
    G --> I[Push to Docker Hub]
    I --> J[Deploy to Production]
    J --> K[✅ Deployment Complete]
    
    style A fill:#f9f9f9
    style B fill:#2088ff
    style D fill:#28a745
    style E fill:#28a745
    style F fill:#ffc107
    style G fill:#17a2b8
    style H fill:#dc3545
    style J fill:#6f42c1
    style K fill:#28a745
```

## Componentes del Sistema

### Frontend (React + Vite)
- **Puerto:** 3000
- **Tecnologías:** React 18, Vite, React Router DOM
- **Características:**
  - Interfaz de usuario moderna y responsiva
  - Enrutamiento del lado del cliente
  - Gestión de estado con hooks
  - Formularios con React Hook Form
  - Cliente HTTP con Axios

### Backend (Node.js + Express)
- **Puerto:** 5000
- **Tecnologías:** Node.js, Express, Mongoose
- **Características:**
  - API REST completa
  - Autenticación JWT
  - Middleware de autorización por roles
  - Logging con Winston
  - Validaciones con express-validator

### Base de Datos (MongoDB)
- **Tipo:** NoSQL Document Database
- **Hosting:** MongoDB Atlas (Cloud)
- **Características:**
  - Modelos discriminados para usuarios
  - Índices únicos para email y DNI
  - Relaciones entre colecciones
  - Timestamps automáticos

### Contenedores Docker
- **Frontend Container:** Nginx + React build
- **Backend Container:** Node.js + Express
- **MongoDB:** Servicio externo (Atlas)

### CI/CD Pipeline
- **Trigger:** Push o Pull Request a GitHub
- **Tests:** Backend (Jest) + Frontend (Playwright)
- **Build:** Docker images
- **Deploy:** Automático en producción

## Flujo de Datos

### 1. Autenticación
```
Usuario → Frontend → Backend API → MongoDB → JWT Token → Frontend
```

### 2. Operaciones CRUD
```
Frontend → HTTP Request → Backend Controller → Service → MongoDB → Response → Frontend
```

### 3. Logging
```
Backend Operations → Winston Logger → Log Files (app.log, error.log)
```

## Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | ^18.2.0 | Biblioteca UI |
| Vite | ^4.4.5 | Build tool |
| React Router DOM | ^7.9.1 | Enrutamiento |
| Axios | ^1.12.1 | Cliente HTTP |
| React Hook Form | ^7.62.0 | Formularios |
| Playwright | ^1.56.1 | Tests E2E |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | v18+ | Runtime JavaScript |
| Express | ^4.18.2 | Framework web |
| Mongoose | ^7.5.0 | ODM MongoDB |
| JWT | ^9.0.2 | Autenticación |
| Winston | ^3.11.0 | Logging |
| bcryptjs | ^3.0.2 | Encriptación |

### Base de Datos
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| MongoDB | 6.0+ | Base de datos |
| MongoDB Atlas | Cloud | Hosting |

### DevOps
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Docker | Latest | Contenedores |
| GitHub Actions | - | CI/CD |
| Jest | ^29.6.2 | Tests Backend |

## Seguridad

### Autenticación y Autorización
- JWT tokens con expiración de 24h
- Middleware de autenticación en todas las rutas protegidas
- Roles diferenciados: Admin, Profesor, Estudiante
- Passwords hasheados con bcryptjs

### Validaciones
- Validación de entrada con express-validator
- Sanitización de datos
- Validaciones de esquema en MongoDB
- CORS configurado para dominios específicos

### Logging y Monitoreo
- Winston logger con niveles configurables
- Logs de autenticación y errores
- Archivos de log rotativos
- Monitoreo de errores críticos

## Escalabilidad

### Horizontal
- Contenedores Docker para fácil escalado
- API stateless con JWT
- Base de datos en la nube (MongoDB Atlas)

### Vertical
- Optimización de consultas MongoDB
- Índices en campos frecuentemente consultados
- Paginación en listados grandes
- Caching de respuestas frecuentes (futuro)

## Monitoreo y Observabilidad

### Logs
- **Ubicación:** `server/logs/`
- **Niveles:** error, warn, info, debug
- **Formato:** JSON estructurado
- **Rotación:** Configurada para producción

### Métricas (Futuro)
- Tiempo de respuesta de endpoints
- Número de usuarios activos
- Errores por minuto
- Uso de recursos del servidor

## Deployment

### Desarrollo
```bash
# Frontend
cd client && npm run dev

# Backend  
cd server && npm run dev
```

### Producción
```bash
# Docker Compose
docker-compose up -d

# O individual
docker run -p 3000:80 consultora-frontend
docker run -p 5000:5000 consultora-backend
```

---

**Documentación creada por:** Vero  
**Fecha:** Noviembre 2024  
**Versión:** 1.0