import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSave, FiX, FiBriefcase } from "react-icons/fi";

export default function ExpenseMaster() {
  const [form, setForm] = useState({
    expenseCode: "",
    expenseName: "",
    expenseCategoryID: "",
    hsnCode: "",
    gstApplicable: false,
    defaultGSTPercent: "",
    isReimbursable: false,
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
      expenseCode: "",
      expenseName: "",
      expenseCategoryID: "",
      hsnCode: "",
      gstApplicable: false,
      defaultGSTPercent: "",
      isReimbursable: false,
    });

  const inputClass =
    "mt-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none bg-white shadow-sm w-full";

  return (
    <div className="min-h-screen bg-gray-50 px-2 py-3 sm:p-8">
      {/* MOBILE FLAT / DESKTOP CARD */}
      <div
        className="
          w-full
          sm:max-w-4xl
          sm:mx-auto
          bg-white
          p-4
          sm:p-8
          sm:rounded-xl
          sm:shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
            <FiBriefcase />
            Expense Master
          </h1>

          <Link
            to="/expenses-master-list"
            className="mt-3 sm:mt-0 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-md hover:bg-indigo-700 transition w-full sm:w-auto text-center"
          >
            VIEW LIST
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Expense Fields */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-4 border-b pb-2">
              Expense Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Expense Code */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Expense Code
                </label>
                <input
                  name="expenseCode"
                  value={form.expenseCode}
                  onChange={handleChange}
                  type="text"
                  className={inputClass}
                  placeholder="Enter expense code"
                />
              </div>

              {/* Expense Name */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Expense Name
                </label>
                <input
                  name="expenseName"
                  value={form.expenseName}
                  onChange={handleChange}
                  type="text"
                  className={inputClass}
                  placeholder="Enter expense name"
                />
              </div>

              {/* Expense Category ID */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Expense Category ID
                </label>
                <input
                  name="expenseCategoryID"
                  value={form.expenseCategoryID}
                  onChange={handleChange}
                  type="text"
                  className={inputClass}
                  placeholder="Enter expense category ID"
                />
              </div>

              {/* HSN Code */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  HSN Code
                </label>
                <input
                  name="hsnCode"
                  value={form.hsnCode}
                  onChange={handleChange}
                  type="text"
                  className={inputClass}
                  placeholder="Enter HSN code"
                />
              </div>

              {/* GST Applicable */}
              <div className="flex items-center gap-3 mt-2">
                <input
                  id="gstApplicable"
                  name="gstApplicable"
                  type="checkbox"
                  checked={form.gstApplicable}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="gstApplicable"
                  className="text-sm font-medium text-slate-600"
                >
                  GST Applicable
                </label>
              </div>

              {/* Default GST Percent */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Default GST Percent
                </label>
                <input
                  name="defaultGSTPercent"
                  value={form.defaultGSTPercent}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  min="0"
                  className={inputClass}
                  placeholder="e.g. 18"
                />
              </div>

              {/* Is Reimbursable */}
              <div className="flex items-center gap-3 mt-2">
                <input
                  id="isReimbursable"
                  name="isReimbursable"
                  type="checkbox"
                  checked={form.isReimbursable}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="isReimbursable"
                  className="text-sm font-medium text-slate-600"
                >
                  Is Reimbursable
                </label>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4 border-t">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg text-sm shadow-lg hover:bg-green-700 transition w-full sm:w-auto"
            >
              <FiSave />
              Save Expense
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg text-sm shadow-md hover:bg-red-600 transition w-full sm:w-auto"
            >
              <FiX />
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
