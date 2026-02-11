package dev.uit.project.domain.dto;

import dev.uit.project.domain.Policy;

import java.time.LocalDateTime;

public class PolicyDTO {
    private Long id;
    private Policy.PolicyType type;
    private String title;
    private String content;
    private String language;
    private Boolean isActive;
    private Integer version;
    private LocalDateTime updatedAt;

    public PolicyDTO() {
    }

    public static PolicyDTO fromEntity(Policy policy) {
        PolicyDTO dto = new PolicyDTO();
        dto.setId(policy.getId());
        dto.setType(policy.getType());
        dto.setTitle(policy.getTitle());
        dto.setContent(policy.getContent());
        dto.setLanguage(policy.getLanguage());
        dto.setIsActive(policy.getIsActive());
        dto.setVersion(policy.getVersion());
        dto.setUpdatedAt(policy.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Policy.PolicyType getType() { return type; }
    public void setType(Policy.PolicyType type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
