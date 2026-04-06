package iuh.fit.customer_service.services.impl;

import iuh.fit.customer_service.dtos.request.LoginRequest;
import iuh.fit.customer_service.dtos.request.RegisterRequest;
import iuh.fit.customer_service.dtos.response.LoginResponse;
import iuh.fit.customer_service.dtos.response.RegisterResponse;
import iuh.fit.customer_service.entities.UserAccount;
import iuh.fit.customer_service.exceptions.ConflictException;
import iuh.fit.customer_service.exceptions.UnauthorizedException;
import iuh.fit.customer_service.repositories.UserAccountRepository;
import iuh.fit.customer_service.services.AuthService;
import iuh.fit.customer_service.services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public RegisterResponse register(RegisterRequest request) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userAccountRepository.existsByUsername(username)) {
            throw new ConflictException("Username already exists");
        }
        if (userAccountRepository.existsByEmail(email)) {
            throw new ConflictException("Email already exists");
        }

        UserAccount user = UserAccount.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .role("CUSTOMER")
                .build();

        UserAccount saved = userAccountRepository.save(user);
        return RegisterResponse.builder()
                .id(saved.getId())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .fullName(saved.getFullName())
                .role(saved.getRole())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        String login = request.getLogin().trim();

        UserAccount user = userAccountRepository.findByUsername(login)
                .or(() -> userAccountRepository.findByEmail(login.toLowerCase()))
                .orElseThrow(() -> new UnauthorizedException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid username/email or password");
        }

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getUsername(), user.getRole());
        return LoginResponse.builder()
                .tokenType("Bearer")
                .accessToken(accessToken)
                .expiresIn(jwtService.getAccessTokenExpirationSeconds())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
