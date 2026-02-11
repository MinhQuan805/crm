package dev.uit.project.domain.dto;

import dev.uit.project.domain.BookingHistory;

import java.time.LocalDateTime;

public class BookingHistoryDTO {
    private Long id;
    private Long bookingId;
    private String action;
    private String performedBy;
    private LocalDateTime timestamp;
    private String notes;

    public BookingHistoryDTO() {
    }

    public static BookingHistoryDTO fromEntity(BookingHistory history) {
        BookingHistoryDTO dto = new BookingHistoryDTO();
        dto.setId(history.getId());
        dto.setBookingId(history.getBooking().getId());
        dto.setAction(history.getAction());
        dto.setPerformedBy(history.getPerformedBy());
        dto.setTimestamp(history.getTimestamp());
        dto.setNotes(history.getNotes());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
