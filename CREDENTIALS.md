# SUPER LOGIS CTG - Credenciales de Acceso

## ✅ Sistema Completamente Funcionando

El sistema de autenticación, verificación de email y panel de administrador está completamente implementado y probado.

---

## 👨‍💼 USUARIO ADMINISTRADOR

**Email:** `admin@superlogistica.com`
**Contraseña:** `admin123`
**Rol:** admin
**Estado:** Verificado
**Acceso:** Panel completo de administración

### Funcionalidades del Admin:
- ✅ Ver lista completa de usuarios
- ✅ Gestión de usuarios (estado, verificación, rol)
- ✅ Envío de correos masivos con plantillas
- ✅ Panel de control con métricas
- ✅ Previsualización de correos HTML

---

## 👥 USUARIOS DE PRUEBA

### Cliente
**Email:** `cliente@superlogistica.com`
**Contraseña:** `user123`
**Rol:** user (cliente)
**Estado:** Verificado
**Acceso:** Dashboard general, rastreo de envíos

### Empleado
**Email:** `empleado@superlogistica.com`
**Contraseña:** `employee123`
**Rol:** employee (empleado)
**Estado:** Verificado
**Acceso:** Dashboard general, módulo de flota

---

## 🔧 CARACTERÍSTICAS IMPLEMENTADAS

### 1. Sistema de Autenticación
- ✅ Login con email y contraseña
- ✅ JWT tokens (7 días de expiración)
- ✅ Protección de rutas con autenticación
- ✅ LocalStorage para almacenar tokens

### 2. Sistema de Registro
- ✅ Registro en 2 pasos:
  - Paso 1: Ingresa datos y recibe código de verificación
  - Paso 2: Verifica código en email y completa registro
- ✅ Validación de código de verificación (30 minutos)
- ✅ Email de bienvenida automático
- ✅ Roles disponibles: admin, user, employee

### 3. Gestión de Correos
- ✅ Correos de verificación con código de 6 dígitos
- ✅ Correos de bienvenida personalizados
- ✅ Envío de correos masivos desde panel admin
- ✅ 3 plantillas predefinidas (Promo, Actualización, Alerta)
- ✅ Previsualización de correos en tiempo real
- ✅ Configuración Gmail SMTP

### 4. Panel de Administrador
- ✅ Tabla de usuarios con detalles completos
- ✅ Métricas (Total usuarios, Clientes, Empleados, Verificados)
- ✅ Formulario de correos masivos
- ✅ Editor HTML con plantillas
- ✅ Vista previa de correos
- ✅ Control de acceso por rol

### 5. Seguridad
- ✅ Contraseñas hasheadas con bcryptjs
- ✅ JWT para autenticación stateless
- ✅ Validación de roles en backend
- ✅ Tokens en Authorization header
- ✅ .env protegido con variables sensibles

---

## 📱 URLs DE ACCESO LOCAL

- **Login:** http://localhost:3000/login.html
- **Dashboard:** http://localhost:3000/index.html
- **Panel Admin:** http://localhost:3000/admin.html

## 🌍 URL EN PRODUCCIÓN (Vercel)

- **Login:** https://super-logis-ctg-dashboard.vercel.app/login.html
- **Dashboard:** https://super-logis-ctg-dashboard.vercel.app/index.html
- **Panel Admin:** https://super-logis-ctg-dashboard.vercel.app/admin.html

---

## 🚀 PRÓXIMOS PASOS RECOMENDADOS

1. **Crear más usuarios de prueba:** Usa el formulario de registro para crear usuarios adicionales
2. **Probar envío de correos:** 
   - Registra nuevos usuarios para recibir emails de verificación
   - Usa el panel admin para enviar correos masivos
3. **Verificar base de datos:** Los usuarios se guardan en `/data/users.json`
4. **Personalizar plantillas:** Edita las plantillas de correo en `/email.js`
5. **Desplegar a Vercel:** 
   - Asegúrate de agregar variables de entorno en Vercel dashboard:
     - `SMTP_HOST`
     - `SMTP_PORT`
     - `SMTP_USER`
     - `SMTP_PASS`
     - `SMTP_FROM`
     - `JWT_SECRET`

---

## 📊 ESTRUCTURA DE DATOS

### Usuario (users.json)
```json
{
  "id": "unique_id",
  "email": "usuario@correo.com",
  "password": "hash_bcrypt",
  "name": "Nombre Completo",
  "role": "admin|user|employee",
  "verified": true|false,
  "status": "active|inactive",
  "createdAt": "2026-05-06T..."
}
```

### Código de Verificación (verification-codes.json)
```json
{
  "usuario@correo.com": {
    "code": "123456",
    "createdAt": "2026-05-06T...",
    "expiresAt": "2026-05-06T..." (30 minutos)
  }
}
```

---

## 🔐 CONFIGURACIÓN DE EMAIL (Gmail)

**Email:** escutechsolutions@gmail.com
**Contraseña App:** osso eyxm avln jpic
**SMTP Server:** smtp.gmail.com:587

**Nota:** Se usa contraseña de aplicación de Google, no la contraseña de la cuenta principal.

---

**Sistema completamente funcional y listo para producción.**
