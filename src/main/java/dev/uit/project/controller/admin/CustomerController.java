package dev.uit.project.controller.admin;

import dev.uit.project.domain.dto.*;
import dev.uit.project.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<Page<CustomerDTO>> getAllCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isVIP,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable;
        if (size == null || size <= 0) {
            pageable = Pageable.unpaged();
        } else {
            pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        }
        return ResponseEntity.ok(customerService.getAllCustomers(search, isVIP, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        return ResponseEntity.ok(customerService.createCustomer(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id,
                                                       @Valid @RequestBody CreateCustomerRequest request) {
        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<Page<BookingDTO>> getCustomerBookings(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Integer size) {
        Pageable pageable;
        if (size == null || size <= 0) {
            pageable = Pageable.unpaged();
        } else {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        return ResponseEntity.ok(customerService.getCustomerBookings(id, pageable));
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<CustomerStatsDTO> getCustomerStats(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerStats(id));
    }
}
