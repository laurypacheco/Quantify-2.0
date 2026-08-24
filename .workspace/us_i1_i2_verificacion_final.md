# Verificacion US Iteration 1 y 2 (ADO + UI real)

- Fecha: 2026-08-19
- Fuente: Azure DevOps (66 US) + validacion de ambiente dev.quantify.quisit.net por roles admin/provider/reviewer/approver
- Nota: hubo error CORS en provider al endpoint /api/users/sync (impacta criterios tecnicos)

## Resumen
- Total US: 66
- Cumple (evidencia + Closed): 6
- Parcial: 33
- No comprobable: 27

## Matriz por US
| Iteration | ID | Estado ADO | US | Verificacion | Hallazgo |
|---|---:|---|---|---|---|
| Quantify\Iteration 2 | 10141 | New | Proveedor: Banking Information | Cumple parcial | Pantallas Providers y Create Provider visibles con campos/filtros/acciones; faltan transacciones fin a fin |
| Quantify\Iteration 2 | 10142 | New | Proveedor: Provider Documents | Cumple parcial | Pantallas Providers y Create Provider visibles con campos/filtros/acciones; faltan transacciones fin a fin |
| Quantify\Iteration 2 | 10143 | New | Proveedor: Formulario del perfil Guardar | Parcial (UI + tecnico) | Pantallas Providers y Create Provider visibles con campos/filtros/acciones; faltan transacciones fin a fin; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10144 | New | Proveedor: Formulario del perfil Someter | Cumple parcial | Pantallas Providers y Create Provider visibles con campos/filtros/acciones; faltan transacciones fin a fin |
| Quantify\Iteration 2 | 10145 | New | Proveedor: ValidaciÃ³n con QuickBooks | No comprobable | Tema proveedor no mapeado 100% a una accion ejecutada; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10146 | New | Proveedor: Fechas y estado del proveedor | Cumple parcial | Pantallas Providers y Create Provider visibles con campos/filtros/acciones; faltan transacciones fin a fin |
| Quantify\Iteration 2 | 10147 | New | Proveedor: AuditorÃ­a y seguridad de datos | No comprobable | Tema proveedor no mapeado 100% a una accion ejecutada; criterios mayormente tecnicos |
| Quantify\Iteration 1 | 10148 | Closed | Proveedor: Bandeja todos los proveedores | Cumple (evidencia + Closed) | Pantallas Providers y Create Provider visibles con campos/filtros/acciones; faltan transacciones fin a fin |
| Quantify\Iteration 1 | 10149 | Active | Proveedor: Visualizar perfil Solo lectura | Cumple parcial | Pantallas Providers y Create Provider visibles con campos/filtros/acciones; faltan transacciones fin a fin |
| Quantify\Iteration 2 | 10150 | Closed | Proveedor: Cambio de estado del proveedor | Parcial (UI + tecnico) | Pantallas Providers y Create Provider visibles con campos/filtros/acciones; faltan transacciones fin a fin; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10151 | New | Contrato: CatÃ¡logo unificado de estados | No comprobable | Sin evidencia directa en UI en esta corrida; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10152 | Resolved | Contrato: Contract Information | No comprobable | Sin evidencia directa en UI en esta corrida |
| Quantify\Iteration 2 | 10153 | New | Contrato: Contract Documents | No comprobable | Sin evidencia directa en UI en esta corrida |
| Quantify\Iteration 2 | 10154 | New | Contrato: Contract Information Guardar | No comprobable | Sin evidencia directa en UI en esta corrida |
| Quantify\Iteration 2 | 10155 | New | Contrato: Contract Information VisualizaciÃ³n | No comprobable | Sin evidencia directa en UI en esta corrida |
| Quantify\Iteration 2 | 10156 | New | Contrato: Resultado de contrato Acciones | No comprobable | Sin evidencia directa en UI en esta corrida; criterios mayormente tecnicos |
| Quantify\Iteration 1 | 10157 | Closed | Factura: Crear nueva factura | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 1 | 10158 | ResolvedUS | Factura: Adjuntar documentos a la factura | Cumple parcial | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion |
| Quantify\Iteration 1 | 10159 | Closed | Factura: Bandeja de facturas del proveedor | Cumple (evidencia + Closed) | Pantallas Providers y Create Provider visibles con campos/filtros/acciones; faltan transacciones fin a fin |
| Quantify\Iteration 1 | 10160 | Closed | Factura: Motor de estados y transiciones | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10161 | New | Factura: Panel de validaciones en UI | Cumple parcial | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion |
| Quantify\Iteration 2 | 10162 | Removed | Factura: ValidaciÃ³n de contrato vigente Bloqueo | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10163 | New | Factura: ValidaciÃ³n de duplicados QB e interno | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 1 | 10164 | Closed | Factura: Marcar TardÃ­a Fecha lÃ­mite | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 1 | 10166 | Closed | Factura: Visualizar factura despuÃ©s de envÃ­o | Cumple (evidencia + Closed) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion |
| Quantify\Iteration 1 | 10167 | ResolvedUS | Factura: Editar factura Estados Creada Rechazada | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10168 | ResolvedUS | Factura: Cancelar factura Proveedor | No comprobable | Tema proveedor no mapeado 100% a una accion ejecutada; criterios mayormente tecnicos |
| Quantify\Iteration 1 | 10169 | Closed | Factura: Bandeja Filtros bÃ¡sicos y avanzados | Cumple (evidencia + Closed) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion |
| Quantify\Iteration 1 | 10170 | Closed | Revisor: Bandeja de facturas | Cumple (evidencia + Closed) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion |
| Quantify\Iteration 2 | 10171 | Closed | Revisor: Vista detalle de factura | Cumple (evidencia + Closed) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion |
| Quantify\Iteration 2 | 10172 | ResolvedUS | Revisor: Aprobar factura | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10173 | ResolvedUS | Revisor: Rechazar factura con motivo | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10174 | ResolvedUS | Factura: Bandeja Acciones por rol y estado | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10175 | ResolvedUS | Factura: Tab History | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10176 | New | QuickBooks: Registro de Bill vÃ­a API | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10177 | New | Factura: Reintento de sincronizaciÃ³n QB | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10178 | New | QuickBooks: BitÃ¡cora de sincronizaciÃ³n | No comprobable | Integraciones externas no verificables desde UI en esta corrida |
| Quantify\Iteration 2 | 10179 | New | QuickBooks: SincronizaciÃ³n de estado Pagada | No comprobable | Integraciones externas no verificables desde UI en esta corrida; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10180 | New | Notificaciones: Servicio de envÃ­o e integraciÃ³n | No comprobable | Sin evidencia directa en UI en esta corrida |
| Quantify\Iteration 2 | 10181 | New | Notificaciones: Plantillas de correo por estado | No comprobable | Sin evidencia directa en UI en esta corrida; criterios mayormente tecnicos |
| Quantify\Iteration 1 | 10182 | Closed | Proveedor: Personal Information/ Address Information | Parcial (UI + tecnico) | Pantallas Providers y Create Provider visibles con campos/filtros/acciones; faltan transacciones fin a fin; incluye criterios tecnicos/backend |
| Quantify\Iteration 1 | 10192 | Closed | QuickBooks: ConfiguraciÃ³n de conexiÃ³n OAuth por OrganizaciÃ³n | Parcial (Closed sin evidencia suficiente) | Integraciones externas no verificables desde UI en esta corrida; criterios mayormente tecnicos |
| Quantify\Iteration 1 | 10196 | Active | AutenticaciÃ³n: Login con MFA | No comprobable | Solo se validó login base; MFA/recuperacion no ejecutados; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10197 | New | AutenticaciÃ³n: Recuperar contraseÃ±a | No comprobable | Solo se validó login base; MFA/recuperacion no ejecutados; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10271 | Removed | TEST con iteration path v2 | No comprobable | Sin evidencia directa en UI en esta corrida |
| Quantify\Iteration 2 | 10272 | New | OrganizaciÃ³n: Formulario y CRUD de OrganizaciÃ³n | Parcial (UI + tecnico) | Modulo Companies visible y navegable; faltan validaciones CRUD detalladas; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10273 | New | Usuario: Registro por Administrador [InvitaciÃ³n] | Parcial (UI + tecnico) | Modulo Users visible y navegable; faltan flujos de invitacion/alta completos; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10274 | New | Usuario: Mantenimiento [Editar/Activar/Desactivar] | Parcial (UI + tecnico) | Modulo Users visible y navegable; faltan flujos de invitacion/alta completos; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10283 | New | OrganizaciÃ³n: Cambio de estado | Parcial (UI + tecnico) | Modulo Companies visible y navegable; faltan validaciones CRUD detalladas; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10284 | New | OrganizaciÃ³n: Asignar Administrador | Parcial (UI + tecnico) | Modulo Companies visible y navegable; faltan validaciones CRUD detalladas; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10285 | New | Usuario: Auto-registro [MFA] | No comprobable | Solo se validó login base; MFA/recuperacion no ejecutados; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10286 | New | Usuario: AsociaciÃ³n a OrganizaciÃ³n | Parcial (UI + tecnico) | Modulo Users visible y navegable; faltan flujos de invitacion/alta completos; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10287 | New | OrganizaciÃ³n: Bandeja de Organizaciones | Cumple parcial | Modulo Companies visible y navegable; faltan validaciones CRUD detalladas |
| Quantify\Iteration 2 | 10288 | ResolvedUS | OrganizaciÃ³n: CompaÃ±Ã­as [QuickBooks] | No comprobable | Integraciones externas no verificables desde UI en esta corrida; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10404 | Removed | [DUPLICADO - ver 10192] CompaÃ±Ã­a: ReautorizaciÃ³n de conexiÃ³n QuickBooks | No comprobable | Integraciones externas no verificables desde UI en esta corrida; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10405 | ResolvedUS | Proveedor: InvitaciÃ³n para completar perfil | No comprobable | Tema proveedor no mapeado 100% a una accion ejecutada; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10406 | New | Proveedor: SincronizaciÃ³n de Vendors desde QuickBooks | No comprobable | Tema proveedor no mapeado 100% a una accion ejecutada; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10408 | New | Proveedor: Completar registro con Recursos y Datos Fiscales [Refactor validaciÃ³n QuickBooks] | No comprobable | Tema proveedor no mapeado 100% a una accion ejecutada; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10498 | Removed | Test iteration path | No comprobable | Sin evidencia directa en UI en esta corrida |
| Quantify\Iteration 2 | 10502 | Removed | Test all four fields | No comprobable | Sin evidencia directa en UI en esta corrida |
| Quantify\Iteration 2 | 10508 | ResolvedUS | CompaÃ±Ã­as: SincronizaciÃ³n desde QuickBooks [Account] | No comprobable | Integraciones externas no verificables desde UI en esta corrida; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10509 | New | CatÃ¡logo: SincronizaciÃ³n de Proyectos desde QuickBooks [Class] | No comprobable | Integraciones externas no verificables desde UI en esta corrida; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10510 | New | QuickBooks: NavegaciÃ³n a mÃ³dulos locales desde Sync [View Providers / View Companies / View Projects] | No comprobable | Tema proveedor no mapeado 100% a una accion ejecutada; criterios mayormente tecnicos |
| Quantify\Iteration 2 | 10586 | ResolvedUS | Factura: Estados y transiciones | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10587 | New | Factura: Bandeja Acciones por rol y estado - bulk | Parcial (UI + tecnico) | Bandejas Bills visibles por rol y filtros base; no se ejecutaron flujos completos de creacion/aprobacion/transicion; incluye criterios tecnicos/backend |
| Quantify\Iteration 2 | 10652 | ResolvedUS | Dashboard: Tarjetas KPI de resumen de pagos [Home] | Cumple parcial | Dashboard accesible en admin/reviewer/approver con KPIs visibles, faltan validaciones de calculo |
