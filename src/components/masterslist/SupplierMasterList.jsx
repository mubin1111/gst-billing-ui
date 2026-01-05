import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Eye, 
  Edit, 
  Trash2 
} from "lucide-react";

// Global Context Imports
import { useToast } from "../contextapi/ToastContext";
import { useExport } from "../contextapi/ExportContext";
import { useActions } from "../contextapi/ActionsContext";

export default function ItemMasterList() {
  const navigate = useNavigate();
  
  // Initialize Global Hooks
  const { error, info } = useToast();
  const { exportExcel, exportPDF, printTable } = useExport();
  const { onView, onEdit, onDelete } = useActions();

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  // ---------- SAMPLE SUPPLIER DATA ----------
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
        (s.City || "").toLowerCase().includes(q) ||
        (s.Phone || "").toLowerCase().includes(q)
    );
  }, [suppliers, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECTION LOGIC ---------------- */
  const toggleRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    const visibleIds = pageItems.map((c) => c.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedRows.includes(id));
    if (allSelected) setSelectedRows((s) => s.filter((id) => !visibleIds.includes(id)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visibleIds])));
  };

  /* ---------------- CENTRALIZED EXPORT ---------------- */
  const handleExport = (type) => {
    const sourceData = onlySelectedExport
      ? suppliers.filter((s) => selectedRows.includes(s.id))
      : filtered;

    if (sourceData.length === 0) {
      error(onlySelectedExport ? "Please select suppliers to export." : "No data to export.");
      return;
    }

    const config = {
      fileName: "Supplier_Master_List",
      title: "Supplier Master Report",
      columns: [
        { key: "id", header: "ID" },
        { key: "SupplierName", header: "Supplier Name" },
        { key: "AddressLine1", header: "Address" },
        { key: "City", header: "City" },
        { key: "PinCode", header: "Pin" },
        { key: "Phone", header: "Phone" },
        { key: "Email", header: "Email" },
      ],
      rows: sourceData,
    };

    if (type === "excel") exportExcel(config);
    else if (type === "pdf") exportPDF(config);
    else if (type === "print") {
      printTable(config);
      info("Opening print preview...");
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">Supplier Master</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border w-full sm:w-80 shadow-inner">
            <Search className="text-slate-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search suppliers..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          <Link
            to="/supplier-master"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Add Supplier
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
          <thead className="bg-gray-900 text-white sticky top-0">
            <tr className="text-left">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={pageItems.length > 0 && pageItems.every((c) => selectedRows.includes(c.id))}
                  onChange={toggleAll}
                  className="w-4 h-4 text-indigo-600 rounded border-indigo-300"
                />
              </th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Supplier Name</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Phone / Email</th>
              <th className="px-4 py-3 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8 text-slate-500 italic">No records found.</td></tr>
            ) : (
              pageItems.map((s) => {
                const selected = selectedRows.includes(s.id);
                return (
                  <tr key={s.id} className={`border-b border-slate-100 transition ${selected ? "bg-indigo-50" : "hover:bg-slate-50"}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected} onChange={() => toggleRow(s.id)} className="w-4 h-4 text-indigo-600 rounded" />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{s.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{s.SupplierName}</td>
                    <td className="px-4 py-3 text-slate-600">{s.City}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="text-xs font-semibold">{s.Phone}</div>
                      <div className="text-[10px] text-slate-400">{s.Email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onView(s)} className="p-2 rounded-full hover:bg-slate-200 text-slate-600" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => onEdit(s)} className="p-2 rounded-full hover:bg-slate-200 text-sky-600" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(s)} className="p-2 rounded-full hover:bg-slate-200 text-rose-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {pageItems.map((s) => (
            <div key={s.id} className={`border rounded-xl p-4 shadow-md ${selectedRows.includes(s.id) ? "bg-indigo-50 border-indigo-300" : "bg-white border-slate-200"}`}>
              <div className="flex justify-between items-start">
                <div className="font-semibold text-indigo-700 text-lg truncate pr-2">{s.SupplierName}</div>
                <input type="checkbox" checked={selectedRows.includes(s.id)} onChange={() => toggleRow(s.id)} className="w-5 h-5 text-indigo-600 rounded" />
              </div>
              <div className="text-xs text-slate-500 mt-1">{s.City} • {s.PinCode}</div>
              <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <div className="text-xs text-slate-600 font-mono">{s.Phone}</div>
                <div className="flex gap-2">
                  <button onClick={() => onView(s)} className="p-1 text-slate-600"><Eye className="w-5 h-5" /></button>
                  <button onClick={() => onEdit(s)} className="p-1 text-sky-600"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => onDelete(s)} className="p-1 text-rose-600"><Trash2 className="w-5 h-5" /></button>
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