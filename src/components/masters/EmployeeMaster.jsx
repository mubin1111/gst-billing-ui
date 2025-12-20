import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Save,
  X,
  User,
  Phone,
  Banknote,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function App() {
  const initialState = {
    EmployeeID: "",
    EmployeeCode: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Gender: "",
    DateOfBirth: "",
    JoiningDate: "",
    DepartmentID: "",
    DesignationID: "",
    MobileNo: "",
    EmailID: "",
    PANNumber: "",
    AadhaarNumber: "",
    Address: "",
    City: "",
    State: "",
    Country: "",
    PostalCode: "",
    MaritalStatus: "",
    BloodGroup: "",
    EmergencyContactName: "",
    EmergencyContactNumber: "",
    BankAccountNo: "",
    BankIFSC: "",
    Salary: "",
  };

  const tabs = useMemo(
    () => [
      {
        id: "basic",
        name: "1. Basic Info",
        icon: User,
        fields: [
          { label: "Employee ID", name: "EmployeeID", type: "text" },
          { label: "Employee Code", name: "EmployeeCode", type: "text" },
          { label: "First Name", name: "FirstName", type: "text", required: true },
          { label: "Middle Name", name: "MiddleName", type: "text" },
          { label: "Last Name", name: "LastName", type: "text", required: true },
          { label: "Gender", name: "Gender", type: "select", options: ["Male", "Female", "Other"] },
          { label: "Date of Birth", name: "DateOfBirth", type: "date" },
          { label: "Joining Date", name: "JoiningDate", type: "date", required: true },
          { label: "Department ID", name: "DepartmentID", type: "text" },
          { label: "Designation ID", name: "DesignationID", type: "text" },
        ],
      },
      {
        id: "contact",
        name: "2. Contact & Address",
        icon: Phone,
        fields: [
          { label: "Mobile No", name: "MobileNo", type: "tel" },
          { label: "Email ID", name: "EmailID", type: "email", required: true },
          { label: "PAN Number", name: "PANNumber", type: "text" },
          { label: "Aadhaar Number", name: "AadhaarNumber", type: "text" },
          { label: "Address", name: "Address", type: "text", span: 3 },
          { label: "City", name: "City", type: "text" },
          { label: "State", name: "State", type: "text" },
          { label: "Country", name: "Country", type: "text" },
          { label: "Postal Code", name: "PostalCode", type: "text" },
        ],
      },
      {
        id: "financial",
        name: "3. Financial & Other",
        icon: Banknote,
        fields: [
          { label: "Bank Account No", name: "BankAccountNo", type: "text" },
          { label: "Bank IFSC", name: "BankIFSC", type: "text" },
          { label: "Salary", name: "Salary", type: "number" },
          { label: "Marital Status", name: "MaritalStatus", type: "text" },
          { label: "Blood Group", name: "BloodGroup", type: "text" },
          { label: "Emergency Contact Name", name: "EmergencyContactName", type: "text" },
          { label: "Emergency Contact Number", name: "EmergencyContactNumber", type: "tel" },
        ],
      },
    ],
    []
  );

  const [form, setForm] = useState(initialState);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [message, setMessage] = useState(null);

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTabId);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("EMPLOYEE DATA:", form);
    setMessage({ type: "success", text: "Employee saved successfully!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const inputClass =
    "mt-1 px-3 py-2 border border-slate-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-indigo-400 outline-none";

  const renderField = (field) => (
    <div key={field.name} className={field.span === 3 ? "md:col-span-3" : ""}>
      <label className="text-sm font-semibold text-slate-700">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      {field.type === "select" ? (
        <select name={field.name} value={form[field.name]} onChange={handleChange} className={inputClass}>
          <option value="">Select</option>
          {field.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} className={inputClass} />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-2 py-3 sm:p-8 flex justify-center">
      {message && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50">
          <CheckCircle className="w-5 h-5" /> {message.text}
        </div>
      )}

      {/* MOBILE FLAT / DESKTOP CARD */}
      <div className="w-full sm:max-w-5xl sm:bg-white sm:rounded-2xl sm:shadow-xl p-4 sm:p-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
            <User className="w-7 h-7" /> Employee Master
          </h1>
          <Link to="/employee-master-list" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg">
            View List
          </Link>
        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto gap-4 border-b mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 pb-2 whitespace-nowrap ${
                  activeTabId === tab.id ? "border-b-2 border-indigo-600 text-indigo-600 font-bold" : "text-gray-500"
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.name}
              </button>
            );
          })}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tabs.find((t) => t.id === activeTabId)?.fields.map(renderField)}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
            {!isFirstTab && (
              <button type="button" onClick={() => setActiveTabId(tabs[currentTabIndex - 1].id)} className="btn">
                <ArrowLeft /> Previous
              </button>
            )}

            {!isLastTab ? (
              <button type="button" onClick={() => setActiveTabId(tabs[currentTabIndex + 1].id)} className="ml-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">
                Next <ArrowRight />
              </button>
            ) : (
              <div className="flex gap-4 ml-auto">
                <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold">
                  <Save /> Save
                </button>
                <button type="button" onClick={() => setForm(initialState)} className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold">
                  <X /> Clear
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
