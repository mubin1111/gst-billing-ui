// src/pages/UnitCompanyMaster.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiSave,
  FiX,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";

export default function UnitCompanyMaster() {
  const [form, setForm] = useState({
    unitName: "",
    gstin: "",
    pan: "",
    line1: "",
    line2: "",
    city: "",
    pincode: "",
    state: "",
    stateCode: "",
    email: "",
    phone: "",
    bankName: "",
    accountNumber: "",
  });

  const navigate = useNavigate();
  const inputBase =
    "w-full rounded-md border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-sm";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleReset = () =>
    setForm({
      unitName: "",
      gstin: "",
      pan: "",
      line1: "",
      line2: "",
      city: "",
      pincode: "",
      state: "",
      stateCode: "",
      email: "",
      phone: "",
      bankName: "",
      accountNumber: "",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <h1 className="text-lg font-bold text-slate-800">Unit Company Master</h1>
            <p className="text-xs text-slate-500">Add unit/company details</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/unit-company-list")}
          className="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white shadow hover:bg-indigo-700"
        >
          VIEW LIST
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="w-full p-3 space-y-5">

        {/* SECTION 1 */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            General & Legal Info
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Unit Name *</label>
              <input
                name="unitName"
                value={form.unitName}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600">GSTIN</label>
                <input
                  name="gstin"
                  value={form.gstin}
                  onChange={handleChange}
                  className={`${inputBase} px-3 py-2`}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">PAN</label>
                <input
                  name="pan"
                  value={form.pan}
                  onChange={handleChange}
                  className={`${inputBase} px-3 py-2`}
                  placeholder="AAAAA0000A"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            Contact Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-slate-400" />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`${inputBase} pl-10 pr-3 py-2`}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-slate-400" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`${inputBase} pl-10 pr-3 py-2`}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <FiMapPin /> Registered Address
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Address Line 1</label>
              <input
                name="line1"
                value={form.line1}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Address line 1"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Address Line 2</label>
              <input
                name="line2"
                value={form.line2}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Address line 2 (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={`${inputBase} px-3 py-2`}
                  placeholder="City"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Pincode</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className={`${inputBase} px-3 py-2`}
                  placeholder="400001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600">State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={`${inputBase} px-3 py-2`}
                  placeholder="Maharashtra"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">State Code</label>
                <input
                  name="stateCode"
                  value={form.stateCode}
                  onChange={handleChange}
                  className={`${inputBase} px-3 py-2`}
                  placeholder="27"
                />
              </div>
            </div>
          </div>
        </section>

        {/* BANK SECTION */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Bank Details</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Bank Name</label>
              <input
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Bank name"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Account Number</label>
              <input
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Account number"
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
