const ExcelJS = require('exceljs');

const FILE = '.workspace/Certificacion_Quantify.xlsx';

// Estado categories -> fill colors
const COLORS = {
  OK: { fill: 'C6EFCE', font: '006100' },        // green - verificado, coincide
  PARCIAL: { fill: 'FFEB9C', font: '9C6500' },    // yellow - coincide con diferencias / desactualizado
  BUG: { fill: 'FFC7CE', font: '9C0006' },        // red - bug o bloqueado
  PENDIENTE: { fill: 'D9D9D9', font: '404040' },  // gray - no verificado en esta sesión
};

function styleCell(cell, category) {
  const c = COLORS[category];
  if (!c) return;
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + c.fill } };
  cell.font = { color: { argb: 'FF' + c.font } };
}

// data[SHEET][ID] = { actual, estado, notas, cat }
const data = {
  Provider: {
    'PRV-001': { actual: "Login correcto (email+password). Redirige a /invoice/invoices. Menú lateral real: \"Bills\" y \"Help\" (no dice literalmente \"Invoice\"). Saludo \"Hello, Juan\" visible. Aparece sección adicional \"Administration > Settings\" no documentada.", estado: '⚠️ OK con diferencias de texto', notas: 'Actualizar: el menú dice "Bills", no "Invoice". Agregar que existe módulo "Settings" bajo "Administration" para este rol.', cat: 'PARCIAL' },
    'PRV-002': { actual: '', estado: '⏳ No verificado', notas: 'No se probó en esta sesión de verificación en vivo.', cat: 'PENDIENTE' },
    'PRV-003': { actual: 'Botón "Microsoft" presente y funcional en pantalla de login (verificado visualmente).', estado: '⏳ No verificado', notas: 'Requiere cuenta Microsoft federada real para completar el flujo; no se ejecutó.', cat: 'PENDIENTE' },
    'PRV-004': { actual: 'La lista carga con métricas Pending Total / Overdue Amount / Payments this month y filtros (Invoice Number, All companies, Advanced, Status, Period). Actualmente "No bills match your filters" (0 facturas cargadas).', estado: '🔴 Bloqueado (sin datos)', notas: 'No hay facturas de prueba en el ambiente actual; no se puede confirmar que solo se vean facturas propias.', cat: 'BUG' },
    'PRV-005': { actual: 'Filtro "Status" presente ("0 selected").', estado: '🔴 Bloqueado (sin datos)', notas: 'No se puede validar el filtrado sin facturas de prueba.', cat: 'BUG' },
    'PRV-006': { actual: 'Filtro "Period" presente.', estado: '🔴 Bloqueado (sin datos)', notas: 'No se puede validar el filtrado sin facturas de prueba.', cat: 'BUG' },
    'PRV-007': { actual: 'Campo "Invoice Number" presente y coincide con lo documentado.', estado: '🔴 Bloqueado (sin datos)', notas: 'No hay facturas para validar la búsqueda.', cat: 'BUG' },
    'PRV-008': { actual: 'Formulario "Create Bill" carga (Year, Month, Company, Bill Number, líneas). El dropdown "Company" aparece deshabilitado con mensaje "Could not load dropdown options" (error 400 Bad Request en consola).', estado: '🔴 BUG confirmado', notas: 'Bug bloqueante: no se puede seleccionar Company, por lo que no se puede completar ni guardar una factura nueva.', cat: 'BUG' },
    'PRV-009': { actual: 'No ejecutable: depende de poder seleccionar Company (ver PRV-008).', estado: '🔴 Bloqueado por bug', notas: 'Mismo bug que PRV-008.', cat: 'BUG' },
    'PRV-010': { actual: 'Botón "Upload Document" y dropdown "Document Type" visibles, pero la fila completa depende del encabezado (Company) que está bloqueado.', estado: '🔴 Bloqueado por bug', notas: 'Mismo bug que PRV-008.', cat: 'BUG' },
    'PRV-011': { actual: '', estado: '⏳ No verificado', notas: 'No se probó el envío del formulario vacío; además el bug de PRV-008 puede interferir.', cat: 'PENDIENTE' },
    'PRV-012': { actual: 'Botón "Cancel" visible con enlace correcto a /invoice/invoices.', estado: '⏳ No verificado (elemento presente)', notas: 'Se confirmó la presencia del botón, no se ejecutó el flujo completo.', cat: 'PENDIENTE' },
    'PRV-013': { actual: 'No ejecutable actualmente: no existe forma de crear una factura en Draft por el bug de PRV-008.', estado: '🔴 Bloqueado por bug', notas: 'Dependencia directa de PRV-008.', cat: 'BUG' },
    'PRV-014': { actual: '', estado: '⏳ No verificado', notas: 'No hay facturas Submitted disponibles para probar.', cat: 'PENDIENTE' },
    'PRV-015': { actual: '', estado: '🔴 Bloqueado (sin datos)', notas: 'No hay facturas cargadas para ver el detalle.', cat: 'BUG' },
    'PRV-016': { actual: 'La pantalla Help solo muestra el título "Help", sin Documentation, Live Chat, Email Support, FAQ ni formulario de contacto.', estado: '🔴 BUG / incompleto', notas: 'El contenido descrito en el documento no existe actualmente en la pantalla real.', cat: 'BUG' },
    'PRV-017': { actual: 'No aplica: no hay preguntas FAQ en la pantalla actual.', estado: '🔴 Bloqueado por bug', notas: 'Depende de PRV-016.', cat: 'BUG' },
    'PRV-018': { actual: 'Logout confirmado: menú de usuario (avatar "PU") → "Log out" → redirige al login de Keycloak.', estado: '✅ Verificado', notas: 'Coincide con lo documentado.', cat: 'OK' },
  },
  Reviewer: {
    'REV-001': { actual: 'Login correcto, redirige a /dashboard. Menú real: Dashboard, Bills, Help, Reports + sección "Administration > Settings" (no documentada).', estado: '⚠️ OK con diferencias', notas: 'Agregar módulo "Settings" al menú documentado para Reviewer.', cat: 'PARCIAL' },
    'REV-002': { actual: '4 tarjetas de métricas + Bills Trend + Bills by Status + Top Providers by Volume + Recent Bills presentes. Con la BD vacía se muestra "No data to display."', estado: '✅ Verificado (estructura)', notas: 'Estructura coincide; contenido vacío por falta de datos.', cat: 'OK' },
    'REV-003': { actual: 'Botón "View Bills" presente con enlace a /invoice/invoices.', estado: '✅ Verificado', notas: '', cat: 'OK' },
    'REV-004': { actual: 'BUG CRÍTICO: al entrar a Bills como Reviewer, la pantalla mostró datos de sesión del Provider ("Hello, Juan" + botón "Create Bill", que el Reviewer no debería tener). Consola: "Hydration completed but contains mismatches."', estado: '🔴 BUG CRÍTICO confirmado', notas: 'Posible filtrado/caché de SSR entre usuarios: riesgo de fuga de datos entre sesiones/roles. Reportar como bug de prioridad alta y volver a verificar con refresco forzado.', cat: 'BUG' },
    'REV-005': { actual: 'No verificable de forma confiable por el bug de REV-004.', estado: '🔴 Bloqueado por bug', notas: 'Repetir la prueba una vez corregido el bug de hidratación.', cat: 'BUG' },
    'REV-006': { actual: '', estado: '🔴 Bloqueado (sin datos + bug)', notas: 'No hay facturas Submitted disponibles y persiste el riesgo del bug de REV-004.', cat: 'BUG' },
    'REV-007': { actual: '', estado: '🔴 Bloqueado (sin datos + bug)', notas: 'Igual a REV-006.', cat: 'BUG' },
    'REV-008': { actual: '', estado: '🔴 Bloqueado (sin datos)', notas: 'No hay facturas para ver detalle.', cat: 'BUG' },
    'REV-009': { actual: '', estado: '⏳ No verificado', notas: 'No se navegó a Reports en esta sesión.', cat: 'PENDIENTE' },
    'REV-010': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'REV-011': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'REV-012': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'REV-013': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'REV-014': { actual: 'La pantalla Help solo muestra el título "Help", sin contenido adicional.', estado: '🔴 BUG / incompleto', notas: 'Mismo hallazgo que PRV-016 (pantalla compartida entre roles).', cat: 'BUG' },
    'REV-015': { actual: 'Logout confirmado: menú de usuario (avatar "RU") → "Log out" → redirige al login.', estado: '✅ Verificado', notas: '', cat: 'OK' },
  },
  Approver: {
    'APP-001': { actual: 'Login correcto, redirige a /dashboard. Menú real: Dashboard, Bills, Help + "Administration > Settings" (sin Reports, correcto).', estado: '⚠️ OK con diferencias', notas: 'Agregar módulo "Settings" al menú documentado para Approver.', cat: 'PARCIAL' },
    'APP-002': { actual: 'Verificado con datos reales: tarjetas de métricas (Rejected $10,980 / 4 bills, Total Volume $37,990 / 16 bills), gráficas y Recent Bills con datos reales.', estado: '✅ Verificado', notas: '', cat: 'OK' },
    'APP-003': { actual: '', estado: '⏳ No verificado', notas: 'No se navegó a Bills como Approver en esta sesión.', cat: 'PENDIENTE' },
    'APP-004': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'APP-005': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'APP-006': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'APP-007': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'APP-008': { actual: '', estado: '⏳ No verificado', notas: 'No se confirmó la ausencia del botón "Create Bill" para Approver en esta sesión.', cat: 'PENDIENTE' },
    'APP-009': { actual: 'La pantalla Help solo muestra el título "Help", sin contenido adicional (mismo componente compartido verificado para Provider/Reviewer).', estado: '🔴 BUG / incompleto', notas: 'Extrapolado del mismo hallazgo en otros roles (ruta /help compartida).', cat: 'BUG' },
    'APP-010': { actual: 'Logout confirmado: menú de usuario (avatar "AU") → "Log out" → redirige al login.', estado: '✅ Verificado', notas: '', cat: 'OK' },
  },
  Admin: {
    'ADM-001': { actual: 'Login correcto, redirige a /dashboard. Menú real: Dashboard, Providers, Bills, Companies, Help + "Administration > Users, Reports, Settings".', estado: '⚠️ Desactualizado', notas: 'Diferencias: aparece módulo nuevo "Companies" (no documentado); NO existe un ítem de menú "Quickbook" (ver ADM-021/022); aparece "Settings" nuevo.', cat: 'PARCIAL' },
    'ADM-002': { actual: 'Verificado con datos reales: métricas, Bills Trend, Bills by Status, Top Providers, Recent Bills con datos reales.', estado: '✅ Verificado', notas: '', cat: 'OK' },
    'ADM-003': { actual: 'Botón "View Bills" presente con enlace a /invoice/invoices.', estado: '✅ Verificado', notas: '', cat: 'OK' },
    'ADM-004': { actual: 'Lista carga con filtros Provider Type (All/Contractor/Vendor), Status y buscador "Search by name...". Botón real es "Create Provider" (sin "+"). Actualmente 0 proveedores.', estado: '⚠️ OK con diferencias', notas: 'El filtro Status tiene más opciones que las documentadas: All, Active, Completed, Pending Confirmation, Disabled, Cancelled, Draft (se agregaron "Completed" y "Pending Confirmation").', cat: 'PARCIAL' },
    'ADM-005': { actual: '', estado: '⏳ No verificado', notas: 'No se completó el formulario de creación en esta sesión.', cat: 'PENDIENTE' },
    'ADM-006': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'ADM-007': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'ADM-008': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'ADM-009': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'ADM-010': { actual: '', estado: '⏳ No verificado', notas: 'No hay proveedores de prueba para ejecutar la acción.', cat: 'PENDIENTE' },
    'ADM-011': { actual: '', estado: '⏳ No verificado', notas: 'No se abrió Bills como Admin en esta sesión. Se detectó un bug de hidratación/caché al ver Bills como Reviewer (REV-004); recomendable re-verificar también con Admin.', cat: 'PENDIENTE' },
    'ADM-012': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'ADM-013': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'ADM-014': { actual: 'Página "Users" carga con filtros Role (All/Admin/Reviewer/Approver/Provider) y Status (All/Active/Disabled) + buscador "Search by name or email...". El botón real es "Invite User", no "+ Add User". No se observaron las tarjetas de conteo por rol (Admins/Reviewers/Approvers/Providers); el encabezado solo muestra "X users". Actualmente 0 usuarios.', estado: '⚠️ Desactualizado', notas: 'Actualizar: el botón se llama "Invite User" (sugiere flujo de invitación por email, no creación directa). Confirmar si las tarjetas de conteo por rol siguen existiendo en la UI real.', cat: 'PARCIAL' },
    'ADM-015': { actual: '', estado: '⏳ No verificado', notas: 'El botón ahora es "Invite User"; el flujo podría ser distinto al de "+ Add User" documentado (posible invitación por correo en vez de alta directa). Verificar antes de re-certificar.', cat: 'PENDIENTE' },
    'ADM-016': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'ADM-017': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'ADM-018': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'ADM-019': { actual: '', estado: '⏳ No verificado', notas: 'Enlace "Reports" presente en el menú; no se exploró la pantalla.', cat: 'PENDIENTE' },
    'ADM-020': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'ADM-021': { actual: 'NO existe un ítem de menú "Quickbook". En su lugar aparece un badge "QuickBooks Not Connected" en la barra lateral, y en Settings > "Accounting Accounts" se menciona "Expense and COGS accounts synced from QuickBooks Online."', estado: '🔴 Desactualizado (flujo cambió)', notas: 'Reescribir el caso de prueba: la conexión/estado de QuickBooks ya no tiene pantalla propia; ahora vive como badge + sección dentro de Settings. Falta documentar el flujo real completo.', cat: 'BUG' },
    'ADM-022': { actual: 'No se encontró una pantalla dedicada de sincronización de Vendors con botón "Sync" como se describe.', estado: '🔴 Desactualizado (flujo cambió)', notas: 'Mismo hallazgo que ADM-021. Requiere levantamiento de UI-UX actualizado antes de redactar steps nuevos.', cat: 'BUG' },
    'ADM-023': { actual: 'La pantalla Help solo muestra el título "Help", sin contenido adicional (mismo hallazgo que otros roles).', estado: '🔴 BUG / incompleto', notas: 'Ruta /help compartida entre todos los roles.', cat: 'BUG' },
    'ADM-024': { actual: 'No se ejecutó el logout explícito para Admin en esta sesión, pero el mismo patrón de menú de usuario → "Log out" se confirmó 3 veces (Provider, Reviewer, Approver).', estado: '⚠️ Muy probable OK (no ejecutado)', notas: 'Confirmar en próxima sesión por consistencia con los otros 3 roles.', cat: 'PARCIAL' },
  },
  'Seguridad y Acceso': {
    // No se navegó explícitamente a rutas restringidas para confirmar bloqueo/permisos en esta sesión.
    'SEC-001': { actual: '', estado: '⏳ No verificado', notas: 'No se intentó acceso directo a /dashboard como Provider en esta sesión.', cat: 'PENDIENTE' },
    'SEC-002': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'SEC-003': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'SEC-004': { actual: 'Hallazgo relacionado: se detectó que Reviewer, al entrar a Bills, mostró momentáneamente datos/sesión de Provider (bug de hidratación, ver REV-004). Esto es un riesgo de aislamiento de datos entre sesiones, aunque no es exactamente este escenario (Provider viendo facturas ajenas).', estado: '⚠️ Riesgo relacionado detectado', notas: 'Priorizar la investigación del bug de REV-004 antes de certificar este módulo de seguridad.', cat: 'PARCIAL' },
    'SEC-005': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'SEC-006': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'SEC-007': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'SEC-008': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'SEC-009': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'SEC-010': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
    'SEC-011': { actual: '', estado: '⏳ No verificado', notas: '', cat: 'PENDIENTE' },
  },
};

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(FILE);

  for (const sheetName of Object.keys(data)) {
    const ws = wb.getWorksheet(sheetName);
    if (!ws) { console.log('Sheet not found:', sheetName); continue; }
    const rowsMap = data[sheetName];
    ws.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // header
      const id = row.getCell(1).value;
      const entry = rowsMap[id];
      if (!entry) return;
      const actualCell = row.getCell(8); // Resultado actual
      const estadoCell = row.getCell(9); // Estado
      const notasCell = row.getCell(10); // Notas
      actualCell.value = entry.actual;
      estadoCell.value = entry.estado;
      notasCell.value = entry.notas;
      styleCell(estadoCell, entry.cat);
      styleCell(row.getCell(2), entry.cat); // color the Módulo cell too
    });
  }

  // Summary sheet
  const existing = wb.getWorksheet('Resumen');
  if (existing) wb.removeWorksheet(existing.id);
  const summary = wb.addWorksheet('Resumen', { views: [{ state: 'frozen', ySplit: 1 }] });
  summary.columns = [
    { header: 'Rol', key: 'rol', width: 12 },
    { header: 'Módulo', key: 'modulo', width: 22 },
    { header: 'Estado del módulo', key: 'estado', width: 45 },
    { header: 'Detalle', key: 'detalle', width: 70 },
  ];
  summary.getRow(1).font = { bold: true };
  summary.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF305496' } };
  summary.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  const rows = [
    ['Provider', 'Login', '✅ Completo', 'Login, credenciales incorrectas (no probado) y SSO (no probado) — el login base funciona.'],
    ['Provider', 'Bill — Lista', '🔴 Bloqueado', 'UI correcta pero sin datos de prueba (facturas) para validar filtros/búsqueda/detalle.'],
    ['Provider', 'Create Bill', '🔴 Bloqueado (BUG)', 'Dropdown "Company" no carga (400 Bad Request). No se puede crear ninguna factura.'],
    ['Provider', 'Submit Bill', '🔴 Bloqueado', 'Depende de Create Bill (bug) y de datos existentes.'],
    ['Provider', 'Help', '🔴 Incompleto', 'Pantalla vacía: solo título "Help", sin FAQ/soporte/formulario.'],
    ['Provider', 'Logout', '✅ Completo', 'Verificado end-to-end.'],
    ['Reviewer', 'Login', '⚠️ Completo con ajuste de texto', 'Funciona; el menú dice "Bills" no "Invoice"; agregar "Settings" al documento.'],
    ['Reviewer', 'Dashboard', '✅ Completo', 'Estructura verificada (tarjetas, gráficas, Recent Bills, botón View Bills).'],
    ['Reviewer', 'Bill — Lista/Acción', '🔴 Bloqueado (BUG CRÍTICO)', 'Se detectaron datos de otra sesión (Provider) al cargar Bills como Reviewer + "Hydration mismatch". Prioridad alta.'],
    ['Reviewer', 'Reports', '⏳ No verificado', 'No explorado en esta sesión.'],
    ['Reviewer', 'Help', '🔴 Incompleto', 'Mismo hallazgo que Provider.'],
    ['Reviewer', 'Logout', '✅ Completo', 'Verificado end-to-end.'],
    ['Approver', 'Login', '⚠️ Completo con ajuste de texto', 'Funciona; agregar "Settings" al documento; sin Reports (correcto).'],
    ['Approver', 'Dashboard', '✅ Completo', 'Verificado con datos reales (montos, gráficas, Recent Bills).'],
    ['Approver', 'Bill — Lista/Acción', '⏳ No verificado', 'No explorado en esta sesión.'],
    ['Approver', 'Help', '🔴 Incompleto', 'Extrapolado del mismo hallazgo compartido.'],
    ['Approver', 'Logout', '✅ Completo', 'Verificado end-to-end.'],
    ['Admin', 'Login', '⚠️ Desactualizado', 'Aparece módulo nuevo "Companies"; NO existe ítem de menú "Quickbook"; aparece "Settings".'],
    ['Admin', 'Dashboard', '✅ Completo', 'Verificado con datos reales.'],
    ['Admin', 'Providers', '⚠️ Completo con ajustes', 'Botón real "Create Provider" (sin "+"); Status tiene 2 opciones nuevas (Completed, Pending Confirmation); 0 proveedores cargados.'],
    ['Admin', 'Users', '⚠️ Desactualizado', 'Botón real "Invite User" (no "+ Add User"); no se vieron tarjetas de conteo por rol; 0 usuarios cargados.'],
    ['Admin', 'Reports', '⏳ No verificado', 'No explorado en esta sesión.'],
    ['Admin', 'Quickbook', '🔴 Desactualizado (flujo cambió)', 'No existe pantalla "Quickbook" dedicada; ahora es un badge + sección en Settings > Accounting Accounts. Reescribir TCs.'],
    ['Admin', 'Help', '🔴 Incompleto', 'Mismo hallazgo compartido.'],
    ['Admin', 'Logout', '⚠️ Muy probable OK', 'No ejecutado para Admin, pero confirmado 3/4 roles con el mismo patrón.'],
    ['Todos', 'Seguridad y Acceso', '⏳ No verificado', 'No se probó ningún escenario de acceso restringido en esta sesión. Se detectó un riesgo relacionado en Reviewer (ver Bill — Lista/Acción).'],
  ];
  rows.forEach(r => summary.addRow(r));
  summary.eachRow((row, rn) => {
    if (rn === 1) return;
    const estado = row.getCell(3).value || '';
    let cat = 'PENDIENTE';
    if (estado.startsWith('✅')) cat = 'OK';
    else if (estado.startsWith('⚠️')) cat = 'PARCIAL';
    else if (estado.startsWith('🔴')) cat = 'BUG';
    styleCell(row.getCell(3), cat);
  });

  // Move Resumen to the front
  wb.worksheets.forEach((s, idx) => { s.orderNo = idx; });
  const resumenSheet = wb.getWorksheet('Resumen');
  wb.worksheets = [resumenSheet, ...wb.worksheets.filter(s => s.name !== 'Resumen')];

  await wb.xlsx.writeFile(FILE);
  console.log('Excel actualizado correctamente:', FILE);
}

main().catch(e => { console.error(e); process.exit(1); });
