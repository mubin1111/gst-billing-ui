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

export default function UnitMasterList() {
  const navigate = useNavigate();

  const { error } = useToast();
  const { exportExcel, exportPDF, printTable } = useExport();
  const { onView, onEdit, onDelete } = useActions();

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  /* ---------------- SAMPLE DATA ---------------- */
  const units = useMemo(
    () => [
      {
        UnitCode: "PCS",
        UnitName: "Pieces",
        UnitSymbol: "pc",
        DecimalAllowed: 0,
        IsBaseUnit: true,
      },
      {
        UnitCode: "KG",
        UnitName: "Kilogram",
        UnitSymbol: "kg",
        DecimalAllowed: 3,
        IsBaseUnit: false,
      },
      {
        UnitCode: "LTR",
        UnitName: "Litre",
        UnitSymbol: "l",
        DecimalAllowed: 2,
        IsBaseUnit: false,
      },
    ],
    []
  );

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return units;

    return units.filter(
      (u) =>
        u.UnitCode.toLowerCase().includes(q) ||
        u.UnitName.toLowerCase().includes(q) ||
        u.UnitSymbol.toLowerCase().includes(q) ||
        String(u.DecimalAllowed).includes(q) ||
        (u.IsBaseUnit ? "yes" : "no").includes(q)
    );
  }, [units, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECT ---------------- */
  const toggleRow = (code) => {
    setSelectedRows((prev) =>
      prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]
    );
  };

  const toggleAll = () => {
    const visible = pageItems.map((u) => u.UnitCode);
    const allSelected = visible.every((c) => selectedRows.includes(c));

    if (allSelected)
      setSelectedRows((s) => s.filter((c) => !visible.includes(c)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visible])));
  };

  /* ---------------- EXPORT ---------------- */
  const getRowsForExport = (selectedOnly) => {
    if (selectedOnly && selectedRows.length === 0) {
      error("No units selected for export/print.");
      return [];
    }
    return selectedOnly
      ? units.filter((u) => selectedRows.includes(u.UnitCode))
      : units;
  };

  const exportColumns = [
    { key: "UnitCode", header: "Unit Code" },
    { key: "UnitName", header: "Unit Name" },
    { key: "UnitSymbol", header: "Unit Symbol" },
    { key: "DecimalAllowed", header: "Decimal Allowed" },
    { key: "IsBaseUnit", header: "Is Base Unit" },
  ];

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">
          Item Unit List
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border w-80">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search unit..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <Link
            to="/unit-master"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Add Unit
          </Link>
        </div>
      </div>

      {/* EXPORT BAR */}
      <div className="flex justify-between items-center mb-5 p-3 bg-slate-50 border rounded-lg">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="font-semibold">{selectedRows.length} selected</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={onlySelectedExport}
              onChange={(e) => setOnlySelectedExport(e.target.checked)}
              className="w-4 h-4"
            />
            Export selected only
          </label>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm flex gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm flex gap-2">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm flex gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-sm hidden md:table">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={
                    pageItems.length > 0 &&
                    pageItems.every((u) => selectedRows.includes(u.UnitCode))
                  }
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3 text-left w-28">Unit Code</th>
              <th className="px-4 py-3 text-left w-56">Unit Name</th>
              <th className="px-4 py-3 text-left w-32">Unit Symbol</th>
              <th className="px-4 py-3 text-center w-36">Decimal</th>
              <th className="px-4 py-3 text-center w-32">Base Unit</th>
              <th className="px-4 py-3 text-center w-28">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map((u) => {
              const selected = selectedRows.includes(u.UnitCode);
              return (
                <tr
                  key={u.UnitCode}
                  className={`border-b ${
                    selected ? "bg-indigo-100/50" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(u.UnitCode)}
                    />
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-left">
                    {u.UnitCode}
                  </td>

                  <td className="px-4 py-3 font-medium text-left">
                    {u.UnitName}
                  </td>

                  <td className="px-4 py-3 text-left">
                    {u.UnitSymbol}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {u.DecimalAllowed}
                  </td>

                  <td className="px-4 py-3 text-center font-semibold">
                    {u.IsBaseUnit ? "YES" : "NO"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button className="p-2 rounded-full hover:bg-slate-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-slate-200 text-sky-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-slate-200 text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
