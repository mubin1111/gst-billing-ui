// src/components/masterslist/CustomerMasterList.jsx  (ya jahan tum rakhe ho)
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
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';


import { useToast } from "../contextapi/ToastContext";
import { useExport } from "../contextapi/ExportContext";
import { useActions } from "../contextapi/ActionsContext";



export default function CustomerList() {
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
  const customers = useMemo(
    () => [
      {
        id: 1,
        CustomerName: "ABC Enterprises Pvt. Ltd.",
        AddressLine1: "12 Marine Drive",
        City: "Mumbai",
        PinCode: "400020",
        Phone: "9876543210",
        Email: "abc@enterprises.com",
        isActive: true,
        isDeleted: false,
      },
      {
        id: 2,
        CustomerName: "XYZ Solutions & Services",
        AddressLine1: "Plot 45, Kalyani Nagar",
        City: "Pune",
        PinCode: "411006",
        Phone: "9988776655",
        Email: "contact@xyzsolutions.in",
        isActive: true,
        isDeleted: false,
      },
      {
        id: 3,
        CustomerName: "Global Imports Co.",
        AddressLine1: "Sector 5, Industrial Area",
        City: "Delhi",
        PinCode: "110075",
        Phone: "8001122334",
        Email: "sales@global.in",
        isActive: true,
        isDeleted: false,
      },
      {
        id: 4,
        CustomerName: "Tech Forward Ltd.",
        AddressLine1: "No. 9, Park St",
        City: "Chennai",
        PinCode: "600001",
        Phone: "7009988776",
        Email: "info@techforward.com",
        isActive: false,
        isDeleted: false,
      },
      {
        id: 5,
        CustomerName: "Green Earth Products",
        AddressLine1: "Bannerghatta Road",
        City: "Bangalore",
        PinCode: "560076",
        Phone: "9005544332",
        Email: "support@greenearth.org",
        isActive: true,
        isDeleted: false,
      },
      {
        id: 6,
        CustomerName: "Innovate Hardware",
        AddressLine1: "MI Road",
        City: "Jaipur",
        PinCode: "302001",
        Phone: "7890123456",
        Email: "hello@innovate.co",
        isActive: true,
        isDeleted: false,
      },
      {
        id: 7,
        CustomerName: "Fast Finance Services",
        AddressLine1: "Hitech City",
        City: "Hyderabad",
        PinCode: "500081",
        Phone: "8765432109",
        Email: "help@fastfin.net",
        isActive: true,
        isDeleted: true,
      },
      {
        id: 8,
        CustomerName: "Coastal Logistics",
        AddressLine1: "Prinsep Ghat Road",
        City: "Kolkata",
        PinCode: "700021",
        Phone: "9012345678",
        Email: "dispatch@coastal.com",
        isActive: false,
        isDeleted: false,
      },
    ],
    []
  );

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        String(c.id).includes(q) ||
        (c.CustomerName || "").toLowerCase().includes(q) ||
        (c.AddressLine1 || "").toLowerCase().includes(q) ||
        (c.City || "").toLowerCase().includes(q) ||
        (c.PinCode || "").toLowerCase().includes(q) ||
        (c.Phone || "").toLowerCase().includes(q) ||
        (c.Email || "").toLowerCase().includes(q)
    );
  }, [customers, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECT ROWS ---------------- */
  const toggleRow = (id) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () => {
    const visibleIds = pageItems.map((c) => c.id);
    const allSelected = visibleIds.every((id) => selectedRows.includes(id));
    if (allSelected)
      setSelectedRows((s) => s.filter((id) => !visibleIds.includes(id)));
    else setSelectedRows((s) => Array.from(new Set([...s, ...visibleIds])));
  };

  /* ---------------- EXPORT HELPERS (context based) ---------------- */
  const getRowsForExport = (selectedOnly) => {
    if (selectedOnly && selectedRows.length === 0) {
      error("No customers selected for export/print.");
      return [];
    }
    return selectedOnly && selectedRows.length > 0
      ? customers.filter((c) => selectedRows.includes(c.id))
      : customers;
  };

  const exportColumns = [
    { key: "id", header: "ID" },
    { key: "CustomerName", header: "Customer Name" },
    { key: "AddressLine1", header: "Address Line 1" },
    { key: "City", header: "City" },
    { key: "PinCode", header: "Pin Code" },
    { key: "Phone", header: "Phone" },
    { key: "Email", header: "Email" },
    { key: "isActive", header: "Is Active" },
    { key: "isDeleted", header: "Is Deleted" },
  ];

  const handleExportExcel = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    exportExcel({
      fileName: "CustomerList",
      sheetName: "Customers",
      columns: exportColumns,
      rows,
    });
  };

  const handleExportPDF = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    exportPDF({
      fileName: "CustomerList",
      title: "Customer List",
      columns: exportColumns,
      rows,
    });
  };

  const handlePrint = (selectedOnly) => {
    const rows = getRowsForExport(selectedOnly);
    if (!rows.length) return;

    printTable({
      title: `Customer List (${selectedOnly ? "Selected Only" : "All"})`,
      columns: exportColumns,
      rows,
    });
  };

  /* ---------------- ROW ACTIONS (context) ---------------- */
  const handleView = (customer) => {
    onView("Customer", customer);
  };

  const handleEdit = (customer) => {
    onEdit("Customer", customer.id, () =>
      navigate(`/customer-master?id=${customer.id}`)
    );
  };

  const handleDelete = (id) => {
    onDelete("Customer", id);
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">
          Customer Master List
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border w-full sm:w-80 shadow-inner">
            <Search className="text-slate-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search id, name, address, city, pin, phone or email"
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          <Link
            to="/customer-master"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]"
            title="Add Customer"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </Link>
        </div>
      </div>

      {/* Export & selection */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 p-2 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-4 text-sm text-slate-600">  
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExportExcel(onlySelectedExport)}
            className="px-3 py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow-md hover:bg-green-700 transition transform hover:scale-[1.02]"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          <button
            onClick={() => handleExportPDF(onlySelectedExport)}
            className="px-3 py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg text-sm font-medium shadow-md hover:bg-red-700 transition transform hover:scale-[1.02]"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={() => handlePrint(onlySelectedExport)}
            className="px-3 py-2 flex items-center gap-2 bg-slate-700 text-white rounded-lg text-sm font-medium shadow-md hover:bg-slate-800 transition transform hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

    {/* Table / cards */}
      <div className="overflow-x-auto border rounded-xl shadow-lg">
        {/* Desktop table */}
        <table className="min-w-full text-sm table-auto hidden md:table">
          <thead className="bg-blue-900 sticky top-0 border-b border-indigo-200">
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
              <th className="px-4 py-3">ID</th>
              
              {/* MOVED ACTIONS HEADER HERE */}
              <th className="px-4 py-3 text-center w-28 border-x border-gray-700">Actions</th>
              
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Pin</th>
              <th className="px-4 py-3">Phone / Email</th>
              <th className="px-4 py-3 text-center">Active</th>
              <th className="px-4 py-3 text-center">Deleted</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan="11" /* Increased colSpan to account for the new column order */
                  className="text-center py-8 text-slate-500 italic"
                >
                  No customer records found.
                </td>
              </tr>
            ) : (
              pageItems.map((c) => {
                const selected = selectedRows.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    className={`border-b border-slate-100 transition ${
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

                    <td className="px-4 py-3 font-mono text-slate-700">
                      {c.id}
                    </td>

                    {/* MOVED ACTIONS CELL HERE */}
                    <td className="px-4 py-3 text-center border-r border-slate-50">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => handleView(c)} className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition" title="View">
                      <VisibilityIcon sx={{ fontSize: 18 }} />
                    </button>
                    <button onClick={() => handleEdit(c)} className="p-2 rounded-full hover:bg-sky-100 text-sky-600 transition" title="Edit">
                      <ModeEditIcon sx={{ fontSize: 18 }} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 rounded-full hover:bg-rose-100 text-rose-600 transition" title="Delete">
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                </td>

                    <td className="px-4 py-3 font-medium text-slate-700">
                      {c.CustomerName}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {c.AddressLine1}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.City}</td>
                    <td className="px-4 py-3 text-slate-600">{c.PinCode}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="font-medium">{c.Phone}</div>
                      <div className="text-xs text-slate-400">{c.Email}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.isActive ? (
                        <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-1 rounded">Yes</span>
                      ) : (
                        <span className="text-slate-400 text-xs">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.isDeleted ? (
                        <span className="text-rose-600 font-semibold text-xs bg-rose-50 px-2 py-1 rounded">Yes</span>
                      ) : (
                        <span className="text-slate-400 text-xs">No</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Mobile card view (Actions kept at bottom for better thumb reach) */}
        <div className="md:hidden p-4 space-y-4">
          {pageItems.map((c) => {
            const selected = selectedRows.includes(c.id);
            return (
              <div
                key={c.id}
                className={`border rounded-xl p-4 shadow-md transition ${
                  selected ? "bg-indigo-50 border-indigo-300" : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-500">#{c.id}</span>
                       <div className="font-semibold text-indigo-700 truncate">{c.CustomerName}</div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{c.City} - {c.PinCode}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleRow(c.id)}
                    className="w-5 h-5 text-indigo-600 rounded border-slate-300"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                  <button onClick={() => handleView(c)} className="p-2 bg-slate-50 rounded-full text-indigo-600"><Eye size={18} /></button>
                  <button onClick={() => handleEdit(c)} className="p-2 bg-slate-50 rounded-full text-sky-600"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 bg-slate-50 rounded-full text-rose-600"><Trash2 size={18} /></button>
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
          {filtered.length === 0
            ? 0
            : Math.min((page - 1) * perPage + 1, filtered.length)}{" "}
          - {Math.min(page * perPage, filtered.length)} of {filtered.length}{" "}
          total
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
            disabled={page === 1}
          >
            Prev
          </button>

          <div className="px-4 py-2 border border-indigo-500 bg-indigo-50 text-indigo-700 rounded-lg font-semibold">
            {page} / {totalPages}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
