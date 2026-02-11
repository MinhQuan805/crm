package dev.uit.project.repository;

import dev.uit.project.domain.BookingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingHistoryRepository extends JpaRepository<BookingHistory, Long> {
    List<BookingHistory> findByBookingIdOrderByTimestampDesc(Long bookingId);
}
