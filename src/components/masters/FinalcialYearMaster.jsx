import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiX, FiBriefcase, FiCalendar } from "react-icons/fi";

export default function FinancialYearMaster() {
  const navigate = useNavigate();

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    financialYearName: "",
    fromDate: "",
    toDate: "",
    assessmentYear: "",
    isCurrentYear: false,
    isLocked: false,
  });

  const inputBase =
    "w-full rounded-md border border-slate-300 bg-white text-sm " +
    "placeholder:text-slate-400 focus:outline-none focus:ring-2 " +
    "focus:ring-indigo-400 focus:border-indigo-400 shadow-sm";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReset = () =>
    setForm({
      financialYearName: "",
      fromDate: "",
      toDate: "",
      assessmentYear: "",
      isCurrentYear: false,
      isLocked: false,
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("FINANCIAL YEAR DATA:", form);
    alert("Financial Year Saved!");
  };

  return (
    <div className="w-full bg-white p-0 m-0">
      {/* HEADER */}
      <div className="w-full bg-white border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center text-lg shadow">
            <FiBriefcase />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Financial Year Master
            </h1>
            <p className="text-xs text-slate-500">
              Add financial year details
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/financialyear-master-list")}
          className="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white shadow hover:bg-indigo-700"
        >
          VIEW LIST
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="w-full p-3 space-y-5">
        {/* BASIC INFO */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            Financial Year Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Financial Year Name */}
            <div>
              <label className="text-xs font-medium text-slate-600">
                Financial Year Name *
              </label>
              <input
                name="financialYearName"
                value={form.financialYearName}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="2024-2025"
                required
              />
            </div>

            {/* Assessment Year */}
            <div>
              <label className="text-xs font-medium text-slate-600">
                Assessment Year *
              </label>
              <input
                name="assessmentYear"
                value={form.assessmentYear}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="2025-2026"
                required
              />
            </div>

            {/* From Date (MODERN) */}
            <div>
              <label className="text-xs font-medium text-slate-600">
                From Date *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  className={`${inputBase} pl-10 pr-3 py-2`}
                  required
                />
              </div>
            </div>

            {/* To Date (MODERN) */}
            <div>
              <label className="text-xs font-medium text-slate-600">
                To Date *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  className={`${inputBase} pl-10 pr-3 py-2`}
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* FLAGS */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            Status
          </h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="isCurrentYear"
                checked={form.isCurrentYear}
                onChange={handleChange}
                className="w-4 h-4"
              />
              Is Current Year
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="isLocked"
                checked={form.isLocked}
                onChange={handleChange}
                className="w-4 h-4"
              />
              Is Locked
            </label>
          </div>
        </section>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t">
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 shadow hover:bg-emerald-700"
          >
            <FiSave /> Save
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 shadow hover:bg-red-600"
          >
            <FiX /> Clear
          </button>
        </div>
      </form>
    </div>
  );
}
