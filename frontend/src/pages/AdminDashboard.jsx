import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  Droplet, 
  FileText, 
  AlertTriangle, 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw,
  Archive,
  UserPlus,
  ShieldCheck,
  Building2
} from "lucide-react";
import { dashboardApi, inventoryApi, requestsApi, donorsApi } from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalDonors: 0,
    activeDonors: 0,
    totalUnitsAvailable: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    completedRequests: 0,
    criticalRequests: 0,
  });

  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingGroup, setUpdatingGroup] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsData, invData, reqsData] = await Promise.all([
        dashboardApi.getStats(),
        inventoryApi.getAll(),
        requestsApi.getAll("ALL"),
      ]);
      setStats(statsData || {});
      setInventory(invData || []);
      setRequests((reqsData || []).slice(0, 5));
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStockDelta = async (bloodGroup, delta) => {
    setUpdatingGroup(bloodGroup);
    try {
      await inventoryApi.updateUnits(bloodGroup, delta, "Manual Admin Dashboard Adjustment");
      // Refresh inventory & stats
      const [newInv, newStats] = await Promise.all([
        inventoryApi.getAll(),
        dashboardApi.getStats(),
      ]);
      setInventory(newInv || []);
      setStats(newStats || {});
    } catch (err) {
      alert("Error adjusting stock: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingGroup(null);
    }
  };

  const handleQuickStatusChange = async (requestId, newStatus) => {
    try {
      await requestsApi.updateStatus(requestId, newStatus, `Updated via Admin Dashboard Quick Action`);
      loadDashboard();
    } catch (err) {
      alert("Error updating status: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "APPROVED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "REJECTED":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Header */}
      <section className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Transfusion Operations Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Transfusion Command Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time monitoring of blood reserves, urgent requisitions, and donor registries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboard}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link
              to="/admin/add-donor"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-red-600/20 flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Add Donor
            </Link>
          </div>
        </div>
      </section>

      {/* KPI METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Donors Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Donors</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalDonors}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                {stats.activeDonors} active &amp; ready
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
          </div>

          {/* Stock Available */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Units</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalUnitsAvailable}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Across all 8 blood groups
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Droplet className="w-7 h-7 fill-emerald-600" />
            </div>
          </div>

          {/* Pending Requisitions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
              <h3 className="text-3xl font-black text-amber-600 mt-1">{stats.pendingRequests}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Awaiting doctor dispatch
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
          </div>

          {/* Critical Requisitions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Emergencies</p>
              <h3 className="text-3xl font-black text-red-600 mt-1">{stats.criticalRequests}</h3>
              <p className="text-xs text-red-600 font-semibold mt-1">
                Requires priority triage
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
          </div>
        </div>
      </section>

      {/* QUICK INVENTORY ADJUSTMENT ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-10">
        <div className="bg-white rounded-3xl p-7 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Blood Stock Levels &amp; Quick Adjuster
              </h2>
              <p className="text-xs text-slate-500">
                Instantly adjust units in stock upon receiving donations or testing clearance.
              </p>
            </div>
            <Link
              to="/admin/inventory"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Full Inventory Console <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-4">
            {inventory.map((item) => (
              <div
                key={item.bloodGroup}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col justify-between"
              >
                <div>
                  <span className="font-extrabold text-sm text-red-600 block">
                    {item.bloodGroup}
                  </span>
                  <span className="text-2xl font-black text-slate-900 block my-1">
                    {item.unitsAvailable}
                  </span>
                  <span className="text-[10px] text-slate-400 block">units in stock</span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-center gap-1.5">
                  <button
                    disabled={updatingGroup === item.bloodGroup || item.unitsAvailable <= 0}
                    onClick={() => handleStockDelta(item.bloodGroup, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600 font-bold disabled:opacity-30"
                    title="Deduct 1 Unit"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    disabled={updatingGroup === item.bloodGroup}
                    onClick={() => handleStockDelta(item.bloodGroup, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center text-slate-600 font-bold"
                    title="Add 1 Unit"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT REQUISITIONS TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Patient Blood Requisitions
              </h2>
              <p className="text-xs text-slate-500">
                Incoming requests requiring doctor review, allocation, and dispatch.
              </p>
            </div>
            <Link
              to="/admin/requests"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              View All Requisitions ({stats.pendingRequests + stats.approvedRequests + stats.completedRequests}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3">Tracking ID</th>
                  <th className="p-3">Patient &amp; Hospital</th>
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Urgency</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {req.trackingCode}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{req.patientName}</div>
                        <div className="text-[11px] text-slate-500">{req.hospitalName}, {req.area || req.district || "Chennai"}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-red-600 text-sm">{req.bloodGroup}</span>
                        <span className="text-slate-500 ml-1">({req.unitsRequired} Units)</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                          req.urgency === "CRITICAL"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : req.urgency === "URGENT"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {req.urgency}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        {req.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleQuickStatusChange(req.id, "APPROVED")}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleQuickStatusChange(req.id, "REJECTED")}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded font-bold text-[11px]"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {req.status === "APPROVED" && (
                          <button
                            onClick={() => handleQuickStatusChange(req.id, "COMPLETED")}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                          >
                            Mark Dispensed
                          </button>
                        )}
                        <Link
                          to={`/request-blood?track=${req.trackingCode}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] inline-block"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No active blood requests recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* QUICK SHORTCUT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/donors"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-red-300 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:bg-red-600 group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Manage Voluntary Donors</h3>
            <p className="text-xs text-slate-500 mt-1">
              View, edit, toggle availability, and audit donor registries.
            </p>
          </Link>

          <Link
            to="/admin/inventory"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-red-300 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
              <Archive className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Central Blood Inventory</h3>
            <p className="text-xs text-slate-500 mt-1">
              Monitor threshold warnings and reserve allocations.
            </p>
          </Link>

          <Link
            to="/admin/requests"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-red-300 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Requisitions Workflow</h3>
            <p className="text-xs text-slate-500 mt-1">
              Filter by urgency, add doctor remarks, and track dispatches.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
