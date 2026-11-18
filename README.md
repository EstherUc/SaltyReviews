# SaltyReviews

SaltyReviews es una aplicación web para descubrir restaurantes, compartir
experiencias gastronómicas y guardar establecimientos como favoritos.

Incluye una interfaz renderizada con EJS y una API REST desarrollada con
Express, con datos almacenados en PostgreSQL mediante Sequelize.

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Roles de usuario y administrador.
- Gestión de restaurantes y categorías.
- Creación, consulta, edición y eliminación de reseñas.
- Valoraciones de restaurantes entre 1 y 5.
- Favoritos por usuario y indicador de "quiero visitar".
- CRUD disponible desde vistas web y endpoints REST.
- Datos de demostración cargados automáticamente al crear la base de datos.

## Tecnologías

- Node.js 20
- Express 5
- EJS
- PostgreSQL 18
- Sequelize
- express-session
- bcrypt
- Docker y Docker Compose
- PgAdmin

## Requisitos

Para ejecutar el proyecto con Docker:

- Docker
- Docker Compose

Para ejecutarlo directamente en el equipo:

- Node.js 20 o superior
- npm
- PostgreSQL

## Configuración

Crea un archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Ejemplo de variables para Docker Compose:

```env
APP_HOST=saltyreviews
APP_PORT=3000

POSTGRES_HOST=postgres
POSTGRES_USER=saltyreviews
POSTGRES_PASSWORD=saltyreviews
POSTGRES_DB=saltyreviews

PGADMIN_HOST=saltyreviews-pgadmin
PGADMIN_PORT=5050
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin

SESSION_SECRET=una_cadena_secreta_larga
JWT_SECRET=una_cadena_secreta_larga
PORT=3000
```

`POSTGRES_HOST` debe ser `postgres` al ejecutar la aplicación dentro de Docker
y `localhost` al ejecutarla fuera de los contenedores.

## Ejecución con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

La aplicación estará disponible en:

- Aplicación: http://localhost:3000
- PgAdmin: http://localhost:5050

El esquema y los datos de demostración se crean desde los archivos de
`sql/01_schema.sql` y `sql/02_seed.sql` la primera vez que arranca el volumen
de PostgreSQL.

Para detener los contenedores:

```bash
docker compose down
```

Para eliminar también los datos persistentes de PostgreSQL:

```bash
docker compose down -v
```

## Ejecución local

Instala las dependencias:

```bash
npm install
```

Crea la base de datos en PostgreSQL y ejecuta los scripts de `sql/` en este
orden:

1. `sql/01_schema.sql`
2. `sql/02_seed.sql`

Después, configura `.env` con `POSTGRES_HOST=localhost` y arranca el servidor:

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000.

Para iniciar sin nodemon:

```bash
npm start
```

## Datos de demostración

Las cuentas de demostración incluyen una cuenta administradora y varios
usuarios normales.

| Cuenta | Email | Contraseña |
| --- | --- | --- |
| Administrador | `admin@demo.test` | `Admin` |
| Usuario | `irene@demo.test` | `Demo1234!` |

La base de datos incluye categorías, restaurantes, usuarios, reseñas y
favoritos de ejemplo.

## Rutas principales

### Vistas

| Ruta | Descripción |
| --- | --- |
| `/home` | Página principal |
| `/auth/login` | Inicio de sesión |
| `/auth/register` | Registro |
| `/restaurant` | Listado de restaurantes |
| `/category` | Categorías |
| `/review` | Reseñas |
| `/favorite` | Favoritos |
| `/user` | Usuarios |

### API

| Recurso | Base |
| --- | --- |
| Reseñas | `/api/review` |
| Usuarios | `/api/user` |
| Categorías | `/api/category` |
| Restaurantes | `/api/restaurant` |
| Favoritos | `/api/favorite` |

La API admite operaciones `GET`, `POST`, `PUT`, `PATCH` y `DELETE` según el
recurso. Comprueba `/api` para verificar que el servicio responde.

## Estructura del proyecto

```text
SaltyReviews/
├── public/          # Archivos estáticos CSS e imágenes
├── sql/             # Esquema y datos de demostración
├── src/
│   ├── config/      # Configuración de PostgreSQL y Sequelize
│   ├── controllers/ # Controladores de vistas y API
│   ├── middlewares/ # Autenticación y permisos
│   ├── models/      # Modelos Sequelize
│   ├── repositories/# Acceso a datos
│   ├── routes/      # Rutas web y REST
│   ├── views/       # Plantillas EJS
│   └── index.js     # Punto de entrada de la aplicación
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Scripts disponibles

```bash
npm start  # Inicia la aplicación
npm run dev # Inicia la aplicación con nodemon
npm test    # Actualmente no hay pruebas configuradas
```

## Licencia

Este proyecto utiliza la licencia indicada en el archivo
[`LICENSE`](./LICENSE).
