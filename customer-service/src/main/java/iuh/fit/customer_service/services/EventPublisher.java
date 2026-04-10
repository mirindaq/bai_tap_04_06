package iuh.fit.customer_service.services;

import iuh.fit.customer_service.config.RabbitMQConfig;
import iuh.fit.customer_service.events.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublisher {
    
    private final RabbitTemplate rabbitTemplate;

    public void publishUserRegistered(UserRegisteredEvent event) {
        log.info("Publishing USER_REGISTERED event for user: {}", event.getUsername());
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.USER_EXCHANGE,
            RabbitMQConfig.USER_REGISTERED_ROUTING_KEY,
            event
        );
        log.info("USER_REGISTERED event published successfully");
    }
}
