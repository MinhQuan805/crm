package dev.uit.project.service;

import dev.uit.project.domain.Policy;
import dev.uit.project.domain.dto.PolicyDTO;
import dev.uit.project.repository.PolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyService(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    @Transactional(readOnly = true)
    public List<PolicyDTO> getAllPolicies() {
        return policyRepository.findAll().stream().map(PolicyDTO::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<PolicyDTO> getPoliciesByType(Policy.PolicyType type) {
        return policyRepository.findByType(type).stream().map(PolicyDTO::fromEntity).toList();
    }

    @Transactional
    public PolicyDTO updatePolicy(Long id, String title, String content, String language) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + id));

        if (title != null) policy.setTitle(title);
        if (content != null) policy.setContent(content);
        if (language != null) policy.setLanguage(language);

        return PolicyDTO.fromEntity(policyRepository.save(policy));
    }

    @Transactional
    public PolicyDTO publishPolicy(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + id));

        // Deactivate all policies of the same type
        policyRepository.findByType(policy.getType()).forEach(p -> {
            p.setIsActive(false);
            policyRepository.save(p);
        });

        // Create a new version
        Policy newVersion = new Policy();
        newVersion.setType(policy.getType());
        newVersion.setTitle(policy.getTitle());
        newVersion.setContent(policy.getContent());
        newVersion.setLanguage(policy.getLanguage());
        newVersion.setIsActive(true);
        newVersion.setVersion(policy.getVersion() + 1);

        return PolicyDTO.fromEntity(policyRepository.save(newVersion));
    }

    @Transactional
    public PolicyDTO createPolicy(Policy.PolicyType type, String title, String content, String language) {
        Policy policy = new Policy();
        policy.setType(type);
        policy.setTitle(title);
        policy.setContent(content);
        policy.setLanguage(language != null ? language : "vi");
        policy.setIsActive(true);
        policy.setVersion(1);

        return PolicyDTO.fromEntity(policyRepository.save(policy));
    }
}
