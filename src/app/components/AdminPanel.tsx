import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  LogOut,
  Shield,
  LayoutDashboard,
  Sparkles,
  ListTodo,
  Users,
  Calendar,
  Search,
  Download,
  FileSpreadsheet,
  BarChart3,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  TrendingUp,
  UserCheck,
  UserX,
  Settings,
  Save,
  Printer,
  Mail,
  Phone,
  Target,
  HelpCircle,
  FileText,
} from "lucide-react";
import {
  getPurposes,
  addPurpose,
  updatePurpose,
  deletePurpose,
  setDefaultPurpose,
  getDefaultPurpose,
  getReferrals,
  addReferral,
  updateReferral,
  deleteReferral,
  getDefaultReferral,
  setDefaultReferral,
} from "../utils/storage";
import { checkoutGuest, getGuests, exportGuestsToCSV } from "../utils/storage";
import { Guest } from "../types";
import { isAdminLoggedIn, logoutAdmin } from "../utils/auth";
import { format } from "date-fns";

type Tab =
  | "dashboard"
  | "purposes"
  | "referrals"
  | "records"
  | "reports"
  | "backup";

export function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  // Auth check
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50/30">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <Header />

        {/* Navigation Tabs */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px]">
          {activeTab === "dashboard" && (
            <DashboardTab onTabChange={setActiveTab} />
          )}{" "}
          {activeTab === "purposes" && <PurposesTab />}
          {activeTab === "referrals" && <ReferralsTab />}
          {activeTab === "records" && <RecordsTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "backup" && <BackupTab />}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

// ============== SUB-COMPONENTS ==============

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-colors group touch-manipulation"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-800">
            Admin Panel
          </h1>
          <p className="text-slate-500 text-sm">
            M LakeHouse Management System
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl shadow-sm hover:shadow-md transition-all touch-manipulation"
      >
        <LogOut className="w-4 h-4" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
}

function TabNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "purposes" as Tab, label: "Purposes", icon: ListTodo },
    { id: "referrals" as Tab, label: "Referrals", icon: Users },
    { id: "records" as Tab, label: "Records", icon: Users },
    { id: "reports" as Tab, label: "Reports", icon: BarChart3 },
    { id: "backup" as Tab, label: "Backup", icon: Save },
  ];

  return (
    <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap touch-manipulation ${
              isActive
                ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-600/25"
                : "bg-white text-slate-600 hover:text-teal-600 hover:bg-teal-50 border border-slate-200"
            }`}
          >
            <Icon className="w-5 h-5" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ============== DASHBOARD TAB ==============
function DashboardTab({ onTabChange }: { onTabChange: (tab: Tab) => void }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    active: 0,
  });

  useEffect(() => {
    const data = getGuests();
    setGuests(data);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    setStats({
      today: data.filter((g) => new Date(g.date) >= today).length,
      week: data.filter((g) => new Date(g.date) >= weekAgo).length,
      month: data.filter((g) => new Date(g.date) >= monthAgo).length,
      active: data.filter((g) => g.status === "active").length,
    });
  }, []);

  const recentGuests = guests.slice(0, 5);

  return (
    <div className="p-6 sm:p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Calendar}
          label="Today"
          value={stats.today}
          color="teal"
        />
        <StatCard
          icon={TrendingUp}
          label="This Week"
          value={stats.week}
          color="blue"
        />
        <StatCard
          icon={BarChart3}
          label="This Month"
          value={stats.month}
          color="purple"
        />
        <StatCard
          icon={UserCheck}
          label="Active Now"
          value={stats.active}
          color="emerald"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Recent Check-ins
            </h3>
          </div>
          {recentGuests.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No recent activity
            </p>
          ) : (
            <div className="space-y-3">
              {recentGuests.map((guest, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200"
                >
                  <div>
                    <p className="font-medium text-slate-800">{guest.name}</p>
                    <p className="text-sm text-slate-500">{guest.purpose}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(guest.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionButton
              icon={Plus}
              label="Add Purpose"
              onClick={() => onTabChange("purposes")}
            />
            <QuickActionButton
              icon={Download}
              label="Export Data"
              onClick={() => onTabChange("backup")}
            />
            <QuickActionButton
              icon={Users}
              label="View Records"
              onClick={() => onTabChange("records")}
            />
            <QuickActionButton
              icon={BarChart3}
              label="Reports"
              onClick={() => onTabChange("reports")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    teal: "bg-teal-100 text-teal-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all touch-manipulation"
    >
      <Icon className="w-6 h-6 text-teal-600" />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );
}

// ============== PURPOSES TAB ==============

function PurposesTab() {
  const [purposes, setPurposes] = useState<string[]>([]);
  const [defaultPurpose, setDefaultPurposeState] = useState<string>("");
  const [newPurpose, setNewPurpose] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPurposes(getPurposes());
    setDefaultPurposeState(getDefaultPurpose() || "");
  };

  const handleAdd = () => {
    if (newPurpose.trim()) {
      addPurpose(newPurpose.trim());
      setNewPurpose("");
      setShowAddInput(false);
      loadData();
    }
  };

  const handleSetDefault = (purpose: string) => {
    setDefaultPurpose(purpose);
    setDefaultPurposeState(purpose);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(purposes[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      updatePurpose(purposes[editingIndex], editValue.trim());
      setEditingIndex(null);
      setEditValue("");
      loadData();
    }
  };

  const handleDelete = (purpose: string) => {
    if (confirm(`Delete "${purpose}"?`)) {
      deletePurpose(purpose);
      loadData();
    }
  };

  const inputClasses = (fieldName: string) => `
    flex-1 px-4 py-3 text-base bg-slate-50 border-2 rounded-xl 
    transition-all duration-300 outline-none
    ${
      focusedField === fieldName
        ? "border-teal-500 bg-white shadow-lg shadow-teal-500/10"
        : "border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
    }
  `;

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <ListTodo className="w-6 h-6 text-teal-600" />
        <h2 className="text-xl font-semibold text-slate-800">
          Manage Visit Purposes
        </h2>
      </div>

      {/* Add Purpose */}
      <div className="mb-6">
        {!showAddInput ? (
          <button
            onClick={() => setShowAddInput(true)}
            className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl shadow-lg shadow-teal-600/25 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Purpose
          </button>
        ) : (
          <div className="flex gap-3 max-w-lg">
            <input
              type="text"
              value={newPurpose}
              onChange={(e) => setNewPurpose(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              onFocus={() => setFocusedField("new")}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter new purpose..."
              className={inputClasses("new")}
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg transition-all"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAddInput(false)}
              className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Purposes List */}
      <div className="space-y-3">
        {purposes.length === 0 ? (
          <EmptyState icon={ListTodo} message="No purposes configured yet" />
        ) : (
          purposes.map((purpose, index) => (
            <div
              key={index}
              className={`group flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                defaultPurpose === purpose
                  ? "bg-teal-50 border-teal-200"
                  : "bg-slate-50 border-slate-200 hover:bg-white hover:border-teal-200"
              }`}
            >
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                    onFocus={() => setFocusedField("edit")}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClasses("edit")} flex-1`}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 bg-emerald-500 text-white rounded-lg"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="p-2 bg-slate-200 text-slate-700 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <span className="font-medium text-slate-700">
                      {purpose}
                    </span>
                    {defaultPurpose === purpose && (
                      <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  {defaultPurpose !== purpose && (
                    <button
                      onClick={() => handleSetDefault(purpose)}
                      className="px-3 py-1.5 text-sm text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                      title="Set as default"
                    >
                      Set Default
                    </button>
                  )}

                  <button
                    onClick={() => handleStartEdit(index)}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(purpose)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ReferralsTab() {
  const [referrals, setReferrals] = useState<string[]>([]);
  const [defaultReferral, setDefaultReferralState] = useState<string>("");
  const [newReferral, setNewReferral] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setReferrals(getReferrals());
    setDefaultReferralState(getDefaultReferral() || "");
  };

  const handleAdd = () => {
    if (newReferral.trim()) {
      addReferral(newReferral.trim());
      setNewReferral("");
      setShowAddInput(false);
      loadData();
    }
  };

  const handleSetDefault = (referral: string) => {
    setDefaultReferral(referral);
    setDefaultReferralState(referral);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(referrals[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      updateReferral(referrals[editingIndex], editValue.trim());
      setEditingIndex(null);
      setEditValue("");
      loadData();
    }
  };

  const handleDelete = (referral: string) => {
    if (confirm(`Delete "${referral}"?`)) {
      deleteReferral(referral);
      loadData();
    }
  };

  const inputClasses = (fieldName: string) => `
    flex-1 px-4 py-3 text-base bg-slate-50 border-2 rounded-xl 
    transition-all duration-300 outline-none
    ${
      focusedField === fieldName
        ? "border-amber-500 bg-white shadow-lg shadow-amber-500/10"
        : "border-slate-200 hover:border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
    }
  `;

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-semibold text-slate-800">
          Manage Referral Sources
        </h2>
      </div>

      {/* Add */}
      <div className="mb-6">
        {!showAddInput ? (
          <button
            onClick={() => setShowAddInput(true)}
            className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Source
          </button>
        ) : (
          <div className="flex gap-3 max-w-lg">
            <input
              type="text"
              value={newReferral}
              onChange={(e) => setNewReferral(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              onFocus={() => setFocusedField("new")}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter referral source..."
              className={inputClasses("new")}
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="px-5 py-3 bg-emerald-500 text-white rounded-xl"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAddInput(false)}
              className="px-5 py-3 bg-slate-200 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {referrals.map((referral, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
              defaultReferral === referral
                ? "bg-amber-50 border-amber-200"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex-1">
              {editingIndex === index ? (
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                  className={inputClasses("edit")}
                  autoFocus
                />
              ) : (
                <span className="font-medium">{referral}</span>
              )}
            </div>

            {editingIndex === index ? (
              <>
                <button onClick={handleSaveEdit}>
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setEditingIndex(null)}>
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {defaultReferral !== referral && (
                  <button onClick={() => handleSetDefault(referral)}>
                    Set Default
                  </button>
                )}
                <button onClick={() => handleStartEdit(index)}>
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(referral)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== RECORDS TAB ==============

function RecordsTab() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const purposes = getPurposes();
  const today = new Date().toISOString().split("T")[0]; // "2026-03-17"
  useEffect(() => {
    setGuests(getGuests());
  }, []);

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
  const filteredGuests = useMemo(() => {
    let result = [...guests];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(term) ||
          g.email?.toLowerCase().includes(term) ||
          g.phone?.includes(term),
      );
    }

    if (filterPurpose) {
      result = result.filter((g) => g.purpose === filterPurpose);
    }

    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      result = result.filter((g) => {
        const guestDate = new Date(g.date);
        return (
          guestDate.getFullYear() === filterDateObj.getFullYear() &&
          guestDate.getMonth() === filterDateObj.getMonth() &&
          guestDate.getDate() === filterDateObj.getDate()
        );
      });
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [guests, searchTerm, filterPurpose, filterDate, sortBy]);

  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-teal-600" />
        <h2 className="text-xl font-semibold text-slate-800">Guest Records</h2>
        <span className="ml-2 px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
          {filteredGuests.length} total
        </span>
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <select
          value={filterPurpose}
          onChange={(e) => setFilterPurpose(e.target.value)}
          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
        >
          <option value="">All Purposes</option>
          {purposes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filterDate || today}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "name")}
          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Purpose
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Check In
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedGuests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              paginatedGuests.map((guest, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedGuest(guest)}
                >
                  {" "}
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {guest.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">
                      {guest.purpose}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {new Date(guest.date).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        guest.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {guest.status === "active" ? (
                        <UserCheck className="w-3 h-3" />
                      ) : (
                        <UserX className="w-3 h-3" />
                      )}
                      {guest.status === "active" ? "Active" : "Checked Out"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredGuests.length)} of{" "}
            {filteredGuests.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
                onClick={() => {
                  checkoutGuest(selectedGuest.id);
                  setGuests(getGuests());
                  setSelectedGuest(null);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium"
              >
                Check Out Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============== REPORTS TAB ==============

function ReportsTab() {
  const [guests] = useState<Guest[]>(getGuests());
  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "all"
  >("week");

  const reportData = useMemo(() => {
    const now = new Date();
    let filtered = guests;

    if (dateRange === "today") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = guests.filter((g) => new Date(g.date) >= today);
    } else if (dateRange === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = guests.filter((g) => new Date(g.date) >= weekAgo);
    } else if (dateRange === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = guests.filter((g) => new Date(g.date) >= monthAgo);
    }

    const byPurpose: Record<string, number> = {};
    filtered.forEach((g) => {
      byPurpose[g.purpose] = (byPurpose[g.purpose] || 0) + 1;
    });

    const daily: Record<string, number> = {};
    filtered.forEach((g) => {
      const date = new Date(g.date).toLocaleDateString();
      daily[date] = (daily[date] || 0) + 1;
    });

    return {
      total: filtered.length,
      active: filtered.filter((g) => g.status === "active").length,
      byPurpose: Object.entries(byPurpose).sort((a, b) => b[1] - a[1]),
      daily: Object.entries(daily).sort(
        (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
      ),
    };
  }, [guests, dateRange]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-semibold text-slate-800">
            Visitor Reports
          </h2>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-teal-50 rounded-2xl p-5 border border-teal-200">
          <p className="text-teal-600 text-sm font-medium mb-1">
            Total Visitors
          </p>
          <p className="text-3xl font-bold text-slate-800">
            {reportData.total}
          </p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
          <p className="text-emerald-600 text-sm font-medium mb-1">
            Currently Active
          </p>
          <p className="text-3xl font-bold text-slate-800">
            {reportData.active}
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium mb-1">Top Purpose</p>
          <p className="text-lg font-bold text-slate-800 truncate">
            {reportData.byPurpose[0]?.[0] || "N/A"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* By Purpose */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">
              Visitors by Purpose
            </h3>
          </div>
          <div className="p-4">
            {reportData.byPurpose.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                No data available
              </p>
            ) : (
              <div className="space-y-3">
                {reportData.byPurpose.map(([purpose, count]) => (
                  <div key={purpose} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">
                          {purpose}
                        </span>
                        <span className="text-sm text-slate-500">{count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{
                            width: `${(count / reportData.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Daily Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">Daily Trend</h3>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            {reportData.daily.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                No data available
              </p>
            ) : (
              <div className="space-y-2">
                {reportData.daily.map(([date, count]) => (
                  <div
                    key={date}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="text-sm text-slate-600">{date}</span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                      {count} visitors
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== BACKUP TAB ==============

function BackupTab() {
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState("");

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const csv = exportGuestsToCSV();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `guest-records-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setMessage("Export completed successfully!");
    } catch (error) {
      setMessage("Export failed. Please try again.");
    }
    setIsExporting(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleBackupLocal = () => {
    const data = {
      guests: getGuests(),
      purposes: getPurposes(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setMessage("Backup saved!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Save className="w-6 h-6 text-teal-600" />
        <h2 className="text-xl font-semibold text-slate-800">
          Backup & Export
        </h2>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-700 font-medium">{message}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Export CSV */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-7 h-7 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Export to CSV
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            Download all guest records as a CSV file for Excel or other
            applications.
          </p>
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all"
          >
            <Download className="w-5 h-5" />
            {isExporting ? "Exporting..." : "Download CSV"}
          </button>
        </div>

        {/* Full Backup */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
            <Save className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Full Backup
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            Create a complete backup including all records and settings as JSON.
          </p>
          <button
            onClick={handleBackupLocal}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
          >
            <Download className="w-5 h-5" />
            Download Backup
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">Backup Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Export CSV for reporting and analysis in Excel</li>
              <li>• Download JSON backup for complete data preservation</li>
              <li>• Regular backups are recommended weekly</li>
              <li>• Store backups in a secure location</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <p className="text-slate-500 font-medium">{message}</p>
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center gap-3 text-slate-400">
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-slate-300" />
        <Shield className="w-4 h-4" />
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-slate-300" />
      </div>
    </div>
  );
}
