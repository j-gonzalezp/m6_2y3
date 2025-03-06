# Sistema de Gestión Hospitalaria

## Configuración del Servidor

El sistema utiliza un servidor propio que corre en http://localhost:5000.
Los queries para la base de datos están en la carpeta database, en queries.sql

### Credenciales de Acceso

Para ir a la ruta protegida /admin:
- user: admin@salvador.cl
- password: admin123

Para logear como usuario normal:
- user: usuario1@salvador.cl
- password: user123

## Funcionalidades Principales

### 1. Gestión de Usuarios
- Registro de nuevos usuarios
- Inicio de sesión con autenticación JWT
- Perfiles de usuario con distintos niveles de acceso (admin/usuario)

### 2. Módulo de Citas
- Visualización del calendario de citas
- Agendamiento de nuevas citas médicas
- Cancelación y modificación de citas existentes
- Asignación automática de doctores según especialidad

### 3. Equipo Médico
- Directorio completo del equipo médico
- Filtrado por especialidad
- Perfiles detallados de cada doctor
- Integración con sistema de citas

### 4. Panel de Administración
- Gestión integral de doctores (crear, actualizar, eliminar)
- Monitoreo de citas programadas
- Estadísticas y reportes

## Progressive Web App (PWA)

La aplicación implementa tecnologías PWA que permiten su instalación como aplicación nativa y funcionamiento sin conexión a internet:

### 1. Manifiesto Web
- Archivo manifest.json con información esencial de la aplicación
- Iconos adaptativos en múltiples resoluciones
- Configuración de pantalla completa (standalone)
- Colores de tema y orientación personalizados
- Accesos directos a funciones principales

### 2. Service Worker Avanzado
- Precarga (precaching) de archivos esenciales
- Funcionamiento offline completo
- Página offline personalizada con opciones de navegación
- Gestión del ciclo de vida y actualización automática
- Notificación de nuevas versiones disponibles

### 3. Estrategias de Caché
- **Cache-First**: Para recursos estáticos (CSS, JS, SVG)
- **Network-First with IndexedDB Fallback**: Para recursos de API
- **Stale-While-Revalidate**: Para páginas HTML y contenido dinámico

### 4. Almacenamiento Web
- **LocalStorage**: Almacenamiento de preferencias de usuario y páginas visitadas
- Gestión eficiente de datos de sesión
- Persistencia entre recargas de página

### 5. IndexedDB
- Base de datos completa en el navegador
- Almacenamiento de citas, doctores y datos médicos
- Sincronización automática con el servidor cuando hay conexión
- Acceso a datos cuando se está sin conexión

### 6. Acceso a Periféricos
- Integración con cámara para captura de imágenes médicas
- Utilización de geolocalización para servicios de emergencia
- Cálculo de distancia y rutas al hospital

### 7. Consumo de API Externa
- Integración con API médica externa (Clinical Tables API del NIH)
- Búsqueda y filtrado de datos médicos
- Almacenamiento en caché para acceso offline
- Manejo de errores y estados de carga

## Prueba de Funcionalidades Offline

Para probar el funcionamiento sin conexión:
1. Carga la aplicación en el navegador
2. Abre las herramientas de desarrollo (F12)
3. Ve a la pestaña "Application" > "Service Workers"
4. Marca la casilla "Offline"
5. Navega por la aplicación para comprobar su funcionamiento sin conexión

## Módulos de Demostración

La aplicación incluye módulos específicos para demostrar las capacidades PWA:

- **/storage-demo**: Demuestra el uso de LocalStorage y su persistencia
- **/device-access**: Muestra el acceso a cámara y geolocalización
- **/medical-api**: Exhibe la integración con API externa y almacenamiento IndexedDB

## Tecnologías Utilizadas

Frontend:
- React 18
- React Router
- React Bootstrap
- Service Workers
- IndexedDB, LocalStorage
- Fetch API

Backend:
- Node.js con Express
- PostgreSQL
- JWT para autenticación
- Helmet para seguridad

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Iniciar servidor backend
node server.js
```
