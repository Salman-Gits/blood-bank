package com.bloodbank.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_inventory")
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blood_group", nullable = false, unique = true, length = 10)
    private String bloodGroup;

    @Column(name = "units_available", nullable = false)
    private Integer unitsAvailable = 0;

    @Column(name = "reserved_units", nullable = false)
    private Integer reservedUnits = 0;

    @Column(name = "critical_threshold", nullable = false)
    private Integer criticalThreshold = 5;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();

    public BloodInventory() {}

    public BloodInventory(String bloodGroup, Integer unitsAvailable, Integer reservedUnits, Integer criticalThreshold) {
        this.bloodGroup = bloodGroup;
        this.unitsAvailable = unitsAvailable;
        this.reservedUnits = reservedUnits;
        this.criticalThreshold = criticalThreshold;
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public Integer getUnitsAvailable() { return unitsAvailable; }
    public void setUnitsAvailable(Integer unitsAvailable) { 
        this.unitsAvailable = unitsAvailable;
        this.lastUpdated = LocalDateTime.now();
    }

    public Integer getReservedUnits() { return reservedUnits; }
    public void setReservedUnits(Integer reservedUnits) { this.reservedUnits = reservedUnits; }

    public Integer getCriticalThreshold() { return criticalThreshold; }
    public void setCriticalThreshold(Integer criticalThreshold) { this.criticalThreshold = criticalThreshold; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public boolean isCritical() {
        return this.unitsAvailable <= this.criticalThreshold;
    }
}
