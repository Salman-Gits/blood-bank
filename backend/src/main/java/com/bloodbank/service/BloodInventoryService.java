package com.bloodbank.service;

import com.bloodbank.dto.InventoryUpdateDto;
import com.bloodbank.exception.ResourceNotFoundException;
import com.bloodbank.model.BloodInventory;
import com.bloodbank.repository.BloodInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BloodInventoryService {

    @Autowired
    private BloodInventoryRepository inventoryRepository;

    public List<BloodInventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public BloodInventory getByBloodGroup(String bloodGroup) {
        return inventoryRepository.findByBloodGroup(bloodGroup.toUpperCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No inventory found for blood group: " + bloodGroup));
    }

    public BloodInventory updateUnits(InventoryUpdateDto updateDto) {
        String bg = updateDto.getBloodGroup().toUpperCase().trim();
        BloodInventory inventory = inventoryRepository.findByBloodGroup(bg)
                .orElseGet(() -> new BloodInventory(bg, 0, 0, 5));

        int newTotal = inventory.getUnitsAvailable() + updateDto.getDeltaUnits();
        if (newTotal < 0) {
            throw new IllegalArgumentException("Cannot deduct more units than available in stock! Current stock: " + inventory.getUnitsAvailable());
        }

        inventory.setUnitsAvailable(newTotal);
        return inventoryRepository.save(inventory);
    }
}
