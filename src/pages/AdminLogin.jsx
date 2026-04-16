// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ setIsAdmin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   // Temporary login (replace with backend)
  //   if (username === "admin" && password === "admin") {
  //     setIsAdmin(true);
  //     navigate("/admin/dashboard");
  //   } else {
  //     alert("Invalid credentials");
  //   }
  // };

  const handleLogin = (e) => {
  e.preventDefault();

  // Demo mode: skip authentication
  navigate("/admin/dashboard");
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white w-full max-w-md shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-semibold">Username</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg mt-1"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Password</label>
            <input
              type="password"
              className="w-full border p-3 rounded-lg mt-1"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}