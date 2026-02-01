import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  X,
  Building2,
  FileText,
  Download,
  Printer,
} from "lucide-react";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

// Custom Context Hooks
import { useToast } from "../contextapi/ToastContext";
import { useExport } from "../contextapi/ExportContext";
import { useActions } from "../contextapi/ActionsContext";

/* ---------------- VIEW MODAL COMPONENT ---------------- */
const ViewCompanyModal = ({ isOpen, onClose, company }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-5 border-b bg-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-indigo-900">Company Information</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DetailItem label="Unit / Company Name" value={company.unitName} fullWidth />
            <DetailItem label="GST Number" value={company.gstin} isMono />
            <DetailItem label="PAN Number" value={company.pan} isMono />
            <DetailItem label="Email Address" value={company.email} />
            <DetailItem label="Phone Number" value={company.phone} />
            <DetailItem label="City" value={company.city} />
            <DetailItem label="Created By" value={company.createdBy} />
            <div className="md:col-span-2 grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-500">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Date Created</p>
                <p className="text-sm text-slate-700">{company.createdDate}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Last Updated</p>
                <p className="text-sm text-slate-700">{company.updatedDate} by {company.updatedBy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, fullWidth = false, isMono = false }) => (
  <div className={fullWidth ? "md:col-span-2" : ""}>
    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">
      {label}
    </label>
    <div className={`p-3 bg-white border border-slate-200 rounded-xl text-slate-800 shadow-sm ${isMono ? "font-mono text-indigo-700" : "font-medium"}`}>
      {value || "Not Provided"}
    </div>
  </div>
);


/* ---------------- MAIN LIST COMPONENT ---------------- */
export default function UnitCompanyList() {
  const navigate = useNavigate();
  const { error } = useToast();
  const { exportExcel, exportPDF, printTable } = useExport();
  const { onView, onEdit, onDelete } = useActions();

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [onlySelectedExport, setOnlySelectedExport] = useState(false);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);

  // Mock Data
  const companies = useMemo(() => [
    { id: 1, unitName: "ABC Enterprises Pvt. Ltd.", gstin: "27ABCDE1234F1Z5", pan: "ABCDE1234F", city: "Mumbai", phone: "9876543210", email: "abc@enterprises.com", createdBy: "John Doe", updatedBy: "Jane Smith", createdDate: "2025-10-02", updatedDate: "2025-11-01" },
    { id: 2, unitName: "XYZ Solutions & Services", gstin: "24XYZAB9876K1Z2", pan: "XYZAB9876K", city: "Pune", phone: "9988776655", email: "contact@xyzsolutions.in", createdBy: "Jane Smith", updatedBy: "Jane Smith", createdDate: "2025-09-12", updatedDate: "2025-09-20" },
    { id: 3, unitName: "Global Imports Co.", gstin: "07AAACB1234F2Z3", pan: "AAACB1234F", city: "Delhi", phone: "8001122334", email: "sales@global.in", createdBy: "Manager", updatedBy: "Manager", createdDate: "2025-11-15", updatedDate: "2025-11-20" },
    { id: 4, unitName: "Tech Forward Ltd.", gstin: "33TTTFF1111A1Z1", pan: "TTTFF1111A", city: "Chennai", phone: "7009988776", email: "info@techforward.com", createdBy: "Admin", updatedBy: "John Doe", createdDate: "2025-08-01", updatedDate: "2025-12-01" },
    { id: 5, unitName: "Green Earth Products", gstin: "19GEPXX5555B2Z4", pan: "GEPXX5555B", city: "Bangalore", phone: "9005544332", email: "support@greenearth.org", createdBy: "Admin", updatedBy: "Admin", createdDate: "2025-07-22", updatedDate: "2025-07-22" },
    { id: 6, unitName: "Innovate Hardware", gstin: "03IHCCC7777C3Z6", pan: "IHCCC7777C", city: "Jaipur", phone: "7890123456", email: "hello@innovate.co", createdBy: "Jane Smith", updatedBy: "John Doe", createdDate: "2025-12-05", updatedDate: "2025-12-05" },
    { id: 7, unitName: "Fast Finance Services", gstin: "29FFSLL9999D4Z7", pan: "FFSLL9999D", city: "Hyderabad", phone: "8765432109", email: "help@fastfin.net", createdBy: "Manager", updatedBy: "Admin", createdDate: "2025-10-10", updatedDate: "2025-11-10" },
    { id: 8, unitName: "Coastal Logistics", gstin: "15CLLMM2222E5Z8", pan: "CLLMM2222E", city: "Kolkata", phone: "9012345678", email: "dispatch@coastal.com", createdBy: "Admin", updatedBy: "Manager", createdDate: "2025-09-01", updatedDate: "2025-10-01" },
  ], []);

  // Filter Logic
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(c =>
      c.unitName.toLowerCase().includes(q) ||
      (c.gstin || "").toLowerCase().includes(q) ||
      (c.city || "").toLowerCase().includes(q)
    );
  }, [companies, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  // Selection Logic
  const toggleRow = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    const visibleIds = pageItems.map(c => c.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedRows.includes(id));
    if (allSelected) setSelectedRows(s => s.filter(id => !visibleIds.includes(id)));
    else setSelectedRows(s => Array.from(new Set([...s, ...visibleIds])));
  };

  // Export Handlers
  const exportColumns = [
    { key: "unitName", header: "Company Name" },
    { key: "gstin", header: "GSTIN" },
    { key: "pan", header: "PAN" },
    { key: "city", header: "City" },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
  ];

  const getRowsForExport = (selectedOnly) => {
    if (selectedOnly && selectedRows.length === 0) {
      error("No companies selected for export.");
      return [];
    }
    const dataToExport = selectedOnly ? companies.filter(c => selectedRows.includes(c.id)) : companies;
    return dataToExport;
  };

  const handleExportExcel = (sel) => {
    const rows = getRowsForExport(sel);
    if (rows.length) exportExcel({ fileName: "Companies_List", sheetName: "Companies", columns: exportColumns, rows });
  };

  const handleExportPDF = (sel) => {
    const rows = getRowsForExport(sel);
    if (rows.length) exportPDF({ fileName: "Companies_List", title: "Unit Company Report", columns: exportColumns, rows });
  };

  const handlePrint = (sel) => {
    const rows = getRowsForExport(sel);
    if (rows.length) printTable({ title: "Unit Company List", columns: exportColumns, rows });
  };

  // Action Handlers
  const handleView = (company) => {
    setViewData(company);
    setIsModalOpen(true);
    onView("Company", company);
  };

  const handleEdit = (company) => onEdit("Company", company.id, () => navigate(`/unit-company?id=${company.id}`));
  const handleDelete = (id) => onDelete("Company", id);

  return (
    <div className="font-poppins bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-slate-100 min-h-full">

      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-indigo-700">Unit Company List</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border w-full sm:w-80 shadow-inner">
            <Search className="text-slate-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by name, GSTIN, or city"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <Link to="/unit-company" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-indigo-700 transition">
            <Plus className="w-4 h-4" /> Add Company
          </Link>
        </div>
      </div>

      {/* 2. EXPORT OPTIONS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-2 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-6">

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => handleExportExcel(onlySelectedExport)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
          >
            <Download className="w-4 h-4" /> Excel
          </button>
          <button
            onClick={() => handleExportPDF(onlySelectedExport)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition shadow-sm"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button
            onClick={() => handlePrint(onlySelectedExport)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* 3. DATA TABLE */}
      <div className="overflow-hidden border rounded-xl shadow-lg font-poppins">
        <table className="min-w-full text-sm table-auto hidden md:table">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={pageItems.length > 0 && pageItems.every(c => selectedRows.includes(c.id))}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3 text-center w-32">Actions</th>
              <th className="px-4 py-3 text-left">Company Name</th>
              <th className="px-4 py-3 text-left">GSTIN</th>
              <th className="px-4 py-3 text-left">City / Contact</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((c) => (
              <tr key={c.id} className={`border-b border-slate-100 hover:bg-slate-50 transition ${selectedRows.includes(c.id) ? "bg-indigo-50" : ""}`}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(c.id)}
                    onChange={() => toggleRow(c.id)}
                  />
                </td>
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
                  {c.unitName}
                  <div className="text-[10px] text-slate-400 font-mono">PAN: {c.pan}</div>
                </td>
                <td className="px-4 py-3 font-mono text-indigo-600">{c.gstin}</td>
                <td className="px-4 py-3 text-slate-600">
                  {c.city}
                  <div className="text-xs text-slate-400">{c.email}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 p-4 border-t">
        <div className="text-sm text-slate-600">
          Showing <b>{Math.min((page - 1) * perPage + 1, filtered.length)}</b> to <b>{Math.min(page * perPage, filtered.length)}</b> of <b>{filtered.length}</b>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50">Prev</button>
          <div className="px-4 py-2 border border-indigo-500 bg-indigo-50 text-indigo-700 rounded-lg font-bold">{page} / {totalPages}</div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50">Next</button>
        </div>
      </div>

      <ViewCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={viewData}
      />
    </div>
  );
}