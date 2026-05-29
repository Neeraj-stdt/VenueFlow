package com.example.smart_venue_backend.controllers;

import com.example.smart_venue_backend.entities.Venue;
import com.example.smart_venue_backend.repositories.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = "http://localhost:5173") 
public class VenueController {

    @Autowired
    private VenueRepository venueRepository;

    @GetMapping
    public List<Venue> getAllVenues() {
        // This automatically writes the SQL: SELECT * FROM venues;
        return venueRepository.findAll();
    }
}