// src/pages/UnitCompanyMaster.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSave,
  FiX,
  FiBriefcase,
} from "react-icons/fi";

export default function UnitCompanyMaster() {
  const [form, setForm] = useState({
    StateName: "",
    StateCode: "",
    StateShortName: "",
    IsUnionTerritory: false,
    CountryName: "",
    DisplayOrder: "",
    Remarks: "",
  });

  const navigate = useNavigate();

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
      StateName: "",
      StateCode: "",
      StateShortName: "",
      IsUnionTerritory: false,
      CountryName: "",
      DisplayOrder: "",
      Remarks: "",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("STATE MASTER DATA:", form);
    alert("Saved!");
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
              State Master
            </h1>
            <p className="text-xs text-slate-500">
              Add state details
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/state-master-list")}
          className="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white shadow hover:bg-indigo-700"
        >
          VIEW LIST
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="w-full p-3 space-y-5">

        {/* SECTION */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            State Information
          </h2>

          <div className="space-y-4">

            <div>
              <label className="text-xs font-medium text-slate-600">
                State Name *
              </label>
              <input
                name="StateName"
                value={form.StateName}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Maharashtra"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600">
                  State Code *
                </label>
                <input
                  name="StateCode"
                  value={form.StateCode}
                  onChange={handleChange}
                  className={`${inputBase} px-3 py-2`}
                  placeholder="27"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  State Short Name
                </label>
                <input
                  name="StateShortName"
                  value={form.StateShortName}
                  onChange={handleChange}
                  className={`${inputBase} px-3 py-2`}
                  placeholder="MH"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Country Name
                </label>
                <input
                  name="CountryName"
                  value={form.CountryName}
                  onChange={handleChange}
                  className={`${inputBase} px-3 py-2`}
                  placeholder="India"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Display Order
                </label>
                <input
                  name="DisplayOrder"
                  value={form.DisplayOrder}
                  onChange={handleChange}
                  className={`${inputBase} px-3 py-2`}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="IsUnionTerritory"
                checked={form.IsUnionTerritory}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm text-slate-700">
                Is Union Territory
              </label>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Remarks
              </label>
              <textarea
                name="Remarks"
                value={form.Remarks}
                onChange={handleChange}
                rows={3}
                className={`${inputBase} px-3 py-2`}
                placeholder="Remarks (optional)"
              />
            </div>

          </div>
        </section>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t">
          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 shadow hover:bg-emerald-700"
          >
            <FiSave /> Save
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 shadow hover:bg-red-600"
          >
            <FiX /> Clear
          </button>
        </div>
      </form>
    </div>
  );
}
