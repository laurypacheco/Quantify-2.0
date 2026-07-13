# Contexto del Proyecto

> ⚠️ Este archivo se auto-carga al inicio de cada sesión (vía `@context/CONTEXT.md` en `CLAUDE.md`).
> Completa cada sección con los datos reales del proyecto — el agente lo usa como **fuente de verdad** para TCs, USs y ejecución.
> NUNCA inventar datos de esta sección: si falta información, preguntar al usuario o usar el skill `project-onboarding`.

---

## Configuración del Agente

| Campo | Valor |
|-------|-------|
| Idioma de interacción | `Español` |
| Zona horaria | `America/Puerto_Rico (UTC-4)` |
| Sprint actual | `Iteration 1` |
| Ruta local de QA-TOOLS-TEMPLATE | _(pendiente — instalar con: `npx github:jmartinez-autoreg/QA-TOOLS-TEMPLATE`)_ |
| Ruta local de estándares oficiales | _(pendiente)_ |

---

## Portales y URLs

| Portal | URL | Descripción |
|--------|-----|-------------|
| **Quantify** | `http://localhost:3000` (dev) | Portal principal — gestión de facturas |

> URL de staging/producción: _(pendiente)_

---

## Login — Flujos Conocidos

### Login principal — Quantify (via Keycloak OIDC/PKCE)

1. Usuario navega a `http://localhost:3000/`
2. Si no autenticado → se muestra botón **"Iniciar sesión"** → redirige a `/auth/keycloak`
3. Keycloak presenta formulario con dos opciones:
   - **Login local:** campos `usuario` y `contraseña` + botón de submit
   - **Microsoft SSO:** botón de inicio con cuenta Microsoft (Azure AD federation)
4. Tras autenticación exitosa → Keycloak redirige a `/auth/keycloak/callback?code=...`
5. Nuxt procesa el code exchange (PKCE) → establece session cookie → redirige a `/welcome`
6. Pantalla `/welcome` muestra: **"Bienvenido a Quantify"** + **"Autenticación exitosa."** + datos del usuario (username, nombre, email) + botón **"Cerrar sesión"**

- Tras login exitoso: pantalla `/welcome`
- Logout: botón **"Cerrar sesión"** (disponible en `/` si autenticado y en `/welcome`)

---

## Roles y Permisos

| Rol | Permisos clave | Acciones en facturas |
|-----|----------------|----------------------|
| `provider` | Crear y editar facturas en estado `Draft` | `Submit` — envía factura a revisión (Draft → Pending) |
| `reviewer` | Revisar facturas en estado `Pending` | `Approve` — aprueba factura (Pending → Approved) |
| `approver` | _(pendiente — documentar permisos/vistas)_ | _(pendiente)_ |
| `admin` | _(pendiente — documentar permisos/vistas)_ | Administración del sistema |

> Roles gestionados vía Keycloak; el backend los lee desde los claims del JWT.

---

## Módulos Principales

- **Facturas (Invoices)** — creación, edición, envío, aprobación y seguimiento de facturas. Flujo de estados: `Draft → Pending → Approved → Paid`. También: `Cancelled`, `Rejected`.
- **Líneas de factura (Invoice Lines)** — ítems de cada factura: descripción, cantidad, precio unitario, tasa de impuesto, categoría.
- **Empresas (Companies)** — entidad multi-tenant; cada factura y usuario pertenece a una empresa.
- **Usuarios (Users)** — perfil: firstName, lastName, email, companyId. Sincronizados desde Keycloak.

---

## Organización ADO

- **Organización:** `QUISIT`
- **Proyecto:** `Quantify`
- **Usuario QA:** `lpacheco@turnospr.com`

---

## Terminología Literal (NO cambiar nombres)

| Término en sistema | Descripción |
|--------------------|-------------|
| `Draft` | Estado inicial de factura — editable |
| `Pending` | Factura enviada a revisión (post-Submit) |
| `Approved` | Factura aprobada por Reviewer |
| `Paid` | Factura pagada |
| `Cancelled` | Factura cancelada |
| `Rejected` | Factura rechazada |
| `Submit` | Acción de enviar factura a revisión (Provider) |
| `Approve` | Acción de aprobar factura (Reviewer) |
| `provider` | Rol: crea y envía facturas |
| `reviewer` | Rol: aprueba facturas |
| `approver` | Rol: _(pendiente de documentar)_ |
| `admin` | Rol: administración del sistema |
| `Invoice` | Entidad principal — factura |
| `InvoiceLine` | Línea/ítem de una factura |
| `Company` | Empresa — entidad multi-tenant |

---

## Tecnología

- **Frontend:** Nuxt 3 SSR — puerto 3000
- **Backend:** .NET 10 Minimal API — puerto 5000 (interno) / 6000 (host)
- **Auth:** Keycloak 25 (OIDC/PKCE) — puerto 8080; federación opcional con Microsoft Azure AD
- **Base de datos:** PostgreSQL 16 — puerto 5432 (interno) / 5433 (host)
- **Caché:** Redis 7 — puerto 6379 (interno) / 6380 (host)
- **Infraestructura:** Docker Compose (`quantify-net`)

---

## API — Endpoints principales

| Método | Ruta | Descripción | Rol requerido |
|--------|------|-------------|---------------|
| `GET` | `/api/invoices` | Buscar/listar facturas (paginado) | Autenticado |
| `GET` | `/api/invoices/{id}` | Obtener factura por ID | Autenticado |
| `POST` | `/api/invoices` | Crear factura | Autenticado |
| `PUT` | `/api/invoices/{id}` | Actualizar factura | Autenticado |
| `DELETE` | `/api/invoices/{id}` | Eliminar factura | Autenticado |
| `POST` | `/api/invoices/{id}/submit` | Enviar factura a revisión | `Provider` |
| `POST` | `/api/invoices/{id}/approve` | Aprobar factura | `Reviewer` |

---

## Pendientes

- URL de staging/producción
- Permisos detallados de roles `approver` y `admin`
- Pantallas de gestión de facturas (Lovable no accesible via WebFetch — requiere screenshots manuales o acceso autenticado)
- Pantallas de gestión de usuarios y empresas
