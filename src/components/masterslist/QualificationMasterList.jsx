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

export default function QualificationList() {
  const navigate = useNavigate();

  const { error, success, info } = useToast();
  const { exportExcel, exportPDF, printTable } = useExport();
  const { onView, onEdit, onDelete } = useActions();

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  /* ---------------- SAMPLE DATA ---------------- */
  const qualifications = useMemo(
    () => [
      {
        QualificationCode: "UG-BSC",
        QualificationName: "B.Sc. Computer Science",
        QualificationType: "Graduate",
        Description: "Bachelor of Science in Computer Science",
      },
      {
        QualificationCode: "UG-BCOM",
        QualificationName: "B.Com",
        QualificationType: "Graduate",
        Description: "Bachelor of Commerce",
      },
      {
        QualificationCode: "PG-MBA",
        QualificationName: "MBA",
        QualificationType: "Post Graduate",
        Description: "Master of Business Administration",
      },
      {
        QualificationCode: "CERT-GST",
        QualificationName: "GST Practitioner",
        QualificationType: "Certificate",
        Description: "Certified GST practitioner course",
      },
    ],
    []
  );

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return qualifications;
    return qualifications.filter(
      (item) =>
        (item.QualificationCode || "").toLowerCase().includes(q) ||
        (item.QualificationName || "").toLowerCase().includes(q) ||
        (item.QualificationType || "").toLowerCase().includes(q) ||
        (item.Description || "").toLowerCase().includes(q)
    );
  }, [qualifications, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECT ROWS ---------------- */
  const toggleRow = (code) => {
    setSelectedRows((prev) =>
      prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]
    );
  };

  const toggleAll = () => {
    const visibleCodes = pageItems.map((c) => c.QualificationCode);
    const allSelected = visibleCodes.every((code) => selectedRows.includes(code));

    if (allSelected)
      setSelectedRows((s) => s.filter((code) => !visibleCodes.includes(code)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visibleCodes])));
  };

  /* ---------------- EXPORT LOGIC ---------------- */
  const exportColumns = [
    { key: "QualificationCode", header: "Code" },
    { key: "QualificationName", header: "Qualification Name" },
    { key: "QualificationType", header: "Type" },
    { key: "Description", header: "Description" },
  ];

  const handleExport = (type) => {
    const sourceData = onlySelectedExport
      ? qualifications.filter((q) => selectedRows.includes(q.QualificationCode))
      : filtered;

    if (sourceData.length === 0) {
      error(onlySelectedExport ? "No qualifications selected." : "No data available.");
      return;
    }

    const config = {
      fileName: "Qualification_List",
      title: "Qualification List Report",
      columns: exportColumns,
      rows: sourceData,
    };

    if (type === "excel") exportExcel(config);
    if (type === "pdf") exportPDF(config);
    if (type === "print") {
      printTable(config);
      info("Print dialog opened.");
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">Qualification List</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border w-full sm:w-80 shadow-inner">
            <Search className="text-slate-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search qualifications..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <Link
            to="/qualification-master"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Qualification
          </Link>
        </div>
      </div>

      {/* EXPORT BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 p-3 rounded-lg bg-slate-50 border">
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
          <button
            onClick={() => handleExport("excel")}
            className="px-3 py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="px-3 py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={() => handleExport("print")}
            className="px-3 py-2 flex items-center gap-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-800 transition"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-xl shadow-lg">
        <table className="min-w-full text-sm table-auto hidden md:table">
          <thead className="bg-gray-900 text-white">
            <tr className="text-left">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={pageItems.length > 0 && pageItems.every((c) => selectedRows.includes(c.QualificationCode))}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3">Qualification Code</th>
              <th className="px-4 py-3">Qualification Name</th>
              <th className="px-4 py-3">Qualification Type</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((e) => {
              const selected = selectedRows.includes(e.QualificationCode);
              return (
                <tr
                  key={e.QualificationCode}
                  className={`border-b border-slate-100 transition ${selected ? "bg-indigo-50" : "hover:bg-slate-50"}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(e.QualificationCode)}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{e.QualificationCode}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{e.QualificationName}</td>
                  <td className="px-4 py-3 text-slate-600">{e.QualificationType}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-xs">{e.Description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onView(e)} className="p-2 rounded-full hover:bg-slate-200 text-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEdit(e)} className="p-2 rounded-full hover:bg-slate-200 text-sky-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(e)} className="p-2 rounded-full hover:bg-slate-200 text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* MOBILE VIEW */}
        <div className="md:hidden p-4 space-y-4">
          {pageItems.map((e) => {
            const selected = selectedRows.includes(e.QualificationCode);
            return (
              <div
                key={e.QualificationCode}
                className={`border rounded-xl p-4 shadow-md ${selected ? "bg-indigo-50 border-indigo-300" : "bg-white"}`}
              >
                <div className="flex justify-between">
                  <h3 className="font-bold text-indigo-700 truncate">{e.QualificationName}</h3>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleRow(e.QualificationCode)}
                  />
                </div>
                <p className="text-xs font-mono text-slate-500 mt-1">Code: {e.QualificationCode}</p>
                <div className="mt-2 text-sm text-slate-700">{e.Description}</div>
                <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                  <button onClick={() => onView(e)} className="text-slate-600"><Eye className="w-5 h-5" /></button>
                  <button onClick={() => onEdit(e)} className="text-sky-600"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => onDelete(e)} className="text-rose-600"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 p-4 border-t">
        <div className="text-sm text-slate-600">
          Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
          >
            Prev
          </button>
          <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold border border-indigo-200">
            {page} / {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}