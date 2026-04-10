package iuh.fit.payment_service.services;

import java.time.LocalDateTime;

import iuh.fit.payment_service.events.BookingCreatedEvent;
import iuh.fit.payment_service.events.PaymentCompletedEvent;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final EventPublisher eventPublisher;

    public void processPayment(BookingCreatedEvent event) {
        log.info("Processing payment for order: {}", event.getOrderId());
        
        try {
            // Simulate processing delay
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Payment always successful
        PaymentCompletedEvent completedEvent = PaymentCompletedEvent.builder()
                .orderId(event.getOrderId())
                .userId(event.getUserId())
                .amount(event.getTotalAmount())
                .completedAt(LocalDateTime.now())
                .build();
        eventPublisher.publishPaymentCompleted(completedEvent);
        log.info("Payment successful for order: {}", event.getOrderId());
    }
}
