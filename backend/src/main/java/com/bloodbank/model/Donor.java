package com.bloodbank.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donors")
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "blood_group", nullable = false, length = 10)
    private String bloodGroup;

    @Column(nullable = false, length = 10)
    private String gender;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(nullable = false, length = 50)
    private String city;

    @Column(length = 50)
    private String district;

    @Column(length = 255)
    private String address;

    @Column(name = "last_donated_date")
    private LocalDate lastDonatedDate;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Column(name = "total_donations", nullable = false)
    private Integer totalDonations = 1;

    @Column(nullable = false)
    private Boolean verified = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Donor() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDate getLastDonatedDate() { return lastDonatedDate; }
    public void setLastDonatedDate(LocalDate lastDonatedDate) { this.lastDonatedDate = lastDonatedDate; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Integer getTotalDonations() { return totalDonations; }
    public void setTotalDonations(Integer totalDonations) { this.totalDonations = totalDonations; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
