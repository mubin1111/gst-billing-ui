// src/pages/EmployeeMasterList.jsx
import React, { useMemo, useState } from "react";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";

import { useExport } from "../contextapi/ExportContext";

export default function EmployeeMasterList({ employees: incoming }) {

  const { exportExcel, exportPDF, printTable } = useExport();

  /* ---------------- SAMPLE DATA (API replace karega) ---------------- */
  const sample = useMemo(
    () => [
      {
        EmployeeID: "EMP001",
        FirstName: "Rahul",
        LastName: "Sharma",
        Gender: "Male",
        DateOfBirth: "1990-05-12",
        JoiningDate: "2020-07-01",
        DepartmentID: "D01",
        DesignationID: "DE100",
        MobileNo: "+91-9876543210",
        EmailID: "rahul@example.com",
        Address: "12 MG Road, Near Park",
        City: "Mumbai",
        State: "Maharashtra",
        Country: "India",
        PostalCode: "400001",
      },
      {
        EmployeeID: "EMP002",
        FirstName: "Asha",
        LastName: "Kumar",
        Gender: "Female",
        DateOfBirth: "1993-11-23",
        JoiningDate: "2021-01-15",
        DepartmentID: "D02",
        DesignationID: "DE200",
        MobileNo: "+91-9123456780",
        EmailID: "asha@example.com",
        Address: "45 MG Road, Lotus Tower",
        City: "Pune",
        State: "Maharashtra",
        Country: "India",
        PostalCode: "411001",
      },
    ],
    []
  );

  const employees = incoming?.length ? incoming : sample;

  /* ---------------- STATE ---------------- */
  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) =>
      Object.values(e).join(" ").toLowerCase().includes(q)
    );
  }, [employees, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECTION ---------------- */
  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    const ids = pageItems.map((r) => r.EmployeeID);
    const allSelected = ids.every((id) => selectedRows.includes(id));

    setSelectedRows(
      allSelected
        ? selectedRows.filter((id) => !ids.includes(id))
        : [...new Set([...selectedRows, ...ids])]
    );
  };

  /* ---------------- EXPORT CONFIG (🔥 FIXED) ---------------- */
  const exportColumns = [
    { header: "Employee ID", key: "EmployeeID" },
    { header: "First Name", key: "FirstName" },
    { header: "Last Name", key: "LastName" },
    { header: "Gender", key: "Gender" },
    { header: "DOB", key: "DateOfBirth" },
    { header: "Joining Date", key: "JoiningDate" },
    { header: "Department", key: "DepartmentID" },
    { header: "Designation", key: "DesignationID" },
    { header: "Mobile", key: "MobileNo" },
    { header: "Email", key: "EmailID" },
    { header: "Address", key: "Address" },
    { header: "City", key: "City" },
    { header: "State", key: "State" },
    { header: "Country", key: "Country" },
    { header: "Postal Code", key: "PostalCode" },
  ];

  /* ✅ VERY IMPORTANT FUNCTION (missing earlier) */
  const getRowsForExport = (onlySelected) =>
    onlySelected
      ? filtered.filter((e) => selectedRows.includes(e.EmployeeID))
      : filtered;

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-slate-700">
          Employee Master
        </h2>

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search employee..."
          className="px-3 py-2 border rounded-lg w-full sm:w-72 text-sm"
        />
      </div>

      {/* EXPORT BAR */}
      <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-lg border">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlySelectedExport}
            onChange={() => setOnlySelectedExport((p) => !p)}
          />
          Export selected only
        </label>

        <div className="flex gap-2">
          <button
            onClick={() =>
              exportExcel({
                fileName: "EmployeeMaster",
                sheetName: "Employees",
                columns: exportColumns,
                rows: getRowsForExport(onlySelectedExport),
              })
            }
            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"
          >
            <FileSpreadsheet size={16} /> Excel
          </button>

          <button
            onClick={() =>
              exportPDF({
                fileName: "EmployeeMaster",
                title: "Employee Master",
                columns: exportColumns,
                rows: getRowsForExport(onlySelectedExport),
              })
            }
            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm flex items-center gap-2"
          >
            <FileText size={16} /> PDF
          </button>

          <button
            onClick={() =>
              printTable({
                title: "Employee Master",
                columns: exportColumns,
                rows: getRowsForExport(onlySelectedExport),
              })
            }
            className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm flex items-center gap-2"
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={
                    pageItems.length > 0 &&
                    pageItems.every((r) =>
                      selectedRows.includes(r.EmployeeID)
                    )
                  }
                />
              </th>
              {exportColumns.map((c) => (
                <th key={c.key} className="p-3 text-left">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageItems.map((e) => (
              <tr
                key={e.EmployeeID}
                className={`border-b ${
                  selectedRows.includes(e.EmployeeID)
                    ? "bg-indigo-50"
                    : ""
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(e.EmployeeID)}
                    onChange={() => toggleRow(e.EmployeeID)}
                  />
                </td>

                {exportColumns.map((c) => (
                  <td key={c.key} className="p-3">
                    {e[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
