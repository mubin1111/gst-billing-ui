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

export default function HSNMasterList() {
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
  const hsnList = useMemo(
    () => [
      {
        HSNCode: "1001",
        HSNDescription: "Wheat",
        GSTType: "Goods",
        CGSTPercent: 2.5,
        SGSTPercent: 2.5,
        IGSTPercent: 5,
        CESSPercent: 0,
      },
      {
        HSNCode: "2106",
        HSNDescription: "Food preparations",
        GSTType: "Goods",
        CGSTPercent: 6,
        SGSTPercent: 6,
        IGSTPercent: 12,
        CESSPercent: 0,
      },
    ],
    []
  );

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return hsnList;
    return hsnList.filter(
      (h) =>
        h.HSNCode.toLowerCase().includes(q) ||
        h.HSNDescription.toLowerCase().includes(q) ||
        h.GSTType.toLowerCase().includes(q)
    );
  }, [hsnList, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECTION ---------------- */
  const toggleRow = (code) => {
    setSelectedRows((p) =>
      p.includes(code) ? p.filter((x) => x !== code) : [...p, code]
    );
  };

  const toggleAll = () => {
    const visible = pageItems.map((h) => h.HSNCode);
    const allSelected = visible.every((v) => selectedRows.includes(v));
    setSelectedRows(allSelected ? [] : visible);
  };

  /* ---------------- EXPORT ---------------- */
  const getRowsForExport = (selectedOnly) => {
    if (selectedOnly && selectedRows.length === 0) {
      error("No HSN selected");
      return [];
    }
    return selectedOnly
      ? hsnList.filter((h) => selectedRows.includes(h.HSNCode))
      : hsnList;
  };

  const exportColumns = [
    { key: "HSNCode", header: "HSN Code" },
    { key: "HSNDescription", header: "Description" },
    { key: "GSTType", header: "GST Type" },
    { key: "CGSTPercent", header: "CGST %" },
    { key: "SGSTPercent", header: "SGST %" },
    { key: "IGSTPercent", header: "IGST %" },
    { key: "CESSPercent", header: "CESS %" },
  ];

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5 border-b pb-4">
        <h1 className="text-3xl font-bold text-indigo-700">
          HSN Master List
        </h1>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 border rounded-lg w-72">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search HSN..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <Link
            to="/hsn-master"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add HSN
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm table-fixed">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="w-10 px-3 py-3 text-center">
                <input type="checkbox" onChange={toggleAll} />
              </th>
              <th className="w-28 px-3 py-3 text-left">HSN Code</th>
              <th className="px-3 py-3 text-left">Description</th>
              <th className="w-24 px-3 py-3 text-left">GST Type</th>
              <th className="w-24 px-3 py-3 text-center">CGST %</th>
              <th className="w-24 px-3 py-3 text-center">SGST %</th>
              <th className="w-24 px-3 py-3 text-center">IGST %</th>
              <th className="w-24 px-3 py-3 text-center">CESS %</th>
              <th className="w-28 px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map((h) => (
              <tr
                key={h.HSNCode}
                className="border-b hover:bg-slate-50"
              >
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(h.HSNCode)}
                    onChange={() => toggleRow(h.HSNCode)}
                  />
                </td>

                <td className="px-3 py-2 font-mono text-xs text-slate-700">
                  {h.HSNCode}
                </td>

                <td className="px-3 py-2 text-slate-700">
                  {h.HSNDescription}
                </td>

                <td className="px-3 py-2">{h.GSTType}</td>

                <td className="px-3 py-2 text-center">{h.CGSTPercent}</td>
                <td className="px-3 py-2 text-center">{h.SGSTPercent}</td>
                <td className="px-3 py-2 text-center">{h.IGSTPercent}</td>
                <td className="px-3 py-2 text-center">{h.CESSPercent}</td>

                <td className="px-3 py-2">
                  <div className="flex justify-center gap-2">
                    <Eye className="w-4 h-4 cursor-pointer" />
                    <Edit className="w-4 h-4 text-sky-600 cursor-pointer" />
                    <Trash2 className="w-4 h-4 text-rose-600 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
