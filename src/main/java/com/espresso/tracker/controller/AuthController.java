package com.espresso.tracker.controller;

import com.espresso.tracker.dto.LoginRequest;
import com.espresso.tracker.dto.LoginResponse;
import com.espresso.tracker.dto.RegisterRequest;
import com.espresso.tracker.entity.Role;
import com.espresso.tracker.entity.User;
import com.espresso.tracker.repository.UserRepository;
import com.espresso.tracker.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication API", description = "Endpoints for user authentication and JWT token generation")
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public AuthController(AuthenticationManager authenticationManager, JwtService jwtService,
      UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @PostMapping("/login")
  @Operation(summary = "Authenticate user", description = "Authenticates with username and password, returns a JWT token.")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.username(), request.password()));

    String username = authentication.getName();
    String role = authentication.getAuthorities().stream()
        .findFirst()
        .map(g -> g.getAuthority().replace("ROLE_", ""))
        .orElse("USER");

    String token = jwtService.generateToken(username, Map.of("role", role));

    return new ResponseEntity<>(new LoginResponse(token, username, role), HttpStatus.OK);
  }

  @PostMapping("/register")
  @Operation(summary = "Register a new user", description = "Creates a new user account with USER role.")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
    if (userRepository.existsByUsername(request.username())) {
      return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
    }
    if (userRepository.existsByEmail(request.email())) {
      return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
    }

    User user = new User();
    user.setId(UUID.randomUUID());
    user.setUsername(request.username());
    user.setEmail(request.email());
    user.setPassword(passwordEncoder.encode(request.password()));
    user.setRole(Role.USER);

    userRepository.save(user);

    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User registered successfully"));
  }
}
