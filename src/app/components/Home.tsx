import { Link } from "react-router";
import { UserPlus, FileText, Settings, Waves } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative background elements - hidden on small mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-teal-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4">
        {/* Logo & Brand Section */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-14">
          <div className="relative inline-block mb-4 sm:mb-6">
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-slate-100">
              <img
                src="src\app\components\image\M.png"
                alt="M LakeHouse"
                className="h-20 sm:h-28 lg:h-36 w-auto object-contain"
              />
            </div>
            {/* Decorative ring */}
            <div className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-teal-500/20 to-amber-500/20 rounded-2xl sm:rounded-3xl -z-10 blur-sm" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-light text-slate-800 tracking-tight mb-2">
            Guest Registration
          </h1>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Waves className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
            <p className="text-xs sm:text-sm lg:text-base font-medium tracking-wide uppercase">
              Boutique Resort & Events Place
            </p>
            <Waves className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
          </div>
        </div>

        {/* Navigation Cards - Stack on mobile, 3-col on desktop */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl lg:max-w-none mx-auto">
          {/* Register Guest */}
          <Link to="/register" className="group block touch-manipulation">
            <div className="relative h-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden active:scale-[0.98]">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/25 sm:group-hover:scale-110 sm:group-hover:rotate-3 transition-transform duration-300 sm:mb-4 lg:mb-5">
                  <UserPlus
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 sm:flex-none text-left sm:text-center">
                  <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-slate-800 mb-0.5 sm:mb-2 group-hover:text-teal-700 transition-colors">
                    Register Guest
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed hidden sm:block">
                    Add a new visitor to the system
                  </p>
                  <p className="text-slate-400 text-xs sm:hidden">
                    Add new visitor
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </Link>

          {/* View Records */}
          <Link to="/records" className="group block touch-manipulation">
            <div className="relative h-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden active:scale-[0.98]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25 sm:group-hover:scale-110 sm:group-hover:rotate-3 transition-transform duration-300 sm:mb-4 lg:mb-5">
                  <FileText
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 sm:flex-none text-left sm:text-center">
                  <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-slate-800 mb-0.5 sm:mb-2 group-hover:text-amber-700 transition-colors">
                    View Records
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed hidden sm:block">
                    Access visitor history and records
                  </p>
                  <p className="text-slate-400 text-xs sm:hidden">
                    See all visitors
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </Link>

          {/* Admin Panel - Full width on tablet when 2-col */}
          <Link
            to="/admin/login"
            className="group block touch-manipulation sm:col-span-2 lg:col-span-1"
          >
            <div className="relative h-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden active:scale-[0.98]">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-500/0 to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-slate-700/25 sm:group-hover:scale-110 sm:group-hover:rotate-3 transition-transform duration-300 sm:mb-4 lg:mb-5">
                  <Settings
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 sm:flex-none text-left sm:text-center">
                  <h2 className="text-lg sm:text-xl lg:text-xl font-semibold text-slate-800 mb-0.5 sm:mb-2 group-hover:text-slate-700 transition-colors">
                    Admin Panel
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed hidden sm:block">
                    Manage purposes and settings
                  </p>
                  <p className="text-slate-400 text-xs sm:hidden">
                    Manage system
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </Link>
        </div>

        {/* Footer accent */}
        <div className="mt-8 sm:mt-10 lg:mt-12 flex justify-center">
          <div className="flex items-center gap-2 sm:gap-3 text-slate-400">
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-slate-300" />
            <Waves className="w-4 h-4 sm:w-5 sm:h-5" />
            <div className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
