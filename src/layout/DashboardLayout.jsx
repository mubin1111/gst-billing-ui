// src/layout/DashboardLayout.jsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

/* ---------------- react-icons imports ---------------- */
import { FiHome, FiFileText, FiSettings, FiSearch, FiChevronDown, FiChevronRight, FiChevronLeft, FiLogOut, FiUser, FiMenu } from "react-icons/fi";
import { IoIosArrowForward, IoMdArrowRoundForward } from "react-icons/io";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { RiBillLine } from "react-icons/ri";
import { SiExpensify } from "react-icons/si";
import { GrTransaction } from "react-icons/gr";
import { RiMastercardLine } from "react-icons/ri";

/* ---------------- ICON_MAP (react-icons components) ---------------- */
const ICON_MAP = {
  FiHome,
  FiFileText,
  FiSettings,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
  FiLogOut,
  IoIosArrowForward,
  IoMdArrowRoundForward,
  FiUser,
  DrawerToggle: FiMenu,
  Dashboard: RiDashboardHorizontalFill,
  Reports:TbReportAnalytics,
  Billing:RiBillLine,
  Expense:SiExpensify,
  Transaction:GrTransaction,
  Masters: RiMastercardLine
};

/* ---------------- initialMenu (same as before) ---------------- */
const initialMenu = [
  { key: "home", title: "Home", icon: "FiHome", path: "/" },
  { key: "dashboard", title: "Dashboard", icon: "Dashboard", path: "/dashboard" },
  {
    key: "masters",
    title: "Masters",
    icon: "Masters",
    children: [
      { key: "unit-company", title: "Unit Company Master", path: "/unit-company" },
      { key: "item-master", title: "Item Master", path: "/item-master" },
      { key: "customer-master", title: "Customer Master", path: "/customer-master" },
      { key: "supplier-master", title: "Supplier Master", path: "/supplier-master" },
      { key: "employee-master", title: "Employee Master", path: "/employee-master" },
      { key: "designation-master", title: "Designation Master", path: "/designation-master" },
      { key: "qualification-master", title: "Qualification Master", path: "/qualification-master" },
      { key: "city-master", title: "City Master", path: "/city-master" },
      { key: "expenses-master", title: "Expenses Master", path: "/expenses-master" },
      { key: "role-master", title: "Role Master", path: "/role-master" },
      { key: "user-master", title: "User Master", path: "/user-master" },
      { key: "functionality-master", title: "Functionality Master", path: "/functionality-master" },
      { key: "department-master", title: "Department Master", path: "/department-master" },
      { key: "dashboard-master", title: "Dashboard Master", path: "/dashboard-master" },
      { key: "gst-master", title: "GST Master", path: "/gst-master" },
      { key: "itemunit-master", title: "Item Unit Master", path: "/itemunit-master" },
      { key: "hsn-master", title: "HSN Master", path: "/hsn-master" },
      { key: "transport-master", title: "Transport Master", path: "/transport-master" },
      { key: "bank-master", title: "Bank Master", path: "/bank-master" },
      { key: "financialyear-master", title: "Financial Year Master", path: "/financialyear-master" },
      { key: "paymentmode-master", title: "Payment Mode Master", path: "/paymentmode-master" },
      { key: "state-master", title: "State Master", path: "/state-master" },
      { key: "termsandcondition-master", title: "Terms & Condition Master", path: "/termsandcondition-master" },
      { key: "country-master", title: "Country Master", path: "/country-master" }
    ],
  },

  // purchase group
  {
    key: "purchase",
    title: "Purchase",
    icon: "FiFileText",
    children: [
      { key: "asset-purchase", title: "Asset Purchase", path: "/asset-purchase" },
      { key: "purchase-return", title: "Purchase Return", path: "/purchase-return" },
      { key: "purchase-stock", title: "Purchase Stock", path: "/purchase-stock" },
    ],
  },

  // billing group
  {
    key: "billing",
    title: "Billing",
    icon: "Billing",
    children: [
      { key: "billing", title: "Billing", path: "/billing" },
      { key: "return-billing", title: "Billing Return", path: "/return-billing" },
    ],
  },

  // transactions
  {
    key: "transactions",
    title: "Transactions",
    icon: "Transaction",
    children: [
      { key: "bill-transaction", title: "Billing Transaction", path: "/bill-transaction" },
      { key: "purchase-transaction", title: "Purchase Transaction", path: "/purchase-transaction" },
    ],
  },

  // Expenses
  {
    key: "expenses",
    title: "Expenses",
    icon: "Expense",
    children: [
      { key: "daily-expenses", title: "Daily Expenses", path: "/daily-expenses" },
      { key: "employee-expenses", title: "Employee Expenses", path: "/employee-expenses" },
    ],
  },

  // Reports (nested)
  {
    key: "reports",
    title: "Reports",
    icon: "Reports",
    children: [
      {
        key: "reports-purchase",
        title: "Purchase Report",
        children: [
          { key: "assetpurchase-report", title: "Asset Purchase Report", path: "assetpurchase-report" },
          { key: "purchase-report", title: "Purchase Report", path: "purchase-report" },
          { key: "purchasereturn-report", title: "Purchase Return Report", path: "purchasereturn-report" },
        ],
      },
      // 	Stock report
      {
        key: "reports-stock",
        title: "Stock Report",
        children: [
          { key: "stock-report", title: "Stock Report", path: "stock-report" },
          { key: "finalstock-report", title: "Final Stock Report", path: "finalstock-report" },

        ],
      },

      // Billing report
      {
        key: "bill-report",
        title: "Billing Report",
        children: [
          { key: "bill-report", title: "Billing Report", path: "bill-report" },
          { key: "billreturn-report", title: "Bill Return Report", path: "billreturn-report" },

        ],
      },
    ],
  },

  { key: "setting", title: "Setting", icon: "FiSettings", path: "/setting-functionality" },
  { key: "assign", title: "Assign Functionality", icon: "FiSettings", path: "/assign-functionality" },
];

/* ---------------- DashboardLayout ---------------- */
const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [menu, setMenu] = useState(initialMenu);
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const logoutRef = useRef(null);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const userName = "Mubin Mutwalli";
  const userRole = "Administrator";
  const userInitial = userName.charAt(0).toUpperCase();

  // --- theme classes (you can swap with dynamic values later) ---
  const activeBarClasses = "bg-sky-500";
  const activeIconClasses = "text-sky-700";
  const activeClasses = "bg-sky-100/90 text-sky-900 ring-2 ring-sky-300/80 shadow-md shadow-sky-200/50";
  const hoverClasses = "hover:bg-slate-50/90 text-slate-800 hover:text-sky-800 hover:shadow-[0_8px_30px_rgba(148,163,184,0.35)]";
  const defaultIconClasses = "text-slate-400 group-hover:text-sky-600 bg-slate-100 group-hover:bg-sky-50/70";

  const greeting = useCallback(() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // toggle expand groups
  const toggleGroup = useCallback((key) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const isExpanded = useCallback((key) => expandedGroups.has(key), [expandedGroups]);

  const addMasterToGroup = useCallback((child, groupKey = "masters") => {
    if (!child || !child.key || !child.title || !child.path) {
      console.warn("gstAddMaster: invalid child object. Expected { key, title, path }. Received:", child);
      return;
    }
    setMenu((prev) => {
      const exists = prev.some((g) => g.children && g.children.some((c) => c.key === child.key || c.path === child.path));
      if (exists) return prev;
      let found = false;
      const next = prev.map((g) => {
        if (g.key === groupKey) { found = true; return { ...g, children: [...(g.children || []), child] }; }
        return g;
      });
      if (!found) next.push({ key: groupKey, title: groupKey.charAt(0).toUpperCase() + groupKey.slice(1), icon: "FiFileText", children: [child] });
      return next;
    });
    setExpandedGroups((prev) => new Set(prev).add(groupKey));
    window.dispatchEvent(new CustomEvent("gst:masters-updated", { detail: { child, groupKey } }));
  }, []);

  useEffect(() => {
    window.gstAddMaster = (child) => addMasterToGroup(child, "masters");
    window.gstDumpMenu = () => console.log("menu:", menu);
    const onCustom = () => { };
    window.addEventListener("gst:masters-updated", onCustom);
    return () => {
      try { delete window.gstAddMaster; } catch (e) { }
      try { delete window.gstDumpMenu; } catch (e) { }
      window.removeEventListener("gst:masters-updated", onCustom);
    };
  }, [addMasterToGroup, menu]);

  // time/date updater
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));
      setCurrentDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" }));
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  // active title detection
  const activePageTitle = useMemo(() => {
    let title = "GST App";
    const walk = (arr) => {
      for (const it of arr) {
        if (it.path && location.pathname === it.path) { title = it.title; return true; }
        if (it.children) {
          if (walk(it.children)) return true;
        }
      }
      return false;
    };
    walk(menu);
    return title;
  }, [location.pathname, menu]);

  // filtered menu for search
  const filteredMenu = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return menu;
    return menu
      .map((item) => {
        if (!item.children) {
          if (item.title.toLowerCase().includes(q)) return item;
          return null;
        }
        const groupTitleMatch = item.title.toLowerCase().includes(q);
        const matchedChildren = item.children.filter((child) => {
          if (child.title.toLowerCase().includes(q)) return true;
          if (child.children) {
            const matchedGrand = child.children.filter(g => g.title.toLowerCase().includes(q));
            if (matchedGrand.length) return true;
          }
          return false;
        });
        if (groupTitleMatch) return { ...item, children: item.children };
        if (matchedChildren.length > 0) return { ...item, children: matchedChildren };
        return null;
      })
      .filter(Boolean);
  }, [searchTerm, menu]);

  // stricter isActive
  const isActive = useCallback((path) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  }, [location.pathname]);

  // find parent keys for route
  const findParentKeysForPath = useCallback((menuArr, path, parents = []) => {
    for (const it of menuArr) {
      if (it.path && (it.path === path || path.startsWith(it.path + "/"))) return parents;
      if (it.children) {
        for (const child of it.children) {
          if (child.path && (child.path === path || path.startsWith(child.path + "/"))) {
            return [...parents, it.key];
          }
          if (child.children) {
            const deeper = findParentKeysForPath([child], path, [...parents, it.key]);
            if (deeper) return deeper;
          }
        }
      }
    }
    return null;
  }, []);

  // open parents on route change
  useEffect(() => {
    const parents = findParentKeysForPath(menu, location.pathname);
    if (parents && parents.length) {
      setExpandedGroups((prev) => {
        const next = new Set(prev);
        parents.forEach(k => next.add(k));
        return next;
      });
    }
  }, [location.pathname, menu, findParentKeysForPath]);

  useEffect(() => {
    const onDocClick = (e) => { if (logoutRef.current && !logoutRef.current.contains(e.target)) setLogoutOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogout = () => { setLogoutOpen(false); navigate("/login"); };

  /* ----------------- recursive renderer ----------------- */
  const renderMenuItemRecursive = (item, depth = 0) => {
    const Icon = ICON_MAP[item.icon];
    const isSearching = searchTerm.trim().length > 0;

    const subtreeHasActive = (node) => {
      if (!node) return false;
      if (node.path && isActive(node.path)) return true;
      if (node.children) return node.children.some(c => subtreeHasActive(c));
      return false;
    };

    const isGroup = !!(item.children && item.children.length > 0);
    const groupActive = isGroup ? subtreeHasActive(item) : isActive(item.path);
    const expanded = isGroup ? (isSearching ? true : isExpanded(item.key)) : false;

    const padLeft = 16 + depth * 14;
    const activeBarLeft = 8 + depth * 14;
    const isSubgroup = depth > 0 && isGroup;

    if (!isGroup) {
      const active = groupActive;
      return (
        <Link
          key={item.key}
          to={item.path}
          title={!open ? item.title : undefined}
          className={`group relative flex items-center transition-all duration-200 ${open ? "gap-3 py-2.5" : "justify-center p-2.5"} rounded-xl my-0.5 cursor-pointer ${active ? activeClasses : hoverClasses + " bg-white/90"}`}
          style={{ paddingLeft: open ? `${padLeft}px` : undefined, paddingRight: 12 }}
        >
          <span
            className={`absolute top-2 bottom-2 rounded-r-xl origin-center transition-transform duration-300 ${active ? "scale-y-100" : "scale-y-0"} ${activeBarClasses}`}
            style={{ width: 6, left: `${activeBarLeft}px` }}
          />
          <div className={`flex items-center justify-center rounded-lg border border-slate-200/80 transition-all duration-200 ${active ? `${activeIconClasses} bg-sky-50` : defaultIconClasses} w-8 h-8 flex-shrink-0`}>
            {Icon ? <Icon className="w-4 h-4 bg-white" /> : <FiFileText className="w-4 h-4" />}
          </div>
          {open && <span className={`text-sm font-medium truncate ml-2 ${active ? "text-slate-900" : "text-slate-700"}`}>{item.title}</span>}
          {!open && <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-900 text-white text-xs opacity-0 group-hover:opacity-100 shadow-lg whitespace-nowrap z-30">{item.title}</span>}
        </Link>
      );
    }

    return (
      <div key={item.key} className="group relative">
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); !isSearching && toggleGroup(item.key); } }}
          onClick={() => !isSearching && toggleGroup(item.key)}
          aria-expanded={expanded}
          className={`flex items-center transition-all duration-200 relative ${open ? "gap-3 py-2.5" : "justify-center p-2.5"} rounded-xl my-0.5 cursor-pointer ${groupActive || expanded ? activeClasses : "bg-white/90 " + hoverClasses + " text-slate-700"}`}
          style={{ paddingLeft: open ? `${padLeft}px` : undefined, paddingRight: 12 }}
        >
          <span
            className={`absolute top-2 bottom-2 rounded-r-xl origin-center transition-transform duration-300 ${groupActive ? "scale-y-100" : "scale-y-0"} ${activeBarClasses}`}
            style={{ width: 6, left: `${activeBarLeft}px` }}
          />
          <div className={`flex items-center justify-center rounded-lg border border-slate-200/80 transition-all duration-200 ${groupActive || expanded ? `${activeIconClasses} bg-sky-50` : defaultIconClasses} w-8 h-8 flex-shrink-0`}>
            {Icon ? <Icon className="w-5 h-5 text-blue-900" /> : <FiFileText className="w-4 h-4" />}
          </div>

          {open && (
            <div className="flex justify-between w-full items-center">
              <div className="flex items-center gap-2">
                {isSubgroup ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-sky-700/90 ">{item.title}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`text-sm  truncate ${groupActive || expanded ? "text-slate-900" : "text-slate-700"}`}>{item.title}</span>
                  </div>
                )}
              </div>
              {expanded ? <FiChevronDown className="w-4 h-4 text-slate-500" /> : <FiChevronRight className="w-4 h-4 text-slate-500" />}
            </div>
          )}

          {!open && <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-900 text-white text-xs opacity-0 group-hover:opacity-100 shadow-lg whitespace-nowrap z-30">{item.title}</span>}
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "opacity-100 pt-1" : "max-h-0 opacity-0"}`}>
          <div className={`py-1 ${open ? "pl-2 border-l border-sky-200/60 relative pb-3" : "hidden"}`}>
            <div className="space-y-0.5">
              {item.children.map((child) => renderMenuItemRecursive(child, depth + 1))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 text-slate-800 font-sans">
      <style>{`
        .drawer-scrollbar::-webkit-scrollbar { width: 6px; }
        .drawer-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .drawer-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 999px; }
        .drawer-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.2) transparent; }
        .min-w-0 { min-width: 0; }
      `}</style>

      {/* SIDEBAR */}
      <aside className={`relative transition-all duration-300 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 shadow-2xl shadow-sky-900/8 flex flex-col z-20 h-full min-h-screen ${open ? "w-72 max-w-xs" : "w-20"} shrink-0`}>
        <div className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 rounded-r-full ${activeBarClasses}`} />

        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200/80 shrink-0">
          {open && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl text-white flex items-center justify-center font-extrabold text-xl shadow`}>G</div>
              </div>
              <div className="leading-tight">
                <div className="text-base font-extrabold text-slate-900 tracking-tight">GST Console</div>
                <p className="text-xs text-slate-500">Compliance &amp; Billing Hub</p>
              </div>
            </div>
          )}

          <button
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setOpen((v) => !v)}
            className="ml-auto p-1.5 rounded-full border border-slate-200 bg-white hover:bg-sky-50/70 text-slate-500 hover:text-sky-600 shadow-md transition"
            title={open ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {open ? <FiChevronLeft className="w-4 h-4" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 sticky top-0 z-10 shrink-0">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                placeholder="Search menu..."
                className="bg-white border border-slate-300 pl-10 pr-4 py-2 rounded-lg w-full text-sm placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none transition shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search masters or invoices"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 drawer-scrollbar overflow-y-auto min-w-0" aria-label="Main navigation">
          <div className="px-3 pb-6 pt-1 space-y-1">
            {filteredMenu.map((item) => renderMenuItemRecursive(item))}
          </div>
        </nav>

        {open && (
          <div className="px-4 py-3 border-t border-slate-200/80 text-[11px] text-slate-500 bg-white/90 shrink-0">
            <div className="flex items-center justify-between"><span>GST App • v1.0.0</span></div>
          </div>
        )}
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className={`flex items-center justify-between gap-4 bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 border-b border-sky-900/40 px-4 md:px-6 py-3 shadow text-white h-16 shrink-0`}>
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2"><span className="text-sm md:text-base font-semibold tracking-tight truncate">{activePageTitle}</span></div>
          </div>

          <div className="flex items-center gap-5 ml-auto">
            <div className="hidden sm:flex items-center gap-3 text-right">
              <div className="flex flex-col items-end">
                <span className="text-[11px] uppercase tracking-wide text-sky-200/80">Date</span>
                <span className="text-xs md:text-sm font-medium text-white/95">{currentDate}</span>
              </div>
              <div className="h-8 w-px bg-sky-700/60 hidden md:block" />
              <div className="flex flex-col items-end">
                <span className="text-[11px] uppercase tracking-wide text-sky-200/80">Time</span>
                <span className="text-xs md:text-sm font-semibold text-emerald-200">{currentTime}</span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col text-right leading-tight text-white border-l border-sky-700/70 pl-4">
              <p className="font-semibold text-sm md:text-base truncate">{userName}</p>
              <span className="text-[11px] text-sky-200 font-medium">{userRole}</span>
            </div>

            <div className="relative" ref={logoutRef}>
              <button onClick={() => setLogoutOpen((v) => !v)} className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-400 text-white flex items-center justify-center cursor-pointer text-lg shadow-md hover:shadow-lg hover:scale-[1.03] transition duration-150 shrink-0 font-semibold" title="User Menu">{userInitial}</button>

              {logoutOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-xl shadow-xl bg-white border border-slate-100 z-30 origin-top-right transform transition-all duration-150">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/60 rounded-t-xl">
                    <p className="font-bold text-slate-900 truncate">{userName}</p>
                    <p className="text-xs text-sky-600 font-semibold">{userRole}</p>
                    <p className="text-xs text-slate-500 mt-1">{greeting()}, {userName.split(" ")[0]}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition" onClick={() => setLogoutOpen(false)}>
                      <FiUser className="w-4 h-4" />
                      View Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition mt-1 rounded-b-xl">
                      <FiLogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-gradient-to-b from-slate-50/80 to-slate-100 overflow-y-auto min-w-0">
          <div className="max-w-full xl:max-w-7xl mx-auto min-w-0">
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-sm shadow-sm p-3 md:p-4 min-w-0">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
