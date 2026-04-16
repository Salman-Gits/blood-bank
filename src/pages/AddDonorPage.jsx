import { useState } from "react";

export default function AddDonorPage() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    location: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Donor added successfully!");
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-red-600 mb-6">Add Donor</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 shadow rounded-lg space-y-4"
      >
        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
        />

        <select
          name="gender"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <select
          name="bloodGroup"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="City / Location"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Add Donor
        </button>
      </form>
    </div>
  );
}