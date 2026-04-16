import { useState } from "react";
import DonorCard from "../components/DonorCard";
import SearchBar from "../components/SearchBar";
import BloodGroupDropdown from "../components/BloodGroupDropdown";

// TEMPORARY DUMMY DATA (will replace with backend)
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

export default function PublicDonorPage() {
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [eligibleOnly, setEligibleOnly] = useState(false);

  // *** FIXED FILTER LOGIC ***
  const filteredDonors = donorsData.filter((donor) => {
    const isNameMatch = donor.name.toLowerCase().includes(search.toLowerCase());
    const isBloodMatch = bloodGroup === "" || donor.bloodGroup === bloodGroup;
    const isLocationMatch =
      location === "" || donor.location.toLowerCase() === location.toLowerCase();

    // ******** ELIGIBLE CHECK (FINAL WORKING VERSION) ********
    let isEligible = true; // default → show all donors

    if (eligibleOnly) {
      const lastDate = new Date(donor.lastDonated);
      const today = new Date();

      const diffTime = today - lastDate; // milliseconds
      const daysDiff = diffTime / (1000 * 60 * 60 * 24); // convert to days

      isEligible = daysDiff >= 90; // Only show if 90+ days
    }

    return isNameMatch && isBloodMatch && isLocationMatch && isEligible;
  });

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        Find a Blood Donor
      </h1>

      {/* Filters */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">

        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

        <BloodGroupDropdown value={bloodGroup} onChange={setBloodGroup} />

        <select
          className="border p-3 rounded-lg"
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
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={eligibleOnly}
            onChange={() => setEligibleOnly(!eligibleOnly)}
          />
          Show only eligible donors (90+ days)
        </label>
      </div>

      {/* Donor Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {filteredDonors.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No donors found.</p>
        ) : (
          filteredDonors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))
        )}
      </div>
    </div>
  );
}