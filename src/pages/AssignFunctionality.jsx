// src/pages/AssignFunctionality.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  ChevronRight,
  ChevronDown,
  Save,
  Trash2,
  X,
  Users,
  Search,
  Plus,
  Lock,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

/* ---------------- MOCK (updated structure) ---------------- */
const MOCK_ROLES = [
  { id: "admin", name: "Administrator" },
  { id: "billing", name: "Billing Manager" },
  { id: "lab", name: "Lab Technician" },
  { id: "viewer", name: "Read Only User" },
];

const MOCK_FEATURES = [
  { baseId: "dashboard.view", label: "Dashboard", group: "Core", subgroup: "General", actions: ["view"] },
  { baseId: "invoices", label: "Invoices", group: "Billing", subgroup: "Transactions", actions: ["create", "read", "update", "delete"] },
  { baseId: "masters.unit", label: "Units", group: "Masters", subgroup: "Catalog", actions: ["create", "read", "update", "delete"] },
  { baseId: "masters.customer", label: "Customers", group: "Masters", subgroup: "Catalog", actions: ["create", "read", "update", "delete"] },
  { baseId: "orders", label: "Work Orders", group: "Processing", subgroup: "Order Management", actions: ["read", "collect", "approve"] },
  { baseId: "reports.financial", label: "Financial Reports", group: "Reporting", subgroup: "Analytics", actions: ["read", "export"] },
  { baseId: "users", label: "Users", group: "Admin", subgroup: "Management", actions: ["manage", "view"] },
  { baseId: "settings", label: "System Settings", group: "Admin", subgroup: "Configuration", actions: ["change"] },
];

const ROLE_COLORS = {
  admin: "bg-fuchsia-600",
  billing: "bg-sky-500",
  lab: "bg-teal-500",
  viewer: "bg-slate-500",
};

/* ------------------- Component ------------------- */

export default function AssignFunctionality() {
  const [roles, setRoles] = useState([]);
  const [features, setFeatures] = useState([]); // features at resource level
  const [selectedRole, setSelectedRole] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [search, setSearch] = useState("");
  const [groupOpen, setGroupOpen] = useState({}); // which groups are open
  const [showAddPageForm, setShowAddPageForm] = useState(false);
  const [addPage, setAddPage] = useState({ group: "", subgroup: "", baseId: "", label: "" });

  /* ------------------- load mock ------------------- */
  useEffect(() => {
    setRoles(MOCK_ROLES);
    setFeatures(MOCK_FEATURES);
    // start with some assignments (permission id strings)
    setAssignments({
      admin: generateAllPermissionIds(MOCK_FEATURES), // admin gets everything
      billing: ["invoices.create", "invoices.read", "invoices.update", "reports.financial.read"],
      lab: ["orders.read", "orders.collect", "masters.unit.read"],
      viewer: ["dashboard.view", "masters.unit.read", "invoices.read"],
    });
    setSelectedRole("admin");
    // open the first group by default (if available)
    if (MOCK_FEATURES.length > 0) {
      setGroupOpen({ [MOCK_FEATURES[0].group]: true });
    }
  }, []);

  /* ---------------- helpers ---------------- */
  function generateAllPermissionIds(featuresArr) {
    const out = [];
    featuresArr.forEach((f) => {
      f.actions.forEach((a) => {
        out.push(`${f.baseId}.${a}`);
      });
    });
    return out;
  }

  // derive visible feature-action items based on search
  const visibleFeatures = useMemo(() => {
    const q = (search || "").toLowerCase();
    if (!q) return features;
    return features.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.group.toLowerCase().includes(q) ||
        (f.subgroup || "").toLowerCase().includes(q) ||
        f.baseId.toLowerCase().includes(q) ||
        f.actions.some((a) => a.includes(q))
    );
  }, [features, search]);

  // grouped by group -> subgroup -> resources
  const grouped = useMemo(() => {
    const map = {};
    visibleFeatures.forEach((f) => {
      if (!map[f.group]) map[f.group] = {};
      const sg = f.subgroup || "General";
      if (!map[f.group][sg]) map[f.group][sg] = [];
      map[f.group][sg].push(f);
    });
    return map; // { group: { subgroup: [features...] } }
  }, [visibleFeatures]);

  const currentRoleName = useMemo(() => {
    const role = roles.find((r) => r.id === selectedRole);
    return role ? role.name : "No Role Selected";
  }, [selectedRole, roles]);

  function notify(type, message) {
    // Using a slightly different color for info/warn
    const opts = { position: "top-right", autoClose: 3000, pauseOnHover: true, theme: "colored", style: { boxShadow: "0 6px 10px rgba(0,0,0,0.1)" } };
    if (type === "success") toast.success(message, opts);
    else if (type === "error") toast.error(message, opts);
    else if (type === "warn") toast.warn(message, { ...opts, style: { background: "#ff9800", color: "#fff", boxShadow: "0 6px 10px rgba(0,0,0,0.1)" } });
    else toast.info(message, { ...opts, style: { background: "#2196f3", color: "#fff", boxShadow: "0 6px 10px rgba(0,0,0,0.1)" } });
  }

  /* ---------------- assignment helpers ---------------- */
  // check if a permission id is assigned
  const selectedAssignedSet = useMemo(
    () => new Set(assignments[selectedRole] || []),
    [selectedRole, assignments]
  );

  // toggle single permission like `${baseId}.${action}`
  function togglePermission(permissionId) {
    if (!selectedRole) return notify("warn", "Select a role first");
    setAssignments((prev) => {
      const copy = { ...prev };
      const s = new Set(prev[selectedRole] || []);
      if (s.has(permissionId)) s.delete(permissionId);
      else s.add(permissionId);
      copy[selectedRole] = Array.from(s);
      return copy;
    });
  }

  // toggle all permissions for a group (visibleFeatures limited to that group's resources)
  function toggleGroupAll(group, checked) {
    if (!selectedRole) return notify("warn", "Select a role first");
    // gather permission ids for all visible features under that group
    const toToggle = [];
    const subgroups = grouped[group] || {};
    Object.values(subgroups).forEach((resources) => {
      resources.forEach((r) => r.actions.forEach((a) => toToggle.push(`${r.baseId}.${a}`)));
    });
    setAssignments((prev) => {
      const copy = { ...prev };
      const s = new Set(prev[selectedRole] || []);
      if (checked) toToggle.forEach((id) => s.add(id));
      else toToggle.forEach((id) => s.delete(id));
      copy[selectedRole] = Array.from(s);
      return copy;
    });
  }

  // toggle all actions for a single resource
  function toggleResource(resourceBaseId, checked) {
    if (!selectedRole) return notify("warn", "Select a role first");
    setAssignments((prev) => {
      const copy = { ...prev };
      const s = new Set(prev[selectedRole] || []);
      const f = features.find((x) => x.baseId === resourceBaseId);
      if (!f) return prev;
      f.actions.forEach((a) => {
        const id = `${resourceBaseId}.${a}`;
        if (checked) s.add(id);
        else s.delete(id);
      });
      copy[selectedRole] = Array.from(s);
      return copy;
    });
  }

  // toggle a specific action for a resource: e.g. masters.unit.create
  function toggleAction(resourceBaseId, action) {
    const permissionId = `${resourceBaseId}.${action}`;
    togglePermission(permissionId);
  }

  /* ------------------- save (mock API) ------------------- */
  async function savePermissions() {
    if (!selectedRole) return notify("warn", "Select a role to save");
    try {
      await new Promise((res) => setTimeout(res, 700));
      notify("success", `Permissions saved for role "${currentRoleName}"`);
    } catch (err) {
      console.error(err);
      notify("error", "Failed to save permissions — try again");
    }
  }

  /* ------------------- clear role assignments ------------------- */
  function clearRoleAssignments() {
    if (!selectedRole) return notify("warn", "Select a role first");
    if (!window.confirm(`Are you sure you want to clear ALL permissions for "${currentRoleName}"?`)) return;
    setAssignments((prev) => ({ ...prev, [selectedRole]: [] }));
    notify("info", `Cleared permissions for "${currentRoleName}"`);
  }

  /* ------------------- delete role (mock) ------------------- */
  async function deleteRole(roleId) {
    const roleName = roles.find((r) => r.id === roleId)?.name || roleId;
    if (!window.confirm(`Delete role "${roleName}"? This is permanent.`)) return;
    try {
      await new Promise((res) => setTimeout(res, 400));
      setRoles((r) => r.filter((x) => x.id !== roleId));
      setAssignments((a) => {
        const copy = { ...a };
        delete copy[roleId];
        return copy;
      });
      if (selectedRole === roleId) setSelectedRole(null);
      notify("success", `Role "${roleName}" deleted`);
    } catch (err) {
      console.error(err);
      notify("error", "Failed to delete role");
    }
  }

  /* ------------------- Add Page (resource) ------------------- */
  function handleAddPageSubmit(e) {
    e.preventDefault();
    const { group, subgroup, baseId, label } = addPage;
    if (!group || !baseId || !label) return notify("warn", "Please fill Group, baseId, and Label");
    // default actions CRUD (you can change UI to pick actions)
    const newFeature = { baseId, label, group, subgroup: subgroup || "General", actions: ["create", "read", "update", "delete"] };
    // avoid duplicate baseId
    if (features.some((f) => f.baseId === baseId)) return notify("error", "A resource with this baseId already exists");
    setFeatures((prev) => [...prev, newFeature]);
    setAddPage({ group: "", subgroup: "", baseId: "", label: "" });
    setShowAddPageForm(false);
    notify("success", `Added page "${label}" to ${group}/${subgroup || "General"}`);
  }

  /* ------------------- counts for progress ------------------- */
  const allPermissionIds = useMemo(() => {
    const out = [];
    features.forEach((f) => f.actions.forEach((a) => out.push(`${f.baseId}.${a}`)));
    return out;
  }, [features]);

  const assignedCount = selectedRole ? (assignments[selectedRole] || []).length : 0;
  const totalFeatures = allPermissionIds.length;
  const selectedRoleColor = selectedRole ? ROLE_COLORS[selectedRole] : "bg-gray-400";
  const assignmentPercentage = totalFeatures > 0 ? Math.round((assignedCount / totalFeatures) * 100) : 0;

  /* ------------------- Small presentational components ------------------- */

  // Custom Toggle Switch (replaces standard checkbox/button for action toggle)
  const ToggleSwitch = ({ id, isChecked, onChange, label, className }) => (
    <div className={`flex items-center ${className || ""}`}>
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={onChange}
        className="sr-only" // Hide the default checkbox
      />
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="relative">
          {/* Track */}
          <div className={`w-12 h-7 rounded-full shadow-inner transition-colors duration-200 ease-in-out ${isChecked ? "bg-fuchsia-600" : "bg-gray-300"}`} />
          {/* Thumb */}
          <div className={`dot absolute w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out top-1 left-1 ${isChecked ? "translate-x-5" : ""}`} />
        </div>
      </label>
      {label && <span className="ml-3 text-sm font-medium text-slate-700">{label}</span>}
    </div>
  );

  const RoleSelectorDropdown = ({ roles, selectedRole, setSelectedRole }) => (
    <div className="flex-shrink-0 w-full sm:w-64 relative">
      <label htmlFor="role-select" className="block text-sm font-medium text-slate-600 mb-1">Select Role</label>
      <select
        id="role-select"
        value={selectedRole || ""}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-base rounded-xl border appearance-none bg-white shadow-lg shadow-fuchsia-100/50 cursor-pointer transition duration-150 ease-in-out font-semibold"
      >
        <option value="" disabled className="text-gray-400">-- Select Role --</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );

  // Resource row with action toggles
  const ResourceRow = ({ resource }) => {
    // check if all actions of this resource are selected
    const ids = resource.actions.map((a) => `${resource.baseId}.${a}`);
    const assignedInResource = ids.filter((id) => selectedAssignedSet.has(id)).length;
    const allChecked = assignedInResource === ids.length && ids.length > 0;
    const someChecked = assignedInResource > 0 && assignedInResource < ids.length;

    return (
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl transition border-b last:border-b-0 hover:bg-fuchsia-50/50 ${someChecked ? "bg-fuchsia-50/70" : ""}`}>
        <div className="min-w-0 mb-3 md:mb-0">
          <div className="font-bold text-md text-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-fuchsia-500" />
            {resource.label}
          </div>
          <div className="text-xs text-slate-400 mt-1 pl-6 italic font-mono">{resource.baseId}</div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Resource-level toggle (using the new switch) */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600 hidden sm:inline">Allow All:</span>
            <ToggleSwitch
              id={`toggle-all-${resource.baseId}`}
              isChecked={allChecked}
              onChange={() => toggleResource(resource.baseId, !allChecked)}
              className="mr-4"
            />
          </div>

          {/* individual action toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            {resource.actions.map((a) => {
              const id = `${resource.baseId}.${a}`;
              const isOn = selectedAssignedSet.has(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleAction(resource.baseId, a)}
                  // Enhanced, visually distinct action buttons
                  className={`px-3 py-1.5 text-xs rounded-full border shadow-sm font-semibold transition-all duration-150 ${isOn
                      ? "bg-fuchsia-600 text-white border-fuchsia-600 hover:bg-fuchsia-700 shadow-fuchsia-300/50"
                      : "bg-white text-slate-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  title={`Toggle ${a}`}
                >
                  {a.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const GroupHeader = ({ group, count, total, isOpen, onToggleOpen, onToggleGroup }) => {
    const allChecked = count === total && total > 0;
    const groupColorClass = isOpen ? "bg-fuchsia-50/50 border-b-2 border-fuchsia-300 rounded-t-2xl" : "bg-gray-50 hover:bg-gray-100 rounded-2xl";
    const groupPercentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
      <div
        className={`flex flex-col md:flex-row items-start md:items-center justify-between p-5 cursor-pointer transition ${groupColorClass}`}
        onClick={onToggleOpen}
      >
        <div className="flex items-center gap-4 mb-3 md:mb-0">
          {isOpen ? <ChevronDown className="w-7 h-7 text-fuchsia-700" /> : <ChevronRight className="w-7 h-7 text-fuchsia-700" />}
          <div>
            <div className="font-extrabold text-2xl text-slate-800">{group}</div>
            <div className="text-sm text-slate-500 mt-0.5">{total} Total Permissions across {Object.keys(grouped[group] || {}).length} Subgroups</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-base font-bold text-fuchsia-600 flex items-center">
            {count}/{total} ({groupPercentage}%)
            {/* Progress Bar Mini-Display */}
            <div className="ml-3 w-16 h-2 bg-fuchsia-200 rounded-full overflow-hidden">
              <div
                className="bg-fuchsia-500 h-2 transition-all duration-300"
                style={{ width: `${groupPercentage}%` }}
              />
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleGroup(!allChecked); }}
            // Enhanced, two-state button style
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-md whitespace-nowrap ${allChecked ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-300/50" : "bg-fuchsia-600 text-white hover:bg-fuchsia-700 shadow-fuchsia-300/50"}`}
            title={allChecked ? `Deselect all ${total} actions in ${group}` : `Select all ${total} actions in ${group}`}
          >
            {allChecked ? "Deselect All" : "Select All"}
          </button>
        </div>
      </div>
    );
  };

  /* ------------------- JSX ------------------- */

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <ToastContainer theme="colored" />

      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
            <Users className="w-9 h-9 text-fuchsia-600" />
            RBAC Permissions Manager
          </h1>
          <p className="text-lg text-slate-500 mt-2">Assign granular access control by toggling resource actions for each role.</p>
        </header>

        <div className="bg-white rounded-3xl shadow-3xl border border-gray-100 overflow-hidden">
          {/* Role/Progress Header */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <RoleSelectorDropdown roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

            {selectedRole && (
              <div className="flex-1 min-w-0 bg-fuchsia-50/50 p-4 rounded-xl shadow-inner border border-fuchsia-100">
                <div className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full flex-shrink-0 ${selectedRoleColor} shadow-md`} />
                  <h2 className="text-2xl font-bold text-slate-800 truncate">{currentRoleName}</h2>
                </div>

                <div className="mt-3 w-full max-w-sm">
                  <p className="text-sm text-slate-600 font-semibold mb-1">{assignedCount} / {totalFeatures} Actions Assigned</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`${selectedRoleColor} h-3 rounded-full transition-all duration-500`} style={{ width: `${assignmentPercentage}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{assignmentPercentage}% Complete</p>
                </div>
              </div>
            )}
          </div>

          {/* Search and Action Bar */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search group / subgroup / page / action..."
                  className="pl-12 pr-4 py-3 border border-gray-300 rounded-full w-full outline-none focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-500 transition shadow-lg shadow-gray-100"
                />
              </div>

              {/* Add Page Button/Toggle */}
              <button
                onClick={() => setShowAddPageForm(!showAddPageForm)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg ${showAddPageForm ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-fuchsia-600 text-white hover:bg-fuchsia-700"}`}
              >
                {showAddPageForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {showAddPageForm ? "Cancel Add Page" : "Add New Page"}
              </button>
            </div>
            
            {/* Add Page Mini-Form - now collapsible */}
            <div className={`transition-all overflow-hidden duration-300 ease-in-out ${showAddPageForm ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0"}`}>
                <form onSubmit={handleAddPageSubmit} className="bg-fuchsia-50/50 p-6 rounded-xl border border-fuchsia-200 shadow-inner flex flex-wrap gap-4 items-center">
                    <input value={addPage.group} onChange={(e) => setAddPage((p) => ({ ...p, group: e.target.value }))} placeholder="Group (e.g., Finance)" className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-300 w-full sm:w-40" required />
                    <input value={addPage.subgroup} onChange={(e) => setAddPage((p) => ({ ...p, subgroup: e.target.value }))} placeholder="Subgroup (Optional)" className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-300 w-full sm:w-40" />
                    <input value={addPage.baseId} onChange={(e) => setAddPage((p) => ({ ...p, baseId: e.target.value }))} placeholder="Base ID (e.g., finance.reports)" className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-300 w-full sm:w-60" required />
                    <input value={addPage.label} onChange={(e) => setAddPage((p) => ({ ...p, label: e.target.value }))} placeholder="Label (e.g., Financial Reports)" className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-300 w-full sm:flex-1" required />
                    <button type="submit" className="flex items-center gap-2 px-4 py-2.5 bg-fuchsia-700 text-white rounded-lg hover:bg-fuchsia-800 transition shadow-md w-full sm:w-auto font-semibold">
                      <Plus className="w-4 h-4"/> Add Page (CRUD Default)
                    </button>
                </form>
            </div>

            {/* Permissions List */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {!selectedRole && (
                <div className="text-center text-fuchsia-400 py-20 bg-fuchsia-50/50 rounded-xl border border-fuchsia-200 shadow-inner">
                  <Users className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-medium text-xl">Please select a role to manage permissions.</p>
                </div>
              )}

              {selectedRole && Object.keys(grouped).length === 0 && search && (
                <div className="text-center text-slate-400 py-20">
                  <Search className="w-10 h-10 mx-auto mb-3" />
                  <p className="text-lg">No permissions match your search for "<b>{search}</b>"</p>
                </div>
              )}

              {selectedRole && Object.entries(grouped).map(([group, subgroups]) => {
                // compute assigned count and total for this group
                const allIdsInGroup = [];
                Object.values(subgroups).forEach((rs) => rs.forEach((r) => r.actions.forEach((a) => allIdsInGroup.push(`${r.baseId}.${a}`))));
                const assignedInGroup = allIdsInGroup.filter((id) => selectedAssignedSet.has(id)).length;
                
                return (
                  <div key={group} className="border border-gray-200 rounded-2xl shadow-xl transition-all duration-300">
                    <GroupHeader
                      group={group}
                      count={assignedInGroup}
                      total={allIdsInGroup.length}
                      isOpen={!!groupOpen[group]}
                      onToggleOpen={() => setGroupOpen((prev) => ({ ...prev, [group]: !prev[group] }))}
                      onToggleGroup={(checked) => toggleGroupAll(group, checked)}
                    />

                    <div className={`transition-all overflow-hidden ${groupOpen[group] ? "max-h-[5000px] opacity-100 duration-500" : "max-h-0 opacity-0 duration-300"}`}>
                      <div className="p-4 space-y-4">
                        {/* iterate subgroups */}
                        {Object.entries(subgroups).map(([subgroupName, resources]) => (
                          <div key={subgroupName} className="bg-white border border-gray-100 rounded-xl shadow-lg">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/70 rounded-t-xl">
                              <div className="font-extrabold text-lg text-slate-700">{subgroupName}</div>
                              <div className="text-xs text-slate-500 mt-1">{resources.length} Pages/Resources</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                              {resources.map((r) => <ResourceRow key={r.baseId} resource={r} />)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky actions (Clear, Save, Delete) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-top-2xl p-4 z-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-end items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => selectedRole && deleteRole(selectedRole)}
              disabled={!selectedRole || selectedRole === "admin"} // Prevent deleting 'admin' role
              className="p-3 text-red-600 bg-red-100 border border-red-300 rounded-full hover:bg-red-200 transition disabled:opacity-50 shadow-md"
              title={`Delete role: ${currentRoleName}. (Admin role cannot be deleted)`}
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <button
              onClick={clearRoleAssignments}
              disabled={!selectedRole || assignedCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-fuchsia-50 text-fuchsia-600 rounded-xl hover:bg-fuchsia-100 transition disabled:opacity-50 disabled:cursor-not-allowed border border-fuchsia-200 shadow-sm"
            >
              <X className="w-5 h-5" /> Clear All Permissions
            </button>

            <button
              onClick={savePermissions}
              disabled={!selectedRole}
              className="flex items-center gap-2 px-8 py-3.5 text-base font-extrabold bg-fuchsia-600 text-white rounded-xl shadow-2xl shadow-fuchsia-500/50 hover:bg-fuchsia-700 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              <Save className="w-5 h-5" /> Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}