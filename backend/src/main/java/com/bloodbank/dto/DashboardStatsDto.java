package com.bloodbank.dto;

import java.util.Map;

public class DashboardStatsDto {

    private long totalDonors;
    private long activeDonors;
    private long totalUnitsAvailable;
    private long pendingRequests;
    private long approvedRequests;
    private long completedRequests;
    private long criticalRequests;
    private Map<String, Integer> inventoryByBloodGroup;

    public DashboardStatsDto() {}

    public long getTotalDonors() { return totalDonors; }
    public void setTotalDonors(long totalDonors) { this.totalDonors = totalDonors; }

    public long getActiveDonors() { return activeDonors; }
    public void setActiveDonors(long activeDonors) { this.activeDonors = activeDonors; }

    public long getTotalUnitsAvailable() { return totalUnitsAvailable; }
    public void setTotalUnitsAvailable(long totalUnitsAvailable) { this.totalUnitsAvailable = totalUnitsAvailable; }

    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }

    public long getApprovedRequests() { return approvedRequests; }
    public void setApprovedRequests(long approvedRequests) { this.approvedRequests = approvedRequests; }

    public long getCompletedRequests() { return completedRequests; }
    public void setCompletedRequests(long completedRequests) { this.completedRequests = completedRequests; }

    public long getCriticalRequests() { return criticalRequests; }
    public void setCriticalRequests(long criticalRequests) { this.criticalRequests = criticalRequests; }

    public Map<String, Integer> getInventoryByBloodGroup() { return inventoryByBloodGroup; }
    public void setInventoryByBloodGroup(Map<String, Integer> inventoryByBloodGroup) { this.inventoryByBloodGroup = inventoryByBloodGroup; }
}
