package com.example.smart_venue_backend.repositories;

import com.example.smart_venue_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This lets us find a club or admin by their email address
    Optional<User> findByEmail(String email);
}