# QUANTIFY
## QA editorial · Fuentes y criterios de lectura

Este documento forma parte del sistema de guías para hacer visible la evidencia usada en la documentación y facilitar su actualización. No es un manual de operación.

## Fuentes utilizadas

| Fuente | Qué aporta | Límite conocido |
|---|---|---|
| `context/CONTEXT.md` | Descripción del dominio, login OIDC, roles y vocabulario de factura | Algunos roles, pantallas y permisos aparecen como pendientes; la secuencia de estados no coincide con UI-UX. |
| `context/UI-UX.md` | Etiquetas, módulos, campos y capturas de pantallas | Inventario mantenido a partir de pantallas; incluye notas de verificación pendientes. |
| `context/screenshots/` | Capturas de Dashboard, Bill, Reports, Providers, Users y Help | Los datos visibles son ejemplos de la captura, no necesariamente datos actuales. |
| `tests/*.spec.ts` | Selectores y pasos esperados para flujos automatizados | Los artefactos disponibles no acreditan ejecución exitosa de los flujos de Reviewer o roles. |
| Preview de Lovable | Experiencia de diseño, login demo y rol Super Admin visible | El preview no confirma acceso ni comportamiento en producción. |
| `.workspace/us_i1_i2_verificacion_final.md` y reportes históricos | Riesgos y estado de verificaciones anteriores | Son observaciones históricas; no afirman que el defecto siga vigente. |

## Diferencias que bloquean una guía operativa completa

1. **Estados:** `CONTEXT.md` usa `Pending`; `UI-UX.md` y tests usan `Submitted` y `Reviewed`; tests también incluyen `Tardy` y `Registered`.
2. **Decisiones:** algunas fuentes atribuyen `Approve` a Reviewer; otras documentan un rol Approver.
3. **Super Admin:** existe en la selección demo del preview, pero la navegación y el alcance no están inventariados.
4. **Reports:** UI-UX lo atribuye a Reviewer; el test de roles lo espera también para Admin.
5. **Rutas/nombres:** UI-UX usa `Bill` y `/bill`; tests esperan `Bills` y `/invoice/invoices`.
6. **Login:** el contexto describe Keycloak/OIDC; el preview muestra un formulario email/password con cuentas demo.
7. **Finalización end-to-end:** el informe histórico califica como parciales varios flujos de proveedor y factura; los tests guardados no acreditan todos los resultados de UI y backend.

## Política editorial aplicada

- No convertir expectativas de test en una afirmación de comportamiento confirmado.
- No interpretar una capacidad ausente del inventario como una denegación técnica; se usa `?` cuando falta evidencia.
- No publicar datos de muestra de las capturas como si fueran valores recomendados.
- Mantener los nombres de controles y estados en inglés cuando así aparecen en la UI.
- Marcar los procedimientos que deben confirmarse antes de usarse con información real.
- Actualizar estas guías junto con `context/UI-UX.md` después de validar las pantallas y flujos.

---

[← Índice de guías](README.md)
