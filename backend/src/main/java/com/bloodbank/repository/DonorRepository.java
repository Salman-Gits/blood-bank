package com.bloodbank.repository;

import com.bloodbank.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    List<Donor> findByBloodGroup(String bloodGroup);

    List<Donor> findByCityIgnoreCase(String city);

    List<Donor> findByIsAvailableTrue();

    @Query("SELECT d FROM Donor d WHERE " +
           "(:bloodGroup IS NULL OR :bloodGroup = '' OR d.bloodGroup = :bloodGroup) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(d.city) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(d.district) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(d.address) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(d.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR d.phone LIKE CONCAT('%', :query, '%') OR LOWER(d.district) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.address) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:availableOnly IS FALSE OR d.isAvailable = TRUE)")
    List<Donor> searchDonors(
            @Param("bloodGroup") String bloodGroup,
            @Param("location") String location,
            @Param("query") String query,
            @Param("availableOnly") boolean availableOnly
    );

    long countByBloodGroup(String bloodGroup);
    long countByIsAvailableTrue();
}
