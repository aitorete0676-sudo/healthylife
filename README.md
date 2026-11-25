# Healthy Life

App personal para un cambio físico: calorías, macros, entrenos, peso y un asistente de IA (Claude) que apunta lo que le cuentas.

## Qué incluye
- **Hoy:** anillo de kcal restantes, macros, agua, peso, cintura, sueño y pasos. Comidas por momento del día y entrenos.
- **Asistente IA y ¿Qué como?:** en esta web funcionan con Gemini (plan gratuito de Google). Dentro de Claude usan Claude.
- **Alimentos:** tus alimentos guardados y unos 55 básicos (valores aproximados BEDCA/USDA).
- **Progreso y Perfil:** gráfica de peso, kcal de 14 días y cálculo de objetivo (Mifflin-St Jeor).

## Archivos
- `index.html`: toda la app (HTML, CSS y JavaScript).
- `api/ai.js`: función de Vercel que llama a Gemini con tu clave gratuita. La clave nunca llega al navegador.
- `manifest.webmanifest` e iconos: para instalarla en el móvil como una app.

## Publicar en Vercel
1. En https://vercel.com/new importa este repositorio. Framework: **Other**. Pulsa **Deploy**.
2. Cada vez que se suba un cambio a GitHub, Vercel lo publica solo.

## Activar el asistente gratis (Gemini)
1. Entra en https://aistudio.google.com/apikey con tu cuenta de Google y pulsa **Create API key**. Es gratis y no pide tarjeta.
2. En Vercel: proyecto → **Settings → Environment Variables** → añade `GEMINI_API_KEY` con esa clave.
3. (Opcional) Añade `APP_PASSWORD` con una contraseña para que nadie más gaste tu cupo gratis, y escríbela en Perfil dentro de la app.
4. **Deployments → Redeploy**.

El plan gratuito tiene un límite de peticiones; si se alcanza, el asistente pide esperar un rato. En el plan gratuito Google puede usar las conversaciones para mejorar sus productos.

## En el móvil
Abre la web en Safari (iPhone) o Chrome (Android) → Compartir / menú → **Añadir a pantalla de inicio**.

## Datos
En la versión de Vercel los datos se guardan en el navegador de cada dispositivo (localStorage). Si borras los datos del navegador, se pierden.
