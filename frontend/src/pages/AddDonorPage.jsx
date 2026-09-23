import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Droplet, 
  UserCheck, 
  HeartHandshake, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";
import { donorsApi } from "../api";
import { CHENNAI_AREAS } from "../constants/locations";

export default function AddDonorPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    bloodGroup: "O+",
    gender: "Male",
    age: 26,
    phone: "",
    email: "",
    city: "Chennai",
    district: "Chennai",
    area: "Porur",
    address: "",
    lastDonatedDate: "",
    totalDonations: 1,
  });

  const [eligibilityAgreed, setEligibilityAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successDonor, setSuccessDonor] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eligibilityAgreed) {
      alert("Please confirm the medical eligibility declaration before proceeding.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await donorsApi.create({
        ...formData,
        age: parseInt(formData.age) || 25,
        totalDonations: parseInt(formData.totalDonations) || 1,
      });
      setSuccessDonor(created);
    } catch (err) {
      alert("Error registering donor: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-700/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            Voluntary Transfusion Registry
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Register as a Blood Donor
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Join voluntary donors across Chennai neighborhoods (Porur, Adyar, Velachery, Anna Nagar, T. Nagar, etc.). When a local hospital enters critical need, your profile facilitates immediate life-saving support.
          </p>
        </div>
      </section>

      {/* Main Registration Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12">
          {successDonor ? (
            <div className="text-center py-8 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome to BloodLife Network!
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your voluntary donor profile for <strong>{successDonor.fullName}</strong> ({successDonor.bloodGroup}) has been recorded in our verified registry.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => navigate(`/donor/${successDonor.id}`)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20"
                >
                  View Your Donor Profile
                </button>
                <button
                  onClick={() => navigate("/find-donor")}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Browse Donor Directory
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">1. Personal &amp; Medical Details</h3>
                <p className="text-xs text-slate-500">Essential details for transfusion matching.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    placeholder="e.g. Mohammed Salman"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Age (Must be 18–65) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    required
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="donor@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900">2. Location &amp; History</h3>
                <p className="text-xs text-slate-500">Helps hospitals find nearby donors during emergencies.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City <span className="text-emerald-600 font-normal">(Chennai Region)</span>
                  </label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 flex items-center justify-between">
                    <span>Chennai</span>
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">Active Region</span>
                  </div>
                </div>

                {/* Chennai Area / Locality */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chennai Area / Locality <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={(e) => {
                      const selectedArea = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        area: selectedArea,
                        district: selectedArea,
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  >
                    {CHENNAI_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Full Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address / Landmark (in {formData.area || "Chennai"})
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={`e.g. Near Sri Ramachandra Hospital, ${formData.area || "Porur"}`}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Last Donated Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Last Donation (Leave blank if first time)
                  </label>
                  <input
                    type="date"
                    name="lastDonatedDate"
                    value={formData.lastDonatedDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Lifetime Donations */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Lifetime Donations
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="totalDonations"
                    value={formData.totalDonations}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Medical Declaration */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={eligibilityAgreed}
                    onChange={(e) => setEligibilityAgreed(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded-md border-slate-300 focus:ring-red-500 mt-0.5"
                  />
                  <span>
                    I confirm that I am aged 18–65, weigh at least 50kg, have no chronic active infections or blood-borne illnesses, and understand that voluntary donation is non-remunerated.
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-red-600/20 disabled:opacity-50"
                >
                  {submitting ? "Registering..." : "Complete Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
