package dev.uit.project.domain.dto;

import java.math.BigDecimal;

public class CustomerStatsDTO {
    private Long customerId;
    private String customerName;
    private Long totalBookings;
    private BigDecimal totalSpent;
    private Long cancelledBookings;
    private Long completedBookings;

    public CustomerStatsDTO() {
    }

    public CustomerStatsDTO(Long customerId, String customerName, Long totalBookings,
                            BigDecimal totalSpent, Long cancelledBookings, Long completedBookings) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.totalBookings = totalBookings;
        this.totalSpent = totalSpent;
        this.cancelledBookings = cancelledBookings;
        this.completedBookings = completedBookings;
    }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }
    public BigDecimal getTotalSpent() { return totalSpent; }
    public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }
    public Long getCancelledBookings() { return cancelledBookings; }
    public void setCancelledBookings(Long cancelledBookings) { this.cancelledBookings = cancelledBookings; }
    public Long getCompletedBookings() { return completedBookings; }
    public void setCompletedBookings(Long completedBookings) { this.completedBookings = completedBookings; }
}
