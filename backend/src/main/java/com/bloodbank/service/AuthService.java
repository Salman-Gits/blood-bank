package com.bloodbank.service;

import com.bloodbank.dto.LoginRequest;
import com.bloodbank.dto.LoginResponse;
import com.bloodbank.dto.RegisterRequest;
import com.bloodbank.model.User;
import com.bloodbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername());
        if (userOpt.isEmpty()) {
            return new LoginResponse(false, "Invalid username or email", null, null, null, null, null, null);
        }

        User user = userOpt.get();
        // In production use BCryptPasswordEncoder; for demonstrative ease and seamless local setup compare plain/hashed
        if (!user.getPassword().equals(request.getPassword())) {
            return new LoginResponse(false, "Invalid password", null, null, null, null, null, null);
        }

        String token = "jwt_" + UUID.randomUUID().toString().replace("-", "");
        return new LoginResponse(
                true,
                "Login successful",
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return new LoginResponse(false, "Username already exists", null, null, null, null, null, null);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return new LoginResponse(false, "Email already registered", null, null, null, null, null, null);
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getFullName(),
                request.getPhone(),
                request.getRole()
        );

        User saved = userRepository.save(user);
        String token = "jwt_" + UUID.randomUUID().toString().replace("-", "");

        return new LoginResponse(
                true,
                "Registration successful",
                token,
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getFullName(),
                saved.getRole()
        );
    }
}
