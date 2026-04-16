import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import FindDonorPage from "./pages/FindDonorPage";
import RequestBloodPage from "./pages/RequestBloodPage";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DonorListPage from "./pages/DonorListPage";
import AddDonorPage from "./pages/AddDonorPage";
import AdminRequestsPage from "./pages/AdminRequestsPage";
import DonorProfilePage from "./pages/DonorProfilePage";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <Navbar isAdmin={isAdmin} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/find-donor" element={<FindDonorPage />} />
        <Route path="/request-blood" element={<RequestBloodPage />} />
        <Route path="/donor/:id" element={<DonorProfilePage />} />

        <Route
          path="/admin/login"
          element={<AdminLogin setIsAdmin={setIsAdmin} />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/donors" element={<DonorListPage />} />
        <Route path="/admin/add-donor" element={<AddDonorPage />} />
        <Route path="/admin/requests" element={<AdminRequestsPage />} />
      </Routes>
    </BrowserRouter>
  );
}