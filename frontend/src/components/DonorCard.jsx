import React from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, MapPin, Calendar, CheckCircle2, Clock, Phone } from "lucide-react";

export default function DonorCard({ donor, onContact }) {
  const navigate = useNavigate();

  const diffDays = donor.lastDonatedDate
    ? (new Date() - new Date(donor.lastDonatedDate)) / (1000 * 60 * 60 * 24)
    : 100;
  const eligible = diffDays >= 90;
  const daysRemaining = Math.max(0, Math.ceil(90 - diffDays));

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-red-200 transition flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-lg flex items-center justify-center shadow-xs">
              {donor.bloodGroup}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                {donor.fullName || donor.name}
              </h3>
              <p className="text-xs text-slate-500">
                {donor.gender || "Donor"}, {donor.age ? `${donor.age} yrs` : ""}
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-md border shrink-0 ${
              eligible
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {eligible ? "Eligible Now" : `In ${daysRemaining}d`}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{donor.city || donor.location || "Central District"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Last Donated: {donor.lastDonatedDate || donor.lastDonated || "First time donor"}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
        {onContact ? (
          <button
            onClick={() => onContact(donor)}
            className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            Contact
          </button>
        ) : (
          <a
            href={`tel:${donor.phone}`}
            className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
        )}
        <button
          onClick={() => navigate(`/donor/${donor.id}`)}
          className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          Profile
        </button>
      </div>
    </div>
  );
}
