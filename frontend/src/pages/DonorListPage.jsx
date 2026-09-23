import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  Search, 
  Droplet, 
  Edit2, 
  Trash2, 
  UserCheck, 
  UserX, 
  Plus, 
  X, 
  Save, 
  Phone, 
  MapPin, 
  Calendar,
  ArrowLeft
} from "lucide-react";
import { donorsApi } from "../api";
import { CHENNAI_AREAS } from "../constants/locations";

export default function DonorListPage() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");

  // Edit Modal State
  const [editingDonor, setEditingDonor] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadDonors = async () => {
    setLoading(true);
    try {
      const data = await donorsApi.search({
        bloodGroup: bloodGroupFilter,
        query: search,
      });
      setDonors(data || []);
    } catch (err) {
      console.error("Failed to load donors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, [bloodGroupFilter, search]);

  const handleToggleAvailability = async (id) => {
    try {
      await donorsApi.toggleAvailability(id);
      loadDonors();
    } catch (err) {
      alert("Error toggling availability: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the donor registry?`)) {
      try {
        await donorsApi.delete(id);
        loadDonors();
      } catch (err) {
        alert("Error deleting donor: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await donorsApi.update(editingDonor.id, editingDonor);
      setEditingDonor(null);
      loadDonors();
    } catch (err) {
      alert("Error updating donor: " + (err.response?.data?.message || err.message));
    } finally {
      setSavingEdit(false);
    }
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
              Registered Voluntary Donors
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive donor registry with administrative controls and real-time availability toggles.
            </p>
          </div>

          <Link
            to="/admin/add-donor"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-red-600/20 flex items-center gap-1.5 w-fit"
          >
            <Plus className="w-4 h-4" /> Add New Donor
          </Link>
        </div>
      </section>

      {/* SEARCH & FILTER CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-88">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, area (Porur, Adyar), phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setBloodGroupFilter("")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                bloodGroupFilter === ""
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Types
            </button>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
              <button
                key={bg}
                onClick={() => setBloodGroupFilter(bloodGroupFilter === bg ? "" : bg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  bloodGroupFilter === bg
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DONORS TABLE / LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Total records: <strong>{donors.length}</strong> (Chennai Region)
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Loading donor records...
            </div>
          ) : donors.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No donor records matching your query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3.5">Donor Name</th>
                    <th className="p-3.5">Blood Group</th>
                    <th className="p-3.5">Demographics</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">Chennai Area</th>
                    <th className="p-3.5">Last Donated</th>
                    <th className="p-3.5">Availability</th>
                    <th className="p-3.5 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {donors.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5">
                        <Link
                          to={`/donor/${d.id}`}
                          className="font-bold text-slate-900 hover:text-red-600 block"
                        >
                          {d.fullName}
                        </Link>
                        <span className="text-[10px] text-slate-400">ID #{d.id}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-extrabold flex items-center justify-center text-xs">
                          {d.bloodGroup}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800">{d.gender}</span>
                        <span className="text-slate-500 ml-1">({d.age} yrs)</span>
                      </td>

                      <td className="p-3.5 font-medium">
                        <a href={`tel:${d.phone}`} className="text-slate-900 hover:text-red-600 block">
                          +91 {d.phone}
                        </a>
                        {d.email && (
                          <span className="text-[10px] text-slate-400 block">{d.email}</span>
                        )}
                      </td>

                      <td className="p-3.5 font-medium">
                        <span className="font-bold text-slate-900">{d.area || d.district || "Chennai"}</span>, <span className="text-slate-400">Chennai</span>
                      </td>

                      <td className="p-3.5">
                        {d.lastDonatedDate ? (
                          <span className="font-mono text-slate-700">{d.lastDonatedDate}</span>
                        ) : (
                          <span className="text-slate-400 italic">No record</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleAvailability(d.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition flex items-center gap-1 border ${
                            d.isAvailable
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${d.isAvailable ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                          {d.isAvailable ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => setEditingDonor({ ...d })}
                          className="p-1.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition"
                          title="Edit Donor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id, d.fullName)}
                          className="p-1.5 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition"
                          title="Delete Donor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* EDIT DONOR MODAL */}
      {editingDonor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingDonor(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-red-600" />
              Edit Donor Record #{editingDonor.id}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingDonor.fullName}
                  onChange={(e) => setEditingDonor({ ...editingDonor, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={editingDonor.bloodGroup}
                    onChange={(e) => setEditingDonor({ ...editingDonor, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={editingDonor.age}
                    onChange={(e) => setEditingDonor({ ...editingDonor, age: parseInt(e.target.value) || 25 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={editingDonor.phone}
                    onChange={(e) => setEditingDonor({ ...editingDonor, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chennai Area</label>
                  <select
                    value={editingDonor.area || editingDonor.district || "Porur"}
                    onChange={(e) => setEditingDonor({ ...editingDonor, area: e.target.value, district: e.target.value, city: "Chennai" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 font-semibold"
                  >
                    {CHENNAI_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingDonor.email || ""}
                  onChange={(e) => setEditingDonor({ ...editingDonor, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Donated Date</label>
                <input
                  type="date"
                  value={editingDonor.lastDonatedDate || ""}
                  onChange={(e) => setEditingDonor({ ...editingDonor, lastDonatedDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDonor(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-xs disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
