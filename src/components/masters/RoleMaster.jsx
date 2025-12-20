import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSave, FiX, FiBriefcase } from "react-icons/fi";

export default function RoleMaster() {
  const [form, setForm] = useState({
    roleCode: "",
    roleName: "",
    description: "",
    isSystemRole: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("FORM DATA:", form);
    // TODO: API / localStorage
  };

  const handleReset = () =>
    setForm({
      roleCode: "",
      roleName: "",
      description: "",
      isSystemRole: false,
    });

  const inputClass =
    "mt-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none bg-white shadow-sm w-full";

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 border border-slate-200 min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
          <FiBriefcase />
          Role Master
        </h1>

        <Link
          to="/role-master-list"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-md hover:bg-indigo-700 transition"
        >
          VIEW LIST
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Role Fields */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">
            Role Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Code */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Role Code
              </label>
              <input
                name="roleCode"
                value={form.roleCode}
                onChange={handleChange}
                type="text"
                className={inputClass}
                placeholder="Enter role code (e.g. ADMIN, USER)"
              />
            </div>

            {/* Role Name */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Role Name
              </label>
              <input
                name="roleName"
                value={form.roleName}
                onChange={handleChange}
                type="text"
                className={inputClass}
                placeholder="Enter role name (e.g. Administrator)"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-600">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className={inputClass}
                placeholder="Short description about this role"
              />
            </div>

            {/* Is System Role (checkbox) */}
            <div className="flex items-center gap-3 mt-2 md:col-span-2">
              <input
                id="isSystemRole"
                name="isSystemRole"
                type="checkbox"
                checked={form.isSystemRole}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label
                htmlFor="isSystemRole"
                className="text-sm font-medium text-slate-600"
              >
                Is System Role (core role that cannot be deleted)
              </label>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="pt-6 flex items-center gap-4 border-t">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg text-sm shadow-lg hover:bg-green-700 transition"
          >
            <FiSave />
            Save Role
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg text-sm shadow-md hover:bg-red-600 transition"
          >
            <FiX />
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
