import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Droplet, 
  Hospital, 
  Phone, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Clock, 
  Copy, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  User
} from "lucide-react";
import { requestsApi, inventoryApi } from "../api";
import { CHENNAI_AREAS } from "../constants/locations";

export default function RequestBloodPage() {
  const routerLocation = useLocation();
  const navigate = useNavigate();

  // Active Tab: 'request' or 'track'
  const [activeTab, setActiveTab] = useState("request");

  // Requisition Form State
  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "O+",
    unitsRequired: 2,
    hospitalName: "",
    city: "Chennai",
    district: "Chennai",
    area: "Porur",
    contactPerson: "",
    contactPhone: "",
    urgency: "URGENT",
    requiredDate: new Date().toISOString().split("T")[0],
    medicalReason: "",
  });

  // Track Code State
  const [trackingInput, setTrackingInput] = useState("");
  const [trackedRequest, setTrackedRequest] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [copied, setCopied] = useState(false);

  // Inventory preview
  const [availableUnits, setAvailableUnits] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const bg = params.get("bloodGroup");
    const track = params.get("track");
    if (bg) {
      setForm((prev) => ({ ...prev, bloodGroup: bg }));
    }
    if (track) {
      setActiveTab("track");
      setTrackingInput(track);
      handleTrackQuery(track);
    }
  }, [routerLocation.search]);

  // Check inventory for chosen blood group
  useEffect(() => {
    async function checkStock() {
      try {
        const item = await inventoryApi.getByBloodGroup(form.bloodGroup);
        setAvailableUnits(item ? item.unitsAvailable : 0);
      } catch (err) {
        setAvailableUnits(null);
      }
    }
    checkStock();
  }, [form.bloodGroup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await requestsApi.create(form);
      setSubmittedRequest(created);
    } catch (err) {
      alert("Error submitting request: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackQuery = async (codeToSearch) => {
    const code = (codeToSearch || trackingInput).trim();
    if (!code) return;
    setTrackLoading(true);
    setTrackError("");
    setTrackedRequest(null);
    try {
      const result = await requestsApi.getByTrackingCode(code);
      if (result) {
        setTrackedRequest(result);
      } else {
        setTrackError("No requisition found with tracking ID: " + code);
      }
    } catch (err) {
      setTrackError("Could not retrieve tracking details. Please verify the code.");
    } finally {
      setTrackLoading(false);
    }
  };

  const copyTrackingCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-300";
      case "URGENT":
        return "bg-amber-100 text-amber-700 border-amber-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "APPROVED":
        return 2;
      case "COMPLETED":
        return 3;
      case "REJECTED":
        return -1;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-700/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Droplet className="w-3.5 h-3.5 fill-red-400" />
            Hospital &amp; Emergency Blood Requisitions
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Patient Blood Requisition Center
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Submit an official request for whole blood or packed red cells, or track an existing medical requisition in real-time.
          </p>

          {/* Tab Switcher */}
          <div className="mt-8 inline-flex p-1 bg-slate-800 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab("request")}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "request"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              New Blood Request
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "track"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-4 h-4" />
              Track Requisition Status
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-16">
        {/* TAB 1: NEW REQUEST FORM */}
        {activeTab === "request" && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12">
            {submittedRequest ? (
              /* Success Confirmation View */
              <div className="text-center py-6 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Requisition Submitted Successfully
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Your blood request has been logged into the emergency transfusion network.
                </p>

                {/* Tracking Code Highlight Box */}
                <div className="my-6 max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Requisition Tracking Code
                    </span>
                    <span className="text-xl font-black text-slate-900 tracking-wider">
                      {submittedRequest.trackingCode}
                    </span>
                  </div>
                  <button
                    onClick={() => copyTrackingCode(submittedRequest.trackingCode)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                </div>

                <div className="text-xs text-slate-600 max-w-md mx-auto bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-left space-y-1.5">
                  <p>
                    <strong>Patient:</strong> {submittedRequest.patientName} ({submittedRequest.bloodGroup}, {submittedRequest.unitsRequired} Units)
                  </p>
                  <p>
                    <strong>Hospital:</strong> {submittedRequest.hospitalName}, {submittedRequest.city}
                  </p>
                  <p>
                    <strong>Urgency:</strong> {submittedRequest.urgency}
                  </p>
                  <p className="text-blue-700 font-medium pt-1">
                    Save this tracking code to check hospital dispatch progress.
                  </p>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmittedRequest(null);
                      setForm({
                        patientName: "",
                        bloodGroup: "O+",
                        unitsRequired: 2,
                        hospitalName: "",
                        city: "Chennai",
                        district: "Chennai",
                        contactPerson: "",
                        contactPhone: "",
                        urgency: "URGENT",
                        requiredDate: new Date().toISOString().split("T")[0],
                        medicalReason: "",
                      });
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Submit Another Request
                  </button>
                  <button
                    onClick={() => {
                      const code = submittedRequest.trackingCode;
                      setSubmittedRequest(null);
                      setActiveTab("track");
                      setTrackingInput(code);
                      handleTrackQuery(code);
                    }}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20"
                  >
                    Track Status Now
                  </button>
                </div>
              </div>
            ) : (
              /* Request Input Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Patient &amp; Clinical Information</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please provide accurate hospital records for transfusion matching.
                  </p>
                </div>

                {/* Stock Notice Pill */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-red-600" />
                    <span>
                      Live Central Blood Bank Stock for <strong>{form.bloodGroup}</strong>:
                    </span>
                    <strong className="text-slate-900">
                      {availableUnits !== null ? `${availableUnits} units available` : "Checking stock..."}
                    </strong>
                  </div>
                  {availableUnits !== null && availableUnits < 5 && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      Low Stock - Donors will be notified
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Patient Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh S."
                      value={form.patientName}
                      onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Blood Group Required <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.bloodGroup}
                      onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    >
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Units Required */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Units Required (Bags) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={form.unitsRequired}
                      onChange={(e) => setForm({ ...form, unitsRequired: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Urgency Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.urgency}
                      onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    >
                      <option value="CRITICAL">Critical Emergency (Immediate / ICU)</option>
                      <option value="URGENT">Urgent (Within 24 Hours)</option>
                      <option value="NORMAL">Normal / Scheduled Transfusion</option>
                    </select>
                  </div>

                  {/* Hospital Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hospital / Clinic Name &amp; Ward <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sri Ramachandra Medical Centre (Porur) or Fortis Malar"
                      value={form.hospitalName}
                      onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Chennai Area / Locality */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Chennai Area / Locality <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-red-600 bg-red-50 font-bold px-1.5 py-0.5 rounded">Chennai Only</span>
                    </label>
                    <select
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value, district: e.target.value, city: "Chennai" })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    >
                      {CHENNAI_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Required Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date Required By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={form.requiredDate}
                      onChange={(e) => setForm({ ...form, requiredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Person / Attendant <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Attendant Name or Doctor"
                      value={form.contactPerson}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone (WhatsApp / Calls) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Medical Reason */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Medical Diagnosis / Reason for Transfusion
                    </label>
                    <textarea
                      rows="3"
                      placeholder="e.g. Scheduled cardiac bypass surgery, severe anemia, accident trauma recovery..."
                      value={form.medicalReason}
                      onChange={(e) => setForm({ ...form, medicalReason: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    * All requests are verified by blood bank administrators.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Droplet className="w-4 h-4 fill-white" />
                    {submitting ? "Submitting Requisition..." : "Submit Blood Requisition"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: TRACK STATUS */}
        {activeTab === "track" && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Track Blood Requisition</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your unique Requisition ID (e.g. REQ-2026-1001) to view real-time clinical review and dispatch status.
              </p>
            </div>

            {/* Tracking Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Tracking ID (e.g. REQ-2026-1001)"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrackQuery()}
                  className="w-full pl-9 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                onClick={() => handleTrackQuery()}
                disabled={trackLoading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
              >
                {trackLoading ? "Searching..." : "Track Status"}
              </button>
            </div>

            {/* Quick Demo Requisition Buttons */}
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span>Try sample codes:</span>
              {["REQ-2026-1001", "REQ-2026-1002", "REQ-2026-1003", "REQ-2026-1004"].map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setTrackingInput(code);
                    handleTrackQuery(code);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px]"
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Error message */}
            {trackError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {/* Tracked Request Card */}
            {trackedRequest && (
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Tracking Code
                    </span>
                    <h4 className="text-xl font-black text-slate-900 tracking-wide font-mono">
                      {trackedRequest.trackingCode}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getUrgencyBadge(trackedRequest.urgency)}`}>
                      {trackedRequest.urgency}
                    </span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-900 text-white uppercase">
                      Status: {trackedRequest.status}
                    </span>
                  </div>
                </div>

                {/* Clinical Timeline */}
                <div>
                  <h5 className="text-xs font-bold uppercase text-slate-500 mb-4">
                    Clinical Workflow Progress
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-2">
                        1
                      </span>
                      <p className="font-bold text-slate-900">Request Received</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Logged in registry</p>
                    </div>

                    <div className={`p-3 rounded-xl border shadow-xs ${
                      getStatusStepIndex(trackedRequest.status) >= 1
                        ? "bg-white border-emerald-300"
                        : "bg-slate-100 border-slate-200 opacity-60"
                    }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold mb-2 ${
                        getStatusStepIndex(trackedRequest.status) >= 1 ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"
                      }`}>
                        2
                      </span>
                      <p className="font-bold text-slate-900">Medical Review</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Doctor validation</p>
                    </div>

                    <div className={`p-3 rounded-xl border shadow-xs ${
                      getStatusStepIndex(trackedRequest.status) >= 2
                        ? "bg-white border-emerald-300"
                        : "bg-slate-100 border-slate-200 opacity-60"
                    }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold mb-2 ${
                        getStatusStepIndex(trackedRequest.status) >= 2 ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"
                      }`}>
                        3
                      </span>
                      <p className="font-bold text-slate-900">Approved &amp; Reserved</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Units allocated</p>
                    </div>

                    <div className={`p-3 rounded-xl border shadow-xs ${
                      getStatusStepIndex(trackedRequest.status) >= 3
                        ? "bg-white border-emerald-300"
                        : "bg-slate-100 border-slate-200 opacity-60"
                    }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold mb-2 ${
                        getStatusStepIndex(trackedRequest.status) >= 3 ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"
                      }`}>
                        4
                      </span>
                      <p className="font-bold text-slate-900">Dispensed / Completed</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Transfusion delivered</p>
                    </div>
                  </div>
                </div>

                {/* Patient & Hospital Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Patient Name</span>
                    <p className="text-sm font-bold text-slate-900">{trackedRequest.patientName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Blood Group &amp; Units</span>
                    <p className="text-sm font-bold text-red-600">
                      {trackedRequest.bloodGroup} • {trackedRequest.unitsRequired} Bag(s)
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Hospital Facility & Locality</span>
                    <p className="text-sm text-slate-800 font-semibold">{trackedRequest.hospitalName}, {trackedRequest.area || trackedRequest.district || "Chennai"}, Chennai</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Attendant / Phone</span>
                    <p className="text-sm text-slate-800 font-semibold">
                      {trackedRequest.contactPerson} ({trackedRequest.contactPhone})
                    </p>
                  </div>
                  {trackedRequest.adminRemarks && (
                    <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                      <span className="text-slate-400 block uppercase font-bold text-[10px]">Doctor / Administrator Remarks</span>
                      <p className="text-xs text-slate-700 italic bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1">
                        "{trackedRequest.adminRemarks}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
