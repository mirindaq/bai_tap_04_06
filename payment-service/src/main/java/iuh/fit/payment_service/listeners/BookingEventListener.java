package iuh.fit.payment_service.listeners;

import iuh.fit.payment_service.config.RabbitMQConfig;
import iuh.fit.payment_service.events.BookingCreatedEvent;
import iuh.fit.payment_service.services.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingEventListener {

    private final PaymentService paymentService;

    @RabbitListener(queues = RabbitMQConfig.BOOKING_CREATED_QUEUE)
    public void handleBookingCreated(BookingCreatedEvent event) {
        log.info("Received BOOKING_CREATED event for order: {}", event.getOrderId());
        
        // Only process payment for BANK payment type
        if ("BANK".equalsIgnoreCase(event.getPaymentType())) {
            paymentService.processPayment(event);
        } else {
            log.info("Skip payment processing for order {} with payment type: {}", 
                     event.getOrderId(), event.getPaymentType());
        }
    }
}
