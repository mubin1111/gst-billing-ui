import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSave,
  FiX,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";

export default function BankMaster() {
  const navigate = useNavigate();

  /* ---------------- FORM STATE (BANK DETAILS ONLY) ---------------- */
  const [form, setForm] = useState({
    bankName: "",
    branchName: "",
    accountHolderName: "",
    accountNumber: "",
    accountType: "",
    ifscCode: "",
    micrCode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    remarks: "",
  });

  const inputBase =
    "w-full rounded-md border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-sm";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleReset = () =>
    setForm({
      bankName: "",
      branchName: "",
      accountHolderName: "",
      accountNumber: "",
      accountType: "",
      ifscCode: "",
      micrCode: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      remarks: "",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("BANK DETAILS:", form);
    alert("Bank Details Saved!");
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
              Bank Master
            </h1>
            <p className="text-xs text-slate-500">
              Add bank account details
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/bank-master-list")}
          className="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white shadow hover:bg-indigo-700"
        >
          VIEW LIST
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="w-full p-3 space-y-5">

        {/* BANK BASIC INFO */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            Bank Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600">
                Bank Name *
              </label>
              <input
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Bank Name"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Branch Name
              </label>
              <input
                name="branchName"
                value={form.branchName}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Branch Name"
              />
            </div>

             <div>
              <label className="text-xs font-medium text-slate-600">
                Branch Name
              </label>
              <input
                name="branchName"
                value={form.branchName}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Branch Name"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Account Holder Name *
              </label>
              <input
                name="accountHolderName"
                value={form.accountHolderName}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Account Holder Name"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Account Number *
              </label>
              <input
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Account Number"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Account Type
              </label>
              <input
                name="accountType"
                value={form.accountType}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Savings / Current"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                IFSC Code *
              </label>
              <input
                name="ifscCode"
                value={form.ifscCode}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="IFSC Code"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                MICR Code
              </label>
              <input
                name="micrCode"
                value={form.micrCode}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="MICR Code"
              />
            </div>
          </div>
        </section>

        {/* ADDRESS */}
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <FiMapPin /> Bank Address
          </h2>

          <div className="space-y-4">
            <input
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              className={`${inputBase} px-3 py-2`}
              placeholder="Address Line 1"
            />

            <input
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              className={`${inputBase} px-3 py-2`}
              placeholder="Address Line 2"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="City"
              />
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="State"
              />
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                className={`${inputBase} px-3 py-2`}
                placeholder="Pincode"
              />
            </div>
          </div>
        </section>

        {/* REMARKS */}
        <section>
          <label className="text-xs font-medium text-slate-600">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className={`${inputBase} px-3 py-2 h-20 resize-none`}
            placeholder="Any additional remarks"
          />
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
