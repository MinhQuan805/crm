package dev.uit.project.repository;

import dev.uit.project.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long>, JpaSpecificationExecutor<Room> {

    List<Room> findByRoomTypeId(Long roomTypeId);

    List<Room> findByStatus(Room.RoomStatus status);

    List<Room> findByFloor(Integer floor);

    @Query("SELECT r FROM Room r WHERE r.status = 'AVAILABLE' AND r.id NOT IN " +
            "(SELECT b.room.id FROM Booking b WHERE b.status NOT IN ('CANCELLED', 'CHECKED_OUT') " +
            "AND b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate)")
    List<Room> findAvailableRooms(@Param("checkInDate") LocalDate checkInDate,
                                  @Param("checkOutDate") LocalDate checkOutDate);

    @Query("SELECT r.roomType.name, COUNT(r) FROM Room r GROUP BY r.roomType.name")
    List<Object[]> countRoomsByType();

    @Query("SELECT r.status, COUNT(r) FROM Room r GROUP BY r.status")
    List<Object[]> countRoomsByStatus();

    @Query("SELECT COUNT(r) FROM Room r WHERE r.status = :status")
    Long countByStatus(@Param("status") Room.RoomStatus status);
}
