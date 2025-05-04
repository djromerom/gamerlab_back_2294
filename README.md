# 🎮 GamerLab - Plataforma de Gestión de Videojuegos Académicos

Sistema web para gestionar el proceso de inscripción, evaluación y seguimiento de videojuegos desarrollados por estudiantes.

## 🚀 Características Principales

### Para Estudiantes

- Registro de equipos de desarrollo
- Inscripción de videojuegos
- Sistema de confirmación por email
- Seguimiento del estado de inscripción

### Para Jurados

- Portal dedicado para evaluación
- Sistema de calificación con rúbricas predefinidas
- Visualización de proyectos asignados
- Gestión de evaluaciones realizadas

### Para Administradores

- Panel de control centralizado
- Gestión de materias y NRCs
- Administración de jurados
- Monitoreo en tiempo real del evento
- Generación de reportes y estadísticas

## 🛠️ Tecnologías

- Backend:
  - NestJS (Node.js framework)
  - TypeScript
  - PostgreSQL (vía Prisma ORM)
  - JWT para autenticación
  - Nodemailer para emails

- Frontend:
  - React/Vue.js (próximamente)
  - Tailwind CSS
  - Chart.js para visualizaciones

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/gamerlab_back.git
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

```bash
cp .env.example .env
# Edita .env con tus credenciales
```

4. Ejecuta las migraciones:

```bash
npx prisma migrate dev
```

5. Inicia el servidor:

```bash
npm run start:dev
```

## 🗄️ Estructura del Proyecto

```
src/
├── modules/           # Módulos principales
│   ├── equipo/       # Gestión de equipos
│   ├── estudiante/   # Gestión de estudiantes
│   ├── videojuego/   # Gestión de videojuegos
│   └── jurado/       # Gestión de jurados
├── common/           # Código compartido
├── config/          # Configuraciones
└── prisma/          # Modelos y migraciones
```

## 📝 API Endpoints

### Estudiantes

- `POST /api/v1/equipo` - Registro de equipo
- `POST /api/v1/videojuego` - Registro de videojuego
- `GET /api/v1/inscripciones` - Estado de inscripciones

### Jurados

- `GET /api/v1/evaluaciones` - Lista de proyectos a evaluar
- `POST /api/v1/evaluaciones` - Enviar evaluación
- `GET /api/v1/resultados` - Ver resultados

### Admin

- `GET /api/v1/admin/dashboard` - Panel de control
- `POST /api/v1/admin/jurados` - Gestión de jurados
- `GET /api/v1/admin/reportes` - Generación de reportes

## 📊 Modelos de Datos

El sistema utiliza los siguientes modelos principales:

- `Usuario` - Información base de usuarios
- `Estudiante` - Perfil de estudiante
- `Equipo` - Grupos de desarrollo
- `Videojuego` - Proyectos registrados
- `Jurado` - Evaluadores
- `Evaluacion` - Calificaciones realizadas

Ver el schema completo en [prisma/schema.prisma](prisma/schema.prisma)
