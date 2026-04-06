package iuh.fit.payment_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.payment_service.dtos.request.ProcessPaymentRequest;
import iuh.fit.payment_service.services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Void> pay(@Valid @RequestBody ProcessPaymentRequest request) {
        paymentService.process(request);
        return ResponseEntity.ok().build();
    }
}
