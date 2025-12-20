// src/pages/GstDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  CreditCard,
  Target,
  Clock,
  AlertTriangle,
  BarChart,
  PieChart,
  ClipboardList,
  UploadCloud,
  ArrowRight,
  Calendar,
  Eye,
} from "lucide-react";

// Recharts
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ----------------- Data & Colors ----------------- */

const PRIMARY_TEAL = "#0A6E8A";
const JADE_GREEN = "#00CC99";
const SOFT_CORAL = "#E04F5E";
const GOLD_YELLOW = "#FFC300";

const gstKpis = [
  {
    icon: Target,
    title: "Compliance Score",
    value: "A+",
    color: `text-[${JADE_GREEN}]`,
    sub: "92% Accuracy Rating",
  },
  {
    icon: DollarSign,
    title: "Net Liability (₹)",
    value: "1,25,00,000",
    color: `text-[${PRIMARY_TEAL}]`,
    sub: "Due Dec 20, 2025",
  },
  {
    icon: CreditCard,
    title: "ITC Available (₹)",
    value: "87,50,000",
    color: "text-sky-600",
    sub: "Mismatch Risk: 5.4%",
  },
  {
    icon: Clock,
    title: "Next Filing Deadline",
    value: "GSTR-3B",
    color: `text-[${SOFT_CORAL}]`,
    sub: "5 Days Remaining",
  },
];

const taxDistributionData = [
  { name: "IGST", value: 55, color: PRIMARY_TEAL },
  { name: "CGST", value: 25, color: JADE_GREEN },
  { name: "SGST", value: 20, color: GOLD_YELLOW },
  { name: "CESS", value: 5, color: SOFT_CORAL },
];
const TAX_COLORS = taxDistributionData.map((d) => d.color);

const itcReconciliationData = [
  { name: "Matched ITC", value: 94.6, color: JADE_GREEN },
  { name: "Mismatched/Blocked", value: 3.1, color: SOFT_CORAL },
  { name: "Unclaimed/Pending", value: 2.3, color: GOLD_YELLOW },
];
const ITC_COLORS = itcReconciliationData.map((d) => d.color);

const historicalTrendData = [
  { month: "Jul", onTime: 8, late: 2 },
  { month: "Aug", onTime: 9, late: 1 },
  { month: "Sep", onTime: 7, late: 3 },
  { month: "Oct", onTime: 10, late: 0 },
  { month: "Nov", onTime: 9, late: 1 },
  { month: "Dec", onTime: 8, late: 2 },
];

/* ----------------- Small UI helpers ----------------- */

const MetricProgressBar = ({ value, label, colorClass }) => (
  <div className="mb-2">
    <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
      <span>{label}</span>
      <span className="font-semibold">{value}%</span>
    </div>
    <div className="w-full bg-slate-200/70 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-2.5 rounded-full ${colorClass}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const AnalyticalCard = ({
  title,
  icon,
  children,
  iconColor = `text-[${PRIMARY_TEAL}]`,
  className = "",
}) => (
  <div
    className={`p-6 bg-white rounded-3xl border border-slate-100 shadow-2xl hover:shadow-3xl transition-shadow duration-300 shadow-slate-200/50 ${className}`}
  >
    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
      <div
        className={`p-3 rounded-xl ${iconColor} bg-gradient-to-br from-indigo-50 to-emerald-100 shadow-md`}
      >
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <h4 className="text-base font-bold text-slate-900 tracking-tight">
        {title}
      </h4>
    </div>
    {children}
  </div>
);

/* ----------------- Charts ----------------- */

const CustomPieChart = ({ data, colors, title }) => (
  <ResponsiveContainer width="100%" height={240}>
    <RechartsPieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        labelLine={false}
        label={({ name, percent }) =>
          `${name}: ${(percent * 100).toFixed(0)}%`
        }
        // --- ANIMATION IMPLEMENTATION ---
        isAnimationActive={true}
        animationDuration={800}
        animationEasing="ease-in-out"
        // ----------------------------------
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]}
            stroke="#E5E7EB"
          />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name) => [
          title === "ITC" ? `${value}%` : `${value} %`,
          name,
        ]}
      />
      <Legend
        layout="horizontal"
        align="center"
        verticalAlign="bottom"
        wrapperStyle={{ paddingTop: 8 }}
      />
    </RechartsPieChart>
  </ResponsiveContainer>
);

const CustomBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    {/* --- ANIMATION IMPLEMENTATION on RechartsBarChart --- */}
    <RechartsBarChart
      data={data}
      margin={{ top: 20, right: 24, left: 0, bottom: 4 }}
      isAnimationActive={true}
      animationDuration={800}
      animationEasing="ease-in-out"
    >
    {/* ---------------------------------- */}
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis dataKey="month" stroke="#6B7280" />
      <YAxis
        stroke="#6B7280"
        label={{
          value: "Filings",
          angle: -90,
          position: "insideLeft",
          fill: "#6B7280",
        }}
      />
      <Tooltip />
      <Legend />
      <Bar dataKey="onTime" stackId="a" fill={PRIMARY_TEAL} name="On-Time" />
      <Bar dataKey="late" stackId="a" fill={SOFT_CORAL} name="Late" />
    </RechartsBarChart>
  </ResponsiveContainer>
);

/* ----------------- Main Component ----------------- */

export default function GstDashboard() {
  const handleComplianceCheck = () => {
    alert(
      "Launching Cross-Return Validation Engine: GSTR-1 vs 3B vs 2B Mismatch Report."
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(circle_at_top,#e3f2fd_0,transparent_50%)] px-4 py-6 md:px-8 lg:px-10 lg:py-10 font-sans">
      {/* HEADER */}
      <header className="mb-8 md:mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-sky-500 font-semibold mb-1">
            Dashboard Overview
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-sky-600" />
            <span>GST Compliance Console</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl">
            Live snapshot of your GST filings, ITC reconciliation and notices –{" "}
            <span className="font-semibold text-slate-700">
              all in one powerful view.
            </span>
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full bg-[${JADE_GREEN}/10] px-3 py-1 text-xs font-medium text-[${JADE_GREEN}] border border-[${JADE_GREEN}/30]`}>
              <span className={`w-2 h-2 rounded-full bg-[${JADE_GREEN}] animate-pulse`} />
              Risk Level: Low
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 border border-sky-100">
              <Calendar className="w-3.5 h-3.5" />
              Period: FY 2025-26
            </span>
          </div>
          <div className="text-[11px] text-slate-500 bg-white/80 border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
            Last verified: <span className="font-semibold">Dec 8, 2025</span>{" "}
            • System status:{" "}
            <span className={`text-[${JADE_GREEN}] font-semibold`}>Operational</span>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-10">
        {gstKpis.map((kpi, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-3xl bg-white/95 border border-slate-100 shadow-lg hover:shadow-xl shadow-blue-100/70 transition-shadow duration-300"
          >
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 via-sky-50 to-transparent opacity-90" />
            <div className="p-5 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  {kpi.title}
                </p>
                <div className="p-2 rounded-xl bg-slate-50">
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {kpi.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
              <button
                className={`${kpi.color} mt-3 text-[12px] font-bold inline-flex items-center gap-1.5 hover:underline`}
              >
                View details
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* MAIN ANALYTICS ROW */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
        {/* Action Card */}
        <div className="lg:col-span-1">
          <div className={`h-full p-7 rounded-2xl bg-gradient-to-br from-[${PRIMARY_TEAL}] via-[#103E5E] to-slate-900 text-white shadow-[0_20px_55px_rgba(10,110,138,0.6)] flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-sky-200 mb-3">
                <UploadCloud className="w-4 h-4" />
                Automated Checks
              </div>
              <h3 className="text-2xl font-extrabold leading-snug mb-2">
                Cross-Return Mismatch Analysis
              </h3>
              <p className="text-sm text-sky-200/90 mb-5">
                Instantly compare GSTR-1, 3B and 2B to detect supplier and
                outward invoice mismatches before notices are issued.
              </p>
              <ul className="text-xs text-sky-200/90 space-y-1.5 mb-4">
                <li>• Section-wise variance heatmap</li>
                <li>• Counterparty-wise ITC risk bucket</li>
                <li>• Download-ready Excel reconciliation</li>
              </ul>
            </div>

            <button
              onClick={handleComplianceCheck}
              className={`mt-2 w-full px-6 py-3 bg-white text-[${PRIMARY_TEAL}] font-extrabold text-sm rounded-xl shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-2 hover:bg-sky-50 active:scale-[0.98] transition`}
            >
              <BarChart className="w-4 h-4" />
              Run Compliance Check
            </button>
          </div>
        </div>

        {/* ITC Reconciliation + Metrics */}
        <div className="lg:col-span-2">
          <AnalyticalCard
            title="Monthly ITC Reconciliation (GSTR-3B vs 2B)"
            icon={<PieChart />}
            iconColor={`text-[${JADE_GREEN}]`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 border-r border-slate-100 pr-0 md:pr-4">
                <CustomPieChart
                  data={itcReconciliationData}
                  colors={ITC_COLORS}
                  title="ITC"
                />
              </div>
              <div className="md:col-span-1 flex flex-col justify-center">
                <p className="text-[11px] font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                  Match quality
                </p>
                <MetricProgressBar
                  value={94.6}
                  label="ITC Matched (Auto-populated)"
                  colorClass={`bg-[${JADE_GREEN}]`}
                />
                <MetricProgressBar
                  value={3.1}
                  label="Mismatched / Blocked (Action)"
                  colorClass={`bg-[${SOFT_CORAL}]`}
                />
                <MetricProgressBar
                  value={2.3}
                  label="Unclaimed / Pending (Follow-up)"
                  colorClass={`bg-[${GOLD_YELLOW}]`}
                />
                <p className="text-[11px] text-slate-500 mt-4">
                  Overall match rate:{" "}
                  <span className={`font-semibold text-[${JADE_GREEN}]`}>
                    94.6%
                  </span>{" "}
                  &nbsp;|&nbsp; Target &gt; 95%
                </p>
              </div>
            </div>
          </AnalyticalCard>
        </div>
      </section>

      {/* SECONDARY ANALYTICS ROW */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Tax distribution */}
        <AnalyticalCard
          title="Tax Liability Component Split"
          icon={<DollarSign />}
          iconColor={`text-[${PRIMARY_TEAL}]`}
        >
          <CustomPieChart
            data={taxDistributionData}
            colors={TAX_COLORS}
            title="Tax"
          />
        </AnalyticalCard>

        {/* Filing trend */}
        <div className="lg:col-span-2">
          <AnalyticalCard
            title="Historical Filing Timeliness (Last 6 Months)"
            icon={<BarChart />}
            iconColor="text-indigo-600"
          >
            <CustomBarChart data={historicalTrendData} />
          </AnalyticalCard>
        </div>
      </section>

      {/* ACTION ITEMS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-8">
        <AnalyticalCard
          title="Action Required: Notices & Alerts"
          icon={<AlertTriangle />}
          iconColor={`text-[${SOFT_CORAL}]`}
        >
          <ul className="text-sm space-y-3">
            <li className={`flex justify-between items-center p-3.5 bg-[${SOFT_CORAL}/5] rounded-xl border border-[${SOFT_CORAL}/40] hover:bg-rose-100 transition`}>
              <span className={`font-semibold text-[${SOFT_CORAL}] flex items-center gap-2`}>
                <Eye className="w-4 h-4" />
                SCN issued: GSTR-9 turnover / tax mismatch
              </span>
              <Link
                to="#"
                className={`text-xs text-[${PRIMARY_TEAL}] font-semibold hover:underline`}
              >
                Reply now
              </Link>
            </li>
            <li className={`flex justify-between items-center p-3.5 bg-[${GOLD_YELLOW}/5] rounded-xl border border-[${GOLD_YELLOW}/40] hover:bg-amber-100 transition`}>
              <span className={`font-semibold text-[${GOLD_YELLOW}]/90 flex items-center gap-2`}>
                <Eye className="w-4 h-4" />
                ITC reconciliation reminder (October)
              </span>
              <Link
                to="#"
                className={`text-xs text-[${PRIMARY_TEAL}] font-semibold hover:underline`}
              >
                View GSTR-2B
              </Link>
            </li>
          </ul>
        </AnalyticalCard>

        <AnalyticalCard
          title="Upcoming Compliance Calendar"
          icon={<Calendar />}
          iconColor="text-sky-600"
        >
          <ul className="text-sm space-y-3">
            <li className="flex justify-between items-center p-3.5 bg-sky-50 rounded-xl border border-sky-200">
              <span className="font-medium text-slate-700">
                GSTR-3B (November)
              </span>
              <span className={`text-[${SOFT_CORAL}] font-extrabold text-sm`}>
                Dec 20
              </span>
            </li>
            <li className="flex justify-between items-center p-3.5 bg-sky-50 rounded-xl border border-sky-200">
              <span className="font-medium text-slate-700">
                TDS / TCS return (November)
              </span>
              <span className="text-slate-900 font-extrabold text-sm">
                Dec 25
              </span>
            </li>
          </ul>
        </AnalyticalCard>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 text-center text-xs text-slate-500 pt-6 border-t border-slate-200">
        GST Compliance Console • Data integrity reviewed by{" "}
        <span className="font-semibold text-slate-700">[Firm Name]</span>.
      </footer>
    </div>
  );
}