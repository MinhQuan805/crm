package dev.uit.project.service;

import dev.uit.project.domain.Customer;
import dev.uit.project.domain.dto.*;
import dev.uit.project.repository.BookingRepository;
import dev.uit.project.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;

    public CustomerService(CustomerRepository customerRepository, BookingRepository bookingRepository) {
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public Page<CustomerDTO> getAllCustomers(String search, Boolean isVIP, Pageable pageable) {
        Specification<Customer> spec = Specification.where((root, query, cb) -> cb.conjunction());

        if (search != null && !search.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("firstName")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("lastName")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("phone")), "%" + search.toLowerCase() + "%")
            ));
        }

        if (isVIP != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isVIP"), isVIP));
        }

        return customerRepository.findAll(spec, pageable).map(CustomerDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return CustomerDTO.fromEntity(customer);
    }

    @Transactional
    public CustomerDTO createCustomer(CreateCustomerRequest request) {
        if (request.getEmail() != null && customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        Customer customer = new Customer();
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setIdNumber(request.getIdNumber());
        customer.setNationality(request.getNationality());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setAddress(request.getAddress());
        customer.setNotes(request.getNotes());
        customer.setIsVIP(request.getIsVIP() != null ? request.getIsVIP() : false);

        return CustomerDTO.fromEntity(customerRepository.save(customer));
    }

    @Transactional
    public CustomerDTO updateCustomer(Long id, CreateCustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        if (request.getFirstName() != null) customer.setFirstName(request.getFirstName());
        if (request.getLastName() != null) customer.setLastName(request.getLastName());
        if (request.getEmail() != null) {
            if (!request.getEmail().equals(customer.getEmail()) && customerRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists: " + request.getEmail());
            }
            customer.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) customer.setPhone(request.getPhone());
        if (request.getIdNumber() != null) customer.setIdNumber(request.getIdNumber());
        if (request.getNationality() != null) customer.setNationality(request.getNationality());
        if (request.getDateOfBirth() != null) customer.setDateOfBirth(request.getDateOfBirth());
        if (request.getAddress() != null) customer.setAddress(request.getAddress());
        if (request.getNotes() != null) customer.setNotes(request.getNotes());
        if (request.getIsVIP() != null) customer.setIsVIP(request.getIsVIP());

        return CustomerDTO.fromEntity(customerRepository.save(customer));
    }

    @Transactional(readOnly = true)
    public Page<BookingDTO> getCustomerBookings(Long customerId, Pageable pageable) {
        return bookingRepository.findByCustomerId(customerId, pageable)
                .map(BookingDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public CustomerStatsDTO getCustomerStats(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));

        return new CustomerStatsDTO(
                customer.getId(),
                customer.getFirstName() + " " + customer.getLastName(),
                bookingRepository.countByCustomerId(customerId),
                bookingRepository.totalSpentByCustomer(customerId),
                bookingRepository.countCancelledByCustomer(customerId),
                bookingRepository.countCompletedByCustomer(customerId)
        );
    }
}
