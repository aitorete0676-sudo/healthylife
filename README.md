# Healthy Life

App personal para un cambio físico: calorías, macros, entrenos, peso y un asistente de IA (Claude) que apunta lo que le cuentas.

## Qué incluye
- **Hoy:** anillo de kcal restantes, macros, agua, peso, cintura, sueño y pasos. Comidas por momento del día y entrenos.
- **Asistente IA y ¿Qué como?:** solo en la versión dentro de Claude (gratis con la cuenta de Claude). En esta web se apunta a mano.
- **Alimentos:** tus alimentos guardados y unos 55 básicos (valores aproximados BEDCA/USDA).
- **Progreso y Perfil:** gráfica de peso, kcal de 14 días y cálculo de objetivo (Mifflin-St Jeor).

## Archivos
- `index.html`: toda la app (HTML, CSS y JavaScript).
- `manifest.webmanifest` e iconos: para instalarla en el móvil como una app.

## Publicar en Vercel
1. En https://vercel.com/new importa este repositorio.
2. Framework: **Other**. Sin comando de build. Pulsa **Deploy**.
3. Cada vez que se suba un cambio a GitHub, Vercel lo publica solo.

No hace falta ninguna clave ni pagar nada.

## En el móvil
Abre la web en Safari (iPhone) o Chrome (Android) → Compartir / menú → **Añadir a pantalla de inicio**.

## Datos
En la versión de Vercel los datos se guardan en el navegador de cada dispositivo (localStorage). Si borras los datos del navegador, se pierden.
