import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import SignatureCanvas from "react-signature-canvas";
import {
  ArrowLeft,
  Trash2,
  Check,
  User,
  Mail,
  Phone,
  FileText,
  HelpCircle,
  PenTool,
  Waves,
} from "lucide-react";
import { saveGuest, getPurposes, getReferrals } from "../utils/storage";
import { Guest } from "../types";

export function GuestRegistration() {
  const navigate = useNavigate();
  const signatureRef = useRef<SignatureCanvas>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    referral: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [purposes, setPurposes] = useState<string[]>([]);
  const [signatureError, setSignatureError] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [referrals, setReferrals] = useState<string[]>([]);

  useEffect(() => {
    setPurposes(getPurposes());
    setReferrals(getReferrals());
  }, []);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
    setSignatureError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.purpose) {
      newErrors.purpose = "Purpose is required";
    }
    if (!formData.referral) {
      newErrors.referral = "Please let us know how you found us";
    }

    const signatureIsEmpty = signatureRef.current?.isEmpty();
    if (signatureIsEmpty) {
      setSignatureError(true);
    }

    if (Object.keys(newErrors).length > 0 || signatureIsEmpty) {
      setErrors(newErrors);
      return;
    }

    const signature = signatureRef.current?.toDataURL() || "";
    const guest: Guest = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      purpose: formData.purpose,
      referral: formData.referral,
      signature,
      date: new Date().toISOString(),
      status: "active", // ✅ ADD THIS
    };

    saveGuest(guest);

    setFormData({ name: "", email: "", phone: "", purpose: "", referral: "" });
    signatureRef.current?.clear();
    setErrors({});
    setSignatureError(false);

    navigate("/records?success=true");
  };

  const inputClasses = (fieldName: string, hasError: boolean) => `
    w-full px-4 py-3.5 sm:py-4 text-base bg-slate-50 border-2 rounded-xl 
    transition-all duration-300 outline-none
    ${
      hasError
        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
        : focusedField === fieldName
          ? "border-teal-500 bg-white shadow-lg shadow-teal-500/10"
          : "border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
    }
  `;

  const labelClasses =
    "block mb-2 text-sm sm:text-base font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50/30">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-teal-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-amber-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-6 sm:py-10 lg:py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 mb-6 sm:mb-8 transition-colors group touch-manipulation"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium hidden sm:inline">Back to Home</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-8 sm:px-8 sm:py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Waves className="w-full h-full text-white" strokeWidth={0.5} />
            </div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-light text-white mb-2">
                Guest Registration
              </h1>
              <p className="text-teal-100 text-sm sm:text-base">
                M LakeHouse Boutique Resort & Events Place
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Name Field */}
              <div className="relative">
                <label htmlFor="name" className={labelClasses}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "name" ? "text-teal-500" : "text-slate-400"}`}
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClasses("name", !!errors.name)} pl-12`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="email" className={labelClasses}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "email" ? "text-teal-500" : "text-slate-400"}`}
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClasses("email", !!errors.email)} pl-12`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className={labelClasses}>
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "phone" ? "text-teal-500" : "text-slate-400"}`}
                    />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClasses("phone", !!errors.phone)} pl-12`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Purpose & Referral Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="purpose" className={labelClasses}>
                    Purpose of Visit <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "purpose" ? "text-teal-500" : "text-slate-400"}`}
                    />
                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("purpose")}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClasses("purpose", !!errors.purpose)} pl-12 appearance-none cursor-pointer`}
                    >
                      <option value="">Select purpose</option>
                      {purposes.map((purpose) => (
                        <option key={purpose} value={purpose}>
                          {purpose}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.purpose && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.purpose}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="referral" className={labelClasses}>
                    How did you hear about us?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <HelpCircle
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "referral" ? "text-teal-500" : "text-slate-400"}`}
                    />
                    <select
                      id="referral"
                      name="referral"
                      value={formData.referral}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("referral")}
                      onBlur={() => setFocusedField(null)}
                      className={`${inputClasses("referral", !!errors.referral)} pl-12 appearance-none cursor-pointer`}
                    >
                      <option value="">Select option</option>
                      {referrals.map((referral) => (
                        <option key={referral} value={referral}>
                          {referral}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.referral && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.referral}
                    </p>
                  )}
                </div>
              </div>

              {/* Signature Section */}
              <div className="pt-2">
                <label className={labelClasses}>
                  Digital Signature <span className="text-red-500">*</span>
                </label>
                <div
                  className={`relative bg-slate-50 rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                    signatureError
                      ? "border-red-400 ring-4 ring-red-500/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="absolute top-4 left-4 z-10">
                    <PenTool className="w-5 h-5 text-slate-400" />
                  </div>
                  <SignatureCanvas
                    ref={signatureRef}
                    canvasProps={{
                      className:
                        "w-full h-36 sm:h-44 touch-none cursor-crosshair",
                      style: { background: "transparent" },
                    }}
                    onBegin={() => {
                      setSignatureError(false);
                      setFocusedField("signature");
                    }}
                  />
                  {signatureRef.current?.isEmpty() !== false &&
                    !signatureError && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-slate-300 text-lg font-light">
                          Sign here
                        </span>
                      </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                  {signatureError ? (
                    <p className="text-red-500 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      Please provide your signature
                    </p>
                  ) : (
                    <p className="text-slate-500 text-sm">
                      Sign with your finger or stylus
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Signature
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 active:from-teal-800 active:to-teal-900 text-white py-4 sm:py-5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 text-base sm:text-lg font-medium shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5 active:translate-y-0 touch-manipulation"
                >
                  <Check className="w-6 h-6" />
                  Complete Registration
                </button>
                <p className="text-center text-slate-400 text-xs sm:text-sm mt-4">
                  By submitting, you agree to our terms and privacy policy
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-slate-300" />
            <Waves className="w-4 h-4" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
