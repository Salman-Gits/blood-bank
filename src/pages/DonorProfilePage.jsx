// src/pages/DonorProfilePage.jsx
import { useParams } from "react-router-dom";

// Temporary sample donors (replace with backend data later)
const donorsData = [
  {
    id: 1,
    name: "Mohammed",
    age: 23,
    gender: "Male",
    bloodGroup: "A+",
    location: "Chennai",
    lastDonated: "2025-12-10",
    phone: "9876543210",
  },
  {
    id: 2,
    name: "Arun",
    age: 25,
    gender: "Male",
    bloodGroup: "O+",
    location: "Chennai",
    lastDonated: "2025-11-20",
    phone: "9944332211",
  },
  {
    id: 3,
    name: "Vijay",
    age: 27,
    gender: "Male",
    bloodGroup: "B-",
    location: "Madurai",
    lastDonated: "2025-10-01",
    phone: "9000000000",
  },
];

export default function DonorProfilePage() {
  const { id } = useParams();
  const donor = donorsData.find((d) => d.id === Number(id));

  if (!donor) {
    return (
      <div className="p-10 text-center text-xl font-semibold">
        Donor not found.
      </div>
    );
  }

  // Calculate eligibility
  const daysDiff =
    (new Date() - new Date(donor.lastDonated)) / (1000 * 60 * 60 * 24);
  const isEligible = daysDiff >= 90;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="bg-white w-full max-w-lg shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-4">
          Donor Profile
        </h2>

        {/* Profile Card */}
        <div className="text-center mb-6">
          <div className="w-28 h-28 mx-auto bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl font-bold">
            {donor.name.charAt(0)}
          </div>
          <h3 className="text-2xl font-bold mt-3">{donor.name}</h3>
          <p className="text-gray-600">{donor.location}</p>
        </div>

        {/* Details */}
        <div className="space-y-3 text-gray-700 text-lg">
          <p>
            <strong>Gender:</strong> {donor.gender}
          </p>

          <p>
            <strong>Age:</strong> {donor.age}
          </p>

          <p>
            <strong>Blood Group:</strong>{" "}
            <span className="font-bold text-red-600">{donor.bloodGroup}</span>
          </p>

          <p>
            <strong>Last Donated:</strong> {donor.lastDonated}
          </p>

          <p>
            <strong>Eligibility:</strong>{" "}
            {isEligible ? (
              <span className="text-green-600 font-bold">Eligible</span>
            ) : (
              <span className="text-red-600 font-bold">
                Not Eligible ({Math.floor(90 - daysDiff)} days remaining)
              </span>
            )}
          </p>
        </div>

        {/* Call + WhatsApp Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <a
            href={`tel:${donor.phone}`}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-red-700 transition"
          >
            📞 Call
          </a>

          <a
            href={`https://wa.me/91${donor.phone}?text=${encodeURIComponent(
              `Hello ${donor.name}, I need ${donor.bloodGroup} blood. Can you help?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-600 transition"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}