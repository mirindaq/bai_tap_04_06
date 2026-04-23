package iuh.fit.payment_service.services;

import iuh.fit.payment_service.events.BookingFailedEvent;
import iuh.fit.payment_service.events.PaymentCompletedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EventPublisher {

    public void publishPaymentCompleted(PaymentCompletedEvent event) {
        log.info("RabbitMQ disabled. Skip PAYMENT_COMPLETED event for order: {}", event.getOrderId());
    }

    public void publishBookingFailed(BookingFailedEvent event) {
        log.info("RabbitMQ disabled. Skip BOOKING_FAILED event for order: {}", event.getOrderId());
    }
}
