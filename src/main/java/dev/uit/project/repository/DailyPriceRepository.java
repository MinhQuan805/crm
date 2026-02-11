package dev.uit.project.repository;

import dev.uit.project.domain.DailyPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyPriceRepository extends JpaRepository<DailyPrice, Long> {
    List<DailyPrice> findByRoomTypeIdAndDateBetween(Long roomTypeId, LocalDate startDate, LocalDate endDate);
    Optional<DailyPrice> findByRoomTypeIdAndDate(Long roomTypeId, LocalDate date);
}
