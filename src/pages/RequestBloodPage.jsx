import { useState } from "react";
import api from "../api";

export default function RequestBloodPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    location: "",
    reason: "",
  });

  const adminNumber = "919876543210"; // Add country code (91 for India)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Submit to backend
      await api.post("/requests", form);

      // Create WhatsApp message
      const message = `
🩸 *New Blood Request Received*  
———————————————
👤 Name: ${form.name}
📞 Phone: ${form.phone}
🩸 Blood Group: ${form.bloodGroup}
📍 Location: ${form.location}
📝 Reason: ${form.reason}
———————————————
Please respond quickly.
      `;

      // Send to WhatsApp
      window.open(
        `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      alert("Request submitted successfully!");
    } catch (err) {
      alert("Error submitting request");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-8">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        Request Blood
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="border p-3 rounded-lg w-full"
          placeholder="Full Name"
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-3 rounded-lg w-full"
          placeholder="Phone Number"
          required
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <select
          className="border p-3 rounded-lg w-full"
          required
          onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
        >
          <option value="">Blood Group</option>
          <option>A+</option><option>A-</option>
          <option>B+</option><option>B-</option>
          <option>O+</option><option>O-</option>
          <option>AB+</option><option>AB-</option>
        </select>

        <input
          className="border p-3 rounded-lg w-full"
          placeholder="Location"
          required
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <textarea
          className="border p-3 rounded-lg w-full"
          placeholder="Reason"
          rows="3"
          required
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <button className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700">
          Submit Request
        </button>
      </form>
    </div>
  );
}