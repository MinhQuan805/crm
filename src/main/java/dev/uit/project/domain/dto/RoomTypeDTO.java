package dev.uit.project.domain.dto;

import dev.uit.project.domain.RoomType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class RoomTypeDTO {
    private Long id;
    private String name;
    private String description;
    private Integer capacity;
    private BigDecimal basePrice;
    private List<String> images;
    private List<String> amenities;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RoomTypeDTO() {
    }

    public static RoomTypeDTO fromEntity(RoomType roomType) {
        RoomTypeDTO dto = new RoomTypeDTO();
        dto.setId(roomType.getId());
        dto.setName(roomType.getName());
        dto.setDescription(roomType.getDescription());
        dto.setCapacity(roomType.getCapacity());
        dto.setBasePrice(roomType.getBasePrice());
        dto.setImages(roomType.getImages());
        dto.setAmenities(roomType.getAmenities());
        dto.setCreatedAt(roomType.getCreatedAt());
        dto.setUpdatedAt(roomType.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
