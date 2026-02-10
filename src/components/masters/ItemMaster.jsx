// src/pages/ItemMaster.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSave, FiX, FiPackage } from "react-icons/fi";

export default function ItemMaster() {
  const [form, setForm] = useState({
    ItemName: "",
    ItemNameDetails: "",
    ItemCode: "",
    HSNCode: "",
    Unit: "",
    GSTRate: "",
    PurchasePrice: "",
    SalePrice: "",
    MRP: "",
    OpeningStock: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.ItemName.trim() || !form.ItemCode.trim()) {
      alert("Please fill Item Name and Item Code");
      return;
    }
    console.log("SUBMIT ITEM DATA:", form);
    alert("Item saved (simulation). Check console for payload.");
  };

  const handleReset = () =>
    setForm({
      ItemName: "",
      ItemNameDetails: "",
      ItemCode: "",
      HSNCode: "",
      Unit: "",
      GSTRate: "",
      PurchasePrice: "",
      SalePrice: "",
      MRP: "",
      OpeningStock: ""
    });

  const inputClass =
    "w-full rounded-md border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 shadow-sm";

  return (
    <div className="w-full m-0 p-0 bg-white">
      {/* Header (compact) */}
      <div className="w-full flex items-center justify-between px-3 py-3 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-indigo-600 text-white flex items-center justify-center text-lg shadow">
            <FiPackage />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-indigo-700 leading-tight">Item Master</h1>
            <p className="text-xs text-slate-500">Add or update items</p>
          </div>
        </div>

        <Link
          to="/item-master-list"
          className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-semibold shadow hover:bg-indigo-700"
        >
          VIEW LIST
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full p-3 space-y-4">
        {/* Item Name & Code - Divided 6-6 in one line */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-600">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              name="ItemName"
              value={form.ItemName}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-2 py-1.5 mt-0.5`}
              placeholder="e.g., Blue Pen"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600">
              Item Code <span className="text-red-500">*</span>
            </label>
            <input
              name="ItemCode"
              value={form.ItemCode}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-2 py-1.5 mt-0.5`}
              placeholder="e.g., BP-001"
              required
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <label className="text-xs font-medium text-slate-600">Item Details</label>
          <input
            name="ItemNameDetails"
            value={form.ItemNameDetails}
            onChange={handleChange}
            type="text"
            className={`${inputClass} px-3 py-2 mt-1`}
            placeholder="Details / description (e.g., Ballpoint pen, blue ink)"
          />
        </div>

        {/* HSN / Unit / GST */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">HSN Code</label>
            <input
              name="HSNCode"
              value={form.HSNCode}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="e.g., 9608"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Unit</label>
            <input
              name="Unit"
              value={form.Unit}
              onChange={handleChange}
              type="text"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="pcs, pack"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">GST Rate (%)</label>
            <input
              name="GSTRate"
              value={form.GSTRate}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="e.g., 18"
            />
          </div>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Purchase Price</label>
            <input
              name="PurchasePrice"
              value={form.PurchasePrice}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="Purchase price"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Sale Price</label>
            <input
              name="SalePrice"
              value={form.SalePrice}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="Sale price"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">MRP</label>
            <input
              name="MRP"
              value={form.MRP}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              className={`${inputClass} px-3 py-2 mt-1`}
              placeholder="Maximum Retail Price"
            />
          </div>
        </div>

        {/* Opening Stock - Divided 6-6 in one line */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-600">Opening Stock</label>
            <input
              name="OpeningStock"
              value={form.OpeningStock}
              onChange={handleChange}
              type="number"
              min="0"
              step="1"
              className={`${inputClass} px-2 py-1.5 mt-0.5`}
              placeholder="Initial stock quantity"
            />
          </div>

          <div />
        </div>

        {/* Buttons - full width on mobile */}
        <div className="pt-3 border-t flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-semibold shadow hover:bg-emerald-700"
          >
            <FiSave /> Save Item
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
