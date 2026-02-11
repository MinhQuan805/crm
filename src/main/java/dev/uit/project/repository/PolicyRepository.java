package dev.uit.project.repository;

import dev.uit.project.domain.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByType(Policy.PolicyType type);
    Optional<Policy> findByTypeAndIsActiveTrue(Policy.PolicyType type);
}
