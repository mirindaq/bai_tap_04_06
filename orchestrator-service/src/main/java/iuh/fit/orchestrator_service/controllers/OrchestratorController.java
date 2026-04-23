package iuh.fit.orchestrator_service.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.orchestrator_service.dtos.request.BookTourRequest;
import iuh.fit.orchestrator_service.dtos.request.LoginRequest;
import iuh.fit.orchestrator_service.dtos.request.RegisterRequest;
import iuh.fit.orchestrator_service.dtos.response.ApiResponse;
import iuh.fit.orchestrator_service.dtos.response.BookTourResponse;
import iuh.fit.orchestrator_service.dtos.response.LoginResponse;
import iuh.fit.orchestrator_service.dtos.response.RegisterResponse;
import iuh.fit.orchestrator_service.dtos.response.TourResponse;
import iuh.fit.orchestrator_service.services.OrchestratorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OrchestratorController {

    private final OrchestratorService orchestratorService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(orchestratorService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(orchestratorService.register(request));
    }

    @GetMapping("/tours")
    public ResponseEntity<List<TourResponse>> getTours() {
        return ResponseEntity.ok(orchestratorService.getTours());
    }

    @PostMapping("/book-tour")
    public ResponseEntity<BookTourResponse> bookTour(@Valid @RequestBody BookTourRequest request) {
        return ResponseEntity.ok(orchestratorService.bookTour(request));
    }
}
