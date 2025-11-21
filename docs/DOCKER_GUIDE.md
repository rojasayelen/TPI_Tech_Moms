# 🐳 Guía de Dockerización - Consultora de Idiomas

## Requisitos Previos

- Docker Desktop instalado
- Git instalado
- Al menos 4GB de RAM disponible

## Instalación de Docker

1. Descargar Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Instalar siguiendo el asistente
3. Verificar instalación:
```bash
docker --version
docker-compose --version
```

## Levantar la Aplicación
```bash
# 1. Clonar el repositorio
git clone [https://github.com/rojasayelen/TPI_Tech_Moms]
cd [TPI_Tech_Moms]

# 2. Levantar todos los servicios
docker-compose up -d

# 3. Verificar que estén corriendo
docker-compose ps
```

## Acceder a la Aplicación

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017

## Comandos Útiles
```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend

# Detener todos los servicios
docker-compose down

# Reiniciar un servicio
docker-compose restart backend

# Ver contenedores corriendo
docker-compose ps
```

## Troubleshooting

### Error: Puerto ya en uso
```bash
# Verificar qué está usando el puerto
lsof -i :3000
lsof -i :5000

# Cambiar el puerto en docker-compose.yml
```

### Error: No se puede conectar a MongoDB
```bash
# Verificar que MongoDB esté corriendo
docker-compose ps mongodb

# Ver logs de MongoDB
docker-compose logs mongodb
```

### Limpiar todo y empezar de cero
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

## Variables de Entorno

El backend usa estas variables (configuradas en docker-compose.yml):
- `MONGO_URI`: Conexión a MongoDB
- `PORT`: Puerto del servidor
- `NODE_ENV`: Entorno de ejecución

## Imágenes en Docker Hub

- Backend: romarvz/consultora-backend:latest
- Frontend: romarvz/consultora-frontend:latest