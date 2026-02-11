package dev.uit.project.repository;

import dev.uit.project.domain.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {
    List<Amenity> findByCategory(String category);
}
