# Front Administrador

Una aplicación web construida con Next. **TypeScript**, que muestra la gestión y visualización de cursos.

## 🌐 Deploy

Accede a la aplicación en producción aquí:  
🔗 [https://front-admin.vercel.app](https://front-admin.vercel.app)

---

## 🔧 Clonar el repositorio

1. Haz clic en **Code** y copia la URL:

   ```bash
   https://github.com/SumajCode/Front-Admin.git # copiar
   ```

2. En tu terminal ejecuta:
   ```bash
   git clone https://github.com/SumajCode/Front-Admin.git  # copiar
   ```

---

## 🏗️ Instalación y arranque

1. Entra al directorio del proyecto:
   ```bash
   cd Front-Admin  # copiar
   ```
2. Instala las dependencias:
   ```bash
   npm install  # copiar
   ```
3. Arranca el servidor de desarrollo:
   ```bash
   npm run dev  # copiar
   ```
4. Ejecuta los tests:

   ```bash
   npm run test  # copiar

   ```

5. Abre tu navegador en http://localhost:3000

---

## 📂 Estructura del proyecto Screaming

```
FRONT-ADMIN/
├── public/                          # Archivos públicos estáticos (imágenes, etc.)
├── src/
│   ├── app/                         # Directorio principal de rutas con el App Router de Next.js
│   │   ├── administradores/         # Rutas y vistas para gestión administrativa
│   │   │   ├── gestion/             # Página de gestión de administradores (listado, formularios, etc.)
│   │   │   │   └── page.tsx
│   │   │   └── historial/           # Página de historial de administradores
│   │   │       └── page.tsx
│   │   ├── dashboard/               # Página principal del dashboard general
│   │   │   └── page.tsx
│   │   ├── docentes/                # Rutas relacionadas con docentes
│   │   │   ├── gestion/             # Gestión de docentes (alta, edición, etc.)
│   │   │   │   └── page.tsx
│   │   │   └── historial/           # Historial de acciones realizadas por docentes
│   │   │       └── page.tsx
│   │   ├── noticias/                # Página con publicaciones y anuncios
│   │   │   └── page.tsx
│   │   ├── favicon.ico              # Ícono del sitio web
│   │   ├── globals.css              # Hoja de estilos global (Tailwind u otros)
│   │   ├── layout.tsx               # Layout raíz que envuelve todas las páginas (global)
│   │   └── page.tsx                 # Página inicial del sitio (landing o login)
│   ├── components/                  # Componentes reutilizables en toda la app
│   │   ├── administradores/         # Componentes específicos para el módulo de administradores
│   │   ├── docentes/                # Componentes específicos para el módulo de docentes
│   │   ├── noticias/                # Componentes específicos para el módulo de noticias
│   │   ├── ui/                      # Componentes genéricos de UI (botones, inputs, tarjetas, etc.)
│   │   ├── app-sidebar.tsx          # Componente de la barra lateral principal
│   │   ├── nav-main.tsx             # Navegación principal del sitio
│   │   ├── nav-secondary.tsx        # Navegación secundaria (subsecciones, tabs)
│   │   └── nav-user.tsx             # Navegación y opciones del usuario autenticado
│   ├── data/                        # Archivos de configuración o datos locales estáticos
│   ├── hooks/                       # Hooks personalizados reutilizables (`useAuth`, `useMobile`, etc.)
│   ├── layout/                      # Componentes relacionados con la estructura visual (layout)
│   ├── lib/                         # Funciones auxiliares y lógica compartida entre módulos
│   └── types/                       # Definiciones de tipos TypeScript para uso global
├── test/
│   ├── accessibility/               # Tests de accesibilidad (usando Axe o similar)
│   │   └── accessibility.test.tsx
│   ├── components/                  # Tests unitarios de componentes
│   │   ├── ui/                      # Tests de componentes de UI genéricos
│   │   ├── administradores/         # Tests para componentes del módulo administradores
│   │   ├── docentes/                # Tests para componentes del módulo docentes
│   │   └── noticias/                # Tests para componentes del módulo noticias
│   │   ├── app-sidebar.test.tsx     # Test unitario del componente `app-sidebar`
│   │   ├── nav-main.test.tsx        # Test unitario del componente `nav-main`
│   │   └── nav-user.test.tsx        # Test unitario del componente `nav-user`
│   ├── hooks/                       # Tests para hooks personalizados
│   ├── integration/                 # Tests de integración entre múltiples módulos/componentes
│   ├── layout/                      # Tests para componentes/layouts generales
│   ├── lib/                         # Tests de funciones utilitarias
│   ├── mocks/                       # Datos falsos (mock data) utilizados en tests
│   ├── pages/                       # Tests para páginas completas
│   │   ├── administradores/         # Tests de páginas del módulo administradores
│   │   ├── docentes/                # Tests de páginas del módulo docentes
│   │   ├── noticias/                # Tests de páginas del módulo noticias
│   │   ├── dashboard.test.tsx       # Test del dashboard principal
│   │   └── home.test.tsx            # Test de la página de inicio
│   ├── setup/                       # Archivos de configuración y preparación de entorno de testing
│   ├── types/                       # Tests relacionados con definiciones de tipos
│   └── utils/                       # Tests para funciones auxiliares o de negocio
├── .gitignore                       # Archivos y carpetas ignoradas por Git
├── .prettierrc                      # Configuración de estilos para Prettier
├── components.json                  # Configuración de shadcn/ui y componentes compartidos
├── eslint.config.mjs                # Configuración de ESLint para el proyecto
├── jest.config.js                   # Configuración principal de Jest
├── jest.setup.js                    # Script de inicialización para pruebas (setup global)
├── next-env.d.ts                    # Tipado de entorno Next.js (auto generado)
├── next.config.ts                   # Configuración personalizada de Next.js
├── package.json                     # Archivo principal de dependencias y scripts
├── package-lock.json                # Registro de versiones exactas instaladas
├── postcss.config.mjs               # Configuración de PostCSS (usado por Tailwind)
├── README.md                        # Documentación principal del proyecto
├── tsconfig.json                    # Configuración del compilador TypeScript
└── vercel.json                      # Configuración para despliegue en Vercel

---

## 🚀 Globales

- **App Router**: Se basa en la carpeta `src/app`. Cada carpeta anidada define una ruta.
- **Componentes globales**: En `src/components/ui` encontrarás controles estilizados reutilizables.
- **Componentes globales**:  Cada módulo tiene su propia carpeta en src/components/[modulo], por ejemplo: docentes
- **Estilos globales**: En `src/app/globals.css` y `postcss.config.mjs`.

---

## 📖 Guía de desarrollo

1. Añadir nuevas rutas: crea carpetas y archivos `.tsx` en `src/app`.
2. Crear componentes : úsalos en `src/components` y agrégalos a la UI.
3. Escribir hooks/funciones: en `src/hooks` o `src/lib` según su alcance.
4. Gestionar datos: Centraliza tipos en `src/types/` y constantes en `src/constants/`.
```
