import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import FindDonorPage from "./pages/FindDonorPage";
import RequestBloodPage from "./pages/RequestBloodPage";
import DonorProfilePage from "./pages/DonorProfilePage";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DonorListPage from "./pages/DonorListPage";
import AddDonorPage from "./pages/AddDonorPage";
import AdminRequestsPage from "./pages/AdminRequestsPage";
import AdminInventoryPage from "./pages/AdminInventoryPage";

import { authApi } from "./api";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => authApi.isAdmin());

  useEffect(() => {
    setIsAdmin(authApi.isAdmin());
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">
        <div>
          <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

          <main id="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/find-donor" element={<FindDonorPage />} />
              <Route path="/request-blood" element={<RequestBloodPage />} />
              <Route path="/donor/:id" element={<DonorProfilePage />} />

              {/* Admin & Management routes */}
              <Route
                path="/admin/login"
                element={<AdminLogin setIsAdmin={setIsAdmin} />}
              />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/donors" element={<DonorListPage />} />
              <Route path="/admin/inventory" element={<AdminInventoryPage />} />
              <Route path="/admin/requests" element={<AdminRequestsPage />} />
              <Route path="/admin/add-donor" element={<AddDonorPage />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
