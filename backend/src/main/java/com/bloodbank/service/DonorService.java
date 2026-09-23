package com.bloodbank.service;

import com.bloodbank.dto.DonorDto;
import com.bloodbank.exception.ResourceNotFoundException;
import com.bloodbank.model.Donor;
import com.bloodbank.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonorService {

    @Autowired
    private DonorRepository donorRepository;

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Donor getDonorById(Long id) {
        return donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with ID: " + id));
    }

    public List<Donor> searchDonors(String bloodGroup, String location, String query, boolean eligibleOnly) {
        List<Donor> results = donorRepository.searchDonors(bloodGroup, location, query, false);
        if (!eligibleOnly) {
            return results;
        }

        // 90-day donation interval filter
        return results.stream().filter(donor -> {
            if (donor.getLastDonatedDate() == null) return true;
            long days = java.time.temporal.ChronoUnit.DAYS.between(donor.getLastDonatedDate(), java.time.LocalDate.now());
            return days >= 90;
        }).toList();
    }

    public Donor createDonor(DonorDto dto) {
        Donor donor = new Donor();
        mapDtoToEntity(dto, donor);
        return donorRepository.save(donor);
    }

    public Donor updateDonor(Long id, DonorDto dto) {
        Donor donor = getDonorById(id);
        mapDtoToEntity(dto, donor);
        return donorRepository.save(donor);
    }

    public Donor toggleAvailability(Long id) {
        Donor donor = getDonorById(id);
        donor.setIsAvailable(!donor.getIsAvailable());
        return donorRepository.save(donor);
    }

    public void deleteDonor(Long id) {
        Donor donor = getDonorById(id);
        donorRepository.delete(donor);
    }

    private void mapDtoToEntity(DonorDto dto, Donor donor) {
        donor.setFullName(dto.getFullName());
        donor.setBloodGroup(dto.getBloodGroup().toUpperCase().trim());
        donor.setGender(dto.getGender());
        donor.setAge(dto.getAge());
        donor.setPhone(dto.getPhone());
        donor.setEmail(dto.getEmail());
        donor.setCity(dto.getCity());
        donor.setDistrict(dto.getDistrict());
        donor.setAddress(dto.getAddress());
        donor.setLastDonatedDate(dto.getLastDonatedDate());
        if (dto.getIsAvailable() != null) donor.setIsAvailable(dto.getIsAvailable());
        if (dto.getTotalDonations() != null) donor.setTotalDonations(dto.getTotalDonations());
        if (dto.getVerified() != null) donor.setVerified(dto.getVerified());
    }
}
