// ⬆ top me imports
import React, { createContext, useContext } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";   // ✅ IMPORTANT: named import

import { useToast } from "./ToastContext";

const ExportContext = createContext(null);
export const useExport = () => useContext(ExportContext);

export const ExportProvider = ({ children }) => {
  const { success, error, info } = useToast();

  // ---------- EXCEL ----------
  const exportExcel = ({ fileName = "Export", sheetName = "Sheet1", columns, rows }) => {
    try {
      if (!rows || !rows.length) {
        error("No data available to export to Excel.");
        return;
      }

      const data = rows.map((row) => {
        const obj = {};
        columns.forEach((col) => {
          obj[col.header] = row[col.key] ?? "";
        });
        return obj;
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, `${fileName}.xlsx`);

      success(`Excel file "${fileName}.xlsx" generated successfully.`);
    } catch (err) {
      console.error("Excel export error:", err);
      error("Failed to export Excel file.");
    }
  };

  // ---------- PDF ----------
  const exportPDF = ({ fileName = "Export", title = "Report", columns, rows }) => {
    try {
      if (!rows || !rows.length) {
        error("No data available to export to PDF.");
        return;
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      doc.setFontSize(16);
      doc.text(title, 40, 40);

      const head = [columns.map((c) => c.header)];
      const body = rows.map((row) =>
        columns.map((c) =>
          row[c.key] !== undefined && row[c.key] !== null
            ? String(row[c.key])
            : "-"
        )
      );

      // ⛔ doc.autoTable(...) MAT use karo
      // ✅ ye use karo:
      autoTable(doc, {
        startY: 60,
        head,
        body,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 4, halign: "center" },
        headStyles: { fillColor: [55, 65, 81], textColor: [255, 255, 255] },
      });

      doc.save(`${fileName}.pdf`);
      success(`PDF file "${fileName}.pdf" generated successfully.`);
    } catch (err) {
      console.error("PDF export error:", err);
      error("Failed to export PDF file.");
    }
  };

  // ---------- PRINT ----------
  const printTable = ({ title = "Print", columns, rows }) => {
    try {
      if (!rows || !rows.length) {
        error("No data available to print.");
        return;
      }

      const headerHtml = columns.map((c) => `<th>${c.header}</th>`).join("");

      const rowsHtml = rows
        .map(
          (row) => `
        <tr>
          ${columns.map((c) => `<td>${row[c.key] ?? ""}</td>`).join("")}
        </tr>
      `
        )
        .join("");

      const html = `
        <html>
          <head>
            <title>${title}</title>
            <style>
              @page { size: A4 landscape; }
              body { font-family: 'Inter', sans-serif; padding: 20px; }
              h3 { color: #1e3a8a; margin-bottom: 20px; font-weight: 700; }
              table { width: 100%; border-collapse: collapse; font-size: 11px; }
              th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
              th { background: #f3f4f6; color: #374151; font-weight: 600; }
              tr:nth-child(even) { background-color: #f9fafb; }
            </style>
          </head>
          <body>
            <h3>${title}</h3>
            <table>
              <thead>
                <tr>${headerHtml}</tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </body>
        </html>
      `;

      const win = window.open("", "_blank", "width=1000,height=700");
      win.document.write(html);
      win.document.close();
      win.print();

      info("Print dialog opened.");
    } catch (err) {
      console.error("Print error:", err);
      error("Failed to open print dialog.");
    }
  };

  return (
    <ExportContext.Provider value={{ exportExcel, exportPDF, printTable }}>
      {children}
    </ExportContext.Provider>
  );
};
