package com.bloodbank.repository;

import com.bloodbank.model.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    Optional<BloodRequest> findByTrackingCode(String trackingCode);

    List<BloodRequest> findByStatusOrderByCreatedAtDesc(String status);

    List<BloodRequest> findAllByOrderByCreatedAtDesc();

    List<BloodRequest> findByUrgencyOrderByCreatedAtDesc(String urgency);

    long countByStatus(String status);

    long countByUrgency(String urgency);
}
