const ExcelJS = require('exceljs');

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
let idCounter = 1;
const nextId = (prefix) => `${prefix}-${String(idCounter++).padStart(3, '0')}`;

function tc(id, module, scenario, priority, preconditions, steps, expected) {
  return { id, module, scenario, priority, preconditions, steps, expected };
}

// ─────────────────────────────────────────────────────────
// TEST CASES — PROVIDER
// ─────────────────────────────────────────────────────────
idCounter = 1;
const providerTC = [
  tc(nextId('PRV'), 'Login', 'Login exitoso como Provider', 'Alta',
    'Usuario provider@quantify.local existe en Keycloak',
    '1. Navegar a https://dev.quantify.quisit.net\n2. Ingresar email: provider@quantify.local\n3. Ingresar password: provider123\n4. Clic en botón "Login"',
    'Redirige al módulo Invoice. Menú lateral: Invoice, Help. Saludo "Hello, [nombre]" visible.'),
  tc(nextId('PRV'), 'Login', 'Login con credenciales incorrectas', 'Alta',
    'Sin sesión activa',
    '1. Navegar al login\n2. Ingresar email: provider@quantify.local\n3. Ingresar password incorrecto\n4. Clic en "Login"',
    'Se muestra mensaje de error de credenciales inválidas. No se permite el acceso.'),
  tc(nextId('PRV'), 'Login', 'Login via Microsoft SSO', 'Media',
    'Cuenta Microsoft federada con Keycloak configurada',
    '1. Navegar al login\n2. Clic en "Microsoft"\n3. Completar flujo de autenticación Microsoft',
    'Redirige al módulo Invoice post-autenticación SSO.'),
  tc(nextId('PRV'), 'Invoice — Lista', 'Ver lista de facturas propias', 'Alta',
    'Sesión activa como Provider. Existen facturas del proveedor.',
    '1. Clic en "Invoice" en el menú lateral',
    'Se muestran solo facturas propias. Métricas: Pending Total, Overdue Amount, Payments this month. Columnas: Bill #, Provider, Company, Project, Deadline, Period, Amount, Action.'),
  tc(nextId('PRV'), 'Invoice — Lista', 'Filtrar por estado', 'Media',
    'Sesión activa como Provider. Facturas en distintos estados.',
    '1. Clic en "Status"\n2. Seleccionar estado (ej. Draft)\n3. Observar resultados',
    'La tabla muestra solo facturas con el estado seleccionado.'),
  tc(nextId('PRV'), 'Invoice — Lista', 'Filtrar por período', 'Media',
    'Sesión activa como Provider',
    '1. Clic en "Period"\n2. Seleccionar período (ej. 202501)',
    'La tabla muestra solo facturas del período seleccionado.'),
  tc(nextId('PRV'), 'Invoice — Lista', 'Buscar por número de factura', 'Media',
    'Sesión activa como Provider',
    '1. Escribir número en el campo "Invoice Number"\n2. Clic en el ícono de búsqueda',
    'La tabla muestra la factura correspondiente al número ingresado.'),
  tc(nextId('PRV'), 'Create Bill', 'Crear factura — guardar en Draft', 'Alta',
    'Sesión activa como Provider. Existen companies y proyectos.',
    '1. Clic en "Create Bill"\n2. Seleccionar Year\n3. Seleccionar Month\n4. Seleccionar Company\n5. Ingresar Bill Number\n6. Completar línea: Project, Type, Hours, Rate\n7. Clic en "Save"',
    'La factura se crea en estado Draft. Aparece en la lista.'),
  tc(nextId('PRV'), 'Create Bill', 'Crear factura — múltiples líneas', 'Media',
    'Sesión activa como Provider',
    '1. Clic en "Create Bill"\n2. Completar encabezado\n3. Completar línea 1\n4. Clic en "Add" para línea 2\n5. Completar línea 2\n6. Verificar Total = suma de ambas\n7. Clic en "Save"',
    'Ambas líneas se guardan. Total refleja la suma de todas las líneas.'),
  tc(nextId('PRV'), 'Create Bill', 'Crear factura — adjuntar documento', 'Media',
    'Sesión activa como Provider',
    '1. Clic en "Create Bill"\n2. Completar encabezado\n3. En Documents: clic en "Upload Document"\n4. Seleccionar archivo\n5. Seleccionar Document Type\n6. Clic en "Save"',
    'El documento queda adjunto a la factura.'),
  tc(nextId('PRV'), 'Create Bill', 'Crear factura — validación campos requeridos', 'Alta',
    'Sesión activa como Provider',
    '1. Clic en "Create Bill"\n2. No completar ningún campo\n3. Clic en "Submit"',
    'El sistema muestra mensajes de validación. No permite enviar sin campos requeridos.'),
  tc(nextId('PRV'), 'Create Bill', 'Cancelar creación', 'Media',
    'Sesión activa como Provider',
    '1. Clic en "Create Bill"\n2. Completar algunos campos\n3. Clic en "Cancel"',
    'Redirige a la lista sin crear ninguna factura.'),
  tc(nextId('PRV'), 'Submit Bill', 'Enviar factura — Draft → Submitted', 'Alta',
    'Sesión activa como Provider. Existe factura en Draft.',
    '1. Abrir factura en Draft\n2. Completar todos los campos requeridos\n3. Clic en "Submit"',
    'La factura cambia de Draft a Submitted. Deja de ser editable.'),
  tc(nextId('PRV'), 'Submit Bill', 'Intentar editar factura Submitted', 'Alta',
    'Sesión activa como Provider. Existe factura Submitted.',
    '1. Localizar factura en estado Submitted\n2. Intentar abrir para editar',
    'El sistema no permite editar facturas Submitted. Campos deshabilitados o sin opción de editar.'),
  tc(nextId('PRV'), 'Submit Bill', 'Ver detalle de factura', 'Media',
    'Sesión activa como Provider',
    '1. Clic sobre una fila en la lista Invoice',
    'Se muestra el detalle: número, período, company, project, líneas, documentos, estado.'),
  tc(nextId('PRV'), 'Help', 'Acceder a Help & Support', 'Baja',
    'Sesión activa como Provider',
    '1. Clic en "Help" en el menú lateral',
    'Pantalla Help con: Documentation, Live Chat, Email Support, FAQ, formulario "Send us a message".'),
  tc(nextId('PRV'), 'Help', 'Expandir pregunta FAQ', 'Baja',
    'Sesión activa como Provider, en página Help',
    '1. Clic en una pregunta del FAQ',
    'La pregunta se expande con su respuesta.'),
  tc(nextId('PRV'), 'Logout', 'Cerrar sesión', 'Alta',
    'Sesión activa como Provider',
    '1. Clic en el menú de usuario (esquina superior derecha)\n2. Clic en "Log out" / "Sign out"',
    'Sesión cerrada. Redirige al login. Páginas protegidas inaccesibles sin re-autenticar.'),
];

// ─────────────────────────────────────────────────────────
// TEST CASES — REVIEWER
// ─────────────────────────────────────────────────────────
idCounter = 1;
const reviewerTC = [
  tc(nextId('REV'), 'Login', 'Login exitoso como Reviewer', 'Alta',
    'Usuario reviewer@quantify.local existe en Keycloak',
    '1. Navegar al login de Quantify\n2. Email: reviewer@quantify.local\n3. Password: reviewer123\n4. Clic en "Login"',
    'Redirige al Dashboard. Menú lateral: Dashboard, Invoice, Reports, Help.'),
  tc(nextId('REV'), 'Dashboard', 'Dashboard muestra métricas e indicadores', 'Alta',
    'Sesión activa como Reviewer',
    '1. Clic en "Dashboard"',
    '4 tarjetas de métricas + gráficas Bills Trend, Bills by Status, Top Providers by Volume + sección Recent Bills.'),
  tc(nextId('REV'), 'Dashboard', 'Dashboard — botón View Bills', 'Media',
    'Sesión activa como Reviewer',
    '1. En Dashboard, clic en "View Bills"',
    'Redirige a la lista de Invoice.'),
  tc(nextId('REV'), 'Invoice — Lista', 'Ver facturas de todos los proveedores', 'Alta',
    'Sesión activa como Reviewer. Existen facturas Submitted.',
    '1. Clic en "Invoice"',
    'Lista con facturas de todos los proveedores. Por defecto filtrado para Submitted/Draft. Sin botón "Create Bill".'),
  tc(nextId('REV'), 'Invoice — Lista', 'Filtrar por estado Submitted', 'Alta',
    'Sesión activa como Reviewer',
    '1. Clic en "Status"\n2. Seleccionar solo "Submitted"',
    'Solo se muestran facturas Submitted.'),
  tc(nextId('REV'), 'Invoice — Acción', 'Revisar factura — Submitted → Reviewed', 'Alta',
    'Sesión activa como Reviewer. Existe factura Submitted.',
    '1. Localizar factura Submitted\n2. Clic en "Action"\n3. Seleccionar opción Review\n4. Confirmar',
    'Factura cambia a estado Reviewed.'),
  tc(nextId('REV'), 'Invoice — Acción', 'Rechazar factura', 'Alta',
    'Sesión activa como Reviewer. Existe factura Submitted.',
    '1. Localizar factura Submitted\n2. Clic en "Action"\n3. Seleccionar "Reject"\n4. Ingresar motivo si aplica\n5. Confirmar',
    'Factura cambia a estado Rejected.'),
  tc(nextId('REV'), 'Invoice — Acción', 'Ver detalle antes de revisar', 'Media',
    'Sesión activa como Reviewer',
    '1. Clic sobre fila de factura en la lista',
    'Detalle completo: encabezado, líneas, documentos, historial de estados.'),
  tc(nextId('REV'), 'Reports', 'Acceder a Reports', 'Alta',
    'Sesión activa como Reviewer',
    '1. Clic en "Reports"',
    'Página Reports: sección FILTERS (Status, Provider, Period) + 4 métricas (Gross Amount, IRS Withholding, ITBS Withholding, Net Payable) + gráficas + tabla Detail.'),
  tc(nextId('REV'), 'Reports', 'Filtrar reporte por Provider', 'Media',
    'Sesión activa como Reviewer, en Reports',
    '1. En filtro "Provider", seleccionar un proveedor específico',
    'Métricas y tabla Detail se actualizan para el proveedor seleccionado.'),
  tc(nextId('REV'), 'Reports', 'Filtrar reporte por Status', 'Media',
    'Sesión activa como Reviewer, en Reports',
    '1. En filtro "Status", seleccionar un estado',
    'La tabla refleja solo las facturas del estado seleccionado.'),
  tc(nextId('REV'), 'Reports', 'Filtrar reporte por Período', 'Media',
    'Sesión activa como Reviewer, en Reports',
    '1. En filtro "Period", seleccionar un período',
    'La tabla muestra solo facturas del período indicado.'),
  tc(nextId('REV'), 'Reports', 'Exportar CSV', 'Alta',
    'Sesión activa como Reviewer. Existen datos en la tabla.',
    '1. Aplicar filtros deseados\n2. Clic en "↓ Export CSV"',
    'Se descarga archivo .csv con columnas: Bill #, Provider, Period, Status, Gross, Net.'),
  tc(nextId('REV'), 'Help', 'Acceder a Help & Support', 'Baja',
    'Sesión activa como Reviewer',
    '1. Clic en "Help"',
    'Pantalla Help completa con FAQ, soporte, formulario de contacto.'),
  tc(nextId('REV'), 'Logout', 'Cerrar sesión', 'Alta',
    'Sesión activa como Reviewer',
    '1. Clic en menú de usuario\n2. Clic en "Log out"',
    'Sesión cerrada. Redirige al login de Keycloak.'),
];

// ─────────────────────────────────────────────────────────
// TEST CASES — APPROVER
// ─────────────────────────────────────────────────────────
idCounter = 1;
const approverTC = [
  tc(nextId('APP'), 'Login', 'Login exitoso como Approver', 'Alta',
    'Usuario approver@quantify.local existe en Keycloak',
    '1. Navegar al login de Quantify\n2. Email: approver@quantify.local\n3. Password: approver123\n4. Clic en "Login"',
    'Redirige al Dashboard. Menú lateral: Dashboard, Invoice, Help.'),
  tc(nextId('APP'), 'Dashboard', 'Dashboard muestra métricas e indicadores', 'Alta',
    'Sesión activa como Approver',
    '1. Clic en "Dashboard"',
    '4 tarjetas de métricas + gráficas Bills Trend, Bills by Status, Top Providers + Recent Bills.'),
  tc(nextId('APP'), 'Invoice — Lista', 'Ver facturas — solo estado Reviewed por defecto', 'Alta',
    'Sesión activa como Approver. Existen facturas Reviewed.',
    '1. Clic en "Invoice"',
    'Facturas en estado Reviewed por defecto (filtro "1 selected"). Sin botón "Create Bill".'),
  tc(nextId('APP'), 'Invoice — Acción', 'Aprobar factura — Reviewed → Approved', 'Alta',
    'Sesión activa como Approver. Existe factura en estado Reviewed.',
    '1. Localizar factura Reviewed\n2. Clic en "Action"\n3. Seleccionar "Approve"\n4. Confirmar',
    'Factura cambia a estado Approved.'),
  tc(nextId('APP'), 'Invoice — Acción', 'Rechazar factura', 'Alta',
    'Sesión activa como Approver. Existe factura Reviewed.',
    '1. Localizar factura Reviewed\n2. Clic en "Action"\n3. Seleccionar "Reject"\n4. Ingresar motivo si aplica\n5. Confirmar',
    'Factura cambia a estado Rejected.'),
  tc(nextId('APP'), 'Invoice — Acción', 'Ver detalle antes de aprobar', 'Media',
    'Sesión activa como Approver',
    '1. Clic sobre fila de factura en la lista',
    'Detalle completo: encabezado, líneas de proyecto/horas/rate, documentos adjuntos, historial de estados.'),
  tc(nextId('APP'), 'Invoice — Lista', 'Filtrar facturas por período', 'Media',
    'Sesión activa como Approver',
    '1. Clic en "Period"\n2. Seleccionar período',
    'La tabla se filtra por el período seleccionado.'),
  tc(nextId('APP'), 'Invoice — Lista', 'Approver no puede crear facturas', 'Alta',
    'Sesión activa como Approver',
    '1. Verificar que NO existe botón "Create Bill"\n2. Intentar navegar a /invoice/new-invoice',
    'No existe botón Create Bill. Acceso directo muestra error de permisos.'),
  tc(nextId('APP'), 'Help', 'Acceder a Help & Support', 'Baja',
    'Sesión activa como Approver',
    '1. Clic en "Help"',
    'Pantalla Help completa con FAQ, soporte, formulario de contacto.'),
  tc(nextId('APP'), 'Logout', 'Cerrar sesión', 'Alta',
    'Sesión activa como Approver',
    '1. Clic en menú de usuario\n2. Clic en "Log out"',
    'Sesión cerrada. Redirige al login de Keycloak.'),
];

// ─────────────────────────────────────────────────────────
// TEST CASES — ADMIN
// ─────────────────────────────────────────────────────────
idCounter = 1;
const adminTC = [
  tc(nextId('ADM'), 'Login', 'Login exitoso como Admin', 'Alta',
    'Usuario admin@quantify.local existe en Keycloak',
    '1. Navegar al login\n2. Email: admin@quantify.local\n3. Password: admin123\n4. Clic en "Login"',
    'Redirige al Dashboard. Menú lateral: Dashboard, Providers, Invoice, Users, Reports, Quickbook, Help.'),
  tc(nextId('ADM'), 'Dashboard', 'Dashboard muestra métricas e indicadores', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en "Dashboard"',
    '4 tarjetas de métricas + gráficas Bills Trend, Bills by Status, Top Providers by Volume + Recent Bills.'),
  tc(nextId('ADM'), 'Dashboard', 'Botón View Bills redirige a Invoice', 'Media',
    'Sesión activa como Admin',
    '1. En Dashboard, clic en "View Bills"',
    'Redirige a /invoice/invoices.'),
  tc(nextId('ADM'), 'Providers', 'Ver lista de proveedores', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en "Providers"',
    'Lista con columnas: estado (badge), Provider Type, Provider Name, Vendor ID, Action. Filtros: Provider Type, Status, Provider.'),
  tc(nextId('ADM'), 'Providers', 'Crear proveedor — flujo completo', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en "Create Provider +"\n2. Personal Info: First Name*, Last Name*, Tax ID*, ID Vendor*, Provider Type\n3. Contact Info: Email*, Phone\n4. Address Info\n5. Banking Info: Bank Name*, Bank Address*\n6. Provider Documents: subir archivo + Document Type\n7. Clic en "Save"',
    'Proveedor creado en estado Draft. Visible en la lista.'),
  tc(nextId('ADM'), 'Providers', 'Crear proveedor — validar campos requeridos', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en "Create Provider +"\n2. No completar campos obligatorios\n3. Clic en "Submit"',
    'Mensajes de validación en: First Name, Last Name, Tax ID, ID Vendor, Email, Bank Name, Bank Address.'),
  tc(nextId('ADM'), 'Providers', 'Submit proveedor — Draft → Active', 'Alta',
    'Sesión activa como Admin. Proveedor en Draft con todos los campos completos.',
    '1. Abrir proveedor en Draft\n2. Verificar campos completos\n3. Clic en "Submit"',
    'Estado del proveedor cambia de Draft a Active.'),
  tc(nextId('ADM'), 'Providers', 'Filtrar por Provider Type', 'Media',
    'Sesión activa como Admin',
    '1. En filtro "Provider Type", seleccionar "Contractor"\n2. Luego seleccionar "Vendor"',
    'Lista filtrada correctamente por cada tipo.'),
  tc(nextId('ADM'), 'Providers', 'Filtrar por estado de proveedor', 'Media',
    'Sesión activa como Admin',
    '1. En filtro "Status", seleccionar "Active"',
    'Solo proveedores Active visibles en la lista.'),
  tc(nextId('ADM'), 'Providers', 'Cambiar estado de proveedor (Action)', 'Media',
    'Sesión activa como Admin. Existe proveedor Active.',
    '1. En la fila del proveedor, clic en "Action"\n2. Seleccionar "Disable" o "Cancel"',
    'El estado del proveedor se actualiza al nuevo estado.'),
  tc(nextId('ADM'), 'Invoice', 'Ver facturas de todos los proveedores', 'Alta',
    'Sesión activa como Admin. Existen facturas de múltiples proveedores.',
    '1. Clic en "Invoice"',
    'Lista con facturas de TODOS los proveedores. Columnas: estado, Bill #, Provider, Company, Project, Deadline, Period, Amount, Action.'),
  tc(nextId('ADM'), 'Invoice', 'Filtrar por proveedor', 'Media',
    'Sesión activa como Admin',
    '1. Escribir nombre de proveedor en el buscador\n2. Clic en búsqueda',
    'La tabla muestra solo facturas del proveedor buscado.'),
  tc(nextId('ADM'), 'Invoice', 'Admin NO puede crear factura', 'Alta',
    'Sesión activa como Admin',
    '1. Verificar que NO existe botón "Create Bill" en el header\n2. Intentar navegar directamente a /invoice/new-invoice',
    'Sin botón Create Bill para Admin. Acceso directo muestra error de permisos.'),
  tc(nextId('ADM'), 'Users', 'Ver lista de usuarios y roles', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en "Users"',
    '"Users & Roles": tarjetas de conteo (Admins, Reviewers, Approvers, Providers), buscador, filtro All Roles, tabla: USER, EMAIL, ROLE, COMPANY, STATUS.'),
  tc(nextId('ADM'), 'Users', 'Agregar nuevo usuario', 'Alta',
    'Sesión activa como Admin, en Users',
    '1. Clic en "+ Add User"\n2. Ingresar Full name\n3. Ingresar Email\n4. Seleccionar Role\n5. Si rol Provider: completar Company\n6. Clic en "Create user"',
    'Usuario creado y visible en la tabla.'),
  tc(nextId('ADM'), 'Users', 'Campo Company solo visible para rol Provider', 'Media',
    'Modal Add User abierto',
    '1. Seleccionar Role = "Reviewer" → verificar Company\n2. Cambiar Role a "Provider" → verificar Company',
    'Campo Company solo aparece cuando el rol es Provider.'),
  tc(nextId('ADM'), 'Users', 'Filtrar usuarios por rol', 'Media',
    'Sesión activa como Admin, en Users',
    '1. Dropdown "All Roles" → seleccionar "Provider"',
    'Tabla muestra solo usuarios Provider.'),
  tc(nextId('ADM'), 'Users', 'Buscar usuario por nombre o email', 'Media',
    'Sesión activa como Admin, en Users',
    '1. Escribir nombre o email en "Search users..."',
    'Tabla filtrada en tiempo real.'),
  tc(nextId('ADM'), 'Reports', 'Acceder a Reports', 'Media',
    'Sesión activa como Admin',
    '1. Clic en "Reports"',
    'Página Reports con sección FILTERS, métricas y tabla Detail.'),
  tc(nextId('ADM'), 'Reports', 'Exportar CSV desde Reports', 'Media',
    'Sesión activa como Admin, en Reports. Existen datos.',
    '1. Aplicar filtros si se desea\n2. Clic en "↓ Export CSV"',
    'Se descarga el archivo CSV con los datos del reporte.'),
  tc(nextId('ADM'), 'Quickbook', 'Ver estado de conexión con QuickBooks', 'Media',
    'Sesión activa como Admin',
    '1. Clic en "Quickbook"',
    'Estado de conexión (Connected/Disconnected), Realm ID, Environment, fecha conexión, sección de sincronización.'),
  tc(nextId('ADM'), 'Quickbook', 'Sincronizar Vendors desde QuickBooks', 'Media',
    'Sesión activa como Admin. QuickBooks conectado.',
    '1. En Quickbook, localizar fila "Vendor"\n2. Clic en "Sync"',
    'Sincronización ejecutada. Resultado muestra: Fetched, Created, Updated y fecha/hora del sync.'),
  tc(nextId('ADM'), 'Help', 'Acceder a Help & Support', 'Baja',
    'Sesión activa como Admin',
    '1. Clic en "Help"',
    'Pantalla Help completa.'),
  tc(nextId('ADM'), 'Logout', 'Cerrar sesión', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en el menú de usuario\n2. Clic en "Log out"',
    'Sesión cerrada. Redirige al login de Keycloak.'),
];

// ─────────────────────────────────────────────────────────
// TEST CASES — SEGURIDAD
// ─────────────────────────────────────────────────────────
idCounter = 1;
const securityTC = [
  tc(nextId('SEC'), 'Acceso', 'Provider no accede al Dashboard', 'Alta',
    'Sesión activa como Provider',
    '1. Intentar navegar a /dashboard',
    'Sin acceso al Dashboard. Redirige a Invoice o muestra error de permisos.'),
  tc(nextId('SEC'), 'Acceso', 'Provider no accede a Providers', 'Alta',
    'Sesión activa como Provider',
    '1. Intentar navegar a /providers',
    'Acceso denegado.'),
  tc(nextId('SEC'), 'Acceso', 'Provider no accede a Users', 'Alta',
    'Sesión activa como Provider',
    '1. Intentar navegar a /users',
    'Acceso denegado.'),
  tc(nextId('SEC'), 'Acceso', 'Provider solo ve sus propias facturas', 'Alta',
    'Sesión activa como Provider. Existen facturas de otros proveedores.',
    '1. Navegar a Invoice\n2. Revisar todas las facturas visibles',
    'Solo aparecen facturas del provider autenticado.'),
  tc(nextId('SEC'), 'Acceso', 'Reviewer no puede crear facturas', 'Alta',
    'Sesión activa como Reviewer',
    '1. Verificar que no existe botón "Create Bill"\n2. Intentar navegar a /invoice/new-invoice',
    'Sin botón Create Bill. Acceso directo → denegado.'),
  tc(nextId('SEC'), 'Acceso', 'Reviewer no accede a Providers ni Users', 'Alta',
    'Sesión activa como Reviewer',
    '1. Intentar navegar a /providers\n2. Intentar navegar a /users',
    'Acceso denegado en ambos casos.'),
  tc(nextId('SEC'), 'Acceso', 'Approver no puede crear facturas', 'Alta',
    'Sesión activa como Approver',
    '1. Verificar que no existe botón "Create Bill"\n2. Intentar navegar a /invoice/new-invoice',
    'Sin botón Create Bill. Acceso directo → denegado.'),
  tc(nextId('SEC'), 'Acceso', 'Approver no accede a Reports', 'Alta',
    'Sesión activa como Approver',
    '1. Verificar que no existe "Reports" en el menú\n2. Intentar navegar a /reports',
    'Sin enlace en menú. Acceso directo → denegado.'),
  tc(nextId('SEC'), 'Acceso', 'Sin sesión no accede a páginas protegidas', 'Alta',
    'Sin sesión activa',
    '1. Navegar directamente a /dashboard\n2. Navegar directamente a /invoice/invoices',
    'Redirige al login de Keycloak en ambos casos.'),
  tc(nextId('SEC'), 'Acceso', 'Token expirado — redirige al login', 'Media',
    'Sesión vencida por expiración del token Keycloak',
    '1. Dejar la sesión inactiva hasta que expire el token\n2. Intentar realizar cualquier acción',
    'El sistema detecta el token expirado y redirige al login para re-autenticarse.'),
  tc(nextId('SEC'), 'Acceso', 'Admin no accede a crear facturas', 'Alta',
    'Sesión activa como Admin',
    '1. Verificar que no existe botón "Create Bill" para Admin\n2. Intentar navegar a /invoice/new-invoice',
    'Sin botón Create Bill. Acceso directo → denegado.'),
];

// ─────────────────────────────────────────────────────────
// EXCEL GENERATION
// ─────────────────────────────────────────────────────────
async function buildExcel() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Quantify QA';
  wb.created = new Date();

  const HEADERS = ['ID', 'Módulo', 'Escenario', 'Prioridad', 'Pre-condiciones', 'Pasos', 'Resultado esperado', 'Resultado actual', 'Estado', 'Notas'];
  const COL_WIDTHS = [12, 22, 48, 11, 45, 68, 55, 38, 12, 25];

  // Colores por rol
  const SHEET_COLORS = {
    'Provider':             { header: '1D6FA4', light: 'DDEEFF', accent: '1D6FA4' },
    'Reviewer':             { header: '217346', light: 'D9F0E2', accent: '217346' },
    'Approver':             { header: '7B3F9E', light: 'EEE0F9', accent: '7B3F9E' },
    'Admin':                { header: 'B8500A', light: 'FDE8D8', accent: 'B8500A' },
    'Seguridad y Acceso':   { header: '8B0000', light: 'FAD7D7', accent: '8B0000' },
  };

  const PRIORITY_COLORS = {
    'Alta':  { bg: 'FFD7D7', font: '9C0006' },
    'Media': { bg: 'FFEB9C', font: '9C6500' },
    'Baja':  { bg: 'C6EFCE', font: '276221' },
  };

  const sheets = [
    { name: 'Provider',           tcs: providerTC  },
    { name: 'Reviewer',           tcs: reviewerTC  },
    { name: 'Approver',           tcs: approverTC  },
    { name: 'Admin',              tcs: adminTC     },
    { name: 'Seguridad y Acceso', tcs: securityTC  },
  ];

  for (const { name, tcs } of sheets) {
    const ws = wb.addWorksheet(name, { properties: { tabColor: { argb: 'FF' + SHEET_COLORS[name].header } } });

    // Column widths
    ws.columns = HEADERS.map((h, i) => ({ header: h, key: h, width: COL_WIDTHS[i] }));

    // Header row style
    const headerRow = ws.getRow(1);
    headerRow.height = 28;
    HEADERS.forEach((_, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = HEADERS[i];
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + SHEET_COLORS[name].header } };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10, name: 'Calibri' };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'medium', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
    });

    // Data rows
    let prevModule = null;
    for (let i = 0; i < tcs.length; i++) {
      const t = tcs[i];
      const rowData = [t.id, t.module, t.scenario, t.priority, t.preconditions, t.steps, t.expected, '', '', ''];
      const row = ws.addRow(rowData);
      row.height = 80;

      const isModuleChange = t.module !== prevModule;
      const rowBg = isModuleChange ? SHEET_COLORS[name].light : 'FFFFFF';
      prevModule = t.module;

      for (let c = 1; c <= HEADERS.length; c++) {
        const cell = row.getCell(c);
        cell.alignment = { vertical: 'top', horizontal: c <= 4 ? 'center' : 'left', wrapText: true };
        cell.font = { size: 9, name: 'Calibri' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };

        // Color de fondo por módulo alternado
        if (c !== 4) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + rowBg.replace('#', '') } };
        }

        // Celda de Prioridad con color semáforo
        if (c === 4) {
          const p = t.priority;
          const pc = PRIORITY_COLORS[p] || {};
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + (pc.bg || 'FFFFFF') } };
          cell.font = { bold: true, size: 9, name: 'Calibri', color: { argb: 'FF' + (pc.font || '000000') } };
        }

        // Celda ID — bold
        if (c === 1) {
          cell.font = { bold: true, size: 9, name: 'Calibri', color: { argb: 'FF' + SHEET_COLORS[name].accent } };
        }
      }
    }

    // Freeze header row
    ws.views = [{ state: 'frozen', ySplit: 1 }];

    // Auto-filter
    ws.autoFilter = { from: 'A1', to: `J${tcs.length + 1}` };
  }

  const outPath = 'C:\\Users\\Laury Pacheco\\Desktop\\Quantify 2.0\\Quantify-2.0\\.workspace\\Certificacion_Quantify.xlsx';
  await wb.xlsx.writeFile(outPath);
  console.log(`✅ Archivo generado: ${outPath}`);
  console.log(`   Hojas: Provider (${providerTC.length} TCs) | Reviewer (${reviewerTC.length} TCs) | Approver (${approverTC.length} TCs) | Admin (${adminTC.length} TCs) | Seguridad (${securityTC.length} TCs)`);
  console.log(`   Total: ${providerTC.length + reviewerTC.length + approverTC.length + adminTC.length + securityTC.length} casos de prueba`);
}

buildExcel().catch(console.error);
