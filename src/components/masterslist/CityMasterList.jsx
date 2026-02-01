// src/components/masterslist/CityMasterList.jsx (ya jahan bhi file hai)
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
import { useActions } from "../contextapi/ActionsContext";

export default function CityList() {
  const navigate = useNavigate();

  const { error } = useToast();
  const { exportExcel, exportPDF, printTable } = useExport();
  const { onView, onEdit, onDelete } = useActions();

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]); // store CityCode
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  // sample city data (replace with API / DB data)
  const cities = useMemo(
    () => [
      {
        CityCode: "MUM",
        CityName: "Mumbai",
        StateID: "MH",
        CountryID: "IN",
        STDCode: "022",
        PostalCode: "400001",
      },
      {
        CityCode: "PUN",
        CityName: "Pune",
        StateID: "MH",
        CountryID: "IN",
        STDCode: "020",
        PostalCode: "411001",
      },
      {
        CityCode: "DLH",
        CityName: "New Delhi",
        StateID: "DL",
        CountryID: "IN",
        STDCode: "011",
        PostalCode: "110001",
      },
      {
        CityCode: "BLR",
        CityName: "Bengaluru",
        StateID: "KA",
        CountryID: "IN",
        STDCode: "080",
        PostalCode: "560001",
      },
      // add more sample rows as needed
    ],
    []
  );

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((item) =>
      (item.CityCode || "").toLowerCase().includes(q) ||
      (item.CityName || "").toLowerCase().includes(q) ||
      (item.StateID || "").toLowerCase().includes(q) ||
      (item.CountryID || "").toLowerCase().includes(q) ||
      (item.STDCode || "").toLowerCase().includes(q) ||
      (item.PostalCode || "").toLowerCase().includes(q)
    );
  }, [cities, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECT ROWS ---------------- */
  const toggleRow = (code) => {
    setSelectedRows((prev) =>
      prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]
    );
  };

  const toggleAll = () => {
    const visibleCodes = pageItems.map((c) => c.CityCode);
    const allSelected = visibleCodes.every((code) =>
      selectedRows.includes(code)
    );
    if (allSelected)
      setSelectedRows((s) => s.filter((code) => !visibleCodes.includes(code)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visibleCodes])));
  };

  /* ---------------- EXPORT HELPERS (using context) ---------------- */
  const getRowsForExport = (selectedOnly) => {
    if (selectedOnly && selectedRows.length === 0) {
      error("No cities selected for export/print.");
      return [];
    }
    return selectedOnly && selectedRows.length > 0
      ? cities.filter((c) => selectedRows.includes(c.CityCode))
      : cities;
  };

  const exportColumns = [
    { key: "CityCode", header: "City Code" },
    { key: "CityName", header: "City Name" },
    { key: "StateID", header: "State ID" },
    { key: "CountryID", header: "Country ID" },
    { key: "STDCode", header: "STD Code" },
    { key: "PostalCode", header: "Postal Code" },
  ];

  const handleExportExcel = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    exportExcel({
      fileName: "CityList",
      sheetName: "Cities",
      columns: exportColumns,
      rows,
    });
  };

  const handleExportPDF = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    exportPDF({
      fileName: "CityList",
      title: "City List",
      columns: exportColumns,
      rows,
    });
  };

  const handlePrint = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    printTable({
      title: `City List (${selectedOnly ? "Selected Only" : "All Cities"})`,
      columns: exportColumns,
      rows,
    });
  };

  /* ---------------- ROW ACTIONS (via context) ---------------- */
  const handleView = (city) => {
    onView("City", city);
  };

  const handleEdit = (city) => {
    onEdit("City", city.CityCode, () =>
      navigate(`/city-master?code=${city.CityCode}`)
    );
  };

  const handleDelete = (code) => {
    onDelete("City", code);
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full">
      {/* Header & Search/Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">City List</h1>

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
              placeholder="Search by code, name, state, country, STD or postal"
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          {/* Add City Button */}
          <Link
            to="/city-master"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]"
            title="Add City"
          >
            <Plus className="w-4 h-4" /> Add City
          </Link>
        </div>
      </div>

      {/* Controls: Export & Selection */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="font-semibold">
            {selectedRows.length} city
            {selectedRows.length !== 1 ? "ies" : ""} selected
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
          <thead className="bg-blue-900 sticky top-0 border-b border-indigo-200">
            <tr className="text-white text-left">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={
                    pageItems.length > 0 &&
                    pageItems.every((c) => selectedRows.includes(c.CityCode))
                  }
                  onChange={toggleAll}
                  className="w-4 h-4 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500"
                />
              </th>
              <th className="px-4 py-3">City Code</th>
              <th className="px-4 py-3">City Name</th>
              <th className="px-4 py-3">State ID</th>
              <th className="px-4 py-3">Country ID</th>
              <th className="px-4 py-3">STD Code</th>
              <th className="px-4 py-3">Postal Code</th>
              <th className="px-4 py-3 text-center w-28">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map((e) => {
              const selected = selectedRows.includes(e.CityCode);
              return (
                <tr
                  key={e.CityCode}
                  className={`border-b border-slate-100 transition duration-150 ease-in-out ${
                    selected ? "bg-indigo-100/50" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(e.CityCode)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {e.CityCode}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {e.CityName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{e.StateID}</td>
                  <td className="px-4 py-3 text-slate-600">{e.CountryID}</td>
                  <td className="px-4 py-3 text-slate-600">{e.STDCode}</td>
                  <td className="px-4 py-3 text-slate-600">{e.PostalCode}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleView(e)}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEdit(e)}
                        className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(e.CityCode)}
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
              No cities found.
            </div>
          )}
          {pageItems.map((e) => {
            const selected = selectedRows.includes(e.CityCode);
            return (
              <div
                key={e.CityCode}
                className={`border rounded-xl p-4 shadow-md transition duration-150 ${
                  selected
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-slate-200 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="font-semibold text-lg text-indigo-700 truncate">
                      {e.CityName}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      <span className="font-mono text-xs px-2 py-0.5 bg-slate-200 rounded-full">
                        Code: {e.CityCode}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(e.CityCode)}
                      className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mb-2"
                    />
                    <div className="text-xs font-bold text-slate-800 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mt-1">
                      {e.StateID}/{e.CountryID}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-dashed">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">STD Code</span>
                    <span className="text-base font-bold text-slate-700">
                      {e.STDCode}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Postal Code</span>
                    <span className="text-base font-bold text-slate-700">
                      {e.PostalCode}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                  <button
                    onClick={() => handleView(e)}
                    className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(e)}
                    className="p-2 rounded-full hover:bg-slate-200 text-sky-600 transition"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(e.CityCode)}
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
