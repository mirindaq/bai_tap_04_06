package iuh.fit.payment_service.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * PaymentController - Disabled in Event-Driven Architecture
 * Payment processing is now handled via RabbitMQ events (BookingEventListener)
 * This controller is kept for potential future direct API needs
 */
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    // Payment processing is now event-driven via RabbitMQ
    // See: BookingEventListener for BOOKING_CREATED event handling
    
}
