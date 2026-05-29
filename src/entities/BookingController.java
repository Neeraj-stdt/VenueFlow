package com.example.smart_venue_backend.controllers;

import com.example.smart_venue_backend.entities.Booking;
import com.example.smart_venue_backend.entities.User;
import com.example.smart_venue_backend.entities.Venue;
import com.example.smart_venue_backend.repositories.BookingRepository;
import com.example.smart_venue_backend.repositories.UserRepository;
import com.example.smart_venue_backend.repositories.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VenueRepository venueRepository;

    // 1. Get ALL bookings (For the Admin Dashboard)
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    
   // 2. Create a NEW booking (For the Club Dashboard)
    @PostMapping("/request")
    public ResponseEntity<?> createBookingRequest(@RequestBody Map<String, String> payload) {
        try {
            Long clubId = Long.parseLong(payload.get("clubId"));
            Long venueId = Long.parseLong(payload.get("venueId"));
            LocalDateTime start = java.time.LocalDateTime.parse(payload.get("startTime"));
            LocalDateTime end = java.time.LocalDateTime.parse(payload.get("endTime"));

            // 🛑 THE BOUNCER: Check for overlaps before doing anything else!
            int overlaps = bookingRepository.countOverlappingBookings(venueId, start, end);
            
            if (overlaps > 0) {
                // Return a 409 Conflict error if the room is taken
                return ResponseEntity.status(409).body("Venue is already booked or pending during this time.");
            }

            Optional<User> clubOpt = userRepository.findById(clubId);
            Optional<Venue> venueOpt = venueRepository.findById(venueId);

            if (clubOpt.isPresent() && venueOpt.isPresent()) {
                Booking newBooking = new Booking();
                newBooking.setTitle(payload.get("title"));
                newBooking.setStatus("PENDING"); 
                newBooking.setClub(clubOpt.get());
                newBooking.setVenue(venueOpt.get());
                newBooking.setStartTime(start);
                newBooking.setEndTime(end);
                
                Booking savedBooking = bookingRepository.save(newBooking);
                return ResponseEntity.ok(savedBooking);
            } else {
                return ResponseEntity.status(404).body("Club or Venue not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error creating booking request");
        }
    }
    // 3. Update Booking Status (For the Admin Dashboard)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            Optional<Booking> bookingOpt = bookingRepository.findById(id);
            
            if (bookingOpt.isPresent()) {
                Booking booking = bookingOpt.get();
                // Get the new status from React ("APPROVED" or "REJECTED")
                booking.setStatus(payload.get("status")); 
                
                Booking updatedBooking = bookingRepository.save(booking);
                return ResponseEntity.ok(updatedBooking);
            } else {
                return ResponseEntity.status(404).body("Booking not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error updating booking status");
        }
    }
}