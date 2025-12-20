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

import { useToast } from "../contextapi/ToastContext";
import { useExport } from "../contextapi/ExportContext";
import { useActions } from "../contextapi/ActionsContext"; // 🔹 NEW

export default function UnitCompanyList() {
  const navigate = useNavigate();

  const { error } = useToast();
  const { exportExcel, exportPDF, printTable } = useExport();
  const { onView, onEdit, onDelete } = useActions(); // 🔹 context se actions

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  
  // Sample data (replace with API data)
  const companies = useMemo(
    () => [
      {
        id: 1,
        unitName: "ABC Enterprises Pvt. Ltd.",
        gstin: "27ABCDE1234F1Z5",
        pan: "ABCDE1234F",
        city: "Mumbai",
        phone: "9876543210",
        email: "abc@enterprises.com",
        createdBy: "John Doe",
        updatedBy: "Jane Smith",
        createdDate: "2025-10-02",
        updatedDate: "2025-11-01",
      },
      {
        id: 2,
        unitName: "XYZ Solutions & Services",
        gstin: "24XYZAB9876K1Z2",
        pan: "XYZAB9876K",
        city: "Pune",
        phone: "9988776655",
        email: "contact@xyzsolutions.in",
        createdBy: "Jane Smith",
        updatedBy: "Jane Smith",
        createdDate: "2025-09-12",
        updatedDate: "2025-09-20",
      },
      {
        id: 3,
        unitName: "Global Imports Co.",
        gstin: "07AAACB1234F2Z3",
        pan: "AAACB1234F",
        city: "Delhi",
        phone: "8001122334",
        email: "sales@global.in",
        createdBy: "Manager",
        updatedBy: "Manager",
        createdDate: "2025-11-15",
        updatedDate: "2025-11-20",
      },
      {
        id: 4,
        unitName: "Tech Forward Ltd.",
        gstin: "33TTTFF1111A1Z1",
        pan: "TTTFF1111A",
        city: "Chennai",
        phone: "7009988776",
        email: "info@techforward.com",
        createdBy: "Admin",
        updatedBy: "John Doe",
        createdDate: "2025-08-01",
        updatedDate: "2025-12-01",
      },
      {
        id: 5,
        unitName: "Green Earth Products",
        gstin: "19GEPXX5555B2Z4",
        pan: "GEPXX5555B",
        city: "Bangalore",
        phone: "9005544332",
        email: "support@greenearth.org",
        createdBy: "Admin",
        updatedBy: "Admin",
        createdDate: "2025-07-22",
        updatedDate: "2025-07-22",
      },
      {
        id: 6,
        unitName: "Innovate Hardware",
        gstin: "03IHCCC7777C3Z6",
        pan: "IHCCC7777C",
        city: "Jaipur",
        phone: "7890123456",
        email: "hello@innovate.co",
        createdBy: "Jane Smith",
        updatedBy: "John Doe",
        createdDate: "2025-12-05",
        updatedDate: "2025-12-05",
      },
      {
        id: 7,
        unitName: "Fast Finance Services",
        gstin: "29FFSLL9999D4Z7",
        pan: "FFSLL9999D",
        city: "Hyderabad",
        phone: "8765432109",
        email: "help@fastfin.net",
        createdBy: "Manager",
        updatedBy: "Admin",
        createdDate: "2025-10-10",
        updatedDate: "2025-11-10",
      },
      {
        id: 8,
        unitName: "Coastal Logistics",
        gstin: "15CLLMM2222E5Z8",
        pan: "CLLMM2222E",
        city: "Kolkata",
        phone: "9012345678",
        email: "dispatch@coastal.com",
        createdBy: "Admin",
        updatedBy: "Manager",
        createdDate: "2025-09-01",
        updatedDate: "2025-10-01",
      },
    ],
    []
  );

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.unitName.toLowerCase().includes(q) ||
        (c.gstin || "").toLowerCase().includes(q) ||
        (c.pan || "").toLowerCase().includes(q) ||
        (c.city || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q)
    );
  }, [companies, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECT ROWS ---------------- */
  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const visibleIds = pageItems.map((c) => c.id);
    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedRows.includes(id));
    if (allSelected)
      setSelectedRows((s) => s.filter((id) => !visibleIds.includes(id)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visibleIds])));
  };

  /* ---------------- EXPORT HELPERS (using context) ---------------- */
  const getRowsForExport = (selectedOnly) => {
    if (selectedOnly && selectedRows.length === 0) {
      error("No companies selected for export/print.");
      return [];
    }
    return selectedOnly && selectedRows.length > 0
      ? companies.filter((c) => selectedRows.includes(c.id))
      : companies;
  };

  const exportColumns = [
    { key: "unitName", header: "Company Name" },
    { key: "gstin", header: "GSTIN" },
    { key: "pan", header: "PAN" },
    { key: "city", header: "City" },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
    { key: "createdBy", header: "Created By" },
    { key: "createdDate", header: "Created Date" },
    { key: "updatedBy", header: "Updated By" },
    { key: "updatedDate", header: "Updated Date" },
  ];

  const handleExportExcel = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    exportExcel({
      fileName: "UnitCompanyList",
      sheetName: "Companies",
      columns: exportColumns,
      rows,
    });
  };

  const handleExportPDF = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    exportPDF({
      fileName: "UnitCompanyList",
      title: "Unit Company List",
      columns: exportColumns,
      rows,
    });
  };

  const handlePrint = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    printTable({
      title: `Unit Company List (${selectedOnly ? "Selected Only" : "All"})`,
      columns: exportColumns,
      rows,
    });
  };

  /* ---------------- ROW ACTIONS (via context) ---------------- */
  const handleView = (company) => {
    onView("Company", company);
  };

  const handleEdit = (company) => {
    onEdit("Company", company.id, () =>
      navigate(`/unit-company?id=${company.id}`)
    );
  };

  const handleDelete = (id) => {
    onDelete("Company", id);
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="font-poppins bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full font-sans">
      {/* Header & Search/Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">
          Unit Company List
        </h1>

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
              placeholder="Search by name, GSTIN, city, or email"
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          {/* Add Company Button */}
          <Link
            to="/unit-company"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]"
            title="Add Company"
          >
            <Plus className="w-4 h-4" /> Add Company
          </Link>
        </div>
      </div>

      {/* Controls: Export & Selection */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="font-semibold">
            {selectedRows.length} company record
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
            onClick={() => handleExportExcel(onlySelectedExport)}
            className="px-3 py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow-md hover:bg-green-700 transition transform hover:scale-[1.02]"
            title="Export to Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          <button
            onClick={() => handleExportPDF(onlySelectedExport)}
            className="px-3 py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg text-sm font-medium shadow-md hover:bg-red-700 transition transform hover:scale-[1.02]"
            title="Export to PDF"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={() => handlePrint(onlySelectedExport)}
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
                    pageItems.every((c) => selectedRows.includes(c.id))
                  }
                  onChange={toggleAll}
                  className="w-4 h-4 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500"
                />
              </th>
              <th className="px-4 py-3">Company Name</th>
              <th className="px-4 py-3">GSTIN</th>
              <th className="px-4 py-3">City / Contact</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3">Updated Date</th>
              <th className="px-4 py-3 text-center w-28">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 text-slate-500 italic"
                >
                  No company records found matching your search.
                </td>
              </tr>
            ) : (
              pageItems.map((c) => {
                const selected = selectedRows.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`border-b border-slate-100 transition duration-150 ease-in-out ${
                      selected ? "bg-indigo-100/50" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleRow(c.id)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-700">
                      {c.unitName}
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">
                        PAN: {c.pan}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-indigo-600">
                      {c.gstin}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {c.city}
                      <div className="text-xs text-slate-400 mt-0.5">
                        {c.phone}
                      </div>
                      <div className="text-xs text-slate-400">{c.email}</div>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {c.createdBy}
                      <div className="text-xs text-slate-400 mt-0.5">
                        ({c.createdDate})
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {c.updatedDate}
                      <div className="text-xs text-slate-400 mt-0.5 italic">
                        by {c.updatedBy}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleView(c)}
                          className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleEdit(c)}
                          className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(c.id)}
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
          {pageItems.length === 0 && (
            <div className="text-center py-6 text-slate-500 italic">
              No company records found matching your search.
            </div>
          )}

          {pageItems.map((c) => {
            const selected = selectedRows.includes(c.id);
            return (
              <div
                key={c.id}
                className={`border rounded-xl p-4 shadow-md transition duration-150 ${
                  selected
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-slate-200 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div
                      className="font-semibold text-lg text-indigo-700 truncate"
                      title={c.unitName}
                    >
                      {c.unitName}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      <span className="font-mono text-xs px-2 py-0.5 bg-slate-200 rounded-full">
                        {c.gstin}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">
                        City: {c.city}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(c.id)}
                      className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mb-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-dashed">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Contact</span>
                    <span className="text-sm font-medium text-slate-700">
                      {c.phone}
                    </span>
                    <span
                      className="text-xs text-slate-600 truncate"
                      title={c.email}
                    >
                      {c.email}
                    </span>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="text-xs text-slate-500">
                      Created / Updated
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {c.createdDate}
                    </span>
                    <span className="text-xs text-slate-600">
                      by {c.updatedBy}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                  <button
                    onClick={() => handleView(c)}
                    className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleEdit(c)}
                    className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
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
