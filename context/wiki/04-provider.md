# QUANTIFY
## 04 — Provider User Guide

| Role | Audience | Access Level | Version | Last Updated |
|---|---|---|---|---|
| Provider | Personas que registran y consultan sus facturas | `Bill` y `Help` documentados; creación disponible desde `Create Bill +` | 0.1 · Borrador | 26 de septiembre de 2026 |

[← Guías](README.md) · [Getting Started](00-getting-started.md)

## 🎯 Tu misión en el sistema

Iniciar tus facturas y consultar su información desde tu bandeja. La vista documentada muestra el botón `Create Bill +` y una lista descrita como las facturas propias del Provider. El formulario de creación y el resultado de enviarlo aún no están documentados.

## ¿Qué puedo hacer?

### Puedes

- Abrir `Bill` y consultar la bandeja asociada a tu perfil.
- Iniciar la creación de una factura con `Create Bill +`.
- Abrir `Help`.

### Puedes consultar

- `Pending Total`, `Overdue Amount` y `Payments this month`.
- Provider, Company, `Deadline to Submit`, `Period`, `Amount` y `Status` en las filas visibles.

### No forma parte de tu rol

- `Providers`, `Users` y `Reports`: no aparecen en la navegación Provider documentada.
- Asumir que `Create Bill +` completó o envió una factura: falta confirmar el formulario y su resultado.

## 🚀 Antes de comenzar

### Necesitas

- Una cuenta Provider y acceso al ambiente aprobado.
- Confirmar que tu perfil y la empresa corresponden a la factura que vas a consultar.
- Los datos y soportes autorizados por tu organización para el registro; los campos requeridos no están documentados todavía.

**Tiempo estimado:** no determinado.  
**Quién puede realizarlo:** Provider, según la vista de Bill.  
**Resultado:** iniciar una nueva factura o consultar las filas disponibles para tu perfil.

## Consultar tus facturas

### ¿Qué es?

La pantalla `Bill` presenta un resumen de pagos y una lista con estado, proveedor, empresa, fecha límite, período y monto.

### ¿Cómo hacerlo?

1. Abre `Bill` desde la navegación lateral.
2. Confirma que el saludo y el perfil corresponden a tu usuario.
3. Revisa las métricas superiores.
4. Busca la fila de la factura y compara `Status`, `Company`, `Deadline to Submit`, `Period` y `Amount`.
5. Si no aparece, revisa `+ Status`, `Any date` y los filtros antes de concluir que falta.

![Bandeja Bill de Provider](../screenshots/Pantalla%20Provider%20BILL.png)

**Resultado esperado:** se muestra la bandeja disponible para el Provider y sus filas. La fuente UI/UX indica que ve sus propias facturas; los datos de la captura son ilustrativos y no deben confundirse con los actuales.

## Iniciar una factura nueva

### ¿Qué es?

`Create Bill +` es el punto de entrada visible para comenzar una factura en la pantalla Provider.

### ¿Cómo hacerlo?

1. En `Bill`, selecciona `Create Bill +`.
2. Antes de completar o enviar datos, verifica los campos del formulario y los requisitos aprobados para tu empresa.
3. Si no puedes identificar la información requerida o la acción de envío, detente y consulta al equipo responsable: esta guía no dispone de una captura ni de un inventario del formulario.

**Resultado esperado:** la pantalla documenta `Create Bill +` como acción de creación. No está confirmado el formulario que se abre, sus validaciones, si guarda como borrador ni qué acción la envía a revisión.

> ⚠️ **Importante**  
> No reutilices valores o datos personales de las capturas como si fueran información de tu factura. Tampoco interpretes `Pending`, `Submitted` o `Reviewed` como el mismo estado: las fuentes del proyecto no coinciden en esa secuencia.

## ⭐ ¿Qué debería pasar?

- En la bandeja, la fila y el resumen deben corresponder al perfil y filtros visibles.
- `Create Bill +` inicia la acción de creación documentada. La confirmación de guardado o envío queda por validar.

> **Si ves algo diferente...**  
> Comprueba el rol del perfil, la empresa, el período y los filtros activos. Si el formulario no coincide con lo que tu equipo te indicó, no envíes información; registra los campos visibles y solicita el procedimiento aprobado.

## 🆘 ¿Algo no salió como esperabas?

| Lo que ves | Qué debes verificar | Qué hacer |
|---|---|---|
| No aparece `Create Bill +` | Que tu perfil sea Provider y estés en `Bill` | Verifica la sesión; si el botón sigue ausente, reporta el rol y el ambiente. |
| No encuentras una factura propia | `Status`, fecha, Company y período | Ajusta los filtros disponibles y vuelve a consultar. |
| El estado no coincide con lo que te comunicaron | Texto literal del estado y la acción anterior | Conserva el nombre exacto; no lo traduzcas a otro estado sin validarlo. |
| No sabes qué campos completar en una factura nueva | Formulario y requisitos de tu organización | No inventes valores; solicita la guía del formulario antes de enviar. |

## 💎 Caso práctico — localizar una factura

**Objetivo:** confirmar qué información muestra la bandeja para una factura disponible.

| Dato | Qué usar |
|---|---|
| Perfil | Tu cuenta Provider autorizada |
| Factura | Una factura propia disponible en el ambiente |
| Datos a revisar | `Status`, `Company`, `Deadline to Submit`, `Period`, `Amount` |

1. Abre `Bill`.
2. Confirma tu perfil.
3. Localiza una fila y revisa sus datos.
4. Anota el estado tal como aparece, sin inferir el siguiente paso.

**Resultado esperado:** puedes identificar la fila, la empresa, el período, el monto y el estado visible.

### 🎉 ¿Cómo sé que lo hice correctamente?

- [ ] Confirmé que mi perfil es Provider.
- [ ] Revisé la empresa y el período de la factura.
- [ ] Leí el estado tal como aparece en pantalla.
- [ ] Verifiqué los filtros antes de concluir que una factura no está disponible.
- [ ] No di por enviada una factura sin ver un resultado confirmado.

## 💡 QA Tip

La captura Provider muestra el filtro de estado con selecciones activas. Si falta una fila, revisa primero el estado y la fecha: una bandeja filtrada no necesariamente representa todas las facturas del proceso.

## Preguntas frecuentes

**¿Puedo editar una factura después de crearla?**  
Las fuentes disponibles no describen el formulario ni las reglas de edición por estado. Confirma el procedimiento antes de cambiar datos.

**¿Qué ocurre después de `Create Bill +`?**  
La pantalla indica que inicia la creación. El formulario, el guardado y el envío posterior están por confirmar.

**¿Qué significa `Pending Total`?**  
Es el nombre de una métrica en la vista. La regla exacta con que se calcula no está documentada aquí.

**¿Por qué el botón o menú no coincide con la guía?**  
Verifica el rol y ambiente. Las diferencias entre diseño, inventario y pruebas están recogidas en [Getting Started](00-getting-started.md#informacion-por-confirmar).

## Glosario

- **Bill / Invoice:** nombre usado por distintas fuentes para la factura.
- **Deadline to Submit:** fecha límite mostrada en la bandeja; la regla de cálculo no está confirmada.
- **Period:** período mostrado como dato de la factura.
- **Pending Total:** métrica visible en la vista; cálculo por confirmar.

## 🏁 Checklist — ¿Estoy listo?

- [ ] Estoy en la cuenta Provider correcta.
- [ ] Confirmé empresa y período.
- [ ] Revisé estado y filtros antes de interpretar la bandeja.
- [ ] Consulté los requisitos aprobados antes de iniciar una factura nueva.
- [ ] Confirmé en pantalla el resultado de cualquier acción antes de considerarla completada.

## ⚠️ Information Requiring Confirmation

- Captura y campos del formulario `Create Bill`.
- Campos obligatorios, recursos por línea, cálculo de monto, impuestos y documentos requeridos.
- Acciones disponibles para guardar, editar, someter, cancelar y volver a someter.
- Estado posterior a `Submit` y persona responsable de la revisión.
- Reglas de visualización y alcance de `Pending Total`, `Overdue Amount` y `Payments this month`.
- Secuencia oficial de estados y diferencias entre `Pending`, `Submitted`, `Reviewed`, `Approved`, `Registered` y `Paid`.
