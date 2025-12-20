import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  FileSpreadsheet,
  FileText,
  Printer,
  Plus,
  X,
} from "lucide-react";

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

export default function RoleList() {
  // simulate navigation (replace with useNavigate if you use router)
  const navigate = (path) =>
    console.log(`[SIMULATED NAVIGATION] Navigating to: ${path}`);

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]); // store RoleCode
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
  const removeToast = (id) =>
    setToasts((s) => s.filter((t) => t.id !== id));

  const onDeleteRow = (code) => {
    pushToast(
      "error",
      `Simulating DELETE for Role Code ${code}. Add confirmation/modal in real app.`,
      5000
    );
  };

  // sample role data (replace with API / DB data)
  const roles = useMemo(
    () => [
      {
        RoleCode: "ADMIN",
        RoleName: "Administrator",
        Description: "Full access to all modules and settings.",
        IsSystemRole: true,
      },
      {
        RoleCode: "ACCT",
        RoleName: "Accounts User",
        Description: "Can manage invoices, expenses and billing.",
        IsSystemRole: true,
      },
      {
        RoleCode: "OPS",
        RoleName: "Operations",
        Description: "Handles day-to-day operational tasks.",
        IsSystemRole: false,
      },
      {
        RoleCode: "VIEW",
        RoleName: "Read Only",
        Description: "Can view data but cannot edit or delete.",
        IsSystemRole: false,
      },
      // add more sample rows as needed
    ],
    []
  );

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((item) =>
      (item.RoleCode || "").toLowerCase().includes(q) ||
      (item.RoleName || "").toLowerCase().includes(q) ||
      (item.Description || "").toLowerCase().includes(q) ||
      String(item.IsSystemRole ? "system" : "normal")
        .toLowerCase()
        .includes(q)
    );
  }, [roles, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECT ROWS ---------------- */
  const toggleRow = (code) => {
    setSelectedRows((prev) =>
      prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]
    );
  };

  const toggleAll = () => {
    const visibleCodes = pageItems.map((c) => c.RoleCode);
    const allSelected = visibleCodes.every((code) =>
      selectedRows.includes(code)
    );
    if (allSelected)
      setSelectedRows((s) => s.filter((code) => !visibleCodes.includes(code)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visibleCodes])));
  };

  /* ---------------- EXPORT EXCEL ---------------- */
  const exportExcel = (selectedOnly = false) => {
    const src =
      selectedOnly && selectedRows.length > 0
        ? roles.filter((c) => selectedRows.includes(c.RoleCode))
        : roles;

    if (selectedOnly && selectedRows.length === 0) {
      pushToast("error", "No roles selected for export.");
      return;
    }
    if (!src.length) {
      pushToast("error", "No rows to export");
      return;
    }
    const data = src.map((e) => ({
      RoleCode: e.RoleCode,
      RoleName: e.RoleName,
      Description: e.Description,
      IsSystemRole: e.IsSystemRole ? "Yes" : "No",
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");
    XLSX.writeFile(workbook, "RoleList.xlsx");
    pushToast("success", "Role List exported to Excel.");
  };

  /* ---------------- EXPORT PDF ---------------- */
  const exportPDF = (selectedOnly = false) => {
    const src =
      selectedOnly && selectedRows.length > 0
        ? roles.filter((c) => selectedRows.includes(c.RoleCode))
        : roles;

    if (selectedOnly && selectedRows.length === 0) {
      pushToast("error", "No roles selected for export.");
      return;
    }
    if (!src.length) {
      pushToast("error", "No rows to export");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(30);
    doc.text("Role List", 14, 15);

    const head = [["Role Code", "Role Name", "Description", "System Role"]];
    const body = src.map((e) => [
      e.RoleCode,
      e.RoleName,
      e.Description || "-",
      e.IsSystemRole ? "Yes" : "No",
    ]);

    doc.autoTable({
      startY: 22,
      head,
      body,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2, halign: "center" },
      headStyles: { fillColor: [55, 65, 81], textColor: [255, 255, 255] },
    });

    doc.save("RoleList.pdf");
    pushToast("success", "Role List exported to PDF.");
  };

  /* ---------------- PRINT ---------------- */
  const printTable = (selectedOnly = false) => {
    const src =
      selectedOnly && selectedRows.length > 0
        ? roles.filter((c) => selectedRows.includes(c.RoleCode))
        : roles;

    if (selectedOnly && selectedRows.length === 0) {
      pushToast("error", "No roles selected for print.");
      return;
    }
    if (!src.length) {
      pushToast("error", "No rows to print");
      return;
    }

    const rows = src
      .map(
        (e) => `
      <tr>
        <td>${e.RoleCode}</td>
        <td>${e.RoleName}</td>
        <td>${e.Description || ""}</td>
        <td>${e.IsSystemRole ? "Yes" : "No"}</td>
      </tr>
    `
      )
      .join("");

    const html = `
      <html><head><title>Role List Print</title>
      <style>
        @page { size: A4 landscape; }
        body { font-family: 'Inter', sans-serif; padding: 20px; }
        h3 { color: #1e3a8a; margin-bottom: 20px; font-weight: 700; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
        th { background: #f3f4f6; color: #374151; font-weight: 600; }
        tr:nth-child(even) { background-color: #f9fafb; }
      </style>
      </head><body>
      <h3>Role List (${selectedOnly ? "Selected Only" : "All Roles"})</h3>
      <table>
        <thead>
          <tr>
            <th>Role Code</th>
            <th>Role Name</th>
            <th>Description</th>
            <th>System Role</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      </body></html>
    `;

    const w = window.open("", "_blank", "width=1000,height=700");
    w.document.write(html);
    w.document.close();
    w.print();
    pushToast("info", "Print dialog opened.");
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full">
      <Toasts toasts={toasts} remove={removeToast} />

      {/* Header & Search/Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">Role List</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border w-full sm:w-80 shadow-inner">
            <Search className="text-slate-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by code, name, description or system"
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          {/* Add Role Button */}
          <Link
            to="/role-master"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]"
            title="Add Role"
          >
            <Plus className="w-4 h-4" /> Add Role
          </Link>
        </div>
      </div>

      {/* Controls: Export & Selection */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="font-semibold">
            {selectedRows.length} role
            {selectedRows.length !== 1 ? "s" : ""} selected
          </span>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlySelectedExport}
              onChange={(e) => setOnlySelectedExport(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-xs sm:text-sm">
              Export/Print selected only
            </span>
          </label>
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

      {/* TABLE or CARD VIEW (mobile) */}
      <div className="overflow-x-auto border rounded-xl shadow-lg">
        <table className="min-w-full text-sm table-auto hidden md:table">
          <thead className="bg-gray-900 sticky top-0 border-b border-indigo-200">
            <tr className="text-white text-left">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={
                    pageItems.length > 0 &&
                    pageItems.every((c) => selectedRows.includes(c.RoleCode))
                  }
                  onChange={toggleAll}
                  className="w-4 h-4 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500"
                />
              </th>
              <th className="px-4 py-3">Role Code</th>
              <th className="px-4 py-3">Role Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">System Role</th>
              <th className="px-4 py-3 text-center w-28">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map((e) => {
              const selected = selectedRows.includes(e.RoleCode);
              return (
                <tr
                  key={e.RoleCode}
                  className={`border-b border-slate-100 transition duration-150 ease-in-out ${
                    selected ? "bg-indigo-100/50" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(e.RoleCode)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {e.RoleCode}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {e.RoleName}
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-md">
                    <span className="line-clamp-2">{e.Description}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {e.IsSystemRole ? (
                      <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                        System
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        Normal
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/role-master?code=${e.RoleCode}`)
                        }
                        className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteRow(e.RoleCode)}
                        className="p-2 rounded-full hover:bg-slate-200 text-rose-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile card view */}
        <div className="md:hidden p-4 space-y-4">
          {pageItems.length === 0 && (
            <div className="text-center py-6 text-slate-500 italic">
              No roles found.
            </div>
          )}
          {pageItems.map((e) => {
            const selected = selectedRows.includes(e.RoleCode);
            return (
              <div
                key={e.RoleCode}
                className={`border rounded-xl p-4 shadow-md transition duration-150 ${
                  selected
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-slate-200 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="font-semibold text-lg text-indigo-700 truncate">
                      {e.RoleName}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      <span className="font-mono text-xs px-2 py-0.5 bg-slate-200 rounded-full">
                        Code: {e.RoleCode}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(e.RoleCode)}
                      className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mb-2"
                    />
                    <div
                      className={`text-xs font-bold px-2 py-1 rounded-full mt-1 ${
                        e.IsSystemRole
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {e.IsSystemRole ? "System Role" : "Normal Role"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-dashed">
                  <span className="text-xs text-slate-500 block mb-1">
                    Description
                  </span>
                  <p className="text-sm text-slate-700">
                    {e.Description || "-"}
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                  <button
                    className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/role-master?code=${e.RoleCode}`)
                    }
                    className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDeleteRow(e.RoleCode)}
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
          Showing{" "}
          {Math.min((page - 1) * perPage + 1, filtered.length)} -{" "}
          {Math.min(page * perPage, filtered.length)} of {filtered.length} total
          result{filtered.length !== 1 ? "s" : ""}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page === 1}
          >
            Prev
          </button>

          <div className="px-4 py-2 border border-indigo-500 bg-indigo-50 text-indigo-700 rounded-lg font-semibold">
            {page} / {totalPages}
          </div>

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
