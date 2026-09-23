package com.bloodbank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class DonorDto {

    private Long id;

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Blood Group is required")
    private String bloodGroup;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Age is required")
    private Integer age;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String email;

    @NotBlank(message = "City is required")
    private String city;

    private String district;
    private String address;
    private LocalDate lastDonatedDate;
    private Boolean isAvailable = true;
    private Integer totalDonations = 1;
    private Boolean verified = true;

    public DonorDto() {}

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
}
