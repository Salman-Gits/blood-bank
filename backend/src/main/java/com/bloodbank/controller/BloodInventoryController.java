package com.bloodbank.controller;

import com.bloodbank.dto.InventoryUpdateDto;
import com.bloodbank.model.BloodInventory;
import com.bloodbank.service.BloodInventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class BloodInventoryController {

    @Autowired
    private BloodInventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<BloodInventory>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{bloodGroup}")
    public ResponseEntity<BloodInventory> getByBloodGroup(@PathVariable String bloodGroup) {
        return ResponseEntity.ok(inventoryService.getByBloodGroup(bloodGroup));
    }

    @PostMapping("/update")
    public ResponseEntity<BloodInventory> updateUnits(@Valid @RequestBody InventoryUpdateDto updateDto) {
        return ResponseEntity.ok(inventoryService.updateUnits(updateDto));
    }
}
