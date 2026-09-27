# QUANTIFY
## 01 — Super Admin User Guide

| Role | Audience | Access Level | Version | Last Updated |
|---|---|---|---|---|
| Super Admin | Personas a quienes se haya asignado el rol Super Admin | **Por confirmar** · rol visible en el preview de diseño | 0.1 · Borrador | 26 de septiembre de 2026 |

[← Guías](README.md) · [Getting Started](00-getting-started.md)

> **Estado de esta guía: alcance pendiente de validar.** El preview compartido ofrece una cuenta demo `Super Admin — Sofia Vega`. Eso confirma que el rol aparece en el diseño; no confirma sus permisos, módulos ni comportamiento en el ambiente operativo.

## 🎯 Tu misión en el sistema

La responsabilidad de Super Admin **no está documentada todavía**. No se debe inferir que el rol tenga acceso global, gestione organizaciones o administre otros usuarios solo por su nombre.

## ¿Qué puedo hacer?

### Puedes

- Seleccionar la cuenta de demostración `Super Admin — Sofia Vega` en el preview de Lovable.

### Puedes consultar

- En el preview, la opción de cuenta demo y el mensaje `Logged in as Sofia Vega (superadmin)` después de seleccionarla.

### No forma parte de tu rol

- No hay restricciones confirmadas. La ausencia de evidencia no equivale a una denegación de acceso.

## 🚀 Empieza aquí

### Necesitas

- La URL del ambiente que tu equipo haya autorizado.
- Confirmación de que tu usuario tiene el rol Super Admin.
- Las instrucciones de acceso válidas para ese ambiente.

> **Importante:** el preview usa una experiencia local de demostración; el contexto del proyecto describe autenticación con Keycloak. La cuenta visible en el preview no debe considerarse una cuenta real ni usarse en producción.

### Acceso visible en el preview

1. Abre el [preview de diseño de Quantify](https://lovable.dev/preview/QZrJ9kkGCVugt520bgRtjsD7x6bFCYZw).
2. En la pantalla `Login`, localiza `Super Admin — Sofia Vega` dentro de `DEMO ACCOUNTS`.
3. Al seleccionarla, el preview muestra `Logged in as Sofia Vega (superadmin)`.

**Resultado observado:** cambia la ruta a `/superadmin` y aparece el mensaje de sesión demo. La pantalla funcional que debería seguir y sus permisos no se pudieron confirmar; no uses este resultado como prueba de acceso operativo.

## ¿Qué debería pasar?

En el ambiente operativo, la navegación debería corresponder a la matriz de acceso aprobada para Super Admin. Esa navegación todavía no está documentada.

> **Si ves algo diferente...**  
> No compares la pantalla con la cuenta demo como si fuera el comportamiento esperado de producción. Registra el ambiente, el rol que muestra el perfil y el módulo que intentabas abrir; valida el acceso con el responsable de Quantify.

## 🆘 ¿Algo no salió como esperabas?

| Lo que ves | Qué debes verificar | Qué hacer |
|---|---|---|
| No aparece Super Admin en la lista de cuentas | Si estás viendo el preview compartido o el login operativo | No solicites ni reutilices cuentas demo; pide confirmación de acceso para tu ambiente. |
| La selección demo muestra un mensaje, pero no abre una vista funcional | Que la URL sea el preview correcto | Tómalo como una limitación/resultado del preview, no como evidencia de un error de producción. |
| No aparece un módulo que esperabas | El rol y el ambiente asignados | Solicita la matriz oficial de permisos antes de intentar otra ruta. |

## 💎 Caso práctico — alcance conocido

**Objetivo:** reconocer dónde aparece el rol Super Admin en el diseño.

1. Abre el preview compartido.
2. En `DEMO ACCOUNTS`, localiza `Super Admin — Sofia Vega`.
3. Selecciónala y observa el mensaje de sesión demo.

**Resultado observado:** aparece `Logged in as Sofia Vega (superadmin)`. No se puede continuar con un caso de administración porque el preview y las fuentes locales no confirman las funciones posteriores.

## Preguntas frecuentes

**¿Super Admin tiene más permisos que Admin?**  
El nombre sugiere una diferencia, pero su alcance no está confirmado. No debe documentarse ni asumirse hasta validar la matriz.

**¿Puedo usar la cuenta `super@quantify.io`?**  
Solo aparece como dato en el preview de diseño. No es una instrucción de acceso para ambientes reales.

**¿Hay un módulo específico de Super Admin?**  
No está documentado en las fuentes disponibles.

## Glosario

- **Preview:** versión de diseño accesible mediante Lovable; no certifica el comportamiento de producción.
- **Super Admin:** rol visible en el preview; permisos y misión por confirmar.

## 🏁 Checklist — ¿Estoy listo?

- [ ] Confirmé el ambiente autorizado.
- [ ] Verifiqué que mi cuenta real tenga el rol Super Admin.
- [ ] Consulté la matriz de permisos aprobada.
- [ ] Separé el comportamiento del preview de la operación real.

## ⚠️ Information Requiring Confirmation

- Responsabilidad del rol y decisiones que debe tomar.
- Módulos y acciones disponibles, tanto en consulta como en edición.
- Alcance de datos: organización propia, varias organizaciones u otro ámbito.
- Proceso de acceso real y ruta inicial después del login.
- Si existe una guía separada para Approver y cómo se relaciona con Super Admin.
