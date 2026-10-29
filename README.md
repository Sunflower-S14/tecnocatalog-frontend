# TecnoCatalog Frontend

Interfaz web de **TecnoCatalog**, desarrollada con Angular. Permite consultar el catálogo de productos, iniciar sesión, registrar usuarios, gestionar productos y categorías desde el panel administrativo y administrar una lista de productos favoritos.

## Tecnologías utilizadas

- Angular
- TypeScript
- HTML5 y CSS3
- Bootstrap Icons
- Angular Router
- Angular HttpClient
- Autenticación mediante JWT
- Server-Side Rendering (SSR) e hidratación de Angular

## Requisitos del sistema

Antes de ejecutar el proyecto, instala lo siguiente:

- **Node.js:** versión compatible con la versión de Angular utilizada por el proyecto.
- **npm:** administrador de paquetes de Node.js.
- **Angular CLI:** herramienta de desarrollo de Angular, opcional si utilizas los scripts de npm.
- **Backend de TecnoCatalog:** debe estar configurado y ejecutándose para utilizar las funcionalidades que requieren acceso a la API.

Comprueba las versiones instaladas con los comandos:

```bash
node -v
npm -v
```

Para consultar la versión de Angular del proyecto, ejecuta desde su directorio:

```bash
npx ng version
```

## Instalación

### 1. Obtener el proyecto

Clona el repositorio o abre la carpeta del frontend en tu editor de código.

### 2. Instalar las dependencias

Desde la raíz del proyecto, ejecuta:

```bash
npm install
```

Este comando instala las dependencias declaradas en `package.json`.

### 3. Configurar la conexión con el backend

Verifica la URL base que utilizan los servicios de Angular para comunicarse con la API.

Para el entorno local, el backend está disponible por defecto en:

`http://localhost:8080`

Si la URL está definida en un archivo de configuración o directamente en los servicios, comprueba que corresponda a la dirección donde se ejecuta el backend.

## Ejecución en entorno local

### 1. Iniciar el backend

Primero, ejecuta el backend de TecnoCatalog y verifica que pueda conectarse correctamente a MySQL.

### 2. Iniciar el frontend

En otra terminal, desde la raíz del frontend, ejecuta:

```bash
npm start
```

Si el proyecto no define el script `start`, utiliza:

```bash
npx ng serve
```

### 3. Acceder a la aplicación

Abre el navegador y visita:

`http://localhost:4200`

La aplicación estará disponible mientras el servidor de desarrollo permanezca en ejecución.

## Funcionalidades principales

- **Catálogo de productos:** consulta de los productos disponibles.
- **Autenticación:** inicio de sesión y registro de usuarios.
- **Favoritos:** consulta y administración de productos favoritos para usuarios autenticados.
- **Panel administrativo:** acceso a las funciones de administración según el rol del usuario.
- **Gestión de productos:** consulta, creación, edición y eliminación de productos.
- **Gestión de categorías:** consulta, creación, edición y eliminación de categorías.
- **Perfil de usuario:** consulta de la información de la cuenta.

## Estructura general del proyecto

El frontend organiza sus responsabilidades mediante componentes, servicios, guards e interceptores.

```text
src/
└── app/
    ├── guards/          # Control de acceso a las rutas
    ├── interceptors/    # Interceptores de solicitudes HTTP
    ├── pages/           # Páginas y vistas de la aplicación
    ├── services/        # Comunicación con el backend y autenticación
    ├── app.config.ts    # Configuración de la aplicación
    ├── app.routes.ts    # Definición de rutas
    └── app.ts           # Componente principal, según la estructura del proyecto
```

La estructura anterior es orientativa. Los nombres y archivos definitivos deben coincidir con los que contiene el repositorio.

## Seguridad y comunicación con la API

- El token JWT obtenido durante el inicio de sesión se utiliza para autenticar las solicitudes que requieren autorización.
- El interceptor HTTP agrega el token a las solicitudes correspondientes.
- Los guards controlan el acceso a las rutas de acuerdo con el estado de autenticación y el rol del usuario.
- Los permisos definitivos deben ser validados también por el backend.
- El backend debe permitir las solicitudes de origen `http://localhost:4200` mediante su configuración CORS.

## Consideraciones adicionales

- El frontend y el backend deben ejecutarse simultáneamente para utilizar las funcionalidades que consultan o modifican datos.
- Si el backend utiliza otro puerto o dirección, actualiza la configuración de la API.
- Si existen errores de conexión, verifica que el backend esté activo y que la URL de la API sea correcta.
- No incluyas tokens ni credenciales personales en el repositorio.
