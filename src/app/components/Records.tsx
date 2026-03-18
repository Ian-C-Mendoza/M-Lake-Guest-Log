import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  X,
  Calendar,
  Mail,
  Phone,
  Target,
  HelpCircle,
  FileText,
  Waves,
  Users,
} from "lucide-react";
import { getGuests, getPurposes } from "../utils/storage";
import { Guest } from "../types";
import { format } from "date-fns";

export function Records() {
  const [searchParams] = useSearchParams();
  const showSuccess = searchParams.get("success") === "true";

  const [guests, setGuests] = useState<Guest[]>([]);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showSuccessMsg, setShowSuccessMsg] = useState(showSuccess);
  const [filterDate, setFilterDate] = useState("");
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  useEffect(() => {
    loadData();
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccessMsg(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const loadData = () => {
    const data = getGuests();

    const sorted = data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    setGuests(sorted);
    setPurposes(getPurposes());
  };

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone.includes(searchQuery);

    const matchesPurpose =
      filterPurpose === "" || guest.purpose === filterPurpose;

    const matchesDate =
      filterDate === "" ||
      new Date(guest.date).toDateString() ===
        new Date(filterDate).toDateString();

    return matchesSearch && matchesPurpose && matchesDate;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status?: string) => {
    if (status === "completed") {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
          Checked Out
        </span>
      );
    }
    if (status === "active") {
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
          Active
        </span>
      );
    }
    return null; // Add this fallback
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50/30">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-teal-100/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-amber-100/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-6 sm:py-8 lg:py-10">
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

        {/* Success Message */}
        {showSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 mb-6 flex items-center gap-4 shadow-sm animate-in slide-in-from-top-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-emerald-800 font-medium">
                Registration Successful
              </p>
              <p className="text-emerald-600 text-sm">
                New guest has been added to the records.
              </p>
            </div>
            <button
              onClick={() => setShowSuccessMsg(false)}
              className="p-2 hover:bg-emerald-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-8 sm:px-8 sm:py-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <Waves className="w-full h-full" strokeWidth={0.5} />
            </div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-light">
                      Visit Records
                    </h1>
                    <p className="text-slate-400 text-sm">
                      M LakeHouse Guest Registry
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-4 py-3">
                <Users className="w-5 h-5 text-teal-400" />
                <div>
                  <p className="text-2xl font-light">{guests.length}</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">
                    Total Guests
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Search & Filter */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="relative lg:col-span-2">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    searchQuery ? "text-teal-500" : "text-slate-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 text-base bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>

              <div className="relative">
                <Filter
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    filterPurpose ? "text-teal-500" : "text-slate-400"
                  }`}
                />
                <select
                  value={filterPurpose}
                  onChange={(e) => setFilterPurpose(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 sm:py-4 text-base bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Purposes</option>
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

              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={filterDate || today}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 text-base bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600 text-sm">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {filteredGuests.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {guests.length}
                </span>{" "}
                guests
              </p>
              {(searchQuery || filterPurpose) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterPurpose("");
                    setFilterDate("");
                  }}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Empty State */}
            {filteredGuests.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                {guests.length === 0 ? (
                  <>
                    <p className="text-xl sm:text-2xl text-slate-800 font-light mb-2">
                      No guests registered yet
                    </p>
                    <p className="text-slate-500 mb-6">
                      Start by registering your first guest
                    </p>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                    >
                      <Users className="w-5 h-5" />
                      Register Guest
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-xl text-slate-800 font-light mb-2">
                      No matching guests found
                    </p>
                    <p className="text-slate-500">
                      Try adjusting your search or filter criteria
                    </p>
                  </>
                )}
              </div>
            ) : (
              /* Guest List */
              <div className="space-y-4">
                {filteredGuests.map(
                  (guest, index) => (
                    console.log("Rendering guest:", guest.status),
                    (
                      <div
                        key={guest.id}
                        onClick={() => setSelectedGuest(guest)}
                        className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 hover:shadow-lg hover:border-teal-200 active:scale-[0.99] transition-all cursor-pointer touch-manipulation"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                          {/* Avatar */}
                          <div className="flex items-center gap-4 sm:gap-0 sm:block">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-medium shadow-lg shadow-teal-500/25 flex-shrink-0">
                              {getInitials(guest.name)}
                            </div>
                            <div className="sm:hidden flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1 group-hover:text-teal-700 transition-colors">
                                  {guest.name}
                                </h3>
                                {getStatusBadge(guest.status)}
                              </div>
                              <p className="text-sm text-slate-500">
                                {formatDate(guest.date)}
                              </p>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="hidden sm:block mb-3">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1 group-hover:text-teal-700 transition-colors">
                                  {guest.name}
                                </h3>
                                {getStatusBadge(guest.status)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Calendar className="w-4 h-4" />
                                {formatDate(guest.date)}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                              <div className="flex items-center gap-2 text-sm text-slate-600 min-w-0">
                                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="truncate">{guest.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>{guest.phone}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs sm:text-sm font-medium border border-teal-100">
                                <Target className="w-3.5 h-3.5" />
                                {guest.purpose}
                              </span>
                              {guest.referral && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs sm:text-sm font-medium border border-amber-100">
                                  <HelpCircle className="w-3.5 h-3.5" />
                                  {guest.referral}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Signature Preview */}
                          <div className="hidden sm:block flex-shrink-0">
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-2 w-32 h-20 flex items-center justify-center">
                              <img
                                src={guest.signature}
                                alt="Signature"
                                className="w-full h-full object-contain opacity-80"
                              />
                            </div>
                          </div>

                          {/* Mobile Arrow */}
                          <div className="sm:hidden absolute right-4 top-1/2 -translate-y-1/2">
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
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )
                  ),
                )}
              </div>
            )}
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

      {/* Guest Detail Modal */}
      {selectedGuest && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedGuest(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-6 text-white relative">
              <button
                onClick={() => setSelectedGuest(null)}
                className="absolute right-4 top-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl font-medium">
                  {getInitials(selectedGuest.name)}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-light">
                    {selectedGuest.name}
                  </h2>
                  <p className="text-teal-100 text-sm">Registered Guest</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                    <p className="text-slate-800 font-medium break-all text-sm">
                      {selectedGuest.email}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                    <p className="text-slate-800 font-medium">
                      {selectedGuest.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <Target className="w-4 h-4" />
                    Purpose of Visit
                  </div>
                  <span className="inline-flex px-3 py-1.5 bg-teal-100 text-teal-800 rounded-lg text-sm font-medium">
                    {selectedGuest.purpose}
                  </span>
                </div>

                {selectedGuest.referral && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                      <HelpCircle className="w-4 h-4" />
                      Referral Source
                    </div>
                    <span className="inline-flex px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                      {selectedGuest.referral}
                    </span>
                  </div>
                )}

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    Registration Date
                  </div>
                  <p className="text-slate-800 font-medium">
                    {formatDate(selectedGuest.date)}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                    <FileText className="w-4 h-4" />
                    Digital Signature
                  </label>
                  <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex items-center justify-center">
                    <img
                      src={selectedGuest.signature}
                      alt="Signature"
                      className="max-w-full h-auto max-h-48 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100">
              <button
                onClick={() => setSelectedGuest(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 rounded-xl font-medium transition-colors touch-manipulation"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
