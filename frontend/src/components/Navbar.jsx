import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Droplet, UserPlus, Search, FileText, LayoutDashboard, Users, Archive, LogOut, Shield, PhoneCall } from "lucide-react";
import { authApi } from "../api";

export default function Navbar({ isAdmin, setIsAdmin }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser();

  const handleLogout = () => {
    authApi.logout();
    if (setIsAdmin) setIsAdmin(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Clinical Notification Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 font-semibold text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Emergency Transfusion Service 24/7
            </span>
          </div>
          <div className="flex items-center gap-6 font-medium text-slate-300">
            <span className="flex items-center gap-2 hover:text-white transition">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              Emergency Toll-Free: <strong className="text-white font-bold tracking-wide">1800-256-6324</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav id="main-navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform active:scale-98 shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:shadow-red-500/30 transition-shadow">
              <Droplet className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                Blood<span className="text-red-600">Life</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Transfusion Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-2">
            {!isAdmin ? (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive("/")
                      ? "text-red-600 bg-red-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/find-donor"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive("/find-donor")
                      ? "text-red-600 bg-red-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Find Donors
                </Link>
                <Link
                  to="/request-blood"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive("/request-blood")
                      ? "text-red-600 bg-red-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Request Blood
                </Link>
                <Link
                  to="/admin/add-donor"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive("/admin/add-donor")
                      ? "text-red-600 bg-red-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  Become a Donor
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-3" />

                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Shield className="w-4 h-4 text-slate-500" />
                  Admin Portal
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive("/admin/dashboard")
                      ? "text-red-600 bg-red-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/donors"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive("/admin/donors")
                      ? "text-red-600 bg-red-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Manage Donors
                </Link>
                <Link
                  to="/admin/inventory"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive("/admin/inventory")
                      ? "text-red-600 bg-red-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  Blood Inventory
                </Link>
                <Link
                  to="/admin/requests"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive("/admin/requests")
                      ? "text-red-600 bg-red-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Requisitions
                </Link>
                <Link
                  to="/admin/add-donor"
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                    isActive("/admin/add-donor")
                      ? "text-red-600 bg-red-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Add Donor
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-3" />

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                    Admin Active
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {!isAdmin ? (
              <Link
                to="/request-blood"
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold"
              >
                Request Blood
              </Link>
            ) : null}
            <button
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition focus:outline-hidden"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {open && (
          <div className="lg:hidden border-t border-slate-200 py-4 px-2 space-y-1.5 bg-white">
            {!isAdmin ? (
              <>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/") ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/find-donor"
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/find-donor") ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Find Donors
                </Link>
                <Link
                  to="/request-blood"
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/request-blood") ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Request Blood
                </Link>
                <Link
                  to="/admin/add-donor"
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/admin/add-donor") ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Register as a Donor
                </Link>
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <Link
                    to="/admin/login"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition"
                  >
                    Hospital / Admin Login
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-xs font-bold text-red-600 uppercase tracking-wider">
                  Admin Console
                </div>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/admin/dashboard") ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/donors"
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/admin/donors") ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Manage Donors
                </Link>
                <Link
                  to="/admin/inventory"
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/admin/inventory") ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Blood Inventory
                </Link>
                <Link
                  to="/admin/requests"
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/admin/requests") ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Blood Requests
                </Link>
                <Link
                  to="/admin/add-donor"
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive("/admin/add-donor") ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Add Donor
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full mt-2 text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
