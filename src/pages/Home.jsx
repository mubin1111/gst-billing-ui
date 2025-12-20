// src/pages/Home.jsx
import React, { useMemo } from "react";
import heroImage from "../assets/homePageImage.png"; // 👉 yahi wali image use ho rahi hai

// Time-based greeting
const getGreeting = () => {
  const hr = new Date().getHours();
  if (hr < 12) return "Good Morning";
  if (hr < 17) return "Good Afternoon";
  return "Good Evening";
};

const Home = () => {
  const greeting = useMemo(() => getGreeting(), []);
  const userName = "Mubin";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
        {/* LEFT: Text / CTA */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            {greeting},{" "}
           
          </h1>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span className="bg-sky-100 text-sky-700 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium">
              Smart GST Billing
            </span>
            <span className="bg-emerald-100 text-emerald-700 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium">
              Real-time Reports
            </span>
            <span className="bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium">
              Easy Compliance
            </span>
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className="flex justify-center md:justify-end">
          <img
            src={heroImage}
            alt="GST Billing Console"
            className="w-full max-w-md sm:max-w-lg lg:max-w-xl drop-shadow-2xl rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
