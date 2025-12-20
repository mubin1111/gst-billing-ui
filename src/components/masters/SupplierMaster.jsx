// src/pages/SupplierMaster.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSave, FiX, FiPackage } from "react-icons/fi";

export default function SupplierMaster() {
  // Supplier form fields
  const [form, setForm] = useState({
    SupplierName: "",
    GSTIN: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    PinCode: "",
    State: "",
    StateCode: "",
    Phone: "",
    Email: "",
    BankName: "",
    AccountNumber: "",
    IFSC: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.SupplierName.trim()) {
      alert("Please fill Supplier Name");
      return;
    }
    console.log("SUBMIT SUPPLIER DATA:", form);
    alert("Supplier saved (simulation). Check console for payload.");
  };

  const handleReset = () =>
    setForm({
      SupplierName: "",
      GSTIN: "",
      AddressLine1: "",
      AddressLine2: "",
      City: "",
      PinCode: "",
      State: "",
      StateCode: "",
      Phone: "",
      Email: "",
      BankName: "",
      AccountNumber: "",
      IFSC: ""
    });

  const inputClass =
    "w-full rounded-md border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-sm";

  return (
    <div className="w-full m-0 p-0 bg-white">
      {/* Header (compact, full-bleed like ItemMaster) */}
      <div className="w-full flex items-center justify-between px-3 py-3 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center text-lg shadow">
            <FiPackage />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-indigo-700 leading-tight">Supplier Master</h1>
            <p className="text-xs text-slate-500">Add or update supplier details</p>
          </div>
        </div>

        <Link
          to="/supplier-master-list"
          className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-semibold shadow hover:bg-indigo-700"
        >
          VIEW LIST
        </Link>
      </div>

      {/* Form (full width, compact spacing like ItemMaster) */}
      <form onSubmit={handleSubmit} className="w-full p-3 space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600">Supplier Name <span className="text-red-500">*</span></label>
          <input
            name="SupplierName"
            value={form.SupplierName}
            onChange={handleChange}
            type="text"
            className={`${inputClass} px-3 py-2 mt-1`}
            placeholder="e.g., ABC Suppliers Pvt. Ltd."
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">GSTIN</label>
            <input
              name="GSTIN"
              value={form.GSTIN}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="22AAAAA0000A1Z5"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Phone</label>
            <input
              name="Phone"
              value={form.Phone}
              onChange={handleChange}
              type="tel"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="+91-9876543210"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Email</label>
            <input
              name="Email"
              value={form.Email}
              onChange={handleChange}
              type="email"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="supplier@company.com"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Address Line 1</label>
          <input
            name="AddressLine1"
            value={form.AddressLine1}
            onChange={handleChange}
            type="text"
            className={`${inputClass} px-3 py-2 mt-1`}
            placeholder="Street, Building, Area"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Address Line 2</label>
          <input
            name="AddressLine2"
            value={form.AddressLine2}
            onChange={handleChange}
            type="text"
            className={`${inputClass} px-3 py-2 mt-1`}
            placeholder="Landmark, Colony, Additional info"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">City</label>
            <input
              name="City"
              value={form.City}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="City"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Pin Code</label>
            <input
              name="PinCode"
              value={form.PinCode}
              onChange={handleChange}
              type="text"
              inputMode="numeric"
              className={`${inputClass} px-3 py-2`}
              placeholder="400001"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">State</label>
            <input
              name="State"
              value={form.State}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="State (e.g., Maharashtra)"
            />
          </div>

          <div className="sm:col-start-2 sm:col-span-1">
            <label className="text-xs font-medium text-slate-600">State Code</label>
            <input
              name="StateCode"
              value={form.StateCode}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="27"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Bank Name</label>
            <input
              name="BankName"
              value={form.BankName}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="Bank name"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Account Number</label>
            <input
              name="AccountNumber"
              value={form.AccountNumber}
              onChange={handleChange}
              type="text"
              inputMode="numeric"
              className={`${inputClass} px-3 py-2`}
              placeholder="Account number"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">IFSC</label>
            <input
              name="IFSC"
              value={form.IFSC}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="e.g., SBIN0000001"
            />
          </div>
        </div>

        {/* Buttons - full width on mobile, inline on wider screens */}
        <div className="pt-3 border-t flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-semibold shadow hover:bg-emerald-700"
          >
            <FiSave /> Save Supplier
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md text-sm shadow hover:bg-red-600"
          >
            <FiX /> Clear
          </button>
        </div>
      </form>
    </div>
  );
}
