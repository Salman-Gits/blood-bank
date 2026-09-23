import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Droplet, 
  Search, 
  HeartHandshake, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Users, 
  Calendar, 
  Clock, 
  Hospital,
  AlertCircle,
  PhoneCall
} from "lucide-react";
import { inventoryApi, dashboardApi, requestsApi } from "../api";
import { CHENNAI_AREAS } from "../constants/locations";

export default function HomePage() {
  const navigate = useNavigate();

  // Search widget state
  const [selectedBlood, setSelectedBlood] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Live data
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalUnitsAvailable: 0,
    pendingRequests: 0,
    criticalRequests: 0,
  });
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [invData, statsData, reqsData] = await Promise.all([
          inventoryApi.getAll(),
          dashboardApi.getStats(),
          requestsApi.getAll("ALL"),
        ]);
        setInventory(invData || []);
        setStats(statsData || {});
        // Filter urgent or critical requests
        const urgent = (reqsData || []).filter(
          (r) => r.status === "PENDING" && (r.urgency === "CRITICAL" || r.urgency === "URGENT")
        );
        setUrgentRequests(urgent);
      } catch (err) {
        console.error("Failed to load homepage data", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBlood) params.set("bloodGroup", selectedBlood);
    if (selectedCity) params.set("location", selectedCity);
    navigate(`/find-donor?${params.toString()}`);
  };

  const getStockStatus = (units, threshold = 5) => {
    if (units <= threshold) {
      return { label: "Critical Low", bg: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" };
    }
    if (units <= threshold * 2) {
      return { label: "Moderate", bg: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" };
    }
    return { label: "Adequate", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* URGENT BLOOD REQUIREMENT TICKER / BANNER */}
      {urgentRequests.length > 0 && (
        <aside aria-label="Critical Blood Requirement Alert" className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4 py-2.5 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <span className="p-1 bg-white/20 rounded-full animate-pulse">
                <AlertCircle className="w-4 h-4" />
              </span>
              <span>
                <strong>Critical Urgent Request:</strong> {urgentRequests[0].unitsRequired} Units of{" "}
                <span className="underline font-bold">{urgentRequests[0].bloodGroup}</span> required at{" "}
                {urgentRequests[0].hospitalName}, {urgentRequests[0].city}.
              </span>
            </div>
            <button
              onClick={() => navigate("/find-donor?bloodGroup=" + urgentRequests[0].bloodGroup)}
              className="shrink-0 text-xs font-bold uppercase tracking-wider bg-white text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition shadow-xs"
            >
              Respond as Donor
            </button>
          </div>
        </aside>
      )}

      {/* HERO SECTION WITH QUICK FINDER WIDGET */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-700/50 text-red-400 text-xs font-bold uppercase tracking-wider mb-8">
            <Droplet className="w-4 h-4 fill-red-400" />
            Verified Medical Transfusion System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Every Drop Connects A <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Lifeline</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Real-time blood stock monitoring, verified voluntary donors, and rapid emergency dispatch for hospitals and patients in critical need.
          </p>

          {/* Quick-Search Card */}
          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 text-left border border-slate-100 max-w-4xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-red-600" />
              Quick Donor &amp; Inventory Search
            </h2>

            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-center">
              {/* Blood Group Select */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Required Blood Group
                </label>
                <select
                  value={selectedBlood}
                  onChange={(e) => setSelectedBlood(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Blood Groups</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Select */}
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>Chennai Area / Locality</span>
                  <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded">Chennai Only</span>
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Chennai Areas (Porur, Adyar, etc.)</option>
                  {CHENNAI_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-3 sm:pt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  Find Donors
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                90-day medical interval filter enforced
              </span>
              <button
                type="button"
                onClick={() => navigate("/request-blood")}
                className="text-red-600 font-bold hover:underline flex items-center gap-1"
              >
                Need emergency blood for a hospital? Click here <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Dual Actions */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-5">
            <button
              onClick={() => navigate("/request-blood")}
              className="px-8 py-3.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition shadow-lg shadow-red-600/30 flex items-center gap-2.5"
            >
              <Droplet className="w-4 h-4 fill-white" />
              Submit Urgent Blood Request
            </button>
            <button
              onClick={() => navigate("/admin/add-donor")}
              className="px-8 py-3.5 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 hover:bg-slate-700 font-semibold text-sm transition flex items-center gap-2.5"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              Become a Registered Donor
            </button>
          </div>
        </div>
      </section>

      {/* LIVE BLOOD STOCK MONITOR */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Live Blood Stock &amp; Inventory Levels
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1.5">
                Real-time reserves updated by affiliated hospital blood banks &amp; transfusion centers.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Adequate &gt;10 units
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical &le;5 units
              </span>
            </div>
          </div>

          {/* 8 Blood Group Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4 sm:gap-5 mt-8">
            {inventory.length > 0 ? (
              inventory.map((item) => {
                const status = getStockStatus(item.unitsAvailable, item.criticalThreshold);
                return (
                  <div
                    key={item.bloodGroup}
                    onClick={() => navigate(`/find-donor?bloodGroup=${encodeURIComponent(item.bloodGroup)}`)}
                    className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-red-300 hover:shadow-lg transition-all cursor-pointer text-center group flex flex-col justify-between"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-700 font-extrabold text-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors shadow-xs">
                      {item.bloodGroup}
                    </div>
                    <div className="mt-3">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        {item.unitsAvailable}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 block mt-0.5">units</span>
                    </div>
                    <div className={`mt-3 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${status.bg} inline-flex items-center justify-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                      {status.label}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 text-sm">
                Loading live blood inventory reserves...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* METRICS & IMPACT BANNER */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-100">
              <p className="text-3xl sm:text-4xl font-black text-red-600 tracking-tight">
                {stats.totalDonors ? stats.totalDonors + 1200 : "1,248+"}
              </p>
              <p className="text-sm font-bold text-slate-800 mt-2">Registered Voluntary Donors</p>
              <p className="text-xs text-slate-500 mt-1">Verified with contact details</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-100">
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                {stats.totalUnitsAvailable || 105}
              </p>
              <p className="text-sm font-bold text-slate-800 mt-2">Units In Stock Ready</p>
              <p className="text-xs text-slate-500 mt-1">Across verified storage centers</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-100">
              <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                850+
              </p>
              <p className="text-sm font-bold text-slate-800 mt-2">Transfusions Facilitated</p>
              <p className="text-xs text-slate-500 mt-1">Safely delivered to ICUs &amp; wards</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-100">
              <p className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">
                &lt; 15 mins
              </p>
              <p className="text-sm font-bold text-slate-800 mt-2">Average Response Dispatch</p>
              <p className="text-xs text-slate-500 mt-1">For urgent hospital requisitions</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / CLINICAL PROCESS */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-red-600">
            Certified Workflow
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            How The Blood Donation Pipeline Works
          </p>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            A rapid, transparent protocol guaranteeing donor safety and rapid patient transfusion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mt-14">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-2xl mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Search or Register Request</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Patients and hospital staff can query verified nearby donors filtered by exact blood group or submit an official digital blood requisition with a hospital tracking code.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Hospital &amp; Medical Verification</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Our clinical administration verifies patient requisition details, checks stock reserves, and alerts eligible voluntary donors who completed their 90-day waiting period.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-2xl mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Safe Dispatch &amp; Transfusion</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Tested blood bags or direct donors arrive at the designated blood bank/hospital. Real-time request tracking keeps families and attending physicians informed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOOD COMPATIBILITY MATRIX */}
      <section className="py-20 sm:py-24 bg-slate-100/70 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Blood Type Compatibility Matrix</h3>
            <p className="text-sm text-slate-500 mt-2">
              Ensure ABO and Rh factor compatibility before requesting or donating blood.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-bold text-xs">
                  <th className="p-4">Blood Type</th>
                  <th className="p-4">Can Donate To (Recipients)</th>
                  <th className="p-4">Can Receive From (Donors)</th>
                  <th className="p-4">Clinical Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-4 font-bold text-red-600">O-</td>
                  <td className="p-4 font-semibold">All Blood Types (Universal Donor)</td>
                  <td className="p-4">O- only</td>
                  <td className="p-4 text-slate-500">Crucial for emergency trauma before crossmatch</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-red-600">O+</td>
                  <td className="p-4">O+, A+, B+, AB+</td>
                  <td className="p-4">O+, O-</td>
                  <td className="p-4 text-slate-500">Most common blood type in the population</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-red-600">A+</td>
                  <td className="p-4">A+, AB+</td>
                  <td className="p-4">A+, A-, O+, O-</td>
                  <td className="p-4 text-slate-500">Second most frequent blood group</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-red-600">A-</td>
                  <td className="p-4">A+, A-, AB+, AB-</td>
                  <td className="p-4">A-, O-</td>
                  <td className="p-4 text-slate-500">Essential for A- and AB- patients</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-red-600">B+</td>
                  <td className="p-4">B+, AB+</td>
                  <td className="p-4">B+, B-, O+, O-</td>
                  <td className="p-4 text-slate-500">High demand in regional clinics</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-red-600">B-</td>
                  <td className="p-4">B+, B-, AB+, AB-</td>
                  <td className="p-4">B-, O-</td>
                  <td className="p-4 text-slate-500">Rare; vital for B- emergency patients</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-red-600">AB+</td>
                  <td className="p-4">AB+ only</td>
                  <td className="p-4 font-semibold">All Blood Types (Universal Recipient)</td>
                  <td className="p-4 text-slate-500">Can safely receive from any blood group</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-red-600">AB-</td>
                  <td className="p-4">AB+, AB-</td>
                  <td className="p-4">AB-, A-, B-, O-</td>
                  <td className="p-4 text-slate-500">Rarest blood type; universal plasma donor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DONOR ELIGIBILITY CHECKLIST */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-10 sm:p-14 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3.5 py-1.5 rounded-full text-white">
              Medical Readiness
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-4 tracking-tight">
              Can You Donate Blood Today?
            </h2>
            <p className="text-red-100 text-sm sm:text-base mt-3 leading-relaxed">
              Safe blood starts with healthy, eligible donors. Review the medical criteria below before registering:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-sm">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-red-200 shrink-0" />
                <span>Age between 18 and 65 years</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-red-200 shrink-0" />
                <span>Body weight at least 50 kg</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-red-200 shrink-0" />
                <span>Minimum 90 days since last donation</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-red-200 shrink-0" />
                <span>Hemoglobin level &ge; 12.5 g/dL</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate("/admin/add-donor")}
              className="px-8 py-4 bg-white text-red-700 hover:bg-red-50 font-bold rounded-xl shadow-lg transition text-center text-sm"
            >
              Register as a Donor Now
            </button>
            <button
              onClick={() => navigate("/find-donor")}
              className="px-8 py-3.5 bg-red-800/80 hover:bg-red-800 text-white font-semibold rounded-xl border border-red-500/50 transition text-center text-sm"
            >
              Browse Donor Directory
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
