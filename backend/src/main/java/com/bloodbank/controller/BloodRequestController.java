package com.bloodbank.controller;

import com.bloodbank.dto.BloodRequestDto;
import com.bloodbank.model.BloodRequest;
import com.bloodbank.service.BloodRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {

    @Autowired
    private BloodRequestService requestService;

    @GetMapping
    public ResponseEntity<List<BloodRequest>> getAllRequests(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(requestService.getAllRequests(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodRequest> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @GetMapping("/track/{trackingCode}")
    public ResponseEntity<BloodRequest> getRequestByTrackingCode(@PathVariable String trackingCode) {
        return ResponseEntity.ok(requestService.getRequestByTrackingCode(trackingCode));
    }

    @PostMapping
    public ResponseEntity<BloodRequest> createRequest(@Valid @RequestBody BloodRequestDto dto) {
        BloodRequest created = requestService.createRequest(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BloodRequest> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate
    ) {
        String newStatus = statusUpdate.get("status");
        String remarks = statusUpdate.get("adminRemarks");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(requestService.updateStatus(id, newStatus, remarks));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
