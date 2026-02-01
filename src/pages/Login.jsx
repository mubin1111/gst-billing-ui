import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import logoImage from "../assets/logoImage.png";
import LoginImage from "../assets/LoginImage.png";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative font-poppins bg-[#0F172A] overflow-hidden">

      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E40AF] to-[#3B82F6]" />
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-5%] right-[10%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-[1200px] grid lg:grid-cols-2 gap-8 xl:gap-12 px-6 items-center">

        {/* LEFT AREA — BRANDING + IMAGE */}
        <div className="hidden lg:flex flex-col text-white">

          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20  flex items-center justify-center p-2">
              <img src={logoImage} alt="Logo" className="w-full h-full object-contain invert" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
                ACTIVE<span className="text-orange-400">Cloud</span>
              </h1>
            </div>
          </div>

          {/* 3D Illustration — RESIZED + FLOATING */}
          <div className="relative">
            <img
              src={LoginImage}
              alt="GST Illustration"
              className="w-[420px] xl:w-[480px] drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
            />
            <div className="absolute -z-10 inset-0 bg-blue-500/20 blur-3xl"></div>
          </div>

        </div>

        {/* RIGHT AREA — LOGIN FORM */}
        <div className="flex flex-col items-center lg:items-end w-full">

          {/* CARD */}
          <div className="w-full max-w-[460px] bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] p-8 md:p-10 border border-white/30 relative">

            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="text-center mb-8">
              <div className="lg:hidden flex justify-center mb-4">
                <img src={logoImage} alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight font-poppins">System Login</h3>
              <p className="text-slate-400 text-[13px] mt-1 font-medium font-poppins">Secure Administrative Access</p>
            </div>

            <form className="space-y-6">
              <div className="relative border-b border-slate-200 focus-within:border-blue-500 transition-colors py-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-poppins font-semibold block mb-1">User Identity</span>
                <div className="flex items-center gap-3">
                  <FiMail className="text-slate-300" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="relative border-b border-slate-200 focus-within:border-blue-500 transition-colors py-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-poppins font-semibold block mb-1">Security Key</span>
                <div className="flex items-center gap-3">
                  <FiLock className="text-slate-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-poppins
    py-3 rounded-xl mt-14 shadow-md shadow-blue-500/20
    hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] 
    transition-all duration-200
    flex items-center justify-center gap-2 mt-2"
              >
                <span className="text-sm">Sign in </span>
                <FiArrowRight size={16} className="mt-0.5" />
              </button>
            </form>
            {/* FOOTER TEXT */}
            <div className="mt-10 relative">


            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="mt-8 text-center lg:text-right pr-4">
            <p className="text-white text-[9px] uppercase tracking-[0.4em] font-xl mb-1">
              © 2026 ABC Cloud Services
            </p>
            <div className="h-1 w-1 rounded-full bg-blue-400 inline-block animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
