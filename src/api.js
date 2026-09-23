import axios from "axios";
import { localDb } from "./services/localDatabase";

const getBackendUrl = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
  return String(url).trim().replace(/\/+$/, "");
};

const BACKEND_URL = getBackendUrl();

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 3500,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cache connection check result
let backendReachable = false;
let lastCheckTime = 0;

export async function checkBackendConnection() {
  const now = Date.now();
  if (now - lastCheckTime < 10000) {
    return backendReachable;
  }
  lastCheckTime = now;
  try {
    const res = await apiClient.get("/dashboard/stats", { timeout: 1500 });
    backendReachable = res.status === 200;
  } catch (err) {
    backendReachable = false;
  }
  return backendReachable;
}

// AUTH API
export const authApi = {
  async login(credentials) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.post("/auth/login", credentials);
        if (res.data.token) {
          localStorage.setItem("bloodbank_auth_token", res.data.token);
          localStorage.setItem("bloodbank_user", JSON.stringify(res.data));
        }
        return res.data;
      }
    } catch (e) {
      console.warn("Spring Boot offline, checking local auth:", e.message);
    }

    // Local fallback
    if (
      (credentials.username === "admin" || credentials.username === "admin@bloodbank.org") &&
      credentials.password === "admin123"
    ) {
      const user = {
        success: true,
        message: "Admin login successful (Local Engine)",
        token: "jwt_admin_demo_session",
        userId: 1,
        username: "admin",
        email: "admin@bloodbank.org",
        fullName: "Chief Medical Officer",
        role: "ADMIN",
      };
      localStorage.setItem("bloodbank_auth_token", user.token);
      localStorage.setItem("bloodbank_user", JSON.stringify(user));
      return user;
    }

    return {
      success: false,
      message: "Invalid credentials. Use 'admin' and 'admin123' for admin access.",
    };
  },

  async register(userData) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.post("/auth/register", userData);
        return res.data;
      }
    } catch (e) {
      console.warn("Spring Boot offline, falling back to local registration:", e.message);
    }

    return {
      success: true,
      message: "User registered successfully",
      token: "jwt_user_" + Date.now(),
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role || "USER",
    };
  },

  logout() {
    localStorage.removeItem("bloodbank_auth_token");
    localStorage.removeItem("bloodbank_user");
  },

  getCurrentUser() {
    const raw = localStorage.getItem("bloodbank_user");
    return raw ? JSON.parse(raw) : null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "ADMIN";
  },
};

// DONORS API
export const donorsApi = {
  async getAll() {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.get("/donors");
        return res.data;
      }
    } catch (e) {}
    return localDb.getDonors();
  },

  async getById(id) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.get(`/donors/${id}`);
        return res.data;
      }
    } catch (e) {}
    return localDb.getDonorById(id);
  },

  async search({ bloodGroup, location, query, eligibleOnly }) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.get("/donors/search", {
          params: { bloodGroup, location, query, eligibleOnly },
        });
        return res.data;
      }
    } catch (e) {}
    return localDb.getDonors({ bloodGroup, location, query, eligibleOnly });
  },

  async create(donorData) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.post("/donors", donorData);
        // also mirror in local
        localDb.addDonor(res.data);
        return res.data;
      }
    } catch (e) {}
    return localDb.addDonor(donorData);
  },

  async update(id, donorData) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.put(`/donors/${id}`, donorData);
        localDb.updateDonor(id, res.data);
        return res.data;
      }
    } catch (e) {}
    return localDb.updateDonor(id, donorData);
  },

  async toggleAvailability(id) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.patch(`/donors/${id}/toggle-availability`);
        localDb.updateDonor(id, res.data);
        return res.data;
      }
    } catch (e) {}
    return localDb.toggleDonorAvailability(id);
  },

  async delete(id) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        await apiClient.delete(`/donors/${id}`);
      }
    } catch (e) {}
    return localDb.deleteDonor(id);
  },
};

// INVENTORY API
export const inventoryApi = {
  async getAll() {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.get("/inventory");
        return res.data;
      }
    } catch (e) {}
    return localDb.getInventory();
  },

  async updateUnits(bloodGroup, deltaUnits, reason = "") {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.post("/inventory/update", {
          bloodGroup,
          deltaUnits,
          reason,
        });
        localDb.updateInventoryUnits(bloodGroup, deltaUnits);
        return res.data;
      }
    } catch (e) {}
    return localDb.updateInventoryUnits(bloodGroup, deltaUnits);
  },
};

// BLOOD REQUESTS API
export const requestsApi = {
  async getAll(statusFilter = null) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.get("/requests", {
          params: statusFilter && statusFilter !== "ALL" ? { status: statusFilter } : {},
        });
        return res.data;
      }
    } catch (e) {}
    return localDb.getRequests(statusFilter);
  },

  async getById(id) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.get(`/requests/${id}`);
        return res.data;
      }
    } catch (e) {}
    const reqs = localDb.getRequests();
    return reqs.find((r) => String(r.id) === String(id)) || null;
  },

  async getByTrackingCode(trackingCode) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.get(`/requests/track/${trackingCode}`);
        return res.data;
      }
    } catch (e) {}
    return localDb.getRequestByTrackingCode(trackingCode);
  },

  async create(requestData) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.post("/requests", requestData);
        localDb.addRequest(res.data);
        return res.data;
      }
    } catch (e) {}
    return localDb.addRequest(requestData);
  },

  async updateStatus(id, newStatus, adminRemarks = "") {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.patch(`/requests/${id}/status`, {
          status: newStatus,
          adminRemarks,
        });
        localDb.updateRequestStatus(id, newStatus, adminRemarks);
        return res.data;
      }
    } catch (e) {}
    return localDb.updateRequestStatus(id, newStatus, adminRemarks);
  },

  async delete(id) {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        await apiClient.delete(`/requests/${id}`);
      }
    } catch (e) {}
    return localDb.deleteRequest(id);
  },
};

// DASHBOARD STATS API
export const dashboardApi = {
  async getStats() {
    try {
      const isOnline = await checkBackendConnection();
      if (isOnline) {
        const res = await apiClient.get("/dashboard/stats");
        return res.data;
      }
    } catch (e) {}
    return localDb.getDashboardStats();
  },
};

export default apiClient;
