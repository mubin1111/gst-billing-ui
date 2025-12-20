// src/pages/EmployeeMasterList.jsx
import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * EmployeeMasterList
 * - Expects an `employees` array (if not provided uses sample data)
 * - Shows columns: EmployeeID, FirstName, LastName, Gender, DateOfBirth,
 *   JoiningDate, DepartmentID, DesignationID, MobileNo, EmailID,
 *   Address, City, State, Country, PostalCode
 */
export default function EmployeeMasterList({ employees: incoming }) {
  // sample data fallback (replace with API / props)
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

  const employees = incoming && incoming.length ? incoming : sample;

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  // simple filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) =>
      [
        e.EmployeeID,
        e.FirstName,
        e.LastName,
        e.MobileNo,
        e.EmailID,
        e.City,
        e.State,
        e.DepartmentID,
        e.DesignationID,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [employees, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleRow = (id) =>
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleAll = () => {
    const visibleIds = pageItems.map((r) => r.EmployeeID);
    const allSelected = visibleIds.every((id) => selectedRows.includes(id));
    if (allSelected) setSelectedRows((s) => s.filter((id) => !visibleIds.includes(id)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visibleIds])));
  };

  const exportExcel = (selectedOnly = false) => {
    const src = selectedOnly && selectedRows.length ? employees.filter((e) => selectedRows.includes(e.EmployeeID)) : employees;
    if (!src.length) return alert("No rows to export");
    const worksheet = XLSX.utils.json_to_sheet(src);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Employees");
    XLSX.writeFile(wb, "Employees.xlsx");
  };

  const exportPDF = (selectedOnly = false) => {
    const src = selectedOnly && selectedRows.length ? employees.filter((e) => selectedRows.includes(e.EmployeeID)) : employees;
    if (!src.length) return alert("No rows to export");
    const doc = new jsPDF();
    const head = [
      [
        "Emp ID",
        "Name",
        "Gender",
        "DOB",
        "Joining",
        "Dept",
        "Designation",
        "Mobile",
        "Email",
        "City",
        "State",
        "Postal"
      ],
    ];
    const body = src.map((e) => [
      e.EmployeeID,
      `${e.FirstName} ${e.LastName}`,
      e.Gender,
      e.DateOfBirth,
      e.JoiningDate,
      e.DepartmentID,
      e.DesignationID,
      e.MobileNo,
      e.EmailID,
      e.City,
      e.State,
      e.PostalCode,
    ]);
    doc.autoTable({ startY: 14, head, body, styles: { fontSize: 8 } });
    doc.save("Employees.pdf");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-slate-700">Employee Master</h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, id, mobile, email..."
            className="px-3 py-2 border rounded-lg w-full sm:w-72 text-sm"
          />
          <button onClick={() => exportExcel(selectedRows.length > 0)} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm">
            Export Excel
          </button>
          <button onClick={() => exportPDF(selectedRows.length > 0)} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm">
            Export PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm table-auto">
           <thead className="bg-gray-900 sticky top-0 border-b border-indigo-200">
         
            <tr className="text-white text-left">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={pageItems.length > 0 && pageItems.every((r) => selectedRows.includes(r.EmployeeID))}
                  onChange={toggleAll}
                  className="w-4 h-4"
                />
              </th>
              <th className="p-3 text-left">EmployeeID</th>
              <th className="p-3 text-left">First Name</th>
              <th className="p-3 text-left">Last Name</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">DOB</th>
              <th className="p-3 text-left">Joining</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Designation</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-left">Postal</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map((e) => {
              const selected = selectedRows.includes(e.EmployeeID);
              return (
                <tr key={e.EmployeeID} className={`${selected ? "bg-indigo-50" : ""}`}>
                  <td className="p-3">
                    <input type="checkbox" checked={selected} onChange={() => toggleRow(e.EmployeeID)} className="w-4 h-4" />
                  </td>
                  <td className="p-3 font-mono">{e.EmployeeID}</td>
                  <td className="p-3">{e.FirstName}</td>
                  <td className="p-3">{e.LastName}</td>
                  <td className="p-3">{e.Gender}</td>
                  <td className="p-3">{e.DateOfBirth}</td>
                  <td className="p-3">{e.JoiningDate}</td>
                  <td className="p-3">{e.DepartmentID}</td>
                  <td className="p-3">{e.DesignationID}</td>
                  <td className="p-3">{e.MobileNo}</td>
                  <td className="p-3">{e.EmailID}</td>
                  <td className="p-3 max-w-xs truncate">{e.Address}</td>
                  <td className="p-3">{e.City}</td>
                  <td className="p-3">{e.State}</td>
                  <td className="p-3">{e.Country}</td>
                  <td className="p-3">{e.PostalCode}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-slate-600">
          Showing {Math.min((page - 1) * perPage + 1, filtered.length)} - {Math.min(page * perPage, filtered.length)} of {filtered.length} employees
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">
            Prev
          </button>
          <div className="px-3 py-1 border rounded bg-indigo-50 text-indigo-700 font-semibold">{page} / {totalPages}</div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
