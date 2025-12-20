import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AssetPurchaseReport() {
  /* ---------------- DATE HELPER ---------------- */
  // Returns date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  /* ---------------- STATE & FILTERS ---------------- */
  const initialFilters = {
    unit: "Company Name",
    fromDate: getTodayDate(), // Sets today's date automatically
    toDate: getTodayDate(),   // Sets today's date automatically
    supplier: "All",
    category: "All",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ---------------- SAMPLE DATA ---------------- */
  const rawData = useMemo(
    () => [
      { id: 1, purchaseDate: "2024-04-10", invoiceNo: "INV-101", supplier: "ABC Medical Suppliers", assetName: "ECG Machine", category: "Medical Equipment", qty: 1, rate: 85000 },
      { id: 2, purchaseDate: "2024-04-12", invoiceNo: "INV-102", supplier: "XYZ Traders", assetName: "Office Chair", category: "Furniture", qty: 10, rate: 3500 },
      { id: 3, purchaseDate: "2024-04-15", invoiceNo: "INV-103", supplier: "Global Tech", assetName: "Dell Monitor", category: "IT Hardware", qty: 5, rate: 12000 },
      { id: 4, purchaseDate: "2024-04-18", invoiceNo: "INV-104", supplier: "ABC Medical Suppliers", assetName: "Patient Monitor", category: "Medical Equipment", qty: 2, rate: 45000 },
      { id: 5, purchaseDate: "2024-04-20", invoiceNo: "INV-105", supplier: "Global Tech", assetName: "Laptop L3", category: "IT Hardware", qty: 2, rate: 55000 },
      { id: 6, purchaseDate: "2024-04-22", invoiceNo: "INV-106", supplier: "XYZ Traders", assetName: "Meeting Table", category: "Furniture", qty: 1, rate: 15000 },
      { id: 7, purchaseDate: "2024-04-10", invoiceNo: "INV-101", supplier: "ABC Medical Suppliers", assetName: "ECG Machine", category: "Medical Equipment", qty: 1, rate: 85000 },
      { id: 8, purchaseDate: "2024-04-12", invoiceNo: "INV-102", supplier: "XYZ Traders", assetName: "Office Chair", category: "Furniture", qty: 10, rate: 3500 },
      { id: 9, purchaseDate: "2024-04-15", invoiceNo: "INV-103", supplier: "Global Tech", assetName: "Dell Monitor", category: "IT Hardware", qty: 5, rate: 12000 },
      { id: 10, purchaseDate: "2024-04-18", invoiceNo: "INV-104", supplier: "ABC Medical Suppliers", assetName: "Patient Monitor", category: "Medical Equipment", qty: 2, rate: 45000 },
      { id: 11, purchaseDate: "2024-04-20", invoiceNo: "INV-105", supplier: "Global Tech", assetName: "Laptop L3", category: "IT Hardware", qty: 2, rate: 55000 },
      { id: 12, purchaseDate: "2024-04-22", invoiceNo: "INV-106", supplier: "XYZ Traders", assetName: "Meeting Table", category: "Furniture", qty: 1, rate: 15000 },
    ],
    []
  );

  /* ---------------- LOGIC ---------------- */
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const matchSupplier = filters.supplier === "All" || item.supplier === filters.supplier;
      const matchCategory = filters.category === "All" || item.category === filters.category;

      // Date filtering logic (Optional but recommended since dates are now set)
      const itemDate = item.purchaseDate;
      const matchDate = (filters.fromDate === "" || itemDate >= filters.fromDate) &&
        (filters.toDate === "" || itemDate <= filters.toDate);

      // Note: We return based on Supplier and Category as per your original logic
      return matchSupplier && matchCategory;
    });
  }, [filters, rawData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const handleReset = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  /* ---------------- SHARED STYLES ---------------- */
  const inputStyles = "w-full h-11 rounded-xl border border-slate-300 bg-white text-sm px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer text-slate-700 font-medium";

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 w-full">
      {/* HEADER */}
      <div className="w-full bg-white border-b border-black px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
            Asset Purchase <span className="text-blue-600">Report</span>
          </h1>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-0.5">
            {filters.unit}
          </p>
        </div>
      </div>

      <div className=" w-full">



        {/* FILTER SECTION */}
        <div className={`bg-white overflow-hidden `}>
          <div className="bg-black-50 border-b border-black flex items-center gap-3">
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <div className="flex flex-col space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Supplier</label>
                <select value={filters.supplier} onChange={(e) => setFilters({ ...filters, supplier: e.target.value })} className={inputStyles}>
                  <option>All</option>
                  <option>ABC Medical Suppliers</option>
                  <option>XYZ Traders</option>
                  <option>Global Tech</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Category</label>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className={inputStyles}>
                  <option>All</option>
                  <option>Medical Equipment</option>
                  <option>Furniture</option>
                  <option>IT Hardware</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">From Date</label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  className={inputStyles}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">To Date</label>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  className={inputStyles}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-between gap-6 items-center">
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none h-11 bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg active:scale-95">
                  <Search className="w-4 h-4" /> Search
                </button>

                <button onClick={handleReset} className="w-11 h-11 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center transition-all active:scale-95">
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* NEW RESET BUTTON */}
                <button
                  onClick={handleReset}
                  className="flex-1 md:flex-none h-11 bg-red-50 border border-rose-200 hover:bg-rose-100 text-rose-600 px-8 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>

              <div className="flex gap-2 w-full md:w-auto justify-end">
                <button className="flex-1 md:flex-none h-11 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Excel
                </button>
                <button className="flex-1 md:flex-none h-11 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4 text-rose-600" /> PDF
                </button>
                <button className="flex-1 md:flex-none h-11 px-4 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className={` overflow-hidden `}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest border-r border-blue-500/50">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest border-r border-blue-500/50">Description</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest border-r border-blue-500/50">Supplier Partner</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-center border-r border-blue-500/50">Qty</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-right border-r border-blue-500/50">Unit Rate</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-right">Total Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black-900">
                {paginatedData.length > 0 ? (
                  paginatedData.map((d) => (
                    <tr key={d.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium border-r border-slate-100">{d.purchaseDate}</td>
                      <td className="px-6 py-4 border-r border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{d.assetName}</span>
                          <span className="text-[10px] font-mono text-blue-600 font-bold">{d.invoiceNo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600 border-r border-slate-100">{d.supplier}</td>
                      <td className="px-6 py-4 text-sm text-center font-bold border-r border-slate-100">{d.qty}</td>
                      <td className="px-6 py-4 text-sm text-right border-r border-slate-100">₹{d.rate.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-right font-black text-blue-700 bg-blue-50/20">
                        ₹{(d.qty * d.rate).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-400 font-medium">No records found for the selected criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
              Showing <span className="text-slate-900">{filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="text-slate-900">{filteredData.length}</span> records
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || filteredData.length === 0}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-xs font-black transition-all ${currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || filteredData.length === 0}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center gap-5 group transition-all hover:border-blue-400">
      <div className={`p-4 rounded-xl ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">{label}</p>
        <p className="text-2xl font-black text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}