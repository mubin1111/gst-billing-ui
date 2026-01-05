import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for real usage
import { 
  Eye, Edit, Trash2, Search, FileSpreadsheet, FileText, Printer, Plus, X 
} from "lucide-react";

// Import your context
import { useExport } from "../contextapi/ExportContext";

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

export default function EmployeeList() {
  const navigate = useNavigate();
  const { exportExcel, exportPDF, printTable } = useExport();

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  const pushToast = (type, message, ttl = 3500) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 7);
    setToasts((s) => [...s, { id, type, message }]);
    if (ttl > 0) setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), ttl);
  };
  const removeToast = (id) => setToasts((s) => s.filter((t) => t.id !== id));

  const onDeleteRow = (id) => {
    pushToast('error', `Simulating DELETE for Employee ID ${id}.`, 5000);
  };

  const employees = useMemo(() => [
    { EmployeeID: 101, FirstName: "Rahul", LastName: "Verma", Gender: "Male", DateOfBirth: "1990-05-12", JoiningDate: "2021-02-01", DepartmentID: "D001", DesignationID: "DEV01", MobileNo: "+91-9876543210", EmailID: "rahul.verma@example.com", City: "Mumbai" },
    { EmployeeID: 102, FirstName: "Sakshi", LastName: "Agarwal", Gender: "Female", DateOfBirth: "1992-09-23", JoiningDate: "2020-08-15", DepartmentID: "D002", DesignationID: "ACC01", MobileNo: "+91-9123456780", EmailID: "sakshi.agarwal@example.com", City: "Pune" },
    { EmployeeID: 103, FirstName: "Aman", LastName: "Khan", Gender: "Male", DateOfBirth: "1988-12-02", JoiningDate: "2019-11-20", DepartmentID: "D003", DesignationID: "HR01", MobileNo: "+91-9988776655", EmailID: "aman.khan@example.com", City: "Delhi" },
  ], []);

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((emp) =>
      Object.values(emp).some(val => String(val).toLowerCase().includes(q))
    );
  }, [employees, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECT ROWS ---------------- */
  const toggleRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    const visibleIds = pageItems.map((c) => c.EmployeeID);
    const allSelected = visibleIds.every((id) => selectedRows.includes(id));
    if (allSelected) setSelectedRows((s) => s.filter((id) => !visibleIds.includes(id)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visibleIds])));
  };

  /* ---------------- EXPORT BRIDGE ---------------- */
  const exportColumns = [
    { header: "ID", key: "EmployeeID" },
    { header: "First Name", key: "FirstName" },
    { header: "Last Name", key: "LastName" },
    { header: "Gender", key: "Gender" },
    { header: "Joining Date", key: "JoiningDate" },
    { header: "Department", key: "DepartmentID" },
    { header: "Designation", key: "DesignationID" },
    { header: "Mobile", key: "MobileNo" },
    { header: "Email", key: "EmailID" },
    { header: "City", key: "City" },
  ];

  const handleExport = (type) => {
    const sourceData = onlySelectedExport
      ? employees.filter((e) => selectedRows.includes(e.EmployeeID))
      : filtered;

    if (sourceData.length === 0) {
      pushToast("error", onlySelectedExport ? "No employees selected." : "No data to export.");
      return;
    }

    const config = {
      fileName: `Employee_List`,
      title: "Employee Master Report",
      columns: exportColumns,
      rows: sourceData
    };

    if (type === "excel") {
      exportExcel(config);
      pushToast("success", "Exported to Excel");
    }
    if (type === "pdf") {
      exportPDF(config);
      pushToast("success", "Exported to PDF");
    }
    if (type === "print") {
      printTable(config);
      pushToast("info", "Print dialog opened");
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full">
      <Toasts toasts={toasts} remove={removeToast} />

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">Employee List</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border w-full sm:w-80 shadow-inner">
            <Search className="text-slate-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by ID, name, dept, mobile or city"
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>
          <Link to="/employee-master" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]">
            <Plus className="w-4 h-4" /> Add Employee
          </Link>
        </div>
      </div>

      {/* Export Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="font-semibold">{selectedRows.length} employee{selectedRows.length !== 1 ? 's' : ''} selected</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlySelectedExport}
              onChange={(e) => setOnlySelectedExport(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-xs sm:text-sm">Export/Print selected only</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => handleExport("excel")} className="px-3 py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition transform hover:scale-[1.02]">
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button onClick={() => handleExport("pdf")} className="px-3 py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition transform hover:scale-[1.02]">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button onClick={() => handleExport("print")} className="px-3 py-2 flex items-center gap-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition transform hover:scale-[1.02]">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl shadow-lg">
        <table className="min-w-full text-sm table-auto hidden md:table">
          <thead className="bg-gray-900 sticky top-0 border-b border-indigo-200">
            <tr className="text-white text-left">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={pageItems.length > 0 && pageItems.every((c) => selectedRows.includes(c.EmployeeID))} onChange={toggleAll} className="w-4 h-4 rounded border-indigo-300 focus:ring-indigo-500" />
              </th>
              <th className="px-4 py-3">Employee ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((e) => (
              <tr key={e.EmployeeID} className={`border-b border-slate-100 transition ${selectedRows.includes(e.EmployeeID) ? "bg-indigo-100/50" : "hover:bg-slate-50"}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selectedRows.includes(e.EmployeeID)} onChange={() => toggleRow(e.EmployeeID)} className="w-4 h-4 text-indigo-600 rounded" />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{e.EmployeeID}</td>
                <td className="px-4 py-3 font-medium text-slate-700">{e.FirstName} {e.LastName}</td>
                <td className="px-4 py-3 text-slate-600">{e.DepartmentID}</td>
                <td className="px-4 py-3 text-slate-600">{e.DesignationID}</td>
                <td className="px-4 py-3 text-slate-600">{e.MobileNo}</td>
                <td className="px-4 py-3 text-slate-600">{e.EmailID}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-2 rounded-full hover:bg-slate-200 text-slate-600"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => navigate(`/employee-master?id=${e.EmployeeID}`)} className="p-2 rounded-full hover:bg-slate-200 text-sky-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => onDeleteRow(e.EmployeeID)} className="p-2 rounded-full hover:bg-slate-200 text-rose-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile card view omitted for brevity but logic remains same as desktop row */}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 p-4 border-t">
        <div className="text-sm text-slate-600">
          Showing {Math.min((page - 1) * perPage + 1, filtered.length)} - {Math.min(page * perPage, filtered.length)} of {filtered.length} total
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-50" disabled={page === 1}>Prev</button>
          <div className="px-4 py-2 border border-indigo-500 bg-indigo-50 text-indigo-700 rounded-lg font-semibold">{page} / {totalPages}</div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-100 disabled:opacity-50" disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}