# SUPER LOGIS CTG - Demo Dashboard

Servidor minimal en Node.js + Express con SQLite (demo).

Instalación y ejecución:

```powershell
cd "c:\Users\aleja\OneDrive\Desktop\SUPER LOGISTIC CTG"
npm install
npm start
```

Luego abrir: http://localhost:3000

- Panel con métricas y gráfico (Chart.js)
- Tabla de seguimiento con búsqueda y cambio de estado
- Simulación de envío de email cuando pasa a `En Tránsito`
- Botón de WhatsApp que abre mensaje preconfigurado
- Módulo de Flota con ubicaciones simuladas
Características implementadas:
- Panel con métricas y gráfico (Chart.js)
- Tabla de seguimiento con búsqueda y cambio de estado
- Simulación de envío de email cuando pasa a `En Tránsito`
- Botón de WhatsApp que abre mensaje preconfigurado
- Módulo de Flota con ubicaciones simuladas

Logo:
- Coloca el logo proporcionado en `public/assets/logo.png`. Hay un `public/assets/README.md` con instrucciones.

Subida a repositorio y despliegue:
- Ver `PUSH_TO_GITHUB.md` para comandos de `git`.
- Hay placeholders `firebase.json` y `.firebaserc` listos para conectar con Firebase Hosting.

Integración siguiente con Google AI Studio:
- Cree un proyecto en Google Cloud y guarde credenciales para futuras integraciones. Vea `PUSH_TO_GITHUB.md`.

Deploy en Vercel:
- Este repositorio incluye `vercel.json` para publicar `server.js` como función Node.
- En Vercel, el almacenamiento local es temporal; la persistencia final debe ir en Firestore.
- Panel con métricas y gráfico (Chart.js)
- Tabla de seguimiento con búsqueda y cambio de estado
- Simulación de envío de email cuando pasa a `En Tránsito`
- Botón de WhatsApp que abre mensaje preconfigurado
- Módulo de Flota con ubicaciones simuladas
