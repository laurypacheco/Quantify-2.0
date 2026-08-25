# Auditoria funcional multirol - Quantify

Fecha: 2026-08-25
Ambiente: https://dev.quantify.quisit.net
Autenticacion: Keycloak (URL provista por usuario)
Roles probados: provider, reviewer, approver, admin

## Resultado ejecutivo
Se ejecuto un flujo completo multirol con Playwright y discovery manual. Se identificaron 3 problemas funcionales prioritarios que deben trabajarse de inmediato.

## Hallazgos priorizados

### 1) [Alta] Fuga de contexto de identidad en modulo Bills para reviewer/approver/admin
- Evidencia: para reviewer, approver y admin, el encabezado de Bills muestra Hello, Juan (identidad del provider) en lugar del usuario autenticado.
- Impacto: riesgo de confusion operativa, decisiones sobre facturas en sesion con identidad visual incorrecta, y posible defecto en resolucion de perfil/tenant en UI.
- Reproducibilidad: 100% en este pase.
- Recomendacion inmediata:
  1. Revisar fuente del nombre en encabezado de Bills (claim JWT vs cache local).
  2. Invalidar estado global de usuario al cambiar sesion.
  3. Agregar prueba de regresion para validar que el saludo coincida con el rol logueado.

### 2) [Alta] Errores CORS en dashboard/bills contra endpoint top-providers
- Evidencia: multiples errores de consola CORS y ERR_FAILED al llamar:
  GET https://api.quantify.quisit.net/api/dashboard/top-providers?take=5
- Impacto: degradacion de widgets y datos incompletos/intermitentes en dashboard.
- Reproducibilidad: 100% durante el flujo.
- Recomendacion inmediata:
  1. Configurar Access-Control-Allow-Origin para https://dev.quantify.quisit.net en API gateway/backend.
  2. Verificar preflight y headers de credenciales.
  3. Agregar monitoreo de errores de frontend para este endpoint.

### 3) [Media-Alta] Modulo Companies visible para admin pero la ruta responde 404
- Evidencia: menu incluye Companies, pero /companies devuelve pagina 404.
- Impacto: enlace roto en navegacion principal para rol administrativo.
- Reproducibilidad: 100%.
- Recomendacion inmediata:
  1. Si el modulo no esta listo, ocultar feature flag en menu.
  2. Si debe estar disponible, corregir routing y carga del modulo.

## Cobertura de permisos validada
- Provider: menu esperado Bills/Help/Settings; sin acceso real persistente a rutas de administracion.
- Reviewer: menu esperado Dashboard/Bills/Help/Reports/Settings.
- Approver: menu esperado Dashboard/Bills/Help/Settings.
- Admin: menu esperado con Providers/Bills/Users/Reports/Settings.

## Observacion de seguridad/UX
Las rutas restringidas redirigen silenciosamente (sin 403 explicito) en varios casos. No es bloqueo inseguro por si solo, pero dificulta trazabilidad y auditoria de permisos.

## Artefactos generados
- Config Playwright: playwright.config.ts
- Suite multirol: tests/roles-e2e.spec.ts
- Scripts npm para ejecucion e2e en package.json

## Comando de ejecucion usado
PowerShell (variables de entorno en sesion) + test:
npm run test:e2e -- tests/roles-e2e.spec.ts
