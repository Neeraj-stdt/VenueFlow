package com.example.smart_venue_backend.controllers;

import com.example.smart_venue_backend.entities.User;
import com.example.smart_venue_backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Crucial: Allows your React app to connect!
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Search the database for this email
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            // Login Success: Send the user object back to React
            return ResponseEntity.ok(userOpt.get());
        } else {
            // Login Failure: Send a 401 Unauthorized error
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}