package iuh.fit.order_service.services;

import iuh.fit.order_service.config.RabbitMQConfig;
import iuh.fit.order_service.events.BookingCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublisher {
    
    private final RabbitTemplate rabbitTemplate;

    public void publishBookingCreated(BookingCreatedEvent event) {
        log.info("Publishing BOOKING_CREATED event for order: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.BOOKING_EXCHANGE,
            RabbitMQConfig.BOOKING_CREATED_ROUTING_KEY,
            event
        );
        log.info("BOOKING_CREATED event published successfully");
    }
}
