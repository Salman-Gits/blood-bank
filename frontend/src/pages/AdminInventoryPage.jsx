import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Archive, 
  Droplet, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  RefreshCw,
  TrendingUp,
  History,
  ShieldCheck
} from "lucide-react";
import { inventoryApi } from "../api";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingGroup, setUpdatingGroup] = useState(null);

  // Custom modal for precise delta or bulk intake
  const [adjustModal, setAdjustModal] = useState(null);
  const [deltaUnits, setDeltaUnits] = useState(1);
  const [operationType, setOperationType] = useState("ADD"); // 'ADD' or 'DEDUCT'
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await inventoryApi.getAll();
      setInventory(data || []);
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleQuickStep = async (bloodGroup, step) => {
    setUpdatingGroup(bloodGroup);
    try {
      await inventoryApi.updateUnits(bloodGroup, step, `Quick step ${step > 0 ? "+" : ""}${step} units`);
      loadInventory();
    } catch (err) {
      alert("Error updating inventory: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingGroup(null);
    }
  };

  const openAdjustModal = (item, type = "ADD") => {
    setAdjustModal(item);
    setOperationType(type);
    setDeltaUnits(1);
    setReason(type === "ADD" ? "Voluntary donation batch accepted" : "Emergency hospital dispatch");
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!adjustModal) return;
    setSubmitting(true);
    const step = operationType === "ADD" ? Math.abs(deltaUnits) : -Math.abs(deltaUnits);
    try {
      await inventoryApi.updateUnits(adjustModal.bloodGroup, step, reason);
      setAdjustModal(null);
      loadInventory();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const totalUnits = inventory.reduce((acc, curr) => acc + curr.unitsAvailable, 0);

  const getStockHealth = (units, threshold = 5) => {
    if (units <= threshold) {
      return { label: "Critical Shortage", bg: "bg-red-50 text-red-700 border-red-200", bar: "bg-red-500", pct: Math.min(100, (units / 20) * 100) };
    }
    if (units <= threshold * 2) {
      return { label: "Moderate Reserve", bg: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-500", pct: Math.min(100, (units / 20) * 100) };
    }
    return { label: "Adequate Stock", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-500", pct: Math.min(100, (units / 20) * 100) };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <section className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-2 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Central Blood Bank Inventory
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live temperature-controlled whole blood &amp; PRBC reserve tracking with automatic safety thresholds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Reserve</span>
              <span className="text-lg font-black text-emerald-400">{totalUnits} Units</span>
            </div>
            <button
              onClick={loadInventory}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 8 BLOOD GROUPS INVENTORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventory.map((item) => {
            const health = getStockHealth(item.unitsAvailable, item.criticalThreshold);
            return (
              <div
                key={item.bloodGroup}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md border border-slate-200/80 flex flex-col justify-between transition"
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-red-500/20">
                      {item.bloodGroup}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${health.bg}`}>
                      {health.label}
                    </span>
                  </div>

                  {/* Numbers */}
                  <div className="mt-4">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {item.unitsAvailable}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold ml-1.5">units in stock</span>
                  </div>

                  {/* Stock Bar */}
                  <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${health.bar}`}
                      style={{ width: `${health.pct}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Threshold: {item.criticalThreshold} units</span>
                    <span>Reserved: {item.reservedUnits || 0}</span>
                  </div>
                </div>

                {/* Adjustment Controls */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={updatingGroup === item.bloodGroup || item.unitsAvailable <= 0}
                      onClick={() => handleQuickStep(item.bloodGroup, -1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center font-bold text-slate-700 disabled:opacity-30"
                      title="Quick -1 Unit"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={updatingGroup === item.bloodGroup}
                      onClick={() => handleQuickStep(item.bloodGroup, 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center font-bold text-slate-700"
                      title="Quick +1 Unit"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => openAdjustModal(item, "ADD")}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
                  >
                    Adjust Stock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STORAGE & CLINICAL SAFETY GUIDELINES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Standard Transfusion Storage Protocol (ISO / NABH Standards)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Whole Blood &amp; Packed Cells</strong>
              <p>Maintained in continuous cold storage between 2°C to 6°C with 35 to 42-day lifespan using CPDA-1 solution.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Fresh Frozen Plasma (FFP)</strong>
              <p>Stored at -18°C or colder for up to 1 year; thawed in 37°C water bath prior to patient administration.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Platelet Concentrates</strong>
              <p>Maintained at 20°C to 24°C with continuous gentle agitation; maximum 5-day shelf life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ADJUST STOCK MODAL */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Adjust Inventory: <span className="text-red-600">{adjustModal.bloodGroup}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Current stock: <strong>{adjustModal.unitsAvailable} Units</strong>
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Action Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOperationType("ADD")}
                    className={`py-2 rounded-lg font-bold transition text-center ${
                      operationType === "ADD"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    + Add Units (Donation)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperationType("DEDUCT")}
                    className={`py-2 rounded-lg font-bold transition text-center ${
                      operationType === "DEDUCT"
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    - Deduct Units (Dispatch)
                  </button>
                </div>
              </div>

              {/* Number of Units */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity (Units/Bags)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={deltaUnits}
                  onChange={(e) => setDeltaUnits(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              {/* Audit Reason */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Operational Audit Note</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Received 5 bags from SRM Medical College blood drive"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModal(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Commit Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
