// src/pages/CustomerMaster.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiSave, FiX, FiCreditCard, FiMapPin, FiBriefcase } from "react-icons/fi";

export default function CustomerMaster() {
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
    creditlimit: "",
    bankName: "",
    accountNumber: "",
    ifsc: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation
    if (!form.unitName.trim()) {
      alert("Please provide Customer Name");
      return;
    }
    console.log("SUBMIT CUSTOMER DATA:", form);
    alert("Customer saved (simulation). Check console for payload.");
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
      creditlimit: "",
      bankName: "",
      accountNumber: "",
      ifsc: ""
    });

  const inputClass =
    "w-full rounded-md border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-sm";

  return (
    <div className="w-full m-0 p-0 bg-white">
      {/* Header (compact like ItemMaster) */}
      <div className="w-full flex items-center justify-between px-3 py-3 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center text-lg shadow">
            <FiBriefcase />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-indigo-700 leading-tight">Customer Master</h1>
            <p className="text-xs text-slate-500">Add or update customer / unit details</p>
          </div>
        </div>

        <Link
          to="/customer-master-list"
          className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-semibold shadow hover:bg-indigo-700"
        >
          VIEW LIST
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full p-3 space-y-4">
        {/* Customer Name */}
        <div>
          <label className="text-xs font-medium text-slate-600">Customer Name <span className="text-red-500">*</span></label>
          <input
            name="unitName"
            value={form.unitName}
            onChange={handleChange}
            type="text"
            className={`${inputClass} px-3 py-2 mt-1`}
            placeholder="e.g., ABC Traders"
            required
          />
        </div>

        {/* GSTIN / PAN / Credit Limit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">GSTIN</label>
            <input
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="22AAAAA0000A1Z5"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">PAN</label>
            <input
              name="pan"
              value={form.pan}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="AAAAA0000A"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Credit Limit</label>
            <div className="relative mt-1">
              <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="creditlimit"
                value={form.creditlimit}
                onChange={handleChange}
                type="number"
                min="0"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-400 outline-none bg-white shadow-sm text-sm"
                placeholder="e.g., 500000"
              />
            </div>
          </div>
        </div>

        {/* Address lines */}
        <div>
          <label className="text-xs font-medium text-slate-600">Street Address</label>
          <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="line1"
              value={form.line1}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="Address line 1"
            />
            <input
              name="line2"
              value={form.line2}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="Address line 2 (optional)"
            />
          </div>
        </div>

        {/* City / Pin / State */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="City"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Pin Code</label>
            <input
              name="pincode"
              value={form.pincode}
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
              name="state"
              value={form.state}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="State"
            />
          </div>

          <div className="sm:col-start-2 sm:col-span-1">
            <label className="text-xs font-medium text-slate-600">State Code</label>
            <input
              name="stateCode"
              value={form.stateCode}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="27"
            />
          </div>
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Email</label>
            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-400 outline-none bg-white shadow-sm text-sm"
                placeholder="name@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Phone Number</label>
            <div className="relative mt-1">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-400 outline-none bg-white shadow-sm text-sm"
                placeholder="+91-9876543210"
              />
            </div>
          </div>
        </div>

        {/* Bank details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Bank Name</label>
            <input
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="Bank name"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Account Number</label>
            <input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              type="text"
              inputMode="numeric"
              className={`${inputClass} px-3 py-2`}
              placeholder="Account number"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">IFSC Code</label>
            <input
              name="ifsc"
              value={form.ifsc}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2`}
              placeholder="IFSC (e.g., SBIN0000001)"
            />
          </div>
        </div>

        {/* Buttons - full width on mobile */}
        <div className="pt-3 border-t flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-semibold shadow hover:bg-emerald-700"
          >
            <FiSave /> Save Customer
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
