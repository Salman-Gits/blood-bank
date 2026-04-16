// src/pages/AdminDashboard.jsx

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-red-600 mb-6">
        Admin Dashboard
      </h1>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1 */}
        <div className="bg-white p-6 shadow rounded-xl border-t-4 border-red-600">
          <h3 className="text-xl font-semibold">Total Donors</h3>
          <p className="text-4xl font-bold mt-2 text-gray-700">124</p>
          <p className="text-gray-500 text-sm">Active registered donors</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 shadow rounded-xl border-t-4 border-blue-500">
          <h3 className="text-xl font-semibold">Pending Requests</h3>
          <p className="text-4xl font-bold mt-2 text-gray-700">8</p>
          <p className="text-gray-500 text-sm">Waiting for approval</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 shadow rounded-xl border-t-4 border-green-600">
          <h3 className="text-xl font-semibold">Approved Requests</h3>
          <p className="text-4xl font-bold mt-2 text-gray-700">56</p>
          <p className="text-gray-500 text-sm">Successfully matched</p>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Recent Blood Requests</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Blood Group</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">Rahman</td>
                <td className="p-3">O+</td>
                <td className="p-3">Chennai</td>
                <td className="p-3 text-yellow-600 font-semibold">Pending</td>
              </tr>

              <tr className="border-b">
                <td className="p-3">Asha</td>
                <td className="p-3">AB+</td>
                <td className="p-3">Madurai</td>
                <td className="p-3 text-green-600 font-semibold">Approved</td>
              </tr>

              <tr>
                <td className="p-3">Vignesh</td>
                <td className="p-3">B+</td>
                <td className="p-3">Trichy</td>
                <td className="p-3 text-red-600 font-semibold">Rejected</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}