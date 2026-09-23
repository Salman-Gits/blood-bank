package com.bloodbank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InventoryUpdateDto {

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotNull(message = "Delta change must be provided")
    private Integer deltaUnits; // can be positive (+5) or negative (-2)

    private String reason;

    public InventoryUpdateDto() {}

    public InventoryUpdateDto(String bloodGroup, Integer deltaUnits, String reason) {
        this.bloodGroup = bloodGroup;
        this.deltaUnits = deltaUnits;
        this.reason = reason;
    }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public Integer getDeltaUnits() { return deltaUnits; }
    public void setDeltaUnits(Integer deltaUnits) { this.deltaUnits = deltaUnits; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
