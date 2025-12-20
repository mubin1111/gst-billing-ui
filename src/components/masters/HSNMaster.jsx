import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSave,
  FiX,
  FiBriefcase,
} from "react-icons/fi";

export default function UnitCompanyMaster() {
  const navigate = useNavigate();

  /* ---------------- FORM STATE (UPDATED) ---------------- */
  const [form, setForm] = useState({
    HSNCode: "",
    HSNDescription: "",
    GSTType: "",
    CGSTPercent: "",
    SGSTPercent: "",
    IGSTPercent: "",
    CESSPercent: "",
  });

  const inputBase =
    "w-full rounded-md border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-sm";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleReset = () =>
    setForm({
      HSNCode: "",
      HSNDescription: "",
      GSTType: "",
      CGSTPercent: "",
      SGSTPercent: "",
      IGSTPercent: "",
      CESSPercent: "",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT HSN DATA:", form);
    alert("HSN Saved Successfully!");
  };

  return (
    <div className="w-full bg-white p-0 m-0">
      {/* HEADER (UNCHANGED STYLE) */}
      <div className="w-full bg-white border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center text-lg shadow">
            <FiBriefcase />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              HSN Master
            </h1>
            <p className="text-xs text-slate-500">
              Add HSN & GST percentage details
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/hsn-master-list")}
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
            HSN Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* HSN Code */}
            <div>
              <label className="text-xs font-medium text-slate-600">
                HSN Code *
              </label>
              <input
                name="HSNCode"
                value={form.HSNCode}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="1001"
                required
              />
            </div>

            {/* GST Type */}
            <div>
              <label className="text-xs font-medium text-slate-600">
                GST Type
              </label>
              <input
                name="GSTType"
                value={form.GSTType}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Goods / Services"
              />
            </div>

            {/* HSN Description */}
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-600">
                HSN Description
              </label>
              <input
                name="HSNDescription"
                value={form.HSNDescription}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Description of goods/services"
              />
            </div>
          </div>
        </section>

        {/* TAX PERCENTAGES */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            GST Percentage Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600">
                CGST %
              </label>
              <input
                type="number"
                name="CGSTPercent"
                value={form.CGSTPercent}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                SGST %
              </label>
              <input
                type="number"
                name="SGSTPercent"
                value={form.SGSTPercent}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                IGST %
              </label>
              <input
                type="number"
                name="IGSTPercent"
                value={form.IGSTPercent}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                CESS %
              </label>
              <input
                type="number"
                name="CESSPercent"
                value={form.CESSPercent}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </section>

        {/* BUTTONS (UNCHANGED STYLE) */}
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
