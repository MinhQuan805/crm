package dev.uit.project.domain.dto;

import dev.uit.project.domain.Room;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class BulkCreateRoomRequest {

    @NotNull(message = "Room type ID is required")
    private Long roomTypeId;

    @NotNull
    private List<RoomEntry> rooms;

    public Long getRoomTypeId() { return roomTypeId; }
    public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }
    public List<RoomEntry> getRooms() { return rooms; }
    public void setRooms(List<RoomEntry> rooms) { this.rooms = rooms; }

    public static class RoomEntry {
        private String roomNumber;
        private Integer floor;
        private Room.RoomStatus status = Room.RoomStatus.AVAILABLE;
        private String notes;

        public String getRoomNumber() { return roomNumber; }
        public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
        public Integer getFloor() { return floor; }
        public void setFloor(Integer floor) { this.floor = floor; }
        public Room.RoomStatus getStatus() { return status; }
        public void setStatus(Room.RoomStatus status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
