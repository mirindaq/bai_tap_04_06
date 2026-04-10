package iuh.fit.notification_service.listeners;

import iuh.fit.notification_service.config.RabbitMQConfig;
import iuh.fit.notification_service.events.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventListener {

    @RabbitListener(queues = RabbitMQConfig.USER_REGISTERED_NOTIFICATION_QUEUE)
    public void handleUserRegistered(UserRegisteredEvent event) {
        log.info("╔════════════════════════════════════════════════════════════════╗");
        log.info("║           🎉 THÔNG BÁO ĐĂNG KÝ THÀNH CÔNG 🎉                 ║");
        log.info("╠════════════════════════════════════════════════════════════════╣");
        log.info("║ User ID       : {}", String.format("%-46s", event.getUserId()) + "║");
        log.info("║ Username      : {}", String.format("%-46s", event.getUsername()) + "║");
        log.info("║ Email         : {}", String.format("%-46s", event.getEmail()) + "║");
        log.info("║ Full Name     : {}", String.format("%-46s", event.getFullName()) + "║");
        log.info("║ Registered At : {}", String.format("%-46s", event.getRegisteredAt()) + "║");
        log.info("╚════════════════════════════════════════════════════════════════╝");
    }
}
