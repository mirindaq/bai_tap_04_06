package iuh.fit.notification_service.listeners;

import iuh.fit.notification_service.config.RabbitMQConfig;
import iuh.fit.notification_service.events.PaymentCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventListener {

    @RabbitListener(queues = RabbitMQConfig.PAYMENT_COMPLETED_NOTIFICATION_QUEUE)
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        log.info("╔════════════════════════════════════════════════════════════════╗");
        log.info("║           💳 THÔNG BÁO THANH TOÁN THÀNH CÔNG 💳              ║");
        log.info("╠════════════════════════════════════════════════════════════════╣");
        log.info("║ Order ID      : {}", String.format("%-46s", event.getOrderId()) + "║");
        log.info("║ User ID       : {}", String.format("%-46s", event.getUserId()) + "║");
        log.info("║ Amount Paid   : {}", String.format("%-46s", String.format("%.2f VNĐ", event.getAmount())) + "║");
        log.info("║ Completed At  : {}", String.format("%-46s", event.getCompletedAt()) + "║");
        log.info("║ Message: User #{} đã đặt đơn #{} thành công!", 
                  event.getUserId(), event.getOrderId() + "                    ║");
        log.info("╚════════════════════════════════════════════════════════════════╝");
    }
}
