import { useEffect, useState } from "react";

export default function DonorListPage() {
  const [donors, setDonors] = useState([]);

  // TEMP DATA
  useEffect(() => {
    setDonors([
      { id: 1, name: "Mohammed", gender: "Male", bloodGroup: "A+", phone: "9876543210" },
      { id: 2, name: "Arun", gender: "Male", bloodGroup: "O+", phone: "9977442211" },
      { id: 3, name: "Priya", gender: "Female", bloodGroup: "B-", phone: "9000099999" },
    ]);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-red-600 mb-6">Donor List</h1>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-4">
        {donors.map((d) => (
          <div key={d.id} className="bg-white p-4 shadow rounded-lg">
            <p className="font-bold text-lg">{d.name}</p>
            <p className="text-gray-600">Gender: {d.gender}</p>
            <p className="text-gray-600">Blood Group: {d.bloodGroup}</p>
            <p className="text-gray-600">Phone: {d.phone}</p>

            <div className="flex gap-3 mt-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded w-full">
                Edit
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded w-full">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">Blood Group</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-3">{d.name}</td>
                <td className="p-3">{d.gender}</td>
                <td className="p-3">{d.bloodGroup}</td>
                <td className="p-3">{d.phone}</td>
                <td className="p-3 flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}