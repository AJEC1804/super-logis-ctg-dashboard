# Subir este proyecto a GitHub

Pasos rápidos para crear el repo remoto y subir el código (ejecutar en PowerShell):

```powershell
cd "c:\Users\aleja\OneDrive\Desktop\SUPER LOGISTIC CTG"
git init
git add .
git commit -m "Initial commit - SUPER LOGIS CTG dashboard"
# crea repo en GitHub y añade remote OR ejecuta:
git remote add origin https://github.com/USUARIO/REPO.git
git branch -M main
git push -u origin main
```

Instrucciones extra:
- Antes de pushear, coloca el logo en `public/assets/logo.png` (sigue `public/assets/README.md`).
- Añade secretos (API keys) en un archivo `.env` y nunca hagas commit de `.env`.

Integración con Firebase y Google AI Studio (resumen):
- Para Firebase: crea proyecto en Firebase Console, instala `firebase-tools` y luego `firebase init` para hosting/functions según necesites.
- Para Google AI Studio: crea un proyecto en Google Cloud, habilita las APIs necesarias y guarda credenciales en Secret Manager o en `.env` (no commits).
