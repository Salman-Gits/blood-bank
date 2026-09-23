import { INITIAL_DONORS, INITIAL_INVENTORY, INITIAL_REQUESTS } from "./databaseSeed";

const STORAGE_KEYS = {
  DONORS: "bloodbank_donors_chennai_v3",
  INVENTORY: "bloodbank_inventory_chennai_v3",
  REQUESTS: "bloodbank_requests_chennai_v3",
  USERS: "bloodbank_users_chennai_v3",
  ADMIN_SESSION: "bloodbank_admin_session",
};

// Initialize default storage if empty
export function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.DONORS)) {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(
      STORAGE_KEYS.USERS,
      JSON.stringify([
        {
          id: 1,
          username: "admin",
          email: "admin@bloodbank.org",
          password: "admin123",
          fullName: "Chief Medical Officer",
          role: "ADMIN",
        },
      ])
    );
  }
}

// Ensure initialized immediately
initLocalStorage();

export const localDb = {
  // DONORS
  getDonors(filters = {}) {
    const raw = localStorage.getItem(STORAGE_KEYS.DONORS);
    let donors = raw ? JSON.parse(raw) : INITIAL_DONORS;

    if (filters.bloodGroup && filters.bloodGroup !== "ALL") {
      donors = donors.filter((d) => d.bloodGroup === filters.bloodGroup);
    }
    if (filters.location && filters.location !== "ALL" && filters.location !== "") {
      const loc = filters.location.toLowerCase().trim();
      donors = donors.filter(
        (d) =>
          (d.area && d.area.toLowerCase().includes(loc)) ||
          (d.district && d.district.toLowerCase().includes(loc)) ||
          (d.city && d.city.toLowerCase().includes(loc)) ||
          (d.address && d.address.toLowerCase().includes(loc))
      );
    }
    if (filters.query && filters.query.trim() !== "") {
      const q = filters.query.toLowerCase().trim();
      donors = donors.filter(
        (d) =>
          d.fullName.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          (d.area && d.area.toLowerCase().includes(q)) ||
          (d.address && d.address.toLowerCase().includes(q)) ||
          (d.city && d.city.toLowerCase().includes(q))
      );
    }
    if (filters.eligibleOnly) {
      donors = donors.filter((d) => {
        if (!d.lastDonatedDate) return true;
        const diffDays =
          (new Date() - new Date(d.lastDonatedDate)) / (1000 * 60 * 60 * 24);
        return diffDays >= 90;
      });
    }

    return donors;
  },

  getDonorById(id) {
    const donors = this.getDonors();
    return donors.find((d) => String(d.id) === String(id)) || null;
  },

  addDonor(donorData) {
    const raw = localStorage.getItem(STORAGE_KEYS.DONORS);
    const donors = raw ? JSON.parse(raw) : [...INITIAL_DONORS];
    const newId = donors.length > 0 ? Math.max(...donors.map((d) => d.id || 0)) + 1 : 1;
    const area = donorData.area || donorData.district || "Chennai";
    const newDonor = {
      id: newId,
      fullName: donorData.fullName,
      bloodGroup: donorData.bloodGroup,
      gender: donorData.gender || "Male",
      age: Number(donorData.age) || 25,
      phone: donorData.phone,
      email: donorData.email || "",
      city: "Chennai",
      district: "Chennai",
      area,
      address: donorData.address || "",
      lastDonatedDate: donorData.lastDonatedDate || null,
      isAvailable: donorData.isAvailable !== undefined ? donorData.isAvailable : true,
      totalDonations: Number(donorData.totalDonations) || 1,
      verified: true,
      createdAt: new Date().toISOString(),
    };
    donors.unshift(newDonor);
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
    return newDonor;
  },

  updateDonor(id, updatedFields) {
    const raw = localStorage.getItem(STORAGE_KEYS.DONORS);
    const donors = raw ? JSON.parse(raw) : [...INITIAL_DONORS];
    const index = donors.findIndex((d) => String(d.id) === String(id));
    if (index !== -1) {
      donors[index] = { ...donors[index], ...updatedFields };
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
      return donors[index];
    }
    return null;
  },

  deleteDonor(id) {
    const raw = localStorage.getItem(STORAGE_KEYS.DONORS);
    let donors = raw ? JSON.parse(raw) : [...INITIAL_DONORS];
    donors = donors.filter((d) => String(d.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
    return true;
  },

  // INVENTORY
  getInventory() {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return raw ? JSON.parse(raw) : INITIAL_INVENTORY;
  },

  updateStock(bloodGroup, deltaUnits) {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const inventory = raw ? JSON.parse(raw) : [...INITIAL_INVENTORY];
    const item = inventory.find((i) => i.bloodGroup === bloodGroup);
    if (item) {
      item.unitsAvailable = Math.max(0, item.unitsAvailable + Number(deltaUnits));
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
      return item;
    }
    return null;
  },

  // REQUESTS
  getRequests(statusFilter = null) {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    let requests = raw ? JSON.parse(raw) : INITIAL_REQUESTS;
    if (statusFilter && statusFilter !== "ALL") {
      requests = requests.filter(
        (r) => r.status.toUpperCase() === statusFilter.toUpperCase()
      );
    }
    return requests;
  },

  getRequestByTrackingCode(trackingCode) {
    const requests = this.getRequests();
    return requests.find(
      (r) => r.trackingCode.toLowerCase() === trackingCode.toLowerCase().trim()
    ) || null;
  },

  addRequest(reqData) {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    const requests = raw ? JSON.parse(raw) : [...INITIAL_REQUESTS];
    const year = new Date().getFullYear();
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `REQ-${year}-${randCode}`;
    const newId = requests.length > 0 ? Math.max(...requests.map((r) => r.id || 0)) + 1 : 1;
    const area = reqData.area || reqData.district || "Chennai";

    const newRequest = {
      id: newId,
      trackingCode,
      patientName: reqData.patientName,
      bloodGroup: reqData.bloodGroup,
      unitsRequired: Number(reqData.unitsRequired) || 1,
      hospitalName: reqData.hospitalName,
      city: "Chennai",
      district: "Chennai",
      area,
      contactPerson: reqData.contactPerson,
      contactPhone: reqData.contactPhone,
      urgency: reqData.urgency || "NORMAL",
      status: "PENDING",
      requiredDate: reqData.requiredDate || new Date().toISOString().split("T")[0],
      medicalReason: reqData.medicalReason || "",
      adminRemarks: "",
      createdAt: new Date().toISOString(),
    };

    requests.unshift(newRequest);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    return newRequest;
  },

  updateRequestStatus(id, newStatus, adminRemarks = "") {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    const requests = raw ? JSON.parse(raw) : [...INITIAL_REQUESTS];
    const index = requests.findIndex((r) => String(r.id) === String(id));
    if (index !== -1) {
      const prev = requests[index];
      requests[index] = {
        ...prev,
        status: newStatus.toUpperCase(),
        adminRemarks: adminRemarks || prev.adminRemarks,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
      return requests[index];
    }
    return null;
  },

  // STATS
  getDashboardStats() {
    const donors = this.getDonors();
    const requests = this.getRequests();
    const inventory = this.getInventory();

    const activeDonors = donors.filter((d) => d.isAvailable).length;
    const totalUnits = inventory.reduce((sum, i) => sum + (i.unitsAvailable || 0), 0);
    const pendingReqs = requests.filter((r) => r.status === "PENDING").length;
    const criticalReqs = requests.filter(
      (r) => r.urgency === "CRITICAL" && r.status !== "COMPLETED" && r.status !== "REJECTED"
    ).length;

    return {
      totalDonors: donors.length,
      activeDonors,
      totalUnitsAvailable: totalUnits,
      pendingRequests: pendingReqs,
      criticalRequests: criticalReqs,
    };
  },

  // AUTH
  login(username, password) {
    if (
      (username === "admin" && password === "admin123") ||
      (username === "admin@bloodbank.org" && password === "admin123")
    ) {
      const session = {
        user: {
          username: "admin",
          fullName: "Chief Medical Officer",
          role: "ADMIN",
        },
        token: "demo-jwt-token-chennai-admin",
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      return { success: true, ...session };
    }
    return { success: false, message: "Invalid credentials. Use admin / admin123" };
  },

  getAdminSession() {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },
};
