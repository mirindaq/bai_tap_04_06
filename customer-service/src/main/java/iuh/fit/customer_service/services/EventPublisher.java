package iuh.fit.customer_service.services;

import iuh.fit.customer_service.events.UserRegisteredEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EventPublisher {

    public void publishUserRegistered(UserRegisteredEvent event) {
        log.info("RabbitMQ disabled. Skip USER_REGISTERED event for user: {}", event.getUsername());
    }
}
