import { useState, useEffect } from "react";

export default function RequestListPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests([
      { id: 1, name: "Ravi", bloodGroup: "O+", status: "Pending", phone: "9000000000" },
      { id: 2, name: "Nisha", bloodGroup: "A-", status: "Accepted", phone: "9555555555" },
    ]);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-red-600 mb-6">Blood Requests</h1>

      {/* MOBILE */}
      <div className="md:hidden space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="bg-white p-4 shadow rounded-lg">
            <p className="font-bold text-lg">{r.name}</p>
            <p className="text-gray-600">Blood Group: {r.bloodGroup}</p>
            <p className="text-gray-600">Phone: {r.phone}</p>
            <p className="text-gray-800 font-semibold mt-2">
              Status:{" "}
              <span
                className={
                  r.status === "Pending"
                    ? "text-yellow-600"
                    : "text-green-600"
                }
              >
                {r.status}
              </span>
            </p>

            <button className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg">
              Mark as Accepted
            </button>
          </div>
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white border shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Blood Group</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.bloodGroup}</td>
                <td className="p-3">{r.phone}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-green-600 text-white rounded">
                    Accept
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