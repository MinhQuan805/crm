package dev.uit.project.domain.dto;

import dev.uit.project.domain.Amenity;

public class AmenityDTO {
    private Long id;
    private String name;
    private String icon;
    private String category;
    private String description;

    public AmenityDTO() {
    }

    public static AmenityDTO fromEntity(Amenity amenity) {
        AmenityDTO dto = new AmenityDTO();
        dto.setId(amenity.getId());
        dto.setName(amenity.getName());
        dto.setIcon(amenity.getIcon());
        dto.setCategory(amenity.getCategory());
        dto.setDescription(amenity.getDescription());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
