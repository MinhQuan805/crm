package dev.uit.project.service;

import dev.uit.project.domain.User;
import dev.uit.project.domain.dto.LoginRequest;
import dev.uit.project.domain.dto.LoginResponse;
import dev.uit.project.domain.dto.RegisterRequest;
import dev.uit.project.domain.dto.UserDTO;
import dev.uit.project.repository.UserRepository;
import dev.uit.project.service.validator.PasswordValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordValidator passwordValidator;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, PasswordValidator passwordValidator) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordValidator = passwordValidator;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user.getStatus() != User.UserStatus.active) {
            throw new RuntimeException("Account is not active. Status: " + user.getStatus());
        }

        // Allow all roles: superadmin, admin, manager, staff, client
        // Role-based access control will be handled by the frontend routing

        String accessToken = "access-token-" + UUID.randomUUID();

        return new LoginResponse(accessToken, UserDTO.fromEntity(user));
    }

    @Transactional
    public UserDTO register(RegisterRequest request) {
        if (!passwordValidator.isValid(request.getPassword())) {
            throw new RuntimeException("Password must contain at least 8 characters, including uppercase, lowercase, and numbers");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        String[] nameParts = request.getName().trim().split("\\s+", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        String username = request.getEmail().split("@")[0];
        int counter = 1;
        String originalUsername = username;
        while (userRepository.existsByUsername(username)) {
            username = originalUsername + counter++;
        }

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUsername(username);
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.UserRole.admin);
        user.setStatus(User.UserStatus.active);
        user.setPhoneNumber("");

        User savedUser = userRepository.save(user);
        return UserDTO.fromEntity(savedUser);
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDTO.fromEntity(user);
    }
}
