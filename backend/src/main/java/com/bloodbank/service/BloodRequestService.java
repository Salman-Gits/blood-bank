package com.bloodbank.service;

import com.bloodbank.dto.BloodRequestDto;
import com.bloodbank.dto.InventoryUpdateDto;
import com.bloodbank.exception.ResourceNotFoundException;
import com.bloodbank.model.BloodRequest;
import com.bloodbank.repository.BloodRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository requestRepository;

    @Autowired
    private BloodInventoryService inventoryService;

    public List<BloodRequest> getAllRequests(String status) {
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            return requestRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase().trim());
        }
        return requestRepository.findAllByOrderByCreatedAtDesc();
    }

    public BloodRequest getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with ID: " + id));
    }

    public BloodRequest getRequestByTrackingCode(String trackingCode) {
        return requestRepository.findByTrackingCode(trackingCode.trim())
                .orElseThrow(() -> new ResourceNotFoundException("No blood request found with tracking code: " + trackingCode));
    }

    public BloodRequest createRequest(BloodRequestDto dto) {
        BloodRequest request = new BloodRequest();
        String year = String.valueOf(java.time.Year.now().getValue());
        int randomCode = 1000 + new Random().nextInt(9000);
        request.setTrackingCode("REQ-" + year + "-" + randomCode);

        request.setPatientName(dto.getPatientName());
        request.setBloodGroup(dto.getBloodGroup().toUpperCase().trim());
        request.setUnitsRequired(dto.getUnitsRequired() != null ? dto.getUnitsRequired() : 1);
        request.setHospitalName(dto.getHospitalName());
        request.setCity(dto.getCity());
        request.setDistrict(dto.getDistrict());
        request.setContactPerson(dto.getContactPerson());
        request.setContactPhone(dto.getContactPhone());
        request.setUrgency(dto.getUrgency() != null ? dto.getUrgency().toUpperCase() : "NORMAL");
        request.setStatus("PENDING");
        request.setRequiredDate(dto.getRequiredDate());
        request.setMedicalReason(dto.getMedicalReason());

        return requestRepository.save(request);
    }

    public BloodRequest updateStatus(Long id, String newStatus, String adminRemarks) {
        BloodRequest request = getRequestById(id);
        String upperStatus = newStatus.toUpperCase().trim();
        String previousStatus = request.getStatus();

        // Valid statuses: PENDING, APPROVED, REJECTED, COMPLETED
        request.setStatus(upperStatus);
        if (adminRemarks != null) {
            request.setAdminRemarks(adminRemarks);
        }
        request.setUpdatedAt(LocalDateTime.now());

        // When request is COMPLETED and wasn't already completed, deduct stock
        if ("COMPLETED".equals(upperStatus) && !"COMPLETED".equals(previousStatus)) {
            try {
                inventoryService.updateUnits(new InventoryUpdateDto(
                        request.getBloodGroup(),
                        -request.getUnitsRequired(),
                        "Dispatched for Request #" + request.getTrackingCode() + " (" + request.getHospitalName() + ")"
                ));
            } catch (Exception ignored) {
                // Keep status even if inventory is negative or auto-adjusted
            }
        }

        return requestRepository.save(request);
    }

    public void deleteRequest(Long id) {
        BloodRequest request = getRequestById(id);
        requestRepository.delete(request);
    }
}
