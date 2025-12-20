import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSave, FiX, FiBriefcase } from "react-icons/fi";

export default function CityMaster() {
  const [form, setForm] = useState({
    cityCode: "",
    cityName: "",
    stateID: "",
    countryID: "",
    stdCode: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("FORM DATA:", form);
    // TODO: API / localStorage
  };

  const handleReset = () =>
    setForm({
      cityCode: "",
      cityName: "",
      stateID: "",
      countryID: "",
      stdCode: "",
      postalCode: "",
    });

  const inputClass =
    "mt-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none bg-white shadow-sm w-full";

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 border border-slate-200 min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
          <FiBriefcase />
          City Master
        </h1>

        <Link
          to="/city-master-list"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-md hover:bg-indigo-700 transition"
        >
          VIEW LIST
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* City Fields */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">
            City Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-600">
                City Code
              </label>
              <input
                name="cityCode"
                value={form.cityCode}
                onChange={handleChange}
                type="text"
                className={inputClass}
                placeholder="Enter city code"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                City Name
              </label>
              <input
                name="cityName"
                value={form.cityName}
                onChange={handleChange}
                type="text"
                className={inputClass}
                placeholder="Enter city name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                State ID
              </label>
              <input
                name="stateID"
                value={form.stateID}
                onChange={handleChange}
                type="text"
                className={inputClass}
                placeholder="Enter state ID"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                Country ID
              </label>
              <input
                name="countryID"
                value={form.countryID}
                onChange={handleChange}
                type="text"
                className={inputClass}
                placeholder="Enter country ID"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                STD Code
              </label>
              <input
                name="stdCode"
                value={form.stdCode}
                onChange={handleChange}
                type="text"
                className={inputClass}
                placeholder="e.g. 022"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                Postal Code
              </label>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                type="text"
                className={inputClass}
                placeholder="e.g. 400001"
              />
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
            Save City
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
