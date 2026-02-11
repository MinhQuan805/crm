package dev.uit.project.domain.dto;

import dev.uit.project.domain.DailyPrice;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DailyPriceDTO {
    private Long id;
    private Long roomTypeId;
    private String roomTypeName;
    private LocalDate date;
    private BigDecimal price;
    private String reason;

    public DailyPriceDTO() {
    }

    public static DailyPriceDTO fromEntity(DailyPrice dp) {
        DailyPriceDTO dto = new DailyPriceDTO();
        dto.setId(dp.getId());
        dto.setRoomTypeId(dp.getRoomType().getId());
        dto.setRoomTypeName(dp.getRoomType().getName());
        dto.setDate(dp.getDate());
        dto.setPrice(dp.getPrice());
        dto.setReason(dp.getReason());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRoomTypeId() { return roomTypeId; }
    public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }
    public String getRoomTypeName() { return roomTypeName; }
    public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
