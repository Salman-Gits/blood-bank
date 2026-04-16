// src/pages/FindDonorPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dummy data (replace with backend fetch later)
const donorsData = [
  {
    id: 1,
    name: "Mohammed",
    bloodGroup: "A+",
    location: "Chennai",
    lastDonated: "2025-12-10",
    phone: "9876543210",
  },
  {
    id: 2,
    name: "Arun",
    bloodGroup: "O+",
    location: "Chennai",
    lastDonated: "2025-11-20",
    phone: "9944332211",
  },
  {
    id: 3,
    name: "Vijay",
    bloodGroup: "B-",
    location: "Madurai",
    lastDonated: "2025-10-01",
    phone: "9000000000",
  },
];

export default function FindDonorPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [eligibleOnly, setEligibleOnly] = useState(false);

  // FILTER LOGIC
  const filteredDonors = donorsData.filter((donor) => {
    const matchName = donor.name.toLowerCase().includes(search.toLowerCase());
    const matchBlood = bloodGroup === "" || donor.bloodGroup === bloodGroup;
    const matchLocation =
      location === "" ||
      donor.location.toLowerCase() === location.toLowerCase();

    const daysDiff =
      (new Date() - new Date(donor.lastDonated)) / (1000 * 60 * 60 * 24);

    const isEligible = daysDiff >= 90;
    const passEligibleFilter = !eligibleOnly || isEligible;

    return matchName && matchBlood && matchLocation && passEligibleFilter;
  });

  // Function to calculate eligibility
  const getEligibility = (lastDate) => {
    const daysDiff =
      (new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24);

    if (daysDiff >= 90)
      return { status: "Eligible", color: "bg-green-100 text-green-700", daysLeft: 0 };

    return {
      status: "Not Eligible",
      color: "bg-red-100 text-red-600",
      daysLeft: Math.ceil(90 - daysDiff),
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        Find a Blood Donor
      </h1>

      {/* Filters */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search donor name"
          className="p-3 border rounded-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-lg shadow-sm"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          className="p-3 border rounded-lg shadow-sm"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Select Location</option>
          <option value="Chennai">Chennai</option>
          <option value="Madurai">Madurai</option>
          <option value="Coimbatore">Coimbatore</option>
        </select>
      </div>

      {/* Eligible Filter */}
      <div className="max-w-5xl mx-auto mt-4">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <input
            type="checkbox"
            checked={eligibleOnly}
            onChange={() => setEligibleOnly(!eligibleOnly)}
          />
          Show only eligible donors (90+ days)
        </label>
      </div>

      {/* Donor Cards */}
      <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredDonors.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No donors match the search.
          </p>
        ) : (
          filteredDonors.map((donor) => {
            const eligibility = getEligibility(donor.lastDonated);

            return (
              <div
                key={donor.id}
                onClick={() => navigate(`/donor/${donor.id}`)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition border border-gray-200"
              >
                {/* Blood Group Badge */}
                <div className="flex justify-end">
                  <span className="px-3 py-1 bg-red-100 text-red-700 font-bold text-sm rounded-full">
                    {donor.bloodGroup}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mt-2">
                  {donor.name}
                </h3>

                <p className="text-gray-600 mt-1 font-medium">
                  📍 {donor.location}
                </p>

                {/* Eligibility */}
                <div
                  className={`mt-4 px-3 py-2 rounded-lg text-sm font-semibold ${eligibility.color}`}
                >
                  {eligibility.status}
                  {eligibility.daysLeft > 0 &&
                    ` — Eligible in ${eligibility.daysLeft} days`}
                </div>

                {/* Footer */}
                <p className="text-gray-500 mt-3 text-sm">
                  Tap to view full details →
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}