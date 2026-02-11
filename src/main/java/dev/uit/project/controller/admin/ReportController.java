package dev.uit.project.controller.admin;

import dev.uit.project.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "MONTH") String groupBy) {
        return ResponseEntity.ok(reportService.getRevenueReport(startDate, endDate, groupBy));
    }

    @GetMapping("/occupancy")
    public ResponseEntity<Map<String, Object>> getOccupancyReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(reportService.getOccupancyReport(startDate, endDate));
    }

    @GetMapping("/booking-trends")
    public ResponseEntity<Map<String, Object>> getBookingTrends(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(reportService.getBookingTrends(startDate, endDate));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {
        return ResponseEntity.ok(reportService.getDashboardOverview());
    }

    // New endpoints for dashboard and reports

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        return ResponseEntity.ok(reportService.getDashboardOverview());
    }

    @GetMapping("/trends")
    public ResponseEntity<List<Map<String, Object>>> getTrends(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> result = reportService.getBookingTrends(startDate, endDate);
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> trends = (List<Map<String, Object>>) result.get("trends");
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue(
            @RequestParam(defaultValue = "12") int months) {
        return ResponseEntity.ok(reportService.getMonthlyRevenue(months));
    }

    @GetMapping("/recent-bookings")
    public ResponseEntity<List<Map<String, Object>>> getRecentBookings(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(reportService.getRecentBookings(limit));
    }

    @GetMapping("/occupancy-today")
    public ResponseEntity<Map<String, Object>> getOccupancyToday(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(reportService.getDetailedOccupancy(targetDate));
    }

    @GetMapping("/total-revenue")
    public ResponseEntity<BigDecimal> getTotalRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(reportService.getTotalRevenue(startDate, endDate));
    }

    @GetMapping("/rooms-by-type")
    public ResponseEntity<List<Map<String, Object>>> getRoomsByType() {
        return ResponseEntity.ok(reportService.getRoomsByType());
    }

    @GetMapping("/rooms-by-status")
    public ResponseEntity<List<Map<String, Object>>> getRoomsByStatus() {
        return ResponseEntity.ok(reportService.getRoomsByStatus());
    }

    @GetMapping("/bookings-by-status")
    public ResponseEntity<List<Map<String, Object>>> getBookingsByStatus() {
        return ResponseEntity.ok(reportService.getBookingsByStatus());
    }

    @GetMapping("/revenue-by-room-type")
    public ResponseEntity<List<Map<String, Object>>> getRevenueByRoomType() {
        return ResponseEntity.ok(reportService.getRevenueByRoomType());
    }

    @GetMapping("/popular-room-types")
    public ResponseEntity<List<Map<String, Object>>> getPopularRoomTypes(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(reportService.getPopularRoomTypes(startDate, endDate));
    }
}
