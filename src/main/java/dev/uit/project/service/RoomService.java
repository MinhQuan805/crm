package dev.uit.project.service;

import dev.uit.project.domain.Room;
import dev.uit.project.domain.RoomType;
import dev.uit.project.domain.dto.*;
import dev.uit.project.repository.RoomRepository;
import dev.uit.project.repository.RoomTypeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;

    public RoomService(RoomRepository roomRepository, RoomTypeRepository roomTypeRepository) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    // Room Type operations
    @Transactional(readOnly = true)
    public List<RoomTypeDTO> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream().map(RoomTypeDTO::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public RoomTypeDTO getRoomTypeById(Long id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room type not found with id: " + id));
        return RoomTypeDTO.fromEntity(roomType);
    }

    @Transactional
    public RoomTypeDTO createRoomType(CreateRoomTypeRequest request) {

        RoomType roomType = new RoomType();
        roomType.setName(request.getName());
        roomType.setDescription(request.getDescription());
        roomType.setCapacity(request.getCapacity());
        roomType.setBasePrice(request.getBasePrice());
        if (request.getImages() != null) roomType.setImages(request.getImages());
        if (request.getAmenities() != null) roomType.setAmenities(request.getAmenities());

        return RoomTypeDTO.fromEntity(roomTypeRepository.save(roomType));
    }

    @Transactional
    public RoomTypeDTO updateRoomType(Long id, CreateRoomTypeRequest request) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room type not found with id: " + id));

        if (request.getName() != null) roomType.setName(request.getName());
        if (request.getDescription() != null) roomType.setDescription(request.getDescription());
        if (request.getCapacity() != null) roomType.setCapacity(request.getCapacity());
        if (request.getBasePrice() != null) roomType.setBasePrice(request.getBasePrice());
        if (request.getImages() != null) roomType.setImages(request.getImages());
        if (request.getAmenities() != null) roomType.setAmenities(request.getAmenities());

        return RoomTypeDTO.fromEntity(roomTypeRepository.save(roomType));
    }

    // Room operations
    @Transactional(readOnly = true)
    public Page<RoomDTO> getAllRooms(Room.RoomStatus status, Long roomTypeId, Integer floor,
                                     Pageable pageable) {
        Specification<Room> spec = Specification.where((root, query, cb) -> cb.conjunction());

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (roomTypeId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("roomType").get("id"), roomTypeId));
        }
        if (floor != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("floor"), floor));
        }
        return roomRepository.findAll(spec, pageable).map(RoomDTO::fromEntity);
    }

    @Transactional
    public List<RoomDTO> bulkCreateRooms(BulkCreateRoomRequest request) {
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("Room type not found with id: " + request.getRoomTypeId()));

        List<Room> rooms = new ArrayList<>();
        for (BulkCreateRoomRequest.RoomEntry entry : request.getRooms()) {
            Room room = new Room();
            room.setRoomType(roomType);
            room.setRoomNumber(entry.getRoomNumber());
            room.setFloor(entry.getFloor());
            room.setStatus(entry.getStatus() != null ? entry.getStatus() : Room.RoomStatus.AVAILABLE);
            room.setNotes(entry.getNotes());
            rooms.add(room);
        }

        List<Room> saved = roomRepository.saveAll(rooms);
        return saved.stream().map(RoomDTO::fromEntity).toList();
    }

    @Transactional
    public RoomDTO updateRoomStatus(Long roomId, Room.RoomStatus status) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
        room.setStatus(status);
        return RoomDTO.fromEntity(roomRepository.save(room));
    }

    @Transactional(readOnly = true)
    public List<RoomDTO> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate) {
        return roomRepository.findAvailableRooms(checkInDate, checkOutDate)
                .stream().map(RoomDTO::fromEntity).toList();
    }
}
