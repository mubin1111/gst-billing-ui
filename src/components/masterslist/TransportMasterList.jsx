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

export default function TransportMasterList() {
  const navigate = useNavigate();

  const { error } = useToast();
  const { exportExcel, exportPDF, printTable } = useExport();
  const { onView, onEdit, onDelete } = useActions();

  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]); // TransportName
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  /* ---------------- SAMPLE DATA ---------------- */
  const transports = useMemo(
    () => [
      {
        TransportName: "ABC Logistics",
        ContactPerson: "Ramesh",
        MobileNo: "9876543210",
        PhoneNo: "022123456",
        EmailID: "abc@logistics.com",
        Address: "Andheri East",
        City: "Mumbai",
        StateCode: "27",
        Pincode: "400069",
        IsOwnTransport: true,
      },
      {
        TransportName: "Fast Movers",
        ContactPerson: "Suresh",
        MobileNo: "9123456780",
        PhoneNo: "",
        EmailID: "fast@move.com",
        Address: "MIDC Area",
        City: "Pune",
        StateCode: "27",
        Pincode: "411001",
        IsOwnTransport: false,
      },
    ],
    []
  );

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return transports;
    return transports.filter(
      (t) =>
        t.TransportName.toLowerCase().includes(q) ||
        t.ContactPerson.toLowerCase().includes(q) ||
        t.MobileNo.includes(q) ||
        t.City.toLowerCase().includes(q)
    );
  }, [transports, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ---------------- SELECTION ---------------- */
  const toggleRow = (name) => {
    setSelectedRows((p) =>
      p.includes(name) ? p.filter((x) => x !== name) : [...p, name]
    );
  };

  const toggleAll = () => {
    const visible = pageItems.map((t) => t.TransportName);
    const allSelected = visible.every((v) => selectedRows.includes(v));
    setSelectedRows(allSelected ? [] : visible);
  };

  /* ---------------- EXPORT ---------------- */
  const getRowsForExport = (selectedOnly) => {
    if (selectedOnly && selectedRows.length === 0) {
      error("No transport selected");
      return [];
    }
    return selectedOnly
      ? transports.filter((t) =>
          selectedRows.includes(t.TransportName)
        )
      : transports;
  };

  const exportColumns = [
    { key: "TransportName", header: "Transport Name" },
    { key: "ContactPerson", header: "Contact Person" },
    { key: "MobileNo", header: "Mobile No" },
    { key: "PhoneNo", header: "Phone No" },
    { key: "EmailID", header: "Email ID" },
    { key: "Address", header: "Address" },
    { key: "City", header: "City" },
    { key: "StateCode", header: "State Code" },
    { key: "Pincode", header: "Pincode" },
    { key: "IsOwnTransport", header: "Own Transport" },
  ];

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5 border-b pb-4">
        <h1 className="text-3xl font-bold text-indigo-700">
          Transport Master List
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
              placeholder="Search transport..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <Link
            to="/transport-master"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Transport
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
              <th className="w-48 px-3 py-3 text-left">Transport Name</th>
              <th className="w-36 px-3 py-3 text-left">Contact Person</th>
              <th className="w-32 px-3 py-3 text-left">Mobile</th>
              <th className="w-32 px-3 py-3 text-left">Phone</th>
              <th className="w-52 px-3 py-3 text-left">Email</th>
              <th className="w-48 px-3 py-3 text-left">City</th>
              <th className="w-24 px-3 py-3 text-center">Own</th>
              <th className="w-28 px-3 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map((t) => (
              <tr
                key={t.TransportName}
                className="border-b hover:bg-slate-50"
              >
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(t.TransportName)}
                    onChange={() => toggleRow(t.TransportName)}
                  />
                </td>

                <td className="px-3 py-2 font-medium">
                  {t.TransportName}
                </td>
                <td className="px-3 py-2">{t.ContactPerson}</td>
                <td className="px-3 py-2">{t.MobileNo}</td>
                <td className="px-3 py-2">{t.PhoneNo || "-"}</td>
                <td className="px-3 py-2 truncate">{t.EmailID}</td>
                <td className="px-3 py-2">
                  {t.City} ({t.StateCode})
                </td>
                <td className="px-3 py-2 text-center">
                  {t.IsOwnTransport ? "YES" : "NO"}
                </td>

                <td className="px-3 py-2">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => onView("Transport", t)}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        onEdit("Transport", t.TransportName, () =>
                          navigate("/transport-master")
                        )
                      }
                    >
                      <Edit className="w-4 h-4 text-sky-600" />
                    </button>
                    <button
                      onClick={() =>
                        onDelete("Transport", t.TransportName)
                      }
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                    </button>
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
