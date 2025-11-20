# Sistema de Monitoreo y Logging

## Winston Logging System

### Configuración Implementada

El sistema utiliza **Winston** como biblioteca de logging con la siguiente configuración:

#### Niveles de Log
- **error**: Errores críticos del sistema
- **warn**: Advertencias y situaciones sospechosas  
- **info**: Información general del sistema
- **debug**: Información detallada para desarrollo

#### Formato de Logs
```
[TIMESTAMP] [LEVEL] MESSAGE
2024-01-15 10:30:45 info: Server running on port 5000
2024-01-15 10:31:02 error: Error en login: Invalid credentials
```

#### Salidas Configuradas
- **Consola**: Logs coloreados en desarrollo
- **Archivo error.log**: Solo errores críticos
- **Archivo app.log**: Todos los niveles de log

### Ubicación de Archivos

```
server/
├── config/
│   └── logger.js          # Configuración Winston
├── logs/
│   ├── app.log           # Todos los logs
│   └── error.log         # Solo errores
```

### Logs Implementados

#### Autenticación
- ✅ Login exitoso con email y rol
- ✅ Errores de login con detalles
- ✅ Tokens expirados/inválidos
- ✅ Errores de registro de usuarios

#### Sistema
- ✅ Inicio del servidor con puerto y endpoints
- ✅ Conexión a MongoDB
- ✅ Errores críticos del sistema

#### Base de Datos
- ✅ Errores de conexión
- ✅ Operaciones fallidas
- ✅ Validaciones de datos

### Cómo Ver Logs

#### Desarrollo Local
```bash
# Ver logs en tiempo real
tail -f server/logs/app.log

# Ver solo errores
tail -f server/logs/error.log

# Ver logs en consola (desarrollo)
cd server && npm run dev
```

#### Docker
```bash
# Ver logs del contenedor backend
docker-compose logs -f backend

# Ver logs específicos
docker-compose logs backend | grep ERROR
docker-compose logs backend | grep "Login exitoso"
```

#### Filtrar Logs
```bash
# Buscar errores específicos
grep "Error en login" server/logs/app.log

# Ver logs de hoy
grep "$(date +%Y-%m-%d)" server/logs/app.log

# Contar errores
grep -c "error" server/logs/error.log
```

### Ejemplos de Logs

#### Login Exitoso
```json
{
  "timestamp": "2024-01-15 10:30:45",
  "level": "info",
  "message": "Login exitoso para usuario: admin@example.com (admin)",
  "service": "consultora-idiomas"
}
```

#### Error de Autenticación
```json
{
  "timestamp": "2024-01-15 10:31:02", 
  "level": "error",
  "message": "Error en login: Invalid credentials",
  "service": "consultora-idiomas",
  "stack": "Error: Invalid credentials\n    at login..."
}
```

#### Inicio del Servidor
```json
{
  "timestamp": "2024-01-15 10:30:00",
  "level": "info", 
  "message": "Server running on port 5000",
  "service": "consultora-idiomas"
}
```

### Configuración por Ambiente

#### Desarrollo
- Nivel: `debug`
- Salida: Consola + Archivos
- Formato: Coloreado y legible

#### Producción  
- Nivel: `info`
- Salida: Solo archivos
- Formato: JSON estructurado

### Monitoreo Recomendado

#### Métricas Clave
- Errores de login por minuto
- Tiempo de respuesta de endpoints
- Conexiones a base de datos
- Uso de memoria y CPU

#### Alertas Sugeridas
- Más de 10 errores por minuto
- Fallos de conexión a MongoDB
- Tokens expirados masivos
- Errores 500 frecuentes

### Rotación de Logs (Futuro)

Para implementar rotación automática:
```bash
npm install winston-daily-rotate-file
```

Configuración sugerida:
- Archivos diarios
- Máximo 14 días de retención
- Compresión automática
- Límite de 20MB por archivo

### Troubleshooting

#### Logs No Aparecen
1. Verificar permisos de escritura en `/logs`
2. Comprobar configuración de `NODE_ENV`
3. Revisar rutas de archivos en `logger.js`

#### Performance
- Los logs síncronos pueden afectar rendimiento
- Considerar logging asíncrono en producción
- Monitorear tamaño de archivos de log

### Comandos Útiles

```bash
# Crear directorio de logs
mkdir -p server/logs

# Ver últimas 100 líneas
tail -n 100 server/logs/app.log

# Buscar por usuario específico
grep "admin@example.com" server/logs/app.log

# Estadísticas de logs
wc -l server/logs/app.log
```

---

**Sistema implementado por:** Vero  
**Fecha:** Enero 2024  
**Versión:** 1.0