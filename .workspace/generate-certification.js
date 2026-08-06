const XLSX = require('xlsx');

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
let idCounter = 1;
const nextId = (prefix) => `${prefix}-${String(idCounter++).padStart(3, '0')}`;

function makeRow(id, module, scenario, priority, preconditions, steps, expected) {
  return { ID: id, Módulo: module, Escenario: scenario, Prioridad: priority, 'Pre-condiciones': preconditions, Pasos: steps, 'Resultado esperado': expected, 'Resultado actual': '', Estado: '', Notas: '' };
}

// ─────────────────────────────────────────────────────────
// TEST CASES — PROVIDER
// ─────────────────────────────────────────────────────────
idCounter = 1;
const providerRows = [
  // ── LOGIN ──
  makeRow(nextId('PRV'), 'Login', 'Login exitoso como Provider', 'Alta',
    'Usuario provider@quantify.local existe en Keycloak',
    '1. Navegar a https://dev.quantify.quisit.net\n2. Ingresar email: provider@quantify.local\n3. Ingresar password: provider123\n4. Clic en "Login"',
    'Redirige al módulo Invoice. Menú lateral muestra: Invoice, Help. Saludo "Hello, [nombre]" visible.'),

  makeRow(nextId('PRV'), 'Login', 'Login con credenciales incorrectas', 'Alta',
    'Ninguna sesión activa',
    '1. Navegar al login\n2. Ingresar email: provider@quantify.local\n3. Ingresar password: INCORRECTO\n4. Clic en "Login"',
    'Se muestra mensaje de error de credenciales inválidas. No se permite acceso.'),

  makeRow(nextId('PRV'), 'Login', 'Login via Microsoft SSO', 'Media',
    'Cuenta Microsoft federada con Keycloak configurada',
    '1. Navegar al login\n2. Clic en el botón "Microsoft"\n3. Completar autenticación de Microsoft',
    'Redirige correctamente al módulo Invoice post-autenticación SSO.'),

  // ── INVOICE LIST ──
  makeRow(nextId('PRV'), 'Invoice', 'Ver lista de facturas propias', 'Alta',
    'Sesión activa como Provider. Existen facturas asociadas al proveedor.',
    '1. Clic en "Invoice" en el menú lateral',
    'Se muestra la lista con únicamente las facturas del provider. Columnas: Bill #, Provider, Company, Project, Deadline to Submit, Period, Amount, Action. Métricas: Pending Total, Overdue Amount, Payments this month.'),

  makeRow(nextId('PRV'), 'Invoice', 'Filtrar facturas por estado', 'Media',
    'Sesión activa como Provider. Existen facturas en distintos estados.',
    '1. En la lista Invoice, clic en el botón "Status"\n2. Seleccionar un estado (ej. "Draft")\n3. Observar los resultados',
    'La tabla muestra solo facturas con el estado seleccionado.'),

  makeRow(nextId('PRV'), 'Invoice', 'Filtrar facturas por período', 'Media',
    'Sesión activa como Provider',
    '1. Clic en el botón "Period"\n2. Seleccionar un período (ej. 202501)\n3. Observar los resultados',
    'La tabla muestra solo facturas del período seleccionado.'),

  makeRow(nextId('PRV'), 'Invoice', 'Buscar factura por número', 'Media',
    'Sesión activa como Provider',
    '1. Escribir un número de factura en el campo "Invoice Number"\n2. Clic en el botón de búsqueda',
    'La tabla muestra la factura correspondiente al número ingresado.'),

  makeRow(nextId('PRV'), 'Invoice', 'Paginación de facturas', 'Baja',
    'Sesión activa como Provider. Existen más de 10 facturas.',
    '1. Observar el paginador en la parte inferior\n2. Cambiar "Rows per page" a 25\n3. Navegar a página siguiente',
    'La paginación funciona correctamente. Se muestran 25 filas por página.'),

  // ── CREATE BILL ──
  makeRow(nextId('PRV'), 'Create Bill', 'Crear factura nueva — guardado en Draft', 'Alta',
    'Sesión activa como Provider. Existen companies y proyectos configurados.',
    '1. Clic en "Create Bill"\n2. Seleccionar Year\n3. Seleccionar Month\n4. Seleccionar Company\n5. Ingresar Bill Number\n6. En la línea: seleccionar Project, Type, ingresar Hours y Rate\n7. Opcional: agregar Description\n8. Clic en "Save"',
    'La factura se crea en estado "Draft". Redirige a la lista. La factura aparece en la tabla con estado Draft.'),

  makeRow(nextId('PRV'), 'Create Bill', 'Crear factura — agregar múltiples líneas', 'Media',
    'Sesión activa como Provider',
    '1. Clic en "Create Bill"\n2. Completar datos del encabezado (Year, Month, Company, Bill Number)\n3. Completar primera línea (Project, Type, Hours, Rate)\n4. Clic en "Add" para agregar segunda línea\n5. Completar segunda línea\n6. Verificar que "Total" suma ambas líneas\n7. Clic en "Save"',
    'Ambas líneas se guardan. El monto Total es la suma de todas las líneas.'),

  makeRow(nextId('PRV'), 'Create Bill', 'Crear factura — adjuntar documento', 'Media',
    'Sesión activa como Provider',
    '1. Clic en "Create Bill"\n2. Completar datos del encabezado\n3. En sección Documents: clic en "Upload Document"\n4. Seleccionar archivo (PDF, imagen)\n5. Seleccionar Document Type\n6. Clic en "Save"',
    'El documento se adjunta correctamente a la factura.'),

  makeRow(nextId('PRV'), 'Create Bill', 'Crear factura — validación campos requeridos', 'Alta',
    'Sesión activa como Provider',
    '1. Clic en "Create Bill"\n2. No completar ningún campo\n3. Clic en "Submit"',
    'El sistema muestra mensajes de validación en los campos requeridos. No permite enviar.'),

  makeRow(nextId('PRV'), 'Create Bill', 'Cancelar creación de factura', 'Media',
    'Sesión activa como Provider',
    '1. Clic en "Create Bill"\n2. Completar algunos campos\n3. Clic en "Cancel"',
    'Redirige a la lista de Invoice sin crear ninguna factura.'),

  // ── SUBMIT BILL ──
  makeRow(nextId('PRV'), 'Submit Bill', 'Enviar factura (Draft → Submitted)', 'Alta',
    'Sesión activa como Provider. Existe una factura en estado Draft.',
    '1. En la lista Invoice, localizar una factura en estado "Draft"\n2. Clic en "Action"\n3. Seleccionar "Submit" (o equivalente)\n\nAlternativa — desde formulario:\n1. Abrir la factura en Draft\n2. Completar todos los campos requeridos\n3. Clic en "Submit"',
    'La factura cambia de estado "Draft" a "Submitted" (o "Pending" según la implementación). Ya no es editable por el Provider.'),

  makeRow(nextId('PRV'), 'Submit Bill', 'Intentar editar factura Submitted', 'Alta',
    'Sesión activa como Provider. Existe una factura en estado Submitted.',
    '1. Localizar una factura en estado Submitted\n2. Intentar abrir o editar',
    'El sistema no permite editar facturas ya enviadas. Los campos están deshabilitados o no existe opción de editar.'),

  makeRow(nextId('PRV'), 'Submit Bill', 'Ver detalle de factura', 'Media',
    'Sesión activa como Provider. Existen facturas en la lista.',
    '1. En la lista Invoice, clic sobre una fila de factura\n2. Observar el detalle',
    'Se muestra el detalle completo de la factura: número, período, company, project, líneas con horas/rate/amount, documentos adjuntos, estado.'),

  // ── HELP ──
  makeRow(nextId('PRV'), 'Help', 'Acceder a Help & Support', 'Baja',
    'Sesión activa como Provider',
    '1. Clic en "Help" en el menú lateral',
    'Se muestra la pantalla Help & Support con: tarjetas Documentation/Live Chat/Email Support, sección FAQ, formulario "Send us a message".'),

  makeRow(nextId('PRV'), 'Help', 'Expandir pregunta del FAQ', 'Baja',
    'Sesión activa como Provider, en la página Help',
    '1. Clic en alguna pregunta del FAQ (ej. "How do I submit a new bill?")',
    'La pregunta se expande mostrando la respuesta. Las demás se colapsan o permanecen colapsadas.'),

  // ── LOGOUT ──
  makeRow(nextId('PRV'), 'Logout', 'Cerrar sesión', 'Alta',
    'Sesión activa como Provider',
    '1. Clic en el avatar/menú de usuario (esquina superior derecha)\n2. Clic en "Log out" o "Sign out"',
    'La sesión se cierra. Redirige al login de Keycloak. No es posible acceder a páginas protegidas sin volver a autenticarse.'),
];

// ─────────────────────────────────────────────────────────
// TEST CASES — REVIEWER
// ─────────────────────────────────────────────────────────
idCounter = 1;
const reviewerRows = [
  makeRow(nextId('REV'), 'Login', 'Login exitoso como Reviewer', 'Alta',
    'Usuario reviewer@quantify.local existe en Keycloak',
    '1. Navegar al login de Quantify\n2. Ingresar email: reviewer@quantify.local\n3. Ingresar password: reviewer123\n4. Clic en "Login"',
    'Redirige al Dashboard. Menú lateral muestra: Dashboard, Invoice, Reports, Help.'),

  makeRow(nextId('REV'), 'Dashboard', 'Dashboard muestra métricas e indicadores', 'Alta',
    'Sesión activa como Reviewer',
    '1. Clic en "Dashboard" en el menú lateral',
    'Se muestran 4 tarjetas de métricas (Total Pending, Approved This Month, Rejected, Total Volume) + gráfica Bills Trend + gráfica Bills by Status + gráfica Top Providers + sección Recent Bills.'),

  makeRow(nextId('REV'), 'Dashboard', 'Dashboard — botón View Bills', 'Media',
    'Sesión activa como Reviewer',
    '1. En el Dashboard, clic en "View Bills"',
    'Redirige a la lista de Invoice.'),

  makeRow(nextId('REV'), 'Invoice', 'Ver lista de facturas (todos los proveedores)', 'Alta',
    'Sesión activa como Reviewer. Existen facturas en estado Submitted.',
    '1. Clic en "Invoice" en el menú lateral',
    'Se muestra la lista con facturas de todos los proveedores. Por defecto filtrado para Submitted/Draft. Columnas: Bill #, Provider, Company, Project, Deadline, Period, Amount, Action.'),

  makeRow(nextId('REV'), 'Invoice', 'Filtrar por estado Submitted', 'Alta',
    'Sesión activa como Reviewer',
    '1. En la lista Invoice, clic en "Status"\n2. Seleccionar solo "Submitted"\n3. Observar resultados',
    'Solo se muestran facturas con estado "Submitted" (pendientes de revisión).'),

  makeRow(nextId('REV'), 'Invoice', 'Revisar factura (Submitted → Reviewed)', 'Alta',
    'Sesión activa como Reviewer. Existe factura en estado Submitted.',
    '1. Localizar factura en estado "Submitted"\n2. Clic en "Action"\n3. Seleccionar opción de Review\n4. Confirmar la acción',
    'La factura cambia de estado "Submitted" a "Reviewed". La acción queda registrada.'),

  makeRow(nextId('REV'), 'Invoice', 'Rechazar factura', 'Alta',
    'Sesión activa como Reviewer. Existe factura en estado Submitted.',
    '1. Localizar factura en estado "Submitted"\n2. Clic en "Action"\n3. Seleccionar "Reject"\n4. Ingresar motivo de rechazo (si aplica)\n5. Confirmar',
    'La factura cambia a estado "Rejected". El Provider puede ver el rechazo.'),

  makeRow(nextId('REV'), 'Invoice', 'Ver detalle de factura antes de revisar', 'Media',
    'Sesión activa como Reviewer',
    '1. Clic sobre una fila de factura en la lista\n2. Revisar contenido',
    'Se muestra detalle completo: encabezado, líneas de horas/proyecto, documentos adjuntos, historial de estados.'),

  makeRow(nextId('REV'), 'Reports', 'Acceder a Reports', 'Alta',
    'Sesión activa como Reviewer',
    '1. Clic en "Reports" en el menú lateral',
    'Se muestra la página Reports con: sección FILTERS (Status, Provider, Period), 4 tarjetas (Gross Amount, IRS Withholding, ITBS Withholding, Net Payable), gráficas, tabla Detail.'),

  makeRow(nextId('REV'), 'Reports', 'Filtrar reporte por Provider', 'Media',
    'Sesión activa como Reviewer, en página Reports',
    '1. Clic en el filtro "Provider"\n2. Seleccionar un proveedor específico\n3. Observar las métricas y la tabla',
    'Los datos de métricas y la tabla Detail se actualizan para mostrar solo el proveedor seleccionado.'),

  makeRow(nextId('REV'), 'Reports', 'Filtrar reporte por Status', 'Media',
    'Sesión activa como Reviewer, en página Reports',
    '1. Clic en filtro "Status"\n2. Seleccionar un estado (ej. "Approved")',
    'La tabla y métricas reflejan solo las facturas del estado seleccionado.'),

  makeRow(nextId('REV'), 'Reports', 'Filtrar por Período', 'Media',
    'Sesión activa como Reviewer, en página Reports',
    '1. Clic en filtro "Period"\n2. Seleccionar un período (ej. 202501)',
    'La tabla muestra solo facturas del período indicado. Las métricas reflejan ese período.'),

  makeRow(nextId('REV'), 'Reports', 'Exportar CSV', 'Alta',
    'Sesión activa como Reviewer, en página Reports. Existen datos en la tabla.',
    '1. Aplicar filtros si se desea\n2. Clic en "↓ Export CSV"',
    'Se descarga un archivo .csv con los datos de la tabla Detail. El archivo contiene las columnas: Bill #, Provider, Period, Status, Gross, Net.'),

  makeRow(nextId('REV'), 'Help', 'Acceder a Help & Support', 'Baja',
    'Sesión activa como Reviewer',
    '1. Clic en "Help" en el menú lateral',
    'Se muestra la pantalla Help & Support completa.'),

  makeRow(nextId('REV'), 'Logout', 'Cerrar sesión', 'Alta',
    'Sesión activa como Reviewer',
    '1. Clic en el avatar de usuario\n2. Seleccionar "Log out"',
    'Sesión cerrada. Redirige al login de Keycloak.'),
];

// ─────────────────────────────────────────────────────────
// TEST CASES — APPROVER
// ─────────────────────────────────────────────────────────
idCounter = 1;
const approverRows = [
  makeRow(nextId('APP'), 'Login', 'Login exitoso como Approver', 'Alta',
    'Usuario approver@quantify.local existe en Keycloak',
    '1. Navegar al login de Quantify\n2. Ingresar email: approver@quantify.local\n3. Ingresar password: approver123\n4. Clic en "Login"',
    'Redirige al Dashboard. Menú lateral muestra: Dashboard, Invoice, Help.'),

  makeRow(nextId('APP'), 'Dashboard', 'Dashboard muestra métricas e indicadores', 'Alta',
    'Sesión activa como Approver',
    '1. Clic en "Dashboard"',
    'Se muestran 4 tarjetas de métricas (Total Pending, Approved This Month, Rejected, Total Volume) + gráficas Bills Trend, Bills by Status, Top Providers + Recent Bills.'),

  makeRow(nextId('APP'), 'Invoice', 'Ver lista de facturas — solo estado Reviewed', 'Alta',
    'Sesión activa como Approver. Existen facturas en estado Reviewed.',
    '1. Clic en "Invoice" en el menú lateral',
    'Por defecto se muestran facturas en estado "Reviewed" (listas para aprobación). El filtro de estado muestra "1 selected". No aparece botón "Create Bill".'),

  makeRow(nextId('APP'), 'Invoice', 'Aprobar factura (Reviewed → Approved)', 'Alta',
    'Sesión activa como Approver. Existe factura en estado Reviewed.',
    '1. Localizar factura en estado "Reviewed"\n2. Clic en "Action"\n3. Seleccionar "Approve"\n4. Confirmar la acción',
    'La factura cambia de estado "Reviewed" a "Approved". La acción queda registrada.'),

  makeRow(nextId('APP'), 'Invoice', 'Rechazar factura (Reviewed → Rejected)', 'Alta',
    'Sesión activa como Approver. Existe factura en estado Reviewed.',
    '1. Localizar factura en estado "Reviewed"\n2. Clic en "Action"\n3. Seleccionar "Reject"\n4. Ingresar motivo si aplica\n5. Confirmar',
    'La factura cambia a estado "Rejected". El Provider puede ver el rechazo.'),

  makeRow(nextId('APP'), 'Invoice', 'Ver detalle de factura antes de aprobar', 'Media',
    'Sesión activa como Approver',
    '1. Clic sobre una fila de factura en la lista\n2. Revisar el contenido completo',
    'Se muestra detalle: encabezado, líneas de proyecto/horas/rate, documentos, historial de estados.'),

  makeRow(nextId('APP'), 'Invoice', 'Filtrar facturas por período', 'Media',
    'Sesión activa como Approver',
    '1. Clic en "Period"\n2. Seleccionar período\n3. Observar resultados',
    'La tabla se filtra correctamente por el período seleccionado.'),

  makeRow(nextId('APP'), 'Invoice', 'Intentar crear factura (acción no permitida)', 'Alta',
    'Sesión activa como Approver',
    '1. Verificar que NO existe botón "Create Bill" en el header\n2. Intentar navegar directamente a /invoice/new-invoice',
    'No existe botón Create Bill para el Approver. Si navega directamente, muestra "Access denied" o redirige al listado.'),

  makeRow(nextId('APP'), 'Help', 'Acceder a Help & Support', 'Baja',
    'Sesión activa como Approver',
    '1. Clic en "Help" en el menú lateral',
    'Se muestra la pantalla Help & Support completa.'),

  makeRow(nextId('APP'), 'Logout', 'Cerrar sesión', 'Alta',
    'Sesión activa como Approver',
    '1. Clic en el avatar de usuario\n2. Seleccionar "Log out"',
    'Sesión cerrada. Redirige al login de Keycloak.'),
];

// ─────────────────────────────────────────────────────────
// TEST CASES — ADMIN
// ─────────────────────────────────────────────────────────
idCounter = 1;
const adminRows = [
  // ── LOGIN ──
  makeRow(nextId('ADM'), 'Login', 'Login exitoso como Admin', 'Alta',
    'Usuario admin@quantify.local existe en Keycloak',
    '1. Navegar al login de Quantify\n2. Ingresar email: admin@quantify.local\n3. Ingresar password: admin123\n4. Clic en "Login"',
    'Redirige al Dashboard. Menú lateral muestra: Dashboard, Providers, Invoice, Users, Reports, Quickbook, Help.'),

  // ── DASHBOARD ──
  makeRow(nextId('ADM'), 'Dashboard', 'Dashboard muestra métricas e indicadores', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en "Dashboard"',
    'Se muestran 4 tarjetas de métricas (Total Pending, Approved This Month, Rejected, Total Volume) + gráficas Bills Trend, Bills by Status, Top Providers by Volume + Recent Bills.'),

  makeRow(nextId('ADM'), 'Dashboard', 'Dashboard — botón View Bills', 'Media',
    'Sesión activa como Admin',
    '1. En el Dashboard, clic en "View Bills"',
    'Redirige a la lista de Invoice (/invoice/invoices).'),

  // ── PROVIDERS ──
  makeRow(nextId('ADM'), 'Providers', 'Ver lista de proveedores', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en "Providers" en el menú lateral',
    'Se muestra la lista de proveedores con columnas: estado (badge), Provider Type, Provider Name, Vendor ID, Action. Filtros: Provider Type, Status, Provider.'),

  makeRow(nextId('ADM'), 'Providers', 'Crear proveedor nuevo', 'Alta',
    'Sesión activa como Admin',
    '1. En Providers, clic en "Create Provider +"\n2. Completar sección Personal Information: First Name, Last Name, Tax ID, ID Vendor, Provider Type\n3. Completar Contact Information: Email, Phone\n4. Completar Address Information\n5. Completar Banking Information (Bank Name, Bank Address)\n6. Adjuntar documento en Provider Documents\n7. Clic en "Save"',
    'El proveedor se crea en estado "Draft". Aparece en la lista de Providers.'),

  makeRow(nextId('ADM'), 'Providers', 'Crear proveedor — validación campos requeridos', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en "Create Provider +"\n2. Dejar vacíos los campos obligatorios (*)\n3. Clic en "Submit"',
    'El sistema muestra mensajes de validación en: First Name, Last Name, Tax ID, ID Vendor, Email, Bank Name, Bank Address.'),

  makeRow(nextId('ADM'), 'Providers', 'Crear proveedor — Submit activa proveedor', 'Alta',
    'Sesión activa como Admin. Existe un proveedor en estado Draft.',
    '1. Completar todos los campos requeridos del formulario Create Provider\n2. Adjuntar documentos requeridos\n3. Clic en "Submit"',
    'El proveedor cambia de estado "Draft" a "Active" (o flujo de activación correspondiente).'),

  makeRow(nextId('ADM'), 'Providers', 'Filtrar proveedores por tipo', 'Media',
    'Sesión activa como Admin, en lista Providers',
    '1. En filtro "Provider Type", seleccionar "Contractor"\n2. Observar resultados\n3. Cambiar a "Vendor"',
    'La lista se filtra correctamente por tipo de proveedor.'),

  makeRow(nextId('ADM'), 'Providers', 'Filtrar proveedores por estado', 'Media',
    'Sesión activa como Admin',
    '1. En filtro "Status", seleccionar "Active"\n2. Observar resultados',
    'Solo aparecen proveedores con estado Active.'),

  makeRow(nextId('ADM'), 'Providers', 'Acción sobre proveedor — cambiar estado', 'Media',
    'Sesión activa como Admin. Existe un proveedor Active.',
    '1. En la fila del proveedor, clic en "Action"\n2. Seleccionar "Disable" o "Cancel"',
    'El estado del proveedor cambia al nuevo estado seleccionado.'),

  // ── INVOICE ──
  makeRow(nextId('ADM'), 'Invoice', 'Ver facturas de todos los proveedores', 'Alta',
    'Sesión activa como Admin. Existen facturas de múltiples proveedores.',
    '1. Clic en "Invoice" en el menú lateral',
    'Se muestra la lista de facturas de TODOS los proveedores. Columnas: estado, Bill #, Provider, Company, Project, Deadline, Period, Amount, Action.'),

  makeRow(nextId('ADM'), 'Invoice', 'Filtrar facturas por proveedor', 'Media',
    'Sesión activa como Admin',
    '1. En la lista Invoice, escribir nombre de proveedor en el buscador\n2. Clic en búsqueda',
    'La tabla muestra solo facturas del proveedor buscado.'),

  makeRow(nextId('ADM'), 'Invoice', 'Admin NO puede crear factura', 'Alta',
    'Sesión activa como Admin',
    '1. Verificar que NO existe botón "Create Bill" visible para el Admin\n2. Intentar navegar directamente a /invoice/new-invoice',
    'El Admin no tiene botón "Create Bill". Si navega directamente, muestra acceso denegado.'),

  // ── USERS ──
  makeRow(nextId('ADM'), 'Users', 'Ver lista de usuarios y roles', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en "Users" en el menú lateral',
    'Se muestra la pantalla "Users & Roles" con: tarjetas de conteo por rol (Admins, Reviewers, Approvers, Providers), buscador, filtro por rol, tabla con columnas USER, EMAIL, ROLE, COMPANY, STATUS.'),

  makeRow(nextId('ADM'), 'Users', 'Agregar nuevo usuario', 'Alta',
    'Sesión activa como Admin, en pantalla Users',
    '1. Clic en "+ Add User"\n2. Completar Full name\n3. Completar Email\n4. Seleccionar Role (Provider/Reviewer/Approver/Admin)\n5. Si rol = Provider: completar Company\n6. Clic en "Create user"',
    'El usuario se crea y aparece en la tabla. Si el rol es Provider, se muestra la empresa asociada.'),

  makeRow(nextId('ADM'), 'Users', 'Agregar usuario — campo Company visible solo para Provider', 'Media',
    'Sesión activa como Admin, modal Add User abierto',
    '1. En el modal Add User, seleccionar Role = "Reviewer"\n2. Verificar campo Company\n3. Cambiar Role a "Provider"\n4. Verificar campo Company',
    'El campo Company solo aparece cuando el rol seleccionado es "Provider".'),

  makeRow(nextId('ADM'), 'Users', 'Filtrar usuarios por rol', 'Media',
    'Sesión activa como Admin, en pantalla Users',
    '1. En el dropdown "All Roles", seleccionar "Provider"',
    'La tabla muestra solo usuarios con rol Provider.'),

  makeRow(nextId('ADM'), 'Users', 'Buscar usuario por nombre o email', 'Media',
    'Sesión activa como Admin, en pantalla Users',
    '1. Escribir nombre o email en el campo "Search users..."\n2. Observar resultados',
    'La tabla se filtra en tiempo real mostrando solo los usuarios que coinciden.'),

  // ── REPORTS ──
  makeRow(nextId('ADM'), 'Reports', 'Acceder a Reports como Admin', 'Media',
    'Sesión activa como Admin',
    '1. Clic en "Reports" en el menú lateral',
    'Se muestra la página Reports con sección FILTERS, tarjetas de métricas y tabla Detail.'),

  makeRow(nextId('ADM'), 'Reports', 'Exportar CSV desde Reports', 'Media',
    'Sesión activa como Admin, en página Reports',
    '1. Aplicar algún filtro si se desea\n2. Clic en "↓ Export CSV"',
    'Se descarga el archivo CSV con los datos del reporte.'),

  // ── QUICKBOOK ──
  makeRow(nextId('ADM'), 'Quickbook', 'Ver estado de conexión con QuickBooks', 'Media',
    'Sesión activa como Admin',
    '1. Clic en "Quickbook" en el menú lateral',
    'Se muestra la página Quickbook con: estado de conexión (Connected/Disconnected), Realm ID, Environment, fecha de conexión, sección de sincronización de datos.'),

  makeRow(nextId('ADM'), 'Quickbook', 'Sincronizar Vendors desde QuickBooks', 'Media',
    'Sesión activa como Admin. QuickBooks configurado y conectado.',
    '1. En la página Quickbook, localizar la fila "Vendor"\n2. Clic en "Sync"',
    'Se ejecuta la sincronización de Vendors. El resultado muestra: Fetched, Created, Updated y la fecha/hora del último sync.'),

  makeRow(nextId('ADM'), 'Quickbook', 'Ver providers sincronizados desde QuickBooks', 'Media',
    'Sesión activa como Admin. Vendors sincronizados.',
    '1. En la página Quickbook, fila Vendor, clic en "Ver providers"',
    'Redirige a la lista de Providers mostrando los proveedores importados desde QuickBooks.'),

  // ── HELP ──
  makeRow(nextId('ADM'), 'Help', 'Acceder a Help & Support', 'Baja',
    'Sesión activa como Admin',
    '1. Clic en "Help" en el menú lateral',
    'Se muestra la pantalla Help & Support completa.'),

  // ── LOGOUT ──
  makeRow(nextId('ADM'), 'Logout', 'Cerrar sesión', 'Alta',
    'Sesión activa como Admin',
    '1. Clic en el avatar de usuario\n2. Seleccionar "Log out"',
    'Sesión cerrada. Redirige al login de Keycloak.'),

  // ── SEGURIDAD / ACCESO ──
  makeRow(nextId('ADM'), 'Seguridad', 'Admin no accede a rutas de otros roles', 'Alta',
    'Sesión activa como Admin',
    '1. Intentar navegar a /invoice/new-invoice (solo Provider)\n2. Observar el resultado',
    'Se muestra página de acceso denegado o redirige al módulo correcto del Admin.'),
];

// ─────────────────────────────────────────────────────────
// CROSS-ROL — SEGURIDAD Y RESTRICCIONES
// ─────────────────────────────────────────────────────────
idCounter = 1;
const securityRows = [
  makeRow(nextId('SEC'), 'Seguridad', 'Provider no accede al Dashboard', 'Alta',
    'Sesión activa como Provider',
    '1. Intentar navegar a /dashboard',
    'El Provider no tiene acceso al Dashboard. Redirige a Invoice o muestra acceso denegado.'),

  makeRow(nextId('SEC'), 'Seguridad', 'Provider no accede a Providers', 'Alta',
    'Sesión activa como Provider',
    '1. Intentar navegar a /providers',
    'Acceso denegado. Redirige o muestra error de permisos.'),

  makeRow(nextId('SEC'), 'Seguridad', 'Provider no accede a Users', 'Alta',
    'Sesión activa como Provider',
    '1. Intentar navegar a /users',
    'Acceso denegado.'),

  makeRow(nextId('SEC'), 'Seguridad', 'Provider solo ve sus propias facturas', 'Alta',
    'Sesión activa como Provider. Existen facturas de otros providers.',
    '1. Navegar a Invoice\n2. Revisar todas las facturas visibles',
    'Solo aparecen facturas del provider autenticado. No puede ver facturas de otros proveedores.'),

  makeRow(nextId('SEC'), 'Seguridad', 'Reviewer no puede crear facturas', 'Alta',
    'Sesión activa como Reviewer',
    '1. Verificar que no existe botón "Create Bill"\n2. Intentar navegar a /invoice/new-invoice',
    'Acceso denegado. El Reviewer no tiene permiso de creación.'),

  makeRow(nextId('SEC'), 'Seguridad', 'Reviewer no accede a Providers ni Users', 'Alta',
    'Sesión activa como Reviewer',
    '1. Intentar navegar a /providers\n2. Intentar navegar a /users',
    'Acceso denegado en ambos casos.'),

  makeRow(nextId('SEC'), 'Seguridad', 'Approver no puede crear facturas', 'Alta',
    'Sesión activa como Approver',
    '1. Verificar que no existe botón "Create Bill"\n2. Intentar navegar a /invoice/new-invoice',
    'Acceso denegado.'),

  makeRow(nextId('SEC'), 'Seguridad', 'Approver no accede a Reports', 'Alta',
    'Sesión activa como Approver',
    '1. Intentar navegar a /reports',
    'No existe enlace en el menú. Si navega directamente: acceso denegado.'),

  makeRow(nextId('SEC'), 'Seguridad', 'Usuario sin sesión no accede a páginas protegidas', 'Alta',
    'No existe sesión activa',
    '1. Intentar navegar directamente a /dashboard\n2. Intentar navegar a /invoice/invoices',
    'El sistema redirige al login de Keycloak en ambos casos.'),

  makeRow(nextId('SEC'), 'Seguridad', 'Token expirado — redirige al login', 'Media',
    'Sesión vencida (esperar tiempo de expiración del token de Keycloak)',
    '1. Dejar la sesión inactiva hasta que expire\n2. Intentar realizar cualquier acción',
    'El sistema detecta el token expirado y redirige al login de Keycloak para re-autenticarse.'),
];

// ─────────────────────────────────────────────────────────
// BUILD WORKBOOK
// ─────────────────────────────────────────────────────────
const wb = XLSX.utils.book_new();

const COLS = [
  { wch: 12 },  // ID
  { wch: 18 },  // Módulo
  { wch: 45 },  // Escenario
  { wch: 10 },  // Prioridad
  { wch: 45 },  // Pre-condiciones
  { wch: 65 },  // Pasos
  { wch: 55 },  // Resultado esperado
  { wch: 35 },  // Resultado actual
  { wch: 12 },  // Estado
  { wch: 25 },  // Notas
];

const sheets = [
  { name: 'Provider', rows: providerRows },
  { name: 'Reviewer', rows: reviewerRows },
  { name: 'Approver', rows: approverRows },
  { name: 'Admin',    rows: adminRows },
  { name: 'Seguridad y Acceso', rows: securityRows },
];

for (const { name, rows } of sheets) {
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = COLS;
  XLSX.utils.book_append_sheet(wb, ws, name);
}

const outPath = 'C:\\Users\\Laury Pacheco\\Desktop\\Quantify 2.0\\Quantify-2.0\\.workspace\\Certificacion_Quantify.xlsx';
XLSX.writeFile(wb, outPath);
console.log('Archivo generado: ' + outPath);
