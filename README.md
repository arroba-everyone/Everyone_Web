# Everyone_Web

Breve README que describe el propósito del proyecto y pasos para ejecutar y desplegar la aplicación.

## Descripción

Proyecto web front-end (y/o fullstack) llamado `Everyone_Web`. Contiene la interfaz y la lógica del cliente; puede incluir un servidor API si aplica. Este README recoge los pasos básicos para instalar, ejecutar, construir y desplegar.

## Requisitos

- Node.js >= 16 (o la versión que use el proyecto)
- npm, yarn o pnpm
- Git
- (Opcional) Docker

## Estructura típica

- /src — código fuente
- /public — activos estáticos
- package.json — scripts y dependencias
- .env.example — variables de entorno de ejemplo
- Dockerfile — (si existe) imagen para producción

## Instalación

Clonar y preparar dependencias:

```bash
git clone <repo-url>
cd Everyone_Web
npm install
```

Crear variables de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

## Desarrollo (ejecutar localmente)

Comandos típicos:

```bash
# modo desarrollo con recarga
npm run dev
```

Abrir en el navegador la URL que muestre la consola (http://localhost:3000).

## Construir para producción

Generar artefacto listo para desplegar:

```bash
npm run build
```

Salida típica:

- Aplicaciones SPA: carpeta `build` o `dist`
- Next.js: carpeta `.next` + configuración de host

Para servir estáticamente:

```bash
npm serve
```

## Contribución

- Abrir issues para errores o mejoras.
- Crear branches descriptivas: `feat/`, `fix/`, `chore/`.
- Hacer PR con descripción y pasos para reproducir.

## Licencia

Indicar la licencia en `LICENSE` (p. ej. MIT) y actualizar este README con la información legal correspondiente.
