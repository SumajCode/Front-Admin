# Front Administrador

Una aplicación web construida con Next. **TypeScript**, que muestra la gestión y visualización de cursos.

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
4. Abre tu navegador en http://localhost:3000

---

## 📂 Estructura del proyecto Screaming

```
front-docente/
├── public/                          # Archivos estáticos (favicon, imágenes, etc.)
├── src/
│   ├── app/                         # Rutas con App Router de Next.js
│   │   ├── admin/                   # Panel de administración
│   │   │   ├── docentes/
│   │   │   │   ├── gestion/         # Página principal (listado + modales)
│   │   │   │   │   └── page.tsx
│   │   │   │   └── historial/       # Historial de docentes
│   │   │   │       └── page.tsx
│   │   │   ├── dashboard/           # Dashboard del panel admin
│   │   │   │   └── page.tsx
│   │   │   ├── noticias/            # Noticias y anuncios
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx           # Layout persistente del admin (sidebar, etc.)
│   │   │
│   │   ├── favicon.ico
│   │   ├── globals.css              # Estilos globales (Tailwind u otros)
│   │   ├── layout.tsx               # Layout general del sitio
│   │   └── page.tsx                 # Página principal del sitio
│   ├── components/                  # Componentes reutilizables y específicos
│   │   ├── ui/                      # Botones, inputs, modales reutilizables
│   │   ├── docentes/               # Componentes específicos del módulo docentes
│   │   │   └── docente-form.tsx
│   │   ├── layout/                 # Navbar, Sidebar, Footer, etc.
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── nav-main.tsx
│   │   │   ├── nav-secondary.tsx
│   │   │   └── nav-user.tsx
│   ├── hooks/                       # Custom hooks (useMobile, etc.)
│   ├── lib/                         # Funciones utilitarias y lógica compartida
│   └── types/                       # Tipos e interfaces TypeScript globales
├──test/
│  ├── components/           # Tests de componentes
│  │   ├── ui/              # Tests de componentes UI
│  │   ├── administradores/ # Tests específicos de administradores
│  │   ├── docentes/        # Tests específicos de docentes
│  │   └── noticias/        # Tests específicos de noticias
│  ├── hooks/               # Tests de hooks personalizados
│  ├── pages/               # Tests de páginas
│  ├── lib/                 # Tests de utilidades
│  ├── types/               # Tests de tipos TypeScript
│  ├── mocks/               # Datos mock para testing
│  └── setup/               # Configuración de testing
├── .gitignore
├── .prettierrc
├── components.json                 # Configuración de shadcn/ui
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json

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
