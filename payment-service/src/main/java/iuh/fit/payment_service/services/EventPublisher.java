package iuh.fit.payment_service.services;

import iuh.fit.payment_service.config.RabbitMQConfig;
import iuh.fit.payment_service.events.BookingFailedEvent;
import iuh.fit.payment_service.events.PaymentCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublisher {
    
    private final RabbitTemplate rabbitTemplate;

    public void publishPaymentCompleted(PaymentCompletedEvent event) {
        log.info("Publishing PAYMENT_COMPLETED event for order: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.PAYMENT_EXCHANGE,
            RabbitMQConfig.PAYMENT_COMPLETED_ROUTING_KEY,
            event
        );
        log.info("PAYMENT_COMPLETED event published successfully");
    }

    public void publishBookingFailed(BookingFailedEvent event) {
        log.info("Publishing BOOKING_FAILED event for order: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.PAYMENT_EXCHANGE,
            RabbitMQConfig.BOOKING_FAILED_ROUTING_KEY,
            event
        );
        log.info("BOOKING_FAILED event published successfully");
    }
}
