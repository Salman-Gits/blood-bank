import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  MessageSquare, 
  Building2, 
  Phone, 
  Calendar, 
  X, 
  Search, 
  ArrowLeft,
  Share2,
  Droplet
} from "lucide-react";
import { requestsApi } from "../api";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Selected request for remarks modal or full details modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remarksModalOpen, setRemarksModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState("");
  const [adminRemarks, setAdminRemarks] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await requestsApi.getAll(statusFilter);
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load blood requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const openStatusChange = (req, newStatus) => {
    setSelectedRequest(req);
    setTargetStatus(newStatus);
    setAdminRemarks(req.adminRemarks || "");
    setRemarksModalOpen(true);
  };

  const submitStatusChange = async (e) => {
    e.preventDefault();
    if (!selectedRequest || !targetStatus) return;
    setUpdating(true);
    try {
      await requestsApi.updateStatus(selectedRequest.id, targetStatus, adminRemarks);
      setRemarksModalOpen(false);
      setSelectedRequest(null);
      loadRequests();
    } catch (err) {
      alert("Error updating status: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id, trackingCode) => {
    if (window.confirm(`Permanently delete requisition #${trackingCode}?`)) {
      try {
        await requestsApi.delete(id);
        loadRequests();
      } catch (err) {
        alert("Error deleting request: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.patientName?.toLowerCase().includes(q) ||
      r.trackingCode?.toLowerCase().includes(q) ||
      r.hospitalName?.toLowerCase().includes(q) ||
      r.contactPhone?.includes(q) ||
      r.bloodGroup?.toLowerCase().includes(q)
    );
  });

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-800 border-amber-300";
      case "APPROVED":
        return "bg-blue-50 text-blue-800 border-blue-300";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "REJECTED":
        return "bg-rose-50 text-rose-800 border-rose-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
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
              Hospital Blood Requisitions
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review emergency requests, verify physician prescriptions, and authorize blood component dispatch.
            </p>
          </div>

          <Link
            to="/request-blood"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-red-600/20 w-fit"
          >
            + Create New Requisition
          </Link>
        </div>
      </section>

      {/* FILTER TABS & SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {[
              { label: "All Requests", val: "ALL" },
              { label: "Pending Review", val: "PENDING" },
              { label: "Approved & Reserved", val: "APPROVED" },
              { label: "Dispensed / Completed", val: "COMPLETED" },
              { label: "Rejected", val: "REJECTED" },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setStatusFilter(tab.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  statusFilter === tab.val
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, patient, hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </section>

      {/* TABLE / LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Loading clinical requisitions...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No requisitions found matching current filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3.5">Requisition ID</th>
                    <th className="p-3.5">Patient Details</th>
                    <th className="p-3.5">Blood &amp; Units</th>
                    <th className="p-3.5">Hospital &amp; Location</th>
                    <th className="p-3.5">Urgency</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Needed Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {req.trackingCode}
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{req.patientName}</div>
                        <div className="text-[11px] text-slate-500">
                          Attendant: {req.contactPerson} ({req.contactPhone})
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-7 h-7 rounded-md bg-red-100 text-red-700 font-extrabold flex items-center justify-center text-xs">
                            {req.bloodGroup}
                          </span>
                          <span className="font-bold text-slate-800">
                            {req.unitsRequired} Bag{req.unitsRequired > 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{req.hospitalName}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{req.area || req.district || "Chennai"}, Chennai</div>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] border ${getUrgencyBadge(req.urgency)}`}>
                          {req.urgency}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-700">
                        {req.requiredDate}
                      </td>

                      <td className="p-3.5 text-right space-x-1.5">
                        {req.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => openStatusChange(req, "APPROVED")}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px]"
                              title="Approve & Allocate Units"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openStatusChange(req, "REJECTED")}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-bold text-[11px]"
                              title="Reject Request"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {req.status === "APPROVED" && (
                          <button
                            onClick={() => openStatusChange(req, "COMPLETED")}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                            title="Mark Dispensed & Delivered"
                          >
                            Dispense
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px]"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleDelete(req.id, req.trackingCode)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                          title="Delete Request"
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

      {/* STATUS CHANGE / REMARKS MODAL */}
      {remarksModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setRemarksModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Update Status to: <span className="text-red-600">{targetStatus}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Requisition #{selectedRequest.trackingCode} for {selectedRequest.patientName} ({selectedRequest.bloodGroup})
            </p>

            {targetStatus === "COMPLETED" && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <strong>Inventory Notice:</strong> Marking this request as COMPLETED will automatically deduct <strong>{selectedRequest.unitsRequired} unit(s)</strong> of <strong>{selectedRequest.bloodGroup}</strong> from central blood stock.
              </div>
            )}

            <form onSubmit={submitStatusChange} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Doctor / Administrative Remarks
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Crossmatch cleared. Dispatched 2 units via cold-chain courier to Apollo ICU."
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRemarksModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-xs disabled:opacity-50"
                >
                  {updating ? "Saving..." : `Confirm ${targetStatus}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL DETAILS MODAL */}
      {!remarksModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center">
                {selectedRequest.bloodGroup}
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">
                  {selectedRequest.trackingCode}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedRequest.patientName}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Units Required</span>
                <p className="font-bold text-slate-900">{selectedRequest.unitsRequired} Bag(s)</p>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Urgency</span>
                <p className="font-bold text-red-600">{selectedRequest.urgency}</p>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Hospital Facility</span>
                <p className="font-semibold text-slate-800">{selectedRequest.hospitalName}, {selectedRequest.area || selectedRequest.district || "Chennai"}, Chennai</p>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Date Needed</span>
                <p className="font-semibold text-slate-800">{selectedRequest.requiredDate}</p>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Attendant Person</span>
                <p className="font-semibold text-slate-800">{selectedRequest.contactPerson}</p>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Contact Phone</span>
                <a href={`tel:${selectedRequest.contactPhone}`} className="font-bold text-red-600 hover:underline">
                  +91 {selectedRequest.contactPhone}
                </a>
              </div>
            </div>

            {selectedRequest.medicalReason && (
              <div className="mb-4">
                <span className="text-slate-500 block uppercase font-bold text-[10px] mb-1">
                  Diagnosis / Reason
                </span>
                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                  {selectedRequest.medicalReason}
                </p>
              </div>
            )}

            {selectedRequest.adminRemarks && (
              <div className="mb-4">
                <span className="text-slate-500 block uppercase font-bold text-[10px] mb-1">
                  Clinical Audit Remarks
                </span>
                <p className="text-xs text-slate-700 bg-amber-50 p-3 rounded-lg border border-amber-200 italic">
                  "{selectedRequest.adminRemarks}"
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
