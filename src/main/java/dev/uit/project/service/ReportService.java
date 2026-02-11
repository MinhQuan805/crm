package dev.uit.project.service;

import dev.uit.project.domain.Booking;
import dev.uit.project.repository.BookingRepository;
import dev.uit.project.repository.CustomerRepository;
import dev.uit.project.repository.RoomRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
public class ReportService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;

    public ReportService(BookingRepository bookingRepository, RoomRepository roomRepository,
                         CustomerRepository customerRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRevenueReport(LocalDate startDate, LocalDate endDate,
                                                 String groupBy) {
        Map<String, Object> report = new LinkedHashMap<>();
        BigDecimal totalRevenue = bookingRepository.calculateRevenue(startDate, endDate);

        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalRevenue", totalRevenue);
        report.put("groupBy", groupBy);

        // Generate daily/periodic breakdown
        List<Map<String, Object>> breakdown = new ArrayList<>();
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            LocalDate periodEnd;
            switch (groupBy != null ? groupBy.toUpperCase() : "DAY") {
                case "WEEK":
                    periodEnd = current.plusWeeks(1).minusDays(1);
                    break;
                case "MONTH":
                    periodEnd = current.plusMonths(1).minusDays(1);
                    break;
                case "YEAR":
                    periodEnd = current.plusYears(1).minusDays(1);
                    break;
                default:
                    periodEnd = current;
            }
            if (periodEnd.isAfter(endDate)) periodEnd = endDate;

                BigDecimal periodRevenue = bookingRepository.calculateRevenue(current, periodEnd);

            Map<String, Object> period = new LinkedHashMap<>();
            period.put("startDate", current);
            period.put("endDate", periodEnd);
            period.put("revenue", periodRevenue);
            breakdown.add(period);

            current = periodEnd.plusDays(1);
        }
        report.put("breakdown", breakdown);

        return report;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getOccupancyReport(LocalDate startDate, LocalDate endDate) {
        long totalRooms = roomRepository.count();
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalRooms", totalRooms);

        List<Map<String, Object>> daily = new ArrayList<>();
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            Long occupied = bookingRepository.countOccupiedRoomsOnDate(current);
            double rate = totalRooms > 0 ? (double) occupied / totalRooms * 100 : 0;

            Map<String, Object> day = new LinkedHashMap<>();
            day.put("date", current);
            day.put("totalRooms", totalRooms);
            day.put("occupiedRooms", occupied);
            day.put("occupancyRate", BigDecimal.valueOf(rate).setScale(1, RoundingMode.HALF_UP));
            daily.add(day);

            current = current.plusDays(1);
        }
        report.put("daily", daily);

        return report;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getBookingTrends(LocalDate startDate, LocalDate endDate) {
        List<Map<String, Object>> trends = new ArrayList<>();

        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            LocalDate dayEnd = current.plusDays(1);
            Long count = bookingRepository.countBookingsInPeriod(current, dayEnd);
            BigDecimal dayRevenue = bookingRepository.calculateRevenue(current, current);

            Map<String, Object> day = new LinkedHashMap<>();
            day.put("date", current);
            day.put("bookingCount", count != null ? count : 0);
            day.put("revenue", dayRevenue != null ? dayRevenue : BigDecimal.ZERO);
            trends.add(day);

            current = current.plusDays(1);
        }

        return Map.of("trends", trends);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardOverview() {
        Map<String, Object> overview = new LinkedHashMap<>();
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate lastMonthStart = monthStart.minusMonths(1);
        LocalDate lastMonthEnd = monthStart.minusDays(1);

        long totalRooms = roomRepository.count();
        long totalCustomers = customerRepository.count();
        long totalBookings = bookingRepository.count();
        Long occupiedRooms = bookingRepository.countOccupiedRoomsOnDate(today);
        if (occupiedRooms == null) occupiedRooms = 0L;
        
        BigDecimal monthlyRevenue = bookingRepository.calculateRevenue(monthStart, today);
        if (monthlyRevenue == null) monthlyRevenue = BigDecimal.ZERO;
        
        BigDecimal lastMonthRevenue = bookingRepository.calculateRevenue(lastMonthStart, lastMonthEnd);
        if (lastMonthRevenue == null) lastMonthRevenue = BigDecimal.ZERO;

        double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0;

        // Calculate growth percentages
        double revenueGrowth = 0;
        if (lastMonthRevenue.compareTo(BigDecimal.ZERO) > 0) {
            revenueGrowth = monthlyRevenue.subtract(lastMonthRevenue)
                .divide(lastMonthRevenue, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
        }

        // Today's bookings
        Long todayBookings = bookingRepository.countBookingsInPeriod(today, today.plusDays(1));
        if (todayBookings == null) todayBookings = 0L;

        overview.put("totalRooms", totalRooms);
        overview.put("totalCustomers", totalCustomers);
        overview.put("totalBookings", totalBookings);
        overview.put("monthlyRevenue", monthlyRevenue);
        overview.put("totalRevenue", monthlyRevenue);
        overview.put("occupiedRooms", occupiedRooms);
        overview.put("availableRooms", totalRooms - occupiedRooms);
        overview.put("occupancyRate", BigDecimal.valueOf(occupancyRate).setScale(1, RoundingMode.HALF_UP));
        overview.put("revenueGrowth", revenueGrowth);
        overview.put("todayBookings", todayBookings);

        return overview;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMonthlyRevenue(int months) {
        List<Map<String, Object>> result = new ArrayList<>();
        YearMonth current = YearMonth.now();
        
        for (int i = months - 1; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            LocalDate start = month.atDay(1);
            LocalDate end = month.atEndOfMonth();
            
            BigDecimal revenue = bookingRepository.calculateRevenue(start, end);
            Long bookingCount = bookingRepository.countBookingsInPeriod(start, end.plusDays(1));
            
            Map<String, Object> monthData = new LinkedHashMap<>();
            monthData.put("month", month.getMonth().toString().substring(0, 3));
            monthData.put("year", month.getYear());
            monthData.put("revenue", revenue != null ? revenue : BigDecimal.ZERO);
            monthData.put("bookings", bookingCount != null ? bookingCount : 0);
            result.add(monthData);
        }
        
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRecentBookings(int limit) {
        List<Map<String, Object>> result = new ArrayList<>();
        
        List<Booking> recentBookings = bookingRepository.findAll(
            PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
        
        for (Booking booking : recentBookings) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", booking.getId());
            item.put("customerName", booking.getCustomer() != null ? booking.getCustomer().getFullName() : "N/A");
            item.put("customerEmail", booking.getCustomer() != null ? booking.getCustomer().getEmail() : "N/A");
            item.put("roomNumber", booking.getRoom() != null ? booking.getRoom().getRoomNumber() : "N/A");
            item.put("checkInDate", booking.getCheckInDate());
            item.put("checkOutDate", booking.getCheckOutDate());
            item.put("totalPrice", booking.getTotalPrice());
            item.put("status", booking.getStatus() != null ? booking.getStatus().name() : "UNKNOWN");
            item.put("createdAt", booking.getCreatedAt());
            result.add(item);
        }
        
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDetailedOccupancy(LocalDate date) {
        long totalRooms = roomRepository.count();
        Long occupiedRooms = bookingRepository.countOccupiedRoomsOnDate(date);
        if (occupiedRooms == null) occupiedRooms = 0L;
        
        double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("date", date);
        result.put("totalRooms", totalRooms);
        result.put("occupiedRooms", occupiedRooms);
        result.put("availableRooms", totalRooms - occupiedRooms);
        result.put("occupancyRate", BigDecimal.valueOf(occupancyRate).setScale(1, RoundingMode.HALF_UP));
        
        return result;
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalRevenue(LocalDate startDate, LocalDate endDate) {
        BigDecimal revenue = bookingRepository.calculateRevenue(startDate, endDate);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRoomsByType() {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Object[]> data = roomRepository.countRoomsByType();
        
        for (Object[] row : data) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("roomType", row[0]);
            item.put("count", row[1]);
            result.add(item);
        }
        
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRoomsByStatus() {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Object[]> data = roomRepository.countRoomsByStatus();
        
        for (Object[] row : data) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("status", row[0].toString());
            item.put("count", row[1]);
            result.add(item);
        }
        
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getBookingsByStatus() {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Object[]> data = bookingRepository.countBookingsByStatus();
        
        for (Object[] row : data) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("status", row[0].toString());
            item.put("count", row[1]);
            result.add(item);
        }
        
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRevenueByRoomType() {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Object[]> data = bookingRepository.getRevenueByRoomType();
        
        for (Object[] row : data) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("roomType", row[0]);
            item.put("bookingCount", row[1]);
            item.put("revenue", row[2]);
            result.add(item);
        }
        
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getPopularRoomTypes(LocalDate startDate, LocalDate endDate) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Object[]> data = bookingRepository.getPopularRoomTypes(startDate, endDate);
        
        for (Object[] row : data) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("roomType", row[0]);
            item.put("bookingCount", row[1]);
            result.add(item);
        }
        
        return result;
    }
}
