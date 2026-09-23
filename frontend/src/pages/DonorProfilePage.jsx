import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Droplet, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Heart, 
  ArrowLeft, 
  Share2, 
  PhoneCall, 
  Mail, 
  AlertCircle 
} from "lucide-react";
import { donorsApi } from "../api";

export default function DonorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadDonor() {
      setLoading(true);
      try {
        const data = await donorsApi.getById(id);
        setDonor(data);
      } catch (err) {
        console.error("Failed to load donor profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadDonor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <p className="text-slate-500 font-medium">Loading medical donor profile...</p>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <Droplet className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Donor Profile Not Found</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-sm">
          The requested donor record could not be retrieved from the central registry.
        </p>
        <button
          onClick={() => navigate("/find-donor")}
          className="mt-6 px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700"
        >
          Return to Donor Directory
        </button>
      </div>
    );
  }

  // Calculate 90-day donation eligibility
  const diffDays = donor.lastDonatedDate
    ? (new Date() - new Date(donor.lastDonatedDate)) / (1000 * 60 * 60 * 24)
    : 100;
  const isEligible = diffDays >= 90;
  const daysRemaining = Math.max(0, Math.ceil(90 - diffDays));

  // Blood compatibility facts
  const getCompatibility = (bg) => {
    switch (bg) {
      case "O-":
        return {
          give: "All blood groups (Universal Donor)",
          receive: "O- only",
        };
      case "O+":
        return {
          give: "O+, A+, B+, AB+",
          receive: "O+, O-",
        };
      case "A+":
        return {
          give: "A+, AB+",
          receive: "A+, A-, O+, O-",
        };
      case "A-":
        return {
          give: "A+, A-, AB+, AB-",
          receive: "A-, O-",
        };
      case "B+":
        return {
          give: "B+, AB+",
          receive: "B+, B-, O+, O-",
        };
      case "B-":
        return {
          give: "B+, B-, AB+, AB-",
          receive: "B-, O-",
        };
      case "AB+":
        return {
          give: "AB+ only",
          receive: "All blood groups (Universal Recipient)",
        };
      case "AB-":
        return {
          give: "AB+, AB-",
          receive: "AB-, A-, B-, O-",
        };
      default:
        return {
          give: "Compatible ABO types",
          receive: "Compatible ABO types",
        };
    }
  };

  const compat = getCompatibility(donor.bloodGroup);

  const copyPhone = () => {
    navigator.clipboard.writeText(donor.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-red-500/30 shrink-0">
                {donor.bloodGroup}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {donor.fullName}
                  </h1>
                  {donor.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified Voluntary Donor
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 mt-1">
                  {donor.gender} • {donor.age} Years Old • Registered Transfusion Contributor
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                  <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span className="font-semibold text-white">{donor.area || donor.district || "Chennai"}</span>, Chennai
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                    {donor.totalDonations || 1} Lifetime Donations
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Eligibility Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                isEligible
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isEligible ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
                  }`}
                >
                  {isEligible ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {isEligible ? "Medically Eligible for Blood Donation" : "In Mandatory Waiting Period"}
                  </h4>
                  <p className="text-xs opacity-80 mt-0.5">
                    {isEligible
                      ? "Cleared by the 90-day whole blood interval protocol."
                      : `Eligible to donate again in ${daysRemaining} days.`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-white/70 rounded-lg shrink-0">
                {isEligible ? "Ready Now" : `Wait ${daysRemaining}d`}
              </span>
            </div>

            {/* Compatibility Grid */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-red-600" />
                Transfusion Compatibility Profile ({donor.bloodGroup})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Can Donate Red Cells To:</span>
                  <p className="font-semibold text-emerald-700">{compat.give}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Can Receive Red Cells From:</span>
                  <p className="font-semibold text-blue-700">{compat.receive}</p>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Contact &amp; Dispatch Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block uppercase font-semibold text-[10px]">Direct Phone</span>
                    <a href={`tel:${donor.phone}`} className="text-sm font-bold text-slate-900 hover:text-red-600">
                      +91 {donor.phone}
                    </a>
                  </div>
                  <button
                    onClick={copyPhone}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 font-semibold"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block uppercase font-semibold text-[10px]">Email Contact</span>
                  <p className="text-sm font-semibold text-slate-800">{donor.email || "Confidential"}</p>
                </div>
              </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-slate-400 block uppercase font-semibold text-[10px]">Location / Chennai Area</span>
                  <p className="text-slate-700 mt-0.5">{donor.address ? `${donor.address}, ` : ""}{donor.area || donor.district || "Chennai"}, Chennai</p>
                </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
              <a
                href={`tel:${donor.phone}`}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-red-600/20"
              >
                <PhoneCall className="w-4 h-4" /> Call Donor Directly
              </a>
              <button
                onClick={() => navigate(`/request-blood?bloodGroup=${encodeURIComponent(donor.bloodGroup)}`)}
                className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm text-center flex items-center justify-center gap-2"
              >
                <Droplet className="w-4 h-4" /> Request Blood for Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
