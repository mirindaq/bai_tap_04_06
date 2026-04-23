package iuh.fit.payment_service.services;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import feign.FeignException;
import iuh.fit.payment_service.clients.OrderFeignClient;
import iuh.fit.payment_service.dtos.request.ProcessPaymentRequest;
import iuh.fit.payment_service.dtos.request.UpdatePaymentStatusRequest;
import iuh.fit.payment_service.dtos.response.PaymentResponse;
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
    private final OrderFeignClient orderFeignClient;

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

    public PaymentResponse processPayment(ProcessPaymentRequest request) {
        log.info("Processing REST payment for order: {}", request.getOrderId());

        boolean success = Boolean.TRUE.equals(request.getSuccess());
        UpdatePaymentStatusRequest updateRequest = new UpdatePaymentStatusRequest(
                request.getUserId(),
                request.getTotalAmount(),
                success);

        try {
            orderFeignClient.updatePaymentStatus(request.getOrderId(), updateRequest);
        } catch (FeignException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Khong cap nhat duoc trang thai booking");
        }

        return new PaymentResponse(
                request.getOrderId(),
                request.getUserId(),
                request.getTotalAmount(),
                success,
                success ? "Book tour thanh cong" : "Thanh toan that bai",
                LocalDateTime.now());
    }
}
