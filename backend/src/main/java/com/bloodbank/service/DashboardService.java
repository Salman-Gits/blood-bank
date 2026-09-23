package com.bloodbank.service;

import com.bloodbank.dto.DashboardStatsDto;
import com.bloodbank.model.BloodInventory;
import com.bloodbank.repository.BloodInventoryRepository;
import com.bloodbank.repository.BloodRequestRepository;
import com.bloodbank.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private BloodInventoryRepository inventoryRepository;

    @Autowired
    private BloodRequestRepository requestRepository;

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalDonors(donorRepository.count());
        stats.setActiveDonors(donorRepository.countByIsAvailableTrue());

        List<BloodInventory> inventories = inventoryRepository.findAll();
        long totalUnits = 0;
        Map<String, Integer> inventoryMap = new HashMap<>();

        for (BloodInventory inv : inventories) {
            totalUnits += inv.getUnitsAvailable();
            inventoryMap.put(inv.getBloodGroup(), inv.getUnitsAvailable());
        }

        stats.setTotalUnitsAvailable(totalUnits);
        stats.setInventoryByBloodGroup(inventoryMap);

        stats.setPendingRequests(requestRepository.countByStatus("PENDING"));
        stats.setApprovedRequests(requestRepository.countByStatus("APPROVED"));
        stats.setCompletedRequests(requestRepository.countByStatus("COMPLETED"));
        stats.setCriticalRequests(requestRepository.countByUrgency("CRITICAL"));

        return stats;
    }
}
