import { useState } from "react";

export default function AdminRequestList() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Salman",
      phone: "9876543210",
      bloodGroup: "O+",
      location: "Chennai",
      urgency: "High",
      hospital: "Apollo",
      message: "Emergency case",
      status: "Pending",
    },
  ]);

  function updateStatus(id, newStatus) {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl text-red-600 font-bold mb-4">
        Blood Requests (Admin)
      </h1>

      <div className="overflow-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="p-2">Name</th>
              <th>Phone</th>
              <th>Blood</th>
              <th>Urgency</th>
              <th>Location</th>
              <th>Hospital</th>
              <th>Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border text-center">
                <td className="p-2">{r.name}</td>
                <td>{r.phone}</td>
                <td>{r.bloodGroup}</td>
                <td>{r.urgency}</td>
                <td>{r.location}</td>
                <td>{r.hospital}</td>
                <td>{r.status}</td>

                <td className="flex gap-2 justify-center p-2">
                  <button
                    onClick={() => updateStatus(r.id, "Approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "Completed")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() =>
                      setRequests(requests.filter((x) => x.id !== r.id))
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
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