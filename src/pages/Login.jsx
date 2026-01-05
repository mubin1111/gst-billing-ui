import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-sky-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        
        {/* LEFT SIDE: Brand/Marketing */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-900 text-white relative">
          <div className="z-10">
            <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg mb-8">G</div>
            <h1 className="text-4xl font-bold leading-tight mb-4 text-white">
              The Intelligent <br /> 
              <span className="text-sky-400 font-extrabold underline decoration-sky-500/30 underline-offset-8">GST Solution</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-sm">
              Simplifying compliance, billing, and financial reporting for modern enterprises.
            </p>
          </div>

          <div className="z-10 space-y-6">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <FiCheckCircle size={20} />
              </div>
              <p className="text-sm text-slate-200">Real-time GSTR-1 & 3B Auto-generation</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <FiShield size={20} />
              </div>
              <p className="text-sm text-slate-200">ISO 27001 Certified Data Encryption</p>
            </div>
          </div>
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Please enter your credentials to access the console</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors" />
                  <input 
                    type="email" 
                    required
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all font-medium"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-bold text-sky-600 hover:text-sky-700">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all font-medium"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-sky-500 peer-checked:border-sky-500 transition-all"></div>
                  <FiCheckCircle className="absolute inset-0 text-white opacity-0 peer-checked:opacity-100 transition-opacity scale-75" />
                </div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Keep me signed in</span>
              </label>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Sign In to Account"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
              Don't have an account? <a href="#" className="text-sky-600 font-bold hover:underline">Request Access</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;