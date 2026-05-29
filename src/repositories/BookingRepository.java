package com.example.smart_venue_backend.repositories;

import com.example.smart_venue_backend.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // This custom query counts how many APPROVED or PENDING bookings overlap with the requested time
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.venue.id = :venueId " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    int countOverlappingBookings(@Param("venueId") Long venueId,
                                 @Param("startTime") LocalDateTime startTime,
                                 @Param("endTime") LocalDateTime endTime);
}