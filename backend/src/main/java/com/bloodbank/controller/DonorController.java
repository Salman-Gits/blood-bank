package com.bloodbank.controller;

import com.bloodbank.dto.DonorDto;
import com.bloodbank.model.Donor;
import com.bloodbank.service.DonorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "*")
public class DonorController {

    @Autowired
    private DonorService donorService;

    @GetMapping
    public ResponseEntity<List<Donor>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donor> getDonorById(@PathVariable Long id) {
        return ResponseEntity.ok(donorService.getDonorById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Donor>> searchDonors(
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "false") boolean eligibleOnly
    ) {
        return ResponseEntity.ok(donorService.searchDonors(bloodGroup, location, query, eligibleOnly));
    }

    @PostMapping
    public ResponseEntity<Donor> createDonor(@Valid @RequestBody DonorDto dto) {
        Donor created = donorService.createDonor(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donor> updateDonor(@PathVariable Long id, @Valid @RequestBody DonorDto dto) {
        return ResponseEntity.ok(donorService.updateDonor(id, dto));
    }

    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<Donor> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(donorService.toggleAvailability(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonor(@PathVariable Long id) {
        donorService.deleteDonor(id);
        return ResponseEntity.noContent().build();
    }
}
