package dev.uit.project.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public class CreateRoomTypeRequest {

    @NotBlank(message = "Room type name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 2000)
    private String description;

    @NotNull(message = "Capacity is required")
    @Positive
    private Integer capacity;

    @NotNull(message = "Base price is required")
    @Positive
    private BigDecimal basePrice;

    private List<String> images;
    private List<String> amenities;

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
}
