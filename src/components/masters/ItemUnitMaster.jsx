import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiSave,
  FiX,
} from "react-icons/fi";

export default function UnitCompanyMaster() {
  const navigate = useNavigate();

  /* ---------------- FORM STATE (UPDATED AS PER YOUR FIELDS) ---------------- */
  const [form, setForm] = useState({
    unitCode: "",
    unitName: "",
    unitSymbol: "",
    decimalAllowed: "",
    isBaseUnit: false,
  });

  const inputBase =
    "w-full rounded-md border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-sm";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReset = () =>
    setForm({
      unitCode: "",
      unitName: "",
      unitSymbol: "",
      decimalAllowed: "",
      isBaseUnit: false,
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT UNIT DATA:", form);
    alert("Unit Saved Successfully!");
  };

  return (
    <div className="w-full bg-white p-0 m-0">
      {/* HEADER (STYLE UNCHANGED) */}
      <div className="w-full bg-white border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center text-lg shadow">
            <FiBriefcase />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Item Unit Master
            </h1>
            <p className="text-xs text-slate-500">
              Add unit details
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/itemunit-master-list")}
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
            Unit Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Unit Code */}
            <div>
              <label className="text-xs font-medium text-slate-600">
                Unit Code *
              </label>
              <input
                name="unitCode"
                value={form.unitCode}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="PCS / KG"
                required
              />
            </div>

            {/* Unit Name */}
            <div>
              <label className="text-xs font-medium text-slate-600">
                Unit Name *
              </label>
              <input
                name="unitName"
                value={form.unitName}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Pieces / Kilogram"
                required
              />
            </div>

            {/* Unit Symbol */}
            <div>
              <label className="text-xs font-medium text-slate-600">
                Unit Symbol
              </label>
              <input
                name="unitSymbol"
                value={form.unitSymbol}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="pc / kg"
              />
            </div>

            {/* Decimal Allowed */}
            <div>
              <label className="text-xs font-medium text-slate-600">
                Decimal Allowed
              </label>
              <input
                type="number"
                name="decimalAllowed"
                value={form.decimalAllowed}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="0 / 2 / 3"
                min="0"
              />
            </div>

            {/* Is Base Unit */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="isBaseUnit"
                checked={form.isBaseUnit}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300"
              />
              <label className="text-sm font-medium text-slate-700">
                Is Base Unit
              </label>
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
