// src/components/masterslist/DesignationMasterList.jsx
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

// 🔹 Contexts
import { useToast } from "../contextapi/ToastContext";
import { useExport } from "../contextapi/ExportContext";
import { useActions } from "../contextapi/ActionsContext";

export default function DesignationList() {
  const navigate = useNavigate();

  const { error } = useToast();
  const { exportExcel, exportPDF, printTable } = useExport();
  const { onView, onEdit, onDelete } = useActions();

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]); // store ID
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  // 🔹 Sample designation data (baad me API/DB se aa sakta hai)
  const designations = useMemo(
    () => [
      {
        ID: 1,
        DesignationCode: "DEV01",
        DesignationName: "Software Developer",
        LevelRank: 1,
      },
      {
        ID: 2,
        DesignationCode: "ACC01",
        DesignationName: "Accountant",
        LevelRank: 2,
      },
      {
        ID: 3,
        DesignationCode: "HR01",
        DesignationName: "HR Manager",
        LevelRank: 1,
      },
      {
        ID: 4,
        DesignationCode: "SUP01",
        DesignationName: "Support Executive",
        LevelRank: 3,
      },
    ],
    []
  );

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return designations;

    return designations.filter((d) =>
      (String(d.ID) || "").toLowerCase().includes(q) ||
      (d.DesignationCode || "").toLowerCase().includes(q) ||
      (d.DesignationName || "").toLowerCase().includes(q) ||
      (String(d.LevelRank) || "").toLowerCase().includes(q)
    );
  }, [designations, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECT ROWS ---------------- */
  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const visibleIds = pageItems.map((d) => d.ID);
    const allSelected = visibleIds.every((id) => selectedRows.includes(id));

    if (allSelected)
      setSelectedRows((s) => s.filter((id) => !visibleIds.includes(id)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visibleIds])));
  };

  /* ---------------- EXPORT HELPERS (CityList jaisa) ---------------- */
  const getRowsForExport = (selectedOnly) => {
    if (selectedOnly && selectedRows.length === 0) {
      error("No designations selected for export/print.");
      return [];
    }

    return selectedOnly && selectedRows.length > 0
      ? designations.filter((d) => selectedRows.includes(d.ID))
      : designations;
  };

  const exportColumns = [
    { key: "ID",              header: "ID" },
    { key: "DesignationCode", header: "Designation Code" },
    { key: "DesignationName", header: "Designation Name" },
    { key: "LevelRank",       header: "Level Rank" },
  ];

  const handleExportExcel = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    exportExcel({
      fileName: "DesignationList",
      sheetName: "Designations",
      columns: exportColumns,
      rows,
    });
  };

  const handleExportPDF = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    exportPDF({
      fileName: "DesignationList",
      title: "Designation List",
      columns: exportColumns,
      rows,
    });
  };

  const handlePrint = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    printTable({
      title: `Designation List (${selectedOnly ? "Selected Only" : "All"})`,
      columns: exportColumns,
      rows,
    });
  };

  /* ---------------- ROW ACTIONS (context) ---------------- */
  const handleView = (designation) => {
    onView("Designation", designation);
  };

  const handleEdit = (designation) => {
    onEdit("Designation", designation.ID, () =>
      navigate(`/designation-master?id=${designation.ID}`)
    );
  };

  const handleDelete = (id) => {
    onDelete("Designation", id);
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full">
      {/* Header & Search/Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">
          Designation List
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
              placeholder="Search by ID, code, name or level"
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          {/* Add Designation Button */}
          <Link
            to="/designation-master"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]"
            title="Add Designation"
          >
            <Plus className="w-4 h-4" /> Add Designation
          </Link>
        </div>
      </div>

      {/* Controls: Export & Selection */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="font-semibold">
            {selectedRows.length} designation
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

      {/* TABLE (desktop) */}
      <div className="overflow-x-auto border rounded-xl shadow-lg">
        <table className="min-w-full text-sm table-auto hidden md:table">
          <thead className="bg-blue-900 sticky top-0 border-b border-indigo-200">
            <tr className="text-white text-left">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={
                    pageItems.length > 0 &&
                    pageItems.every((d) => selectedRows.includes(d.ID))
                  }
                  onChange={toggleAll}
                  className="w-4 h-4 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500"
                />
              </th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Designation Code</th>
              <th className="px-4 py-3">Designation Name</th>
              <th className="px-4 py-3">Level Rank</th>
              <th className="px-4 py-3 text-center w-28">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map((d) => {
              const selected = selectedRows.includes(d.ID);
              return (
                <tr
                  key={d.ID}
                  className={`border-b border-slate-100 transition duration-150 ease-in-out ${
                    selected ? "bg-indigo-100/50" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(d.ID)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {d.ID}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {d.DesignationCode}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {d.DesignationName}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {d.LevelRank}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleView(d)}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEdit(d)}
                        className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(d.ID)}
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
              No designations found.
            </div>
          )}

          {pageItems.map((d) => {
            const selected = selectedRows.includes(d.ID);
            return (
              <div
                key={d.ID}
                className={`border rounded-xl p-4 shadow-md transition duration-150 ${
                  selected
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-slate-200 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="font-semibold text-lg text-indigo-700 truncate">
                      {d.DesignationName}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      <span className="font-mono text-xs px-2 py-0.5 bg-slate-200 rounded-full">
                        ID: {d.ID}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">
                        Code: {d.DesignationCode}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(d.ID)}
                      className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mb-2"
                    />
                    <div className="text-xs font-bold text-slate-800 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mt-1">
                      Rank {d.LevelRank}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                  <button
                    onClick={() => handleView(d)}
                    className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(d)}
                    className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(d.ID)}
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
          {Math.min(page * perPage, filtered.length)} of{" "}
          {filtered.length} total result
          {filtered.length !== 1 ? "s" : ""}
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
