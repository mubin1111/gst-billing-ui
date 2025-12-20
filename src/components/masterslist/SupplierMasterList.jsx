// src/components/masters/ItemMasterList.jsx
import React, { useMemo, useState } from "react";
// UI icons (lucide-react used earlier — keep same)
import { Link } from "react-router-dom";
import { Search, Plus, FileSpreadsheet, FileText, Printer, X, Eye, Edit, Trash2 } from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

/* ---------------- Enhanced Toasts Component ---------------- */
function Toasts({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`max-w-sm w-full px-4 py-3 rounded-xl shadow-xl border flex items-start gap-3 transition-opacity duration-300 pointer-events-auto ${
            t.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : t.type === "error"
              ? "bg-rose-50 border-rose-300 text-rose-800"
              : "bg-sky-50 border-sky-300 text-sky-800"
          }`}
        >
          <div className="flex-1 text-sm font-medium">{t.message}</div>
          <button
            onClick={() => remove(t.id)}
            className="text-sm opacity-80 hover:opacity-100 transition-opacity p-1 -m-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
/* ---------------- End Toasts Component ---------------- */

export default function ItemMasterList() {
  // simulate navigation in dev environment or use actual useNavigate in app
  const navigate = (path) => {
    if (typeof window !== "undefined") {
      // try using router navigation if available, otherwise log
      try {
        window.history.pushState({}, "", path);
        window.dispatchEvent(new Event("popstate"));
      } catch {
        console.log(`[SIMULATED NAVIGATION] Navigating to: ${path}`);
      }
    }
  };

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  const pushToast = (type, message, ttl = 3500) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 7);
    setToasts((s) => [...s, { id, type, message }]);

    if (ttl > 0) {
      setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), ttl);
    }
  };
  const removeToast = (id) => setToasts((s) => s.filter((t) => t.id !== id));

  // ---------- SAMPLE SUPPLIER DATA (replace with API) ----------
  const suppliers = useMemo(
    () => [
      {
        id: 1,
        SupplierName: "Shree Traders",
        AddressLine1: "12 A, Market Road",
        City: "Mumbai",
        PinCode: "400001",
        Phone: "9876543210",
        Email: "contact@shreetraders.in",
      },
      {
        id: 2,
        SupplierName: "Radha Supplies",
        AddressLine1: "Plot 5, Industrial Estate",
        City: "Pune",
        PinCode: "411045",
        Phone: "9988776655",
        Email: "sales@radhasupplies.com",
      },
      {
        id: 3,
        SupplierName: "Coastal Distributors",
        AddressLine1: "Harbour Line, Dock 3",
        City: "Kolkata",
        PinCode: "700001",
        Phone: "9012345678",
        Email: "info@coastal.co",
      },
      {
        id: 4,
        SupplierName: "NorthPoint Vendors",
        AddressLine1: "Sector 12, Industrial Park",
        City: "Delhi",
        PinCode: "110092",
        Phone: "8001122334",
        Email: "north@vendors.in",
      },
      {
        id: 5,
        SupplierName: "Green Leaf Supplies",
        AddressLine1: "MG Road, Near Bus Stand",
        City: "Bengaluru",
        PinCode: "560001",
        Phone: "9005544332",
        Email: "hello@greenleaf.com",
      }
    ],
    []
  );

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter(
      (s) =>
        String(s.id).toLowerCase().includes(q) ||
        (s.SupplierName || "").toLowerCase().includes(q) ||
        (s.AddressLine1 || "").toLowerCase().includes(q) ||
        (s.City || "").toLowerCase().includes(q) ||
        (s.PinCode || "").toLowerCase().includes(q) ||
        (s.Phone || "").toLowerCase().includes(q) ||
        (s.Email || "").toLowerCase().includes(q)
    );
  }, [suppliers, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECT ROWS ---------------- */
  const toggleRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    const visibleIds = pageItems.map((c) => c.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedRows.includes(id));
    if (allSelected) setSelectedRows((s) => s.filter((id) => !visibleIds.includes(id)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visibleIds])));
  };

  /* ---------------- EXPORT / PRINT (SUPPLIERS) ---------------- */
  const getExportData = (selectedOnly) => {
    if (selectedOnly && selectedRows.length === 0) {
      pushToast("error", "No suppliers selected for export/print.");
      return [];
    }
    return selectedOnly && selectedRows.length > 0 ? suppliers.filter((c) => selectedRows.includes(c.id)) : suppliers;
  };

  const exportExcel = (selectedOnly = false) => {
    const src = getExportData(selectedOnly);
    if (!src.length) return;

    const data = src.map(({ id, ...rest }) => ({ ID: id, ...rest }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
    XLSX.writeFile(workbook, "Suppliers.xlsx");
    pushToast("success", `Exported ${data.length} supplier record(s) to Excel.`);
  };

  const exportPDF = (selectedOnly = false) => {
    const src = getExportData(selectedOnly);
    if (!src.length) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Supplier List", 14, 15);

    const head = [["ID", "Supplier Name", "Address", "City", "PinCode", "Phone", "Email"]];
    const body = src.map((s) => [
      s.id,
      s.SupplierName || "",
      s.AddressLine1 || "",
      s.City || "",
      s.PinCode || "",
      s.Phone || "",
      s.Email || "",
    ]);

    doc.autoTable({
      startY: 22,
      head,
      body,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [55, 65, 81], textColor: [255, 255, 255] },
    });

    doc.save("Suppliers.pdf");
    pushToast("success", `Exported ${src.length} supplier record(s) to PDF.`);
  };

  const printTable = (selectedOnly = false) => {
    const src = getExportData(selectedOnly);
    if (!src.length) return;

    const rows = src
      .map(
        (s) => `<tr>
          <td style="padding:8px;border:1px solid #e5e7eb">${s.id}</td>
          <td style="padding:8px;border:1px solid #e5e7eb">${s.SupplierName || ""}</td>
          <td style="padding:8px;border:1px solid #e5e7eb">${s.AddressLine1 || ""}</td>
          <td style="padding:8px;border:1px solid #e5e7eb">${s.City || ""}</td>
          <td style="padding:8px;border:1px solid #e5e7eb">${s.PinCode || ""}</td>
          <td style="padding:8px;border:1px solid #e5e7eb">${s.Phone || ""}</td>
          <td style="padding:8px;border:1px solid #e5e7eb">${s.Email || ""}</td>
        </tr>`
      )
      .join("");

    const html = `
      <html><head><title>Supplier List Print</title>
      <style>
        body { font-family: Inter, sans-serif; padding: 20px; color: #111827 }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; vertical-align: top; }
        th { background: #f3f4f6; color: #374151; font-weight: 600; }
      </style>
      </head><body>
      <h3>Supplier List (${selectedOnly ? "Selected Only" : "All"})</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Supplier Name</th><th>Address</th><th>City</th><th>PinCode</th><th>Phone</th><th>Email</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      </body></html>
    `;

    const w = window.open("", "_blank", "width=900,height=700");
    w.document.write(html);
    w.document.close();
    w.print();
    pushToast("info", `Print dialog opened for ${src.length} supplier record(s).`);
  };

  /* ---------------- ACTIONS ---------------- */
  const onDeleteRow = (id) => {
    pushToast("error", `Simulated DELETE for Supplier ID ${id}. Implement confirmation and API call.`, 5000);
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full">
      <Toasts toasts={toasts} remove={removeToast} />

      {/* Header & Search/Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">Supplier Master List</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border w-full sm:w-80 shadow-inner">
            <Search className="text-slate-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by ID, name, city, pin, phone or email"
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          <Link
            to="/supplier-master"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]"
            title="Add Supplier"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="font-semibold">{selectedRows.length} supplier{selectedRows.length !== 1 ? "s" : ""} selected</span>

          
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportExcel(onlySelectedExport)}
            className="px-3 py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow-md hover:bg-green-700 transition transform hover:scale-[1.02]"
            title="Export to Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          <button
            onClick={() => exportPDF(onlySelectedExport)}
            className="px-3 py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg text-sm font-medium shadow-md hover:bg-red-700 transition transform hover:scale-[1.02]"
            title="Export to PDF"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={() => printTable(onlySelectedExport)}
            className="px-3 py-2 flex items-center gap-2 bg-slate-700 text-white rounded-lg text-sm font-medium shadow-md hover:bg-slate-800 transition transform hover:scale-[1.02]"
            title="Print"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* TABLE or CARD VIEW */}
      <div className="overflow-x-auto border rounded-xl shadow-lg">
        <table className="min-w-full text-sm table-auto hidden md:table">
          <thead className="bg-gray-900 sticky top-0 border-b border-indigo-200">
            <tr className="text-white text-left">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={pageItems.length > 0 && pageItems.every((c) => selectedRows.includes(c.id))}
                  onChange={toggleAll}
                  className="w-4 h-4 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500"
                />
              </th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Supplier Name</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">PinCode</th>
              <th className="px-4 py-3">Phone / Email</th>
              <th className="px-4 py-3 text-center w-28">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-500 italic">
                  No supplier records found.
                </td>
              </tr>
            ) : (
              pageItems.map((s) => {
                const selected = selectedRows.includes(s.id);
                return (
                  <tr
                    key={s.id}
                    className={`border-b border-slate-100 transition duration-150 ease-in-out ${selected ? "bg-indigo-100/50" : "hover:bg-slate-50"}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleRow(s.id)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                    </td>

                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{s.id}</td>

                    <td className="px-4 py-3 font-medium text-slate-700">{s.SupplierName}</td>

                    <td className="px-4 py-3 text-slate-600 max-w-sm truncate">{s.AddressLine1}</td>

                    <td className="px-4 py-3 text-slate-600">{s.City}</td>

                    <td className="px-4 py-3 text-slate-600 font-mono">{s.PinCode}</td>

                    <td className="px-4 py-3 text-slate-600">
                      <div className="text-sm">{s.Phone}</div>
                      <div className="text-xs text-slate-400 truncate">{s.Email}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition" title="View">
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigate(`/supplier-master?id=${s.id}`)}
                          className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteRow(s.id)}
                          className="p-2 rounded-full hover:bg-slate-200 text-rose-600 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Mobile card view */}
        <div className="md:hidden p-4 space-y-4">
          {pageItems.length === 0 && <div className="text-center py-6 text-slate-500 italic">No suppliers found.</div>}

          {pageItems.map((s) => {
            const selected = selectedRows.includes(s.id);
            return (
              <div
                key={s.id}
                className={`border rounded-xl p-4 shadow-md transition duration-150 ${selected ? "bg-indigo-50 border-indigo-300" : "bg-white border-slate-200 hover:shadow-lg"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="font-semibold text-lg text-indigo-700 truncate" title={s.SupplierName}>
                      {s.SupplierName}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{s.AddressLine1}</div>
                    <div className="text-xs text-slate-400 mt-1">{s.City} • {s.PinCode}</div>
                  </div>

                  <div className="text-right">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(s.id)}
                      className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mb-2"
                    />
                    <div className="text-xs text-slate-600">{s.Phone}</div>
                    <div className="text-xs text-slate-400 truncate">{s.Email}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                  <button className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition" title="View">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/supplier-master?id=${s.id}`)}
                    className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDeleteRow(s.id)}
                    className="p-2 rounded-full hover:bg-slate-200 text-rose-600 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 p-4 border-t">
        <div className="text-sm text-slate-600">
          Showing {filtered.length === 0 ? 0 : Math.min((page - 1) * perPage + 1, filtered.length)} -{" "}
          {filtered.length === 0 ? 0 : Math.min(page * perPage, filtered.length)} of {filtered.length} total result{filtered.length !== 1 ? "s" : ""}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 1}
          >
            Prev
          </button>

          <div className="px-4 py-2 border border-indigo-500 bg-indigo-50 text-indigo-700 rounded-lg font-semibold">{page} / {totalPages}</div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
