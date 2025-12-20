// src/pages/AdvancedLoginLightEnhanced.jsx
import React, { useState } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiLogIn,
  FiUser 
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../assets/LoginImage.png";

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export default function AdvancedLoginLightEnhanced() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    unit: "", // <-- added unit
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Example units list — replace with API data if needed
  const units = [
    { id: "u1", name: "ABC Enterprises Pvt. Ltd." },
    { id: "u2", name: "XYZ Solutions & Services" },
    { id: "u3", name: "Global Imports Co." },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeedback({ type: "", message: "" });
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const simulateLogin = async () => {
    await new Promise((res) => setTimeout(res, 900));
    return (
      form.email === "test@example.com" &&
      form.password === "password123"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    // Validate unit selection
    if (!form.unit) {
      setFeedback({ type: "error", message: "Please select a Unit." });
      return;
    }

    if (!form.email || !form.password) {
      setFeedback({
        type: "error",
        message: "Please enter both email and password.",
      });
      return;
    }
    if (!validateEmail(form.email)) {
      setFeedback({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }
    if (form.password.length < 6) {
      setFeedback({
        type: "error",
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const ok = await simulateLogin();
      if (ok) {
        setFeedback({
          type: "success",
          message: "Login successful — redirecting...",
        });
        if (form.remember) localStorage.setItem("remember_email", form.email);
        // you can send form.unit along with credentials to backend
        console.log("Selected unit:", form.unit);
        setTimeout(() => navigate("/"), 700);
      } else {
        setFeedback({
          type: "error",
          message:
            "Invalid credentials. Try test@example.com / password123",
        });
      }
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        message: "Server error — please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* 🔥 Blue + Teal Glow Background (Option C) */}
      <div className="absolute inset-0 -z-10">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 25% 20%, rgba(17, 0, 255, 0.22), transparent 45%), \
               radial-gradient(circle at 80% 70%, rgba(13, 17, 11, 0.18), transparent 50%), \
               linear-gradient(to bottom right, #ffffffff, #0099ffff)"
          }}
        />

        {/* Subtle rupee watermark */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="rupattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <text
                x="6"
                y="44"
                fontSize="44"
                fill="rgba(15,23,42,0.05)"
                fontWeight="700"
              >
                ₹
              </text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rupattern)" />
        </svg>
      </div>

      {/* MAIN PAGE LAYOUT — Image & Form are now SEPARATE */}
      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6">

        {/* LEFT — IMAGE ONLY (separate & clean) */}
        <div className="flex justify-center md:justify-end">
  <img
    src={LoginImage}
    alt="GST Illustration"
    className="w-full max-w-[1000px] object-contain"
    style={{ background: "transparent" }}
  />
</div>


        {/* RIGHT — LOGIN FORM CARD */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 max-w-lg w-full mx-auto border border-slate-100">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-indigo-50 rounded-full p-3 mb-4">
              <FiCheckCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Welcome back
            </h1>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

           

            {/* EMAIL */}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">User ID</span>
              <div className="mt-1.5 relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-lg">
                  <FiUser />
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-lg"
                />
              </div>
            </label>

            {/* PASSWORD */}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <div className="mt-1.5 relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 text-lg">
                  <FiLock />
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-14 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </label>

             {/* UNIT SELECT */}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Select Unit</span>
              <div className="mt-1.5 relative">
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="w-full appearance-none pl-3 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-lg"
                >
                  <option value="">-- Choose Unit --</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                {/* small chevron could be added if desired */}
              </div>
            </label>

            {/* CTA BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-teal-500 text-white hover:from-indigo-700 hover:to-teal-600 shadow-lg flex items-center justify-center gap-3 text-lg"
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  <FiLogIn className="text-xl" /> Log in
                </>
              )}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}
