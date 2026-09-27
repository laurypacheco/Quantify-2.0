# QUANTIFY
## 02 — Admin User Guide

| Role | Audience | Access Level | Version | Last Updated |
|---|---|---|---|---|
| Admin | Personal que administra proveedores y usuarios | Operativo; módulos documentados: Dashboard, Providers, Bill y Users | 0.1 · Borrador | 26 de septiembre de 2026 |

[← Guías](README.md) · [Getting Started](00-getting-started.md)

## 🎯 Tu misión en el sistema

Mantener disponibles los perfiles operativos que la interfaz pone a tu cargo y consultar la actividad de facturación de la organización. La gestión documentada se concentra en proveedores y usuarios; la decisión sobre facturas y los permisos de `Reports` requieren validar el menú real de tu ambiente.

## ¿Qué puedo hacer?

### Puedes

- Consultar el `Dashboard` con métricas globales en la vista Admin documentada.
- Abrir `Providers` y comenzar un perfil con `Create Provider +`.
- Abrir `Users` y utilizar `+ Add User`.
- Consultar `Bill` y sus filtros.

### Puedes consultar

- Proveedores y estados `Draft`, `Active`, `Disabled` y `Cancelled`.
- Usuarios, email, rol, empresa y estado.
- Las métricas y la lista de Bills visibles en tus pantallas.

### No forma parte de tu rol

- Crear una factura con `Create Bill +`: ese botón aparece en la vista Provider y no en la vista Bill de Admin documentada.
- Usar `Reports` como una capacidad confirmada: el inventario UI/UX omite ese módulo para Admin, pero una prueba automatizada lo espera en su navegación. **Permission/Role discrepancy — Requires validation.**

## 🚀 Antes de comenzar

### Necesitas

- Una cuenta con rol Admin y acceso al ambiente aprobado.
- Los datos reales autorizados para el proveedor o usuario que vas a registrar.
- Confirmar la empresa y el rol antes de guardar un usuario.

**Tiempo estimado:** no determinado.  
**Quién puede realizarlo:** Admin, según el inventario UI/UX.  
**Resultado:** una ficha de proveedor o usuario creada desde los formularios documentados. La transacción completa no está certificada por las pruebas disponibles.

## Gestionar un proveedor

### ¿Qué es?

La sección `Providers` presenta una lista con estado, tipo, nombre, Vendor ID y acciones. El formulario `Create Provider` agrupa información personal, contacto, dirección, banca y documentos.

### ¿Para qué sirve?

Para preparar una ficha de proveedor. El estado inicial documentado es `Draft`; `Save` guarda el borrador y `Submit` envía el formulario para activación.

### ¿Cómo hacerlo?

#### PASO 1 — Abrir Providers

**Qué haces:** elige `Providers` en el menú lateral y después `Create Provider +`.  
**Resultado esperado:** aparece el formulario `Create Provider`.

![Lista de proveedores en Admin](../screenshots/Pantalla%20Admin%20Providers.png)

#### PASO 2 — Completar la información requerida

**Qué haces:** completa los campos marcados con `*` en `Personal Information`, `Contact Information` y `Banking Information`. La pantalla también documenta `Address Information` y `Provider Documents`.

Campos obligatorios documentados incluyen `First Name`, `Last Name`, `Tax ID o Social Security Number`, `ID Vendor`, `Email`, `Bank Name` y `Bank Address`. `Provider Type` ofrece `Contractor` y `Vendor`.

**Por qué importa:** los campos con asterisco están marcados como requeridos. No inventes valores para completar un alta real.

![Create Provider: información personal y contacto](../screenshots/Create%20provider%20part%201.png)

![Create Provider: dirección y banca](../screenshots/Create%20provider%20part%202.png)

![Create Provider: documentos](../screenshots/Create%20provider%20part%203.png)

#### PASO 3 — Elegir cómo terminar

**Qué haces:**

- Elige `Save` para guardar como `Draft`.
- Elige `Submit` para enviar el formulario para activación.
- Elige `Cancel` para cancelar el formulario.

**Resultado esperado:** `Save` conserva el proveedor en `Draft`; `Submit` inicia el envío para activación según el inventario de pantalla. No está confirmado cuál será el siguiente estado ni si aparecerá una confirmación.

> 💡 **QA Tip**  
> Antes de salir, confirma que estás en el perfil y empresa correctos. La prueba de ciclo de proveedor describe `Active → Cancelled` y un `Status History`, pero no valida el formulario de creación completo.

## Agregar un usuario

### ¿Qué es?

`Users & Roles` lista personas, email, rol, empresa y estado. `+ Add User` abre el formulario de alta.

### ¿Cómo hacerlo?

1. Abre `Users` y selecciona `+ Add User`.
2. Completa `Full name` y `Email`.
3. Elige un valor en `Role`: `Provider`, `Reviewer`, `Approver` o `Admin`.
4. Si corresponde al rol Provider, completa `Company`.
5. Selecciona `Create user`.

**Resultado esperado:** el modal se cierra después de `Create user`, según la pantalla documentada. La invitación, el alta de credenciales y el acceso efectivo del nuevo usuario requieren confirmación.

![Users & Roles en Admin](../screenshots/Pantalla%20admin%20Users.png)

![Modal Add User](../screenshots/Add%20User.png)

## Consultar el Dashboard y Bill

El Dashboard documentado resume `Total Pending`, `Approved This Month`, `Rejected` y `Total Volume`, además de gráficos y `Recent Bills`. Selecciona `View Bills` para abrir la lista de facturas.

En `Bill`, puedes revisar las métricas de resumen, buscar por Provider, usar `Advanced`, filtrar por `Status` o fecha y recorrer páginas. El inventario muestra dos estados seleccionados por defecto en la vista Admin; verifica el filtro antes de interpretar por qué una factura no aparece.

![Dashboard de Admin](../screenshots/dASHBOARD%20ADMIN.png)

![Bandeja Bill de Admin](../screenshots/Pantalla%20Admin%20Bill.png)

## ⭐ ¿Qué debería pasar?

- Después de `Save`, el proveedor permanece como `Draft` según la pantalla documentada.
- Después de `Submit`, el formulario se envía para activación; el estado posterior está por confirmar.
- Después de `Create user`, el modal se cierra; no se confirma si el usuario puede iniciar sesión inmediatamente.
- En `Bill`, la lista cambia cuando aplicas filtros. Confirma cuántos estados siguen seleccionados.

> **Si ves algo diferente...**  
> Verifica el rol en el perfil, el ambiente, los valores obligatorios y los filtros activos. Si el resultado persiste, reporta la pantalla y la acción, sin asumir que la operación se guardó.

## 🆘 ¿Algo no salió como esperabas?

| Lo que ves | Qué debes verificar | Qué hacer |
|---|---|---|
| No aparece `Providers` o `Users` | Rol de la sesión y ambiente | Confirma tu rol Admin y la navegación asignada. |
| No encuentras una factura | `Status`, fecha y filtros avanzados | Limpia o ajusta filtros y vuelve a revisar la lista. |
| Un alta no continúa | Campos con `*` y selección de `Provider Type`/`Bank Name` | Completa los campos requeridos; el mensaje exacto de validación está por confirmar. |
| `Companies` abre una pantalla 404 | El hallazgo se reportó en una verificación histórica; no está confirmado como vigente | Registra la URL y consulta al equipo antes de depender de ese módulo. |

## 💎 Caso práctico — preparar una ficha de proveedor

**Objetivo:** guardar un proveedor como borrador.

| Dato | Valor |
|---|---|
| Información personal, fiscal, contacto y bancaria | Valores autorizados por tu organización |
| Acción final | `Save` |

1. Abre `Providers` → `Create Provider +`.
2. Completa los campos obligatorios con los datos aprobados.
3. Selecciona `Save`.

**Resultado esperado:** la ficha queda en estado `Draft`, según el inventario UI/UX. La persistencia completa del registro no está cubierta por un test end-to-end exitoso.

### 🎉 ¿Cómo sé que lo hice correctamente?

- [ ] El formulario mostraba los datos del proveedor correcto.
- [ ] Completé los campos obligatorios con datos autorizados.
- [ ] Elegí `Save` para guardar como `Draft` (o `Submit` sólo si correspondía iniciar activación).
- [ ] Verifiqué el estado resultante en la ficha o la bandeja.

## Preguntas frecuentes

**¿`Save` y `Submit` hacen lo mismo?**  
No. La pantalla describe `Save` como guardar en `Draft` y `Submit` como enviar para activación.

**¿Puedo crear una factura como Admin?**  
La vista Admin documentada no muestra `Create Bill +`; ese botón aparece para Provider.

**¿Admin puede usar Reports?**  
Está por confirmar: las pruebas esperan el módulo, pero la navegación Admin documentada no lo incluye.

## Glosario

- **Draft:** ficha guardada como borrador, editable según la descripción de la pantalla.
- **Provider:** entidad que puede ser `Contractor` o `Vendor` en el formulario documentado.
- **Vendor ID:** identificador que aparece en la ficha y en la lista de proveedores.
- **Status History:** historial mencionado por una prueba de ciclo de proveedor; validar su disponibilidad en el entorno.

## 🏁 Checklist — ¿Estoy listo?

- [ ] Confirmé que mi sesión es Admin.
- [ ] Revisé que la empresa y el registro seleccionados sean los correctos.
- [ ] Completé los campos marcados como obligatorios.
- [ ] Elegí conscientemente entre `Save` y `Submit`.
- [ ] Comprobé el resultado antes de cerrar el flujo.

## ⚠️ Information Requiring Confirmation

- Validaciones y mensajes exactos del formulario de proveedor.
- Resultado y estado posterior a `Submit`.
- Flujo de invitación, asignación de credenciales y acceso de un usuario nuevo.
- Si Admin tiene `Reports` en el ambiente actual.
- Existencia y disponibilidad actual de `Companies`.
- Diferencia entre `Bill`, `Invoice`, `Pending` y `Submitted`.
