import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  UserPlus,
  Shield,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { registerAdmin, hasAdminAccount } from "../utils/auth";

export function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (hasAdminAccount()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const success = registerAdmin(formData.username, formData.password);

    if (success) {
      navigate("/admin/login");
    } else {
      setError("Failed to create admin account");
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: "Too short", color: "bg-red-500" };
    if (password.length < 8) return { label: "Weak", color: "bg-amber-500" };
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      return { label: "Strong", color: "bg-emerald-500" };
    }
    return { label: "Good", color: "bg-teal-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const inputClasses = (fieldName: string, hasError: boolean) => `
    w-full pl-12 pr-4 py-3.5 sm:py-4 text-base bg-slate-50 border-2 rounded-xl 
    transition-all duration-300 outline-none
    ${
      hasError
        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
        : focusedField === fieldName
          ? "border-teal-500 bg-white shadow-lg shadow-teal-500/10"
          : "border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50/30 flex items-center justify-center p-4 sm:p-6">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-teal-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-slate-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 mb-6 transition-colors group touch-manipulation"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium hidden sm:inline">Back to Home</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <Shield className="w-full h-full" strokeWidth={0.5} />
            </div>
            <div className="relative">
              <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                <UserPlus className="w-10 h-10 text-teal-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-light text-white mb-2">
                Create Admin Account
              </h1>
              <p className="text-slate-400 text-sm">
                M LakeHouse Management System
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Info Banner */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-amber-800 text-sm font-medium mb-1">
                  Initial Setup
                </p>
                <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                  This creates the master admin account for managing visit
                  purposes. Please store your credentials securely.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-slate-700"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "username" ? "text-teal-500" : "text-slate-400"}`}
                  />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    className={inputClasses(
                      "username",
                      !!error && !formData.username,
                    )}
                    placeholder="Choose a username (min. 3 chars)"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <CheckCircle2
                    className={`w-3 h-3 ${formData.username.length >= 3 ? "text-emerald-500" : "text-slate-300"}`}
                  />
                  At least 3 characters
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-slate-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "password" ? "text-teal-500" : "text-slate-400"}`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClasses("password", !!error && !formData.password)} pr-12`}
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength?.color} transition-all duration-300`}
                        style={{
                          width: `${Math.min((formData.password.length / 12) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {passwordStrength?.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-slate-700"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "confirmPassword" ? "text-teal-500" : "text-slate-400"}`}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClasses("confirmPassword", !!error)} pr-12`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Passwords match
                    </p>
                  )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 active:from-teal-800 active:to-teal-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-base font-medium shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5 active:translate-y-0 touch-manipulation"
              >
                <Shield className="w-5 h-5" />
                Create Admin Account
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                <Lock className="w-3 h-3" />
                <span>Secure setup • Credentials encrypted locally</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-slate-300" />
            <Shield className="w-4 h-4" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
