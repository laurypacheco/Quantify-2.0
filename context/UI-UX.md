# UI/UX — Mapa de Pantallas

> ⚠️ Este archivo se auto-carga al inicio de cada sesión (vía `@context/UI-UX.md` en `CLAUDE.md`).
> Contiene el mapa de pantallas reales de la aplicación para que el agente redacte Test Cases sin suponer labels, rutas ni comportamientos.

**Cómo se llena:** usa el skill `project-onboarding` — adjunta screenshots de las pantallas y el agente generará una entrada por cada una, guardando la imagen en `context/screenshots/`.

**Regla para el agente:** antes de redactar steps de un TC sobre una pantalla, busca su entrada aquí. Si no existe, NO supongas el diseño — pide un screenshot al usuario o inspecciona la app real vía MCP Browser antes de redactar el TC.

---

## Formato de cada entrada

Copia este bloque por cada pantalla nueva:

```markdown
## [Portal] > [Módulo] > [Nombre de pantalla]
- **Ruta/URL:** ...
- **Cómo se llega aquí:** [pantalla origen + acción/botón exacto]
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | ... | botón | "Guardar" | abre modal de confirmación |
- **Estados:** vacío / con datos / error / loading
- **Screenshot:** ![nombre](screenshots/nombre-pantalla.png)
- **Notas para TCs:** [detalles relevantes]
---
```

---

## Pantallas documentadas

## Quantify > Home > Inicio
- **Ruta/URL:** `http://localhost:3000/` (`/`)
- **Cómo se llega aquí:** acceso directo / URL base
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | heading | `"Quantify"` | — |
  | Saludo (autenticado) | texto | `"Bienvenido, [nombre o email]"` | visible solo si autenticado |
  | Botón iniciar sesión | botón | `"Iniciar sesión"` | visible solo si NO autenticado; redirige a `/auth/keycloak` |
  | Botón cerrar sesión | botón | `"Cerrar sesión"` | visible solo si autenticado; ejecuta logout |
- **Estados:**
  - No autenticado: muestra título + botón `"Iniciar sesión"`
  - Autenticado: muestra título + saludo con nombre/email + botón `"Cerrar sesión"`
- **Screenshot:** _(pendiente)_
- **Notas para TCs:** La página detecta el estado de auth automáticamente al cargar. El saludo usa `name` del token; si no existe, usa `email`.
---

## Quantify > Auth > Redirect Login
- **Ruta/URL:** `http://localhost:3000/login` (`/login`)
- **Cómo se llega aquí:** navegación directa a `/login`
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Texto de transición | enlace/texto | `"Redirigiendo a Keycloak..."` | visible brevemente antes del redirect |
- **Estados:** pantalla transitoria — redirige automáticamente a `/auth/keycloak` al montar
- **Screenshot:** _(pendiente — pantalla transitoria)_
- **Notas para TCs:** No requiere autenticación (`auth: false`). El redirect es inmediato via `onMounted`.
---

## Quantify > Auth > Bienvenida (post-login)
- **Ruta/URL:** `http://localhost:3000/welcome` (`/welcome`)
- **Cómo se llega aquí:** automáticamente tras login exitoso en Keycloak → callback → redirect a `/welcome`
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | heading h1 | `"Bienvenido a Quantify"` | — |
  | Confirmación | párrafo | `"Autenticación exitosa."` | — |
  | Usuario | lista item | `"Usuario: [preferred_username o email]"` | valor dinámico del token |
  | Nombre | lista item | `"Nombre: [name]"` | valor dinámico del token |
  | Email | lista item | `"Email: [email]"` | valor dinámico del token |
  | Botón cerrar sesión | botón | `"Cerrar sesión"` | ejecuta logout de Keycloak + limpia sesión |
- **Estados:** solo accesible si autenticado (protegida por middleware OIDC)
- **Screenshot:** _(pendiente)_
- **Notas para TCs:** Muestra datos reales del JWT. El campo "Usuario" usa `preferred_username`; si no existe, cae a `email`. Requiere sesión activa de Keycloak.
---

> **Nota:** Las pantallas de gestión de facturas (listado, creación, detalle, aprobación) aún no están
> implementadas en el frontend Nuxt — están diseñadas en el prototipo Lovable
> (requiere acceso autenticado para ver). Se documentarán aquí cuando se implementen o al recibir screenshots.
