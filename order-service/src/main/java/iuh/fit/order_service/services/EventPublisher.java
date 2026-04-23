package iuh.fit.order_service.services;

import iuh.fit.order_service.events.BookingCreatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EventPublisher {

    public void publishBookingCreated(BookingCreatedEvent event) {
        log.info("RabbitMQ disabled. Skip BOOKING_CREATED event for order: {}", event.getOrderId());
    }
}
