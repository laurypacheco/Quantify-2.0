# QUANTIFY
## 03 — Reviewer User Guide

| Role | Audience | Access Level | Version | Last Updated |
|---|---|---|---|---|
| Reviewer | Personal que consulta facturas y actividad de facturación | `Bill` y `Reports` documentados; decisiones requieren validación operativa | 0.1 · Borrador | 26 de septiembre de 2026 |

[← Guías](README.md) · [Getting Started](00-getting-started.md)

## 🎯 Tu misión en el sistema

Consultar la bandeja de facturas que requieren atención y usar la información disponible para entender la actividad de facturación. El inventario UI/UX atribuye a Reviewer `Bill` y `Reports`; un procedimiento automatizado describe aceptar o rechazar, pero no hay una ejecución exitosa que confirme esos pasos en el entorno actual.

## ¿Qué puedo hacer?

### Puedes

- Abrir `Bill` y revisar sus filas, estados y filtros.
- Abrir `Reports` y filtrar la información por `Status`, `Provider` y `Period`.
- Seleccionar `Export CSV` en la vista documentada de Reports.

### Puedes consultar

- Métricas de resumen en la bandeja.
- `Gross Amount`, `IRS Withholding`, `ITBS Withholding` y `Net Payable` en Reports.
- `Detail` con factura, proveedor, período, estado, monto bruto y neto.

### No forma parte de tu rol

- `Providers` y `Users`: el inventario UI/UX y las pruebas de navegación los restringen para Reviewer.
- Dar por confirmado el flujo de aprobación/rechazo hasta probarlo en el ambiente operativo.

## 🚀 Antes de comenzar

### Necesitas

- Una cuenta Reviewer para el ambiente aprobado.
- La factura correcta y autorización para actuar sobre ella, si tu proceso incluye una decisión.
- Confirmar los filtros de estado antes de interpretar los resultados.

**Tiempo estimado:** no determinado.  
**Quién puede realizarlo:** Reviewer, para las pantallas documentadas.  
**Resultado:** una bandeja filtrada o un reporte exportado; la transición de estado no está certificada por las ejecuciones disponibles.

## Consultar la bandeja Bill

### ¿Qué es?

La bandeja muestra facturas junto con estado, Provider, Company, fecha límite, período, monto y el menú `Action`.

### ¿Cómo hacerlo?

1. Abre `Bill` en la navegación.
2. Revisa las métricas `Pending Total`, `Overdue Amount` y `Payments this month`.
3. Para buscar, utiliza el filtro `Provider`, `Advanced`, el botón de búsqueda, `+ Status` o `Any date`.
4. Revisa el estado y los datos de la factura antes de continuar.

![Bandeja Bill de Reviewer](../screenshots/Pantalla%20reviewer%20Bill.png)

**Resultado esperado:** las filas se ajustan a los filtros elegidos. La captura documenta `Submitted` y `Draft`; un test describe además `Tardy`. La lista exacta de estados disponibles debe confirmarse en el ambiente.

> 💡 **QA Tip**  
> Comprueba `+ Status` antes de concluir que una factura no existe. La captura muestra `3 selected`; por tanto, la lista visible puede ser sólo una parte del total.

## Decisión sobre una factura — pendiente de validar

Un test automatizado describe este flujo esperado para Reviewer: `Action` → `View Bill`, seguido de `Accept` y `Continue`, o de `Decline`, motivo `Incorrect Data`, texto de razón y `Save`. **El flujo no cuenta con una ejecución exitosa disponible.** No lo uses como procedimiento operativo sin que el equipo confirme los botones, estados y permisos en tu ambiente.

| Parte descrita en el test | Evidencia disponible | Estado |
|---|---|---|
| Abrir `View Bill` desde `Action` | Selectores en test | Intención de prueba; pendiente de ejecución |
| Aceptar con `Accept` → `Continue` | Selectores en test | Intención de prueba; transición no confirmada |
| Rechazar con `Decline` y `Incorrect Data` | Selectores en test | Intención de prueba; validación no confirmada |
| Guardar texto mediante `Save` | Selector en test | Intención de prueba; mensaje/estado resultante por confirmar |

## Consultar Reports

`Reports` permite filtrar por `Status`, `Provider` y `Period`. La vista documenta las métricas `Gross Amount`, `IRS Withholding`, `ITBS Withholding` y `Net Payable`, dos gráficos y la tabla `Detail`.

1. Abre `Reports` desde la navegación.
2. Ajusta los filtros que necesites.
3. Revisa las métricas y la tabla de detalle.
4. Selecciona `Export CSV` para exportar la información filtrada, según el inventario UI/UX.

![Reports de Reviewer](../screenshots/Pantalla%20reviewer%20Report%20part%201.png)

![Detalle de Reports](../screenshots/Pantalla%20reviewer%20Report%20part%202.png)

**Resultado esperado:** la pantalla muestra los resultados correspondientes a los filtros y permite iniciar una exportación. No se ha validado el contenido descargado en una ejecución disponible.

## ⭐ ¿Qué debería pasar?

- `Bill` muestra las facturas que coinciden con los filtros activos.
- `Reports` refleja los filtros seleccionados en sus métricas, gráficos y detalle.
- `Export CSV` inicia la descarga de la vista filtrada, según la pantalla documentada.

> **Si ves algo diferente...**  
> Revisa el período, el estado y el proveedor seleccionados. Si falta un módulo o un resultado sigue sin coincidir, registra el filtro y el estado exactos antes de reportarlo.

## 🚨 ¿El resultado no es el esperado?

| Lo que ves | Qué debes verificar | Qué hacer |
|---|---|---|
| No aparece una factura | Estados seleccionados y filtros de fecha/proveedor | Ajusta un filtro a la vez y vuelve a consultar. |
| No ves `Reports` | Rol activo y navegación del ambiente | La vista Reviewer documenta Reports; si no aparece, informa el ambiente y el rol. |
| No aparecen valores en Reports | Filtros `Status`, `Provider` y `Period` | Prueba con filtros menos restrictivos y compara `Detail`. |
| La acción `Accept` o `Decline` no está disponible | Estado de la factura y permisos actuales | No fuerces otra ruta; consulta el procedimiento aprobado para ese estado. |
| `Export CSV` no produce un archivo | Filtros activos y comportamiento del navegador | Anota los filtros y la hora; la descarga no ha sido validada aquí. |

## 💎 Caso práctico — revisar una vista, sin cambiar estados

**Objetivo:** entender qué facturas y montos muestra Reports sin ejecutar una decisión.

1. Abre `Reports`.
2. Deja o ajusta los filtros `Status`, `Provider` y `Period`.
3. Compara `Gross Amount` y `Net Payable` con las filas de `Detail`.
4. Si necesitas un archivo, selecciona `Export CSV` y confirma que el navegador inició la descarga.

**Resultado esperado:** una vista cuya selección de filtros puede identificarse y contrastarse con el detalle. Los valores de ejemplo de las capturas no representan tus datos actuales.

### 🎉 ¿Cómo sé que lo hice correctamente?

- [ ] Confirmé que mi perfil indica Reviewer.
- [ ] Revisé los filtros antes de interpretar el conjunto de facturas.
- [ ] Comparé las métricas con la tabla `Detail`.
- [ ] Verifiqué que la exportación se inició antes de darla por completada.
- [ ] No cambié el estado de una factura mediante un flujo no validado.

## 🆘 ¿Algo no salió como esperabas?

| Lo que ves | Qué debes verificar | Qué hacer |
|---|---|---|
| El estado visible no coincide con el proceso descrito | Si la fuente dice `Submitted`, `Reviewed`, `Pending` o `Tardy` | No asumas que son equivalentes; registra el texto literal y pide validación. |
| Un test no puede iniciar sesión | La cuenta de QA autorizada y el ambiente | Los reportes previos señalan ejecuciones bloqueadas por falta de credenciales; eso no demuestra un fallo de tu cuenta real. |
| Un gráfico no coincide con la tabla | Filtros y período seleccionado | Conserva la selección y repórtala para revisión. |

## Preguntas frecuentes

**¿Reviewer aprueba facturas?**  
Un test describe `Accept` y `Decline`, pero el contexto también asigna aprobaciones a `reviewer` mientras otra vista atribuye decisiones a `Approver`. Confirma el responsable oficial antes de actuar.

**¿Qué significa `Tardy`?**  
Aparece en un test de Reviewer, pero no está definido en el glosario del proyecto. Su significado y efecto necesitan confirmación.

**¿Puedo usar Reports con cualquier período?**  
La pantalla ofrece el filtro `Period`; no hay reglas de período adicionales confirmadas.

## Glosario

- **Gross Amount:** monto bruto que muestra Reports.
- **Net Payable:** monto neto que muestra Reports.
- **IRS Withholding / ITBS Withholding:** métricas con esos nombres en Reports; la fórmula no está confirmada aquí.
- **Tardy:** etiqueta utilizada en un test; significado y política por confirmar.

## 🏁 Checklist — ¿Estoy listo?

- [ ] Confirmé la factura y el estado que estoy revisando.
- [ ] Verifiqué los filtros activos.
- [ ] Revisé el resultado en `Bill` o `Reports` según mi objetivo.
- [ ] Confirmé con el proceso oficial antes de usar `Accept` o `Decline`.
- [ ] No confundí un test pendiente con un flujo operativo validado.

## ⚠️ Information Requiring Confirmation

- Si Reviewer puede aprobar/rechazar, o si esa decisión pertenece a Approver.
- Resultado visual y estado posterior a `Accept`, `Decline` y `Save`.
- Motivos de rechazo permitidos y si el comentario es obligatorio.
- Significado y reglas de `Tardy`.
- Secuencia `Submitted` / `Reviewed` / `Approved` / `Registered` / `Paid`.
- Contenido del CSV y comportamiento de la exportación.
- Si Admin también debe tener `Reports`.
