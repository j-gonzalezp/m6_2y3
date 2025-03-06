Cambié supabase, por un servidor propio, esté está en http://localhost:5000
Los queries para la base de datos estan en la carpeta database, en queries.sql

Para ir a la ruta protegida /admin 
logear con
user: admin@salvador.cl
password: admin123

Para logear como usuario normal
user:usuario1@salvador.cl
password: user123


Las dependencias a utilizar, todas instaladas a través de npm
 "dependencies": {
    "@supabase/supabase-js": "^2.47.10",
    "axios": "^1.7.9",
    "bcryptjs": "^2.4.3",
    "bootstrap": "^5.3.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "jwt-decode": "^4.0.0",
    "jwt-simple": "^0.5.6",
    "pg": "^8.13.1",
    "react": "^18.3.1",
    "react-bootstrap": "^2.10.7",
    "react-dom": "^18.3.1",
    "react-helmet": "^6.1.0",
    "react-router": "^7.0.2",
    "react-router-dom": "^7.1.1",
    "y": "^0.3.2"
  },# hospital_m5_real

## Progressive Web App (PWA) Features

Esta aplicación ahora cuenta con funcionalidades de PWA, lo que permite instalarse como una aplicación nativa y funcionar sin conexión a internet:

### Características implementadas:

1. **Manifiesto Web**
   - Archivo manifest.json con información esencial de la aplicación
   - Iconos en múltiples resoluciones
   - Configuración de pantalla completa (standalone)
   - Colores de tema personalizados

2. **Service Worker**
   - Precarga (precaching) de archivos esenciales
   - Funcionamiento offline básico
   - Página offline personalizada

3. **Estrategias de Caché**
   - Cache-first: Para recursos estáticos (CSS, JS, SVG)
   - Stale-While-Revalidate: Para páginas HTML y contenido dinámico

Para probar la funcionalidad offline:
1. Carga la aplicación en el navegador
2. Abre las herramientas de desarrollo (F12)
3. Ve a la pestaña "Application" > "Service Workers"
4. Marca la casilla "Offline"
5. Recarga la página para ver el comportamiento offline
# m6_2y3
