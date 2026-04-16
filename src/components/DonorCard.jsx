// src/components/DonorCard.jsx
import { useNavigate } from "react-router-dom";

export default function DonorCard({ donor }) {
  const navigate = useNavigate();

  // Check eligibility (90+ days)
  const daysDiff =
    (new Date() - new Date(donor.lastDonated)) / (1000 * 60 * 60 * 24);

  const eligible = daysDiff >= 90;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-5 border border-gray-200">
      {/* Top section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{donor.name}</h2>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            eligible
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {eligible ? "Eligible" : "Not Eligible"}
        </span>
      </div>

      {/* Blood group */}
      <div className="mt-3 flex items-center gap-2 text-red-600 font-bold text-lg">
        🩸 <span>{donor.bloodGroup}</span>
      </div>

      {/* Location */}
      <div className="mt-2 flex items-center gap-2 text-gray-600">
        📍 <span>{donor.location}</span>
      </div>

      {/* Last donated */}
      <p className="text-gray-500 text-sm mt-1">
        Last donated: <b>{donor.lastDonated}</b>
      </p>

      {/* Buttons */}
      <div className="mt-5 flex justify-between">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
          onClick={() => navigate(`/donor/${donor.id}`)}
        >
          View Profile
        </button>

        <a
          href={`tel:${donor.phone}`}
          className="bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
        >
          📞 Call
        </a>
      </div>
    </div>
  );
}