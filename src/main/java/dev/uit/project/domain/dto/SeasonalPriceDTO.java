package dev.uit.project.domain.dto;

import dev.uit.project.domain.SeasonalPrice;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SeasonalPriceDTO {
    private Long id;
    private Long roomTypeId;
    private String roomTypeName;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal priceMultiplier;
    private Integer priority;

    public SeasonalPriceDTO() {
    }

    public static SeasonalPriceDTO fromEntity(SeasonalPrice sp) {
        SeasonalPriceDTO dto = new SeasonalPriceDTO();
        dto.setId(sp.getId());
        dto.setRoomTypeId(sp.getRoomType().getId());
        dto.setRoomTypeName(sp.getRoomType().getName());
        dto.setName(sp.getName());
        dto.setStartDate(sp.getStartDate());
        dto.setEndDate(sp.getEndDate());
        dto.setPriceMultiplier(sp.getPriceMultiplier());
        dto.setPriority(sp.getPriority());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRoomTypeId() { return roomTypeId; }
    public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }
    public String getRoomTypeName() { return roomTypeName; }
    public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public BigDecimal getPriceMultiplier() { return priceMultiplier; }
    public void setPriceMultiplier(BigDecimal priceMultiplier) { this.priceMultiplier = priceMultiplier; }
    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
}
