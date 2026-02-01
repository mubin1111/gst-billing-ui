import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  FileSpreadsheet,
  FileText,
  Printer,
  Plus,
} from "lucide-react";

// Import your global contexts
import { useToast } from "../contextapi/ToastContext";
import { useExport } from "../contextapi/ExportContext";
import { useActions } from "../contextapi/ActionsContext";

export default function RoleList() {
  const navigate = useNavigate();
  
  // Use global hooks
  const { error, success, info } = useToast();
  const { exportExcel, exportPDF, printTable } = useExport();
  const { onView, onEdit, onDelete } = useActions();

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]); 
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  // Sample role data
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
      (item.IsSystemRole ? "system" : "normal").includes(q)
    );
  }, [roles, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECTION LOGIC ---------------- */
  const toggleRow = (code) => {
    setSelectedRows((prev) =>
      prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]
    );
  };

  const toggleAll = () => {
    const visibleCodes = pageItems.map((c) => c.RoleCode);
    const allSelected = visibleCodes.every((code) => selectedRows.includes(code));
    if (allSelected) {
      setSelectedRows((s) => s.filter((code) => !visibleCodes.includes(code)));
    } else {
      setSelectedRows((s) => Array.from(new Set([...s, ...visibleCodes])));
    }
  };

  /* ---------------- CONTEXTUAL EXPORT LOGIC ---------------- */
  const handleExport = (type) => {
    const sourceData = onlySelectedExport
      ? roles.filter((r) => selectedRows.includes(r.RoleCode))
      : filtered;

    if (sourceData.length === 0) {
      error(onlySelectedExport ? "Please select roles to export." : "No data available.");
      return;
    }

    const config = {
      fileName: "Role_List",
      title: "User Role List",
      columns: [
        { key: "RoleCode", header: "Code" },
        { key: "RoleName", header: "Role Name" },
        { key: "Description", header: "Description" },
        { key: "IsSystemRole", header: "System Role", transform: (val) => val ? "Yes" : "No" },
      ],
      rows: sourceData,
    };

    if (type === "excel") exportExcel(config);
    else if (type === "pdf") exportPDF(config);
    else if (type === "print") {
      printTable(config);
      info("Preparing print view...");
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">Role List</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border w-full sm:w-80 shadow-inner">
            <Search className="text-slate-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search roles..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          <Link
            to="/role-master"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Add Role
          </Link>
        </div>
      </div>

      {/* Export Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="font-semibold">{selectedRows.length} selected</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlySelectedExport}
              onChange={(e) => setOnlySelectedExport(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300"
            />
            <span className="text-xs sm:text-sm">Export/Print selected only</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => handleExport("excel")} className="px-3 py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button onClick={() => handleExport("pdf")} className="px-3 py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button onClick={() => handleExport("print")} className="px-3 py-2 flex items-center gap-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border rounded-xl shadow-lg">
        <table className="min-w-full text-sm table-auto hidden md:table">
          <thead className="bg-blue-900 sticky top-0 border-b border-indigo-200">
            <tr className="text-white text-left">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={pageItems.length > 0 && pageItems.every((c) => selectedRows.includes(c.RoleCode))}
                  onChange={toggleAll}
                  className="w-4 h-4 text-indigo-600 rounded border-indigo-300"
                />
              </th>
              <th className="px-4 py-3">Role Code</th>
              <th className="px-4 py-3">Role Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((e) => {
              const selected = selectedRows.includes(e.RoleCode);
              return (
                <tr key={e.RoleCode} className={`border-b border-slate-100 transition duration-150 ${selected ? "bg-indigo-50" : "hover:bg-slate-50"}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected} onChange={() => toggleRow(e.RoleCode)} className="w-4 h-4 text-indigo-600 rounded" />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{e.RoleCode}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{e.RoleName}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-md"><span className="line-clamp-1">{e.Description}</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${e.IsSystemRole ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {e.IsSystemRole ? "System" : "Normal"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onView(e)} className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => onEdit(e)} className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(e)} className="p-2 rounded-full hover:bg-slate-200 text-rose-600 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {pageItems.map((e) => (
            <div key={e.RoleCode} className={`border rounded-xl p-4 shadow-md ${selectedRows.includes(e.RoleCode) ? "bg-indigo-50 border-indigo-300" : "bg-white border-slate-200"}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-indigo-700">{e.RoleName}</div>
                <input type="checkbox" checked={selectedRows.includes(e.RoleCode)} onChange={() => toggleRow(e.RoleCode)} className="w-5 h-5 text-indigo-600 rounded" />
              </div>
              <p className="text-xs text-slate-500 mb-2">Code: {e.RoleCode}</p>
              <p className="text-sm text-slate-700 line-clamp-2">{e.Description}</p>
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${e.IsSystemRole ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                   {e.IsSystemRole ? "System" : "Normal"}
                 </span>
                 <div className="flex gap-2">
                   <button onClick={() => onView(e)} className="p-2 text-slate-600"><Eye className="w-5 h-5" /></button>
                   <button onClick={() => onEdit(e)} className="p-2 text-sky-600"><Edit className="w-5 h-5" /></button>
                   <button onClick={() => onDelete(e)} className="p-2 text-rose-600"><Trash2 className="w-5 h-5" /></button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 p-4 border-t">
        <div className="text-sm text-slate-600">
          Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50">Prev</button>
          <div className="px-4 py-2 border border-indigo-500 bg-indigo-50 text-indigo-700 rounded-lg font-semibold">{page} / {totalPages}</div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}