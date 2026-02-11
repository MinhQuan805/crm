package dev.uit.project.controller.admin;

import dev.uit.project.domain.Room;
import dev.uit.project.domain.dto.*;
import dev.uit.project.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }
    @GetMapping({"/room-types"})
    public ResponseEntity<List<RoomTypeDTO>> getAllRoomTypes() {
        return ResponseEntity.ok(roomService.getAllRoomTypes());
    }

    @GetMapping({"/room-types/{id}"})
    public ResponseEntity<RoomTypeDTO> getRoomTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomTypeById(id));
    }

    @PostMapping({"/room-types"})
    public ResponseEntity<RoomTypeDTO> createRoomType(@Valid @RequestBody CreateRoomTypeRequest request) {
        return ResponseEntity.ok(roomService.createRoomType(request));
    }

    @PutMapping({"/room-types/{id}"})
    public ResponseEntity<RoomTypeDTO> updateRoomType(@PathVariable Long id,
                                                       @Valid @RequestBody CreateRoomTypeRequest request) {
        return ResponseEntity.ok(roomService.updateRoomType(id, request));
    }

    // Room endpoints
    @GetMapping("/rooms")
    public ResponseEntity<Page<RoomDTO>> getAllRooms(
            @RequestParam(required = false) Room.RoomStatus status,
            @RequestParam(required = false) Long roomTypeId,
            @RequestParam(required = false) Integer floor,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "roomNumber") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable;
        if (size == null || size <= 0) {
            pageable = Pageable.unpaged();
        } else {
            pageable = PageRequest.of(page, size, sort);
        }
        return ResponseEntity.ok(roomService.getAllRooms(status, roomTypeId, floor, pageable));
    }

    @PostMapping("/rooms/bulk")
    public ResponseEntity<List<RoomDTO>> bulkCreateRooms(@Valid @RequestBody BulkCreateRoomRequest request) {
        return ResponseEntity.ok(roomService.bulkCreateRooms(request));
    }

    @PutMapping("/rooms/{id}/status")
    public ResponseEntity<RoomDTO> updateRoomStatus(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body) {
        Room.RoomStatus status = Room.RoomStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(roomService.updateRoomStatus(id, status));
    }

    @GetMapping("/rooms/availability")
    public ResponseEntity<List<RoomDTO>> getAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {
        return ResponseEntity.ok(roomService.getAvailableRooms(checkInDate, checkOutDate));
    }
}
