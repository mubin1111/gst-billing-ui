import React, { useState } from 'react';
import { 
  FiPlus, FiSliders, FiCheck, FiX, FiShield, 
  FiBriefcase, FiShoppingCart, FiBarChart, FiSettings, FiUser
} from 'react-icons/fi';

const AssignFunctionalityV3 = () => {
  const [selectedRole, setSelectedRole] = useState("Accountant");
  const [activeConfig, setActiveConfig] = useState(null); // To track which "Box" is open

  // Structure: Only show main categories as cards
  const modules = [
    { id: 'masters', title: 'Masters', icon: <FiBriefcase />, color: 'bg-blue-600', count: 24 },
    { id: 'purchase', title: 'Purchase', icon: <FiShoppingCart />, color: 'bg-purple-600', count: 3 },
    { id: 'billing', title: 'Billing', icon: <FiCheck />, color: 'bg-emerald-600', count: 6 },
    { id: 'reports', title: 'Reports', icon: <FiBarChart />, color: 'bg-orange-600', count: 12 },
    { id: 'settings', title: 'Settings', icon: <FiSettings />, color: 'bg-rose-600', count: 8 },
  ];

  const roles = ["Administrator", "Accountant", "Store Manager", "Salesman"];

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6 lg:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Role Permissions.</h1>
            <p className="text-slate-500 font-medium mt-1">Select a role and configure specific module access.</p>
          </div>
          
          {/* Role Pill Selector */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
            {roles.map(role => (
              <button 
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${selectedRole === role ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* --- Card Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod) => (
            <div 
              key={mod.id}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden"
              onClick={() => setActiveConfig(mod)}
            >
              <div className={`${mod.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200`}>
                {mod.icon}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{mod.title}</h3>
              <p className="text-sm text-slate-400 font-medium">{mod.count} functions available</p>
              
              <div className="mt-8 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">Configure Access</span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <FiPlus />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- THE OPTIONS BOX (Overlay/Modal) --- */}
        {activeConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setActiveConfig(null)} />
            
            {/* Options Box */}
            <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className={`${activeConfig.color} p-8 text-white flex justify-between items-center`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    {activeConfig.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">{activeConfig.title} Settings</h2>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Applying to: {selectedRole}</p>
                  </div>
                </div>
                <button onClick={() => setActiveConfig(null)} className="p-3 hover:bg-white/20 rounded-full transition-all">
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {/* Individual Permission Toggles */}
                {['Create New Entries', 'Edit Existing Records', 'Delete Permission', 'Export to Excel', 'Bulk Upload'].map((option, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-blue-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                        <FiShield size={18} />
                      </div>
                      <span className="font-bold text-slate-700">{option}</span>
                    </div>
                    
                    {/* Switch Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                      <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="p-8 border-t border-slate-50 flex gap-4">
                <button 
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                  onClick={() => setActiveConfig(null)}
                >
                  Confirm Permissions
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AssignFunctionalityV3;