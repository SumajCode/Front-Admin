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
├─ public/           # Archivos estáticos (imagenes, favicon)
├─ src/
│  ├─ app/           # Rutas de Next.js (App Router)
│  │  ├─ admin/      # Sección de administración
│  │  │  ├─ docentes/    # Gestión de docentes
│  │  │  │  └─ page.tsx  # Página de listado de docentes
│  │  │  ├─ historial/   # Historial de docentes
│  │  │  │  └─ page.tsx  # Página de historial
│  │  │  └─ noticias/    # Noticias y anuncios
│  │  │     └─ page.tsx  # Página de noticias
│  │  ├─ dashboard/      # Dashboard principal
│  │  │  └─ page.tsx     # Página del dashboard
│  │  ├─ globals.css     # Estilos globales con Tailwind
│  │  ├─ layout.tsx      # Layout global
│  │  └─ page.tsx        # Página principal
│  ├─ components/   # Componentes reutilizables
│  │  └─ ui/        # Biblioteca de UI (botones, tarjetas, etc.)
│  ├─ hooks/        # Hooks personalizados (por ejemplo, use-mobile)
│  └─ lib/          # Utilidades globales
├─ components.json       # Configuración de shadcn/ui
├─ eslint.config.mjs     # Configuración de ESLint
├─ next.config.ts        # Configuración de Next.js
├─ tsconfig.json         # Configuración de TypeScript
└─ package.json          # Scripts y dependencias
```

---

## 🚀 Globales

- **App Router**: Se basa en la carpeta `src/app`. Cada carpeta anidada define una ruta.
- **Componentes globales**: En `src/components/ui` encontrarás controles estilizados reutilizables.
- **Estilos globales**: En `src/app/globals.css` y `postcss.config.mjs`.

---

## 📖 Guía de desarrollo

1. Añadir nuevas rutas: crea carpetas y archivos `.tsx` en `src/app`.
2. Crear componentes : úsalos en `src/components` y agrégalos a la UI.
3. Escribir hooks/funciones: en `src/hooks` o `src/lib` según su alcance.
4. Gestionar datos: define archivos de datos en `src/modules/*`.
