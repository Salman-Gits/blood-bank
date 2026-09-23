import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  Droplet, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Filter, 
  UserCheck, 
  Heart,
  X,
  Share2,
  PhoneCall
} from "lucide-react";
import { donorsApi } from "../api";
import { CHENNAI_AREAS } from "../constants/locations";

export default function FindDonorPage() {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [eligibleOnly, setEligibleOnly] = useState(false);

  // Selected donor for contact modal
  const [contactDonor, setContactDonor] = useState(null);
  const [copied, setCopied] = useState(false);

  // Parse URL query parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const bgParam = params.get("bloodGroup");
    const locParam = params.get("location");
    if (bgParam) setBloodGroup(bgParam);
    if (locParam) setCity(locParam);
  }, [routerLocation.search]);

  // Fetch donors with current filters
  useEffect(() => {
    async function loadDonors() {
      setLoading(true);
      try {
        const results = await donorsApi.search({
          bloodGroup: bloodGroup === "ALL" ? "" : bloodGroup,
          location: city === "ALL" ? "" : city,
          query: searchQuery,
          eligibleOnly,
        });
        setDonors(results || []);
      } catch (err) {
        console.error("Failed to load donors", err);
      } finally {
        setLoading(false);
      }
    }
    loadDonors();
  }, [bloodGroup, city, searchQuery, eligibleOnly]);

  // Calculate 90-day donation eligibility
  const getEligibility = (lastDate) => {
    if (!lastDate) {
      return { isEligible: true, status: "Eligible Now", color: "bg-emerald-50 text-emerald-700 border-emerald-200", daysLeft: 0 };
    }
    const diffDays = (new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24);
    if (diffDays >= 90) {
      return { isEligible: true, status: "Eligible Now", color: "bg-emerald-50 text-emerald-700 border-emerald-200", daysLeft: 0 };
    }
    const daysLeft = Math.ceil(90 - diffDays);
    return {
      isEligible: false,
      status: `Eligible in ${daysLeft} days`,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      daysLeft,
    };
  };

  const copyPhoneNumber = (phone) => {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-700/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <UserCheck className="w-3.5 h-3.5" />
                Verified Donor Directory
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Find A Blood Donor
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Locate voluntary blood donors across Chennai areas including Porur, Adyar, Velachery, Anna Nagar, T. Nagar, Tambaram, and more.
              </p>
            </div>
            <div>
              <button
                onClick={() => navigate("/request-blood")}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-red-600/20"
              >
                + Submit Blood Requisition
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER CONTROLS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-200/80">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search donor name, area (Porur, Adyar), phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* City Dropdown */}
            <div className="md:col-span-3">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Chennai Areas</option>
                {CHENNAI_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Eligibility Toggle */}
            <div className="md:col-span-5 flex items-center justify-between md:justify-end gap-5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={eligibleOnly}
                  onChange={(e) => setEligibleOnly(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded-md border-slate-300 focus:ring-red-500"
                />
                <span>Eligible Donors Only (90+ days)</span>
              </label>

              {(bloodGroup || city || searchQuery || eligibleOnly) && (
                <button
                  onClick={() => {
                    setBloodGroup("");
                    setCity("");
                    setSearchQuery("");
                    setEligibleOnly(false);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-bold underline"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Blood Group Fast Pills */}
          <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-500 mr-2 uppercase tracking-wider">
              Blood Group:
            </span>
            <button
              onClick={() => setBloodGroup("")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                bloodGroup === ""
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Types
            </button>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
              <button
                key={bg}
                onClick={() => setBloodGroup(bloodGroup === bg ? "" : bg)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  bloodGroup === bg
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Droplet className={`w-3 h-3 ${bloodGroup === bg ? "fill-white" : "fill-red-500 text-red-500"}`} />
                {bg}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-slate-500">
            Showing <strong className="text-slate-800">{donors.length}</strong> verified voluntary donors
          </p>
          <span className="text-xs text-slate-400">
            Click on donor to view full profile &amp; contact info
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center text-slate-400 text-sm">
            Searching verified donor database...
          </div>
        ) : donors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto mt-8 shadow-sm">
            <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Donors Matching Your Criteria</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your blood group, clearing location filters, or submit an emergency blood requisition.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  setBloodGroup("");
                  setCity("");
                  setSearchQuery("");
                  setEligibleOnly(false);
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => navigate("/request-blood")}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
              >
                Request Blood
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {donors.map((donor) => {
              const elig = getEligibility(donor.lastDonatedDate);
              return (
                <div
                  key={donor.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-red-200 transition flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-lg flex items-center justify-center shadow-sm shadow-red-500/20">
                          {donor.bloodGroup}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                              {donor.fullName}
                            </h3>
                            {donor.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" title="Verified Donor" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {donor.gender}, {donor.age} yrs
                          </p>
                        </div>
                      </div>

                      {/* Eligibility Badge */}
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${elig.color} shrink-0`}>
                        {elig.status}
                      </span>
                    </div>

                    {/* Details Row */}
                    <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">{donor.area || donor.district || "Chennai"}, Chennai</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Last donated: {donor.lastDonatedDate || "First time voluntary donor"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{donor.totalDonations || 1} lifetime donations recorded</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setContactDonor(donor)}
                      className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Contact Donor
                    </button>
                    <button
                      onClick={() => navigate(`/donor/${donor.id}`)}
                      className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CONTACT DONOR MODAL */}
      {contactDonor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setContactDonor(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center">
                {contactDonor.bloodGroup}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{contactDonor.fullName}</h3>
                <p className="text-xs text-slate-500">
                  {contactDonor.city} • {contactDonor.gender}, {contactDonor.age} yrs
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 mb-5">
              <strong>Transfusion Protocol:</strong> Please confirm with the attending doctor and hospital blood bank before scheduling donor transit.
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
                  <a href={`tel:${contactDonor.phone}`} className="text-base font-bold text-slate-900 hover:text-red-600">
                    +91 {contactDonor.phone}
                  </a>
                </div>
                <button
                  onClick={() => copyPhoneNumber(contactDonor.phone)}
                  className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {contactDonor.email && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                  <p className="text-sm font-semibold text-slate-900">{contactDonor.email}</p>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Location / Chennai Area</span>
                <p className="text-sm text-slate-700">{contactDonor.address ? `${contactDonor.address}, ` : ""}{contactDonor.area || contactDonor.district || "Chennai"}, Chennai</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`tel:${contactDonor.phone}`}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-red-600/20"
              >
                <PhoneCall className="w-4 h-4" />
                Call Directly
              </a>
              <button
                onClick={() => {
                  const id = contactDonor.id;
                  setContactDonor(null);
                  navigate(`/donor/${id}`);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm"
              >
                Full Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
