package iuh.fit.orchestrator_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.orchestrator_service.dtos.request.BookTourRequest;
import iuh.fit.orchestrator_service.dtos.response.BookTourResponse;
import iuh.fit.orchestrator_service.services.OrchestratorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class OrchestratorController {

    private final OrchestratorService orchestratorService;

    @PostMapping("/book-tour")
    public ResponseEntity<BookTourResponse> bookTour(@Valid @RequestBody BookTourRequest request) {
        return ResponseEntity.ok(orchestratorService.bookTour(request));
    }
}
