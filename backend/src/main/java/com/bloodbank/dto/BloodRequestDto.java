package com.bloodbank.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BloodRequestDto {

    private Long id;
    private String trackingCode;

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotNull(message = "Units required must be specified")
    @Min(value = 1, message = "At least 1 unit is required")
    private Integer unitsRequired;

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "City is required")
    private String city;

    private String district;

    @NotBlank(message = "Contact person name is required")
    private String contactPerson;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    private String urgency = "NORMAL"; // NORMAL, URGENT, CRITICAL
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, COMPLETED
    private LocalDate requiredDate;
    private String medicalReason;
    private String adminRemarks;

    public BloodRequestDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTrackingCode() { return trackingCode; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public Integer getUnitsRequired() { return unitsRequired; }
    public void setUnitsRequired(Integer unitsRequired) { this.unitsRequired = unitsRequired; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getRequiredDate() { return requiredDate; }
    public void setRequiredDate(LocalDate requiredDate) { this.requiredDate = requiredDate; }

    public String getMedicalReason() { return medicalReason; }
    public void setMedicalReason(String medicalReason) { this.medicalReason = medicalReason; }

    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }
}
