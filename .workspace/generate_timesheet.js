const ExcelJS = require('exceljs');

const outputPath = '.workspace/Timesheet_Intelutions_Sae_2026.xlsx';
const workbook = new ExcelJS.Workbook();
workbook.creator = 'GitHub Copilot';
workbook.created = new Date();
workbook.modified = new Date();

const navy = '17324D';
const blue = '2E75B6';
const paleBlue = 'D9EAF7';
const paleGray = 'F3F6F8';
const borderColor = 'B7C9D6';
const white = 'FFFFFF';

function applyBorder(cell) {
  cell.border = {
    top: { style: 'thin', color: { argb: borderColor } },
    left: { style: 'thin', color: { argb: borderColor } },
    bottom: { style: 'thin', color: { argb: borderColor } },
    right: { style: 'thin', color: { argb: borderColor } },
  };
}

const timesheet = workbook.addWorksheet('Timesheet');
timesheet.views = [{ state: 'frozen', ySplit: 6 }];
timesheet.mergeCells('A1:H1');
timesheet.getCell('A1').value = 'Zoho Timesheet';
timesheet.getCell('A1').font = { bold: true, size: 18, color: { argb: white } };
timesheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: navy } };
timesheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
timesheet.getRow(1).height = 30;

timesheet.getRow(3).values = ['Project', 'Intelutions Sae 2026', '', 'Period', 'September 2026', '', 'Currency', 'USD'];
timesheet.getRow(4).values = ['Billing rate', 30, '', 'Target amount', 1800, '', 'Target hours', 60];
for (const rowNumber of [3, 4]) {
  for (let column = 1; column <= 8; column += 1) {
    const cell = timesheet.getCell(rowNumber, column);
    applyBorder(cell);
    if ([1, 4, 7].includes(column)) {
      cell.font = { bold: true, color: { argb: navy } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: paleBlue } };
    }
  }
}
timesheet.getCell('B4').numFmt = '$#,##0.00';
timesheet.getCell('E4').numFmt = '$#,##0.00';

const headers = ['Date', 'Project Name', 'Task', 'Hours', 'Rate', 'Amount', 'Billable', 'Notes'];
timesheet.getRow(6).values = headers;
timesheet.getRow(6).eachCell((cell) => {
  cell.font = { bold: true, color: { argb: white } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } };
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  applyBorder(cell);
});

const dates = [];
for (let day = 1; day <= 30; day += 1) {
  const date = new Date(Date.UTC(2026, 8, day));
  const weekday = date.getUTCDay();
  if (weekday !== 0 && weekday !== 6) dates.push(date);
}

dates.forEach((date, index) => {
  const rowNumber = 7 + index;
  const hours = index < 16 ? 3 : 2;
  timesheet.getRow(rowNumber).values = [
    date,
    'Intelutions Sae 2026',
    'Project services',
    hours,
    30,
    { formula: `D${rowNumber}*E${rowNumber}` },
    'Yes',
    'Monthly allocation',
  ];
  timesheet.getCell(rowNumber, 1).numFmt = 'yyyy-mm-dd';
  timesheet.getCell(rowNumber, 5).numFmt = '$#,##0.00';
  timesheet.getCell(rowNumber, 6).numFmt = '$#,##0.00';
  timesheet.getRow(rowNumber).eachCell((cell) => {
    applyBorder(cell);
    cell.alignment = { vertical: 'middle', wrapText: true };
    if (rowNumber % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: paleGray } };
  });
});

const totalRow = 7 + dates.length;
timesheet.getCell(totalRow, 3).value = 'TOTAL';
timesheet.getCell(totalRow, 4).value = { formula: `SUM(D7:D${totalRow - 1})` };
timesheet.getCell(totalRow, 6).value = { formula: `SUM(F7:F${totalRow - 1})` };
timesheet.getCell(totalRow, 6).numFmt = '$#,##0.00';
for (let column = 1; column <= 8; column += 1) {
  const cell = timesheet.getCell(totalRow, column);
  cell.font = { bold: true, color: { argb: navy } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: paleBlue } };
  applyBorder(cell);
}

timesheet.columns = [
  { width: 14 }, { width: 24 }, { width: 22 }, { width: 10 },
  { width: 12 }, { width: 14 }, { width: 12 }, { width: 24 },
];
timesheet.autoFilter = { from: 'A6', to: `H${totalRow - 1}` };

const summary = workbook.addWorksheet('Resumen');
summary.mergeCells('A1:D1');
summary.getCell('A1').value = 'Resumen de facturacion';
summary.getCell('A1').font = { bold: true, size: 18, color: { argb: white } };
summary.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: navy } };
summary.getCell('A1').alignment = { horizontal: 'center' };
summary.getRow(1).height = 30;
summary.getRow(3).values = ['Concepto', 'Valor', 'Objetivo', 'Estado'];
summary.getRow(3).eachCell((cell) => {
  cell.font = { bold: true, color: { argb: white } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: blue } };
  applyBorder(cell);
});
summary.getRow(4).values = ['Proyecto', 'Intelutions Sae 2026', 'Intelutions Sae 2026', 'OK'];
summary.getRow(5).values = ['Horas totales', { formula: `Timesheet!D${totalRow}` }, 60, { formula: 'IF(B5=C5,"OK","REVISAR")' }];
summary.getRow(6).values = ['Tarifa por hora', { formula: 'Timesheet!B4' }, 30, { formula: 'IF(B6=C6,"OK","REVISAR")' }];
summary.getRow(7).values = ['Importe total', { formula: `Timesheet!F${totalRow}` }, 1800, { formula: 'IF(B7=C7,"OK","REVISAR")' }];
summary.getRow(8).values = ['Periodo', 'September 2026', 'Monthly', 'OK'];
for (let rowNumber = 4; rowNumber <= 8; rowNumber += 1) {
  summary.getRow(rowNumber).eachCell((cell) => {
    applyBorder(cell);
    if (rowNumber % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: paleGray } };
  });
}
for (const cell of ['B6', 'C6', 'B7', 'C7']) summary.getCell(cell).numFmt = '$#,##0.00';
summary.getColumn(1).width = 24;
summary.getColumn(2).width = 24;
summary.getColumn(3).width = 20;
summary.getColumn(4).width = 14;

workbook.xlsx.writeFile(outputPath).then(() => console.log(outputPath));
