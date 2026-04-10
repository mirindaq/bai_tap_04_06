package iuh.fit.notification_service.listeners;

import iuh.fit.notification_service.config.RabbitMQConfig;
import iuh.fit.notification_service.events.BookingCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingEventListener {

    @RabbitListener(queues = RabbitMQConfig.BOOKING_CREATED_NOTIFICATION_QUEUE)
    public void handleBookingCreated(BookingCreatedEvent event) {
        // Chỉ log cho đơn hàng COD
        if ("COD".equalsIgnoreCase(event.getPaymentType())) {
            log.info("╔════════════════════════════════════════════════════════════════╗");
            log.info("║           📦 THÔNG BÁO ĐẶT HÀNG COD THÀNH CÔNG 📦            ║");
            log.info("╠════════════════════════════════════════════════════════════════╣");
            log.info("║ Order ID      : {}", String.format("%-46s", event.getOrderId()) + "║");
            log.info("║ User ID       : {}", String.format("%-46s", event.getUserId()) + "║");
            log.info("║ Payment Type  : {}", String.format("%-46s", event.getPaymentType()) + "║");
            log.info("║ Total Amount  : {}", String.format("%-46s", String.format("%.2f VNĐ", event.getTotalAmount())) + "║");
            log.info("║ Created At    : {}", String.format("%-46s", event.getCreatedAt()) + "║");
            log.info("║ Note: Thanh toán khi nhận hàng                                 ║");
            log.info("╚════════════════════════════════════════════════════════════════╝");
        }
    }
}
