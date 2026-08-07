// Generic "export a list to .xlsx" helper.
//
// SheetJS is pulled in with a dynamic import so it only lands in the bundle of
// whoever actually clicks an export button, not in the shared chunks.

/**
 * @param {object}   config
 * @param {Array}    config.rows      records to export
 * @param {Array}    config.columns   [{ header, value(row, index), numFmt?, width? }]
 * @param {string}   config.fileName  e.g. "appointments-2026-08-07.xlsx"
 * @param {string}   [config.sheetName]
 */
export async function exportRowsToExcel({
  rows,
  columns,
  fileName,
  sheetName = "Sheet1",
}) {
  const XLSX = await import("xlsx");

  const header = columns.map((c) => c.header);
  const body = rows.map((row, index) =>
    columns.map((c) => {
      const value = c.value(row, index);
      // Blank cells beat "N/A" strings — they sort and filter properly in Excel.
      return value === null || value === undefined ? "" : value;
    })
  );

  const ws = XLSX.utils.aoa_to_sheet([header, ...body], { cellDates: true });

  // Column widths: honour an explicit width, else size to the header.
  ws["!cols"] = columns.map((c) => ({
    wch: c.width ?? Math.max(12, c.header.length + 2),
  }));

  // Date/number formats have to be stamped on each cell.
  columns.forEach((c, colIndex) => {
    if (!c.numFmt) return;
    for (let rowIndex = 1; rowIndex <= rows.length; rowIndex++) {
      const ref = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      if (ws[ref] && ws[ref].v !== "") ws[ref].z = c.numFmt;
    }
  });

  // Filter dropdowns on the header row.
  if (rows.length > 0) {
    ws["!autofilter"] = {
      ref: XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: rows.length, c: columns.length - 1 },
      }),
    };
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName, { cellDates: true });
}

/** Parse a value into a Date for a date cell, or "" when it isn't usable. */
export const toExcelDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d;
};

/** Flatten an address that may arrive as a string or as an object of parts. */
export const flattenAddress = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    return [value.street, value.city, value.state, value.pincode, value.country]
      .filter(Boolean)
      .join(", ");
  }
  return String(value).trim();
};
