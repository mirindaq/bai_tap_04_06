package iuh.fit.order_service.listeners;

import iuh.fit.order_service.config.RabbitMQConfig;
import iuh.fit.order_service.enums.OrderStatus;
import iuh.fit.order_service.events.BookingFailedEvent;
import iuh.fit.order_service.events.PaymentCompletedEvent;
import iuh.fit.order_service.models.Order;
import iuh.fit.order_service.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventListener {

    private final OrderRepository orderRepository;

    @RabbitListener(queues = RabbitMQConfig.PAYMENT_COMPLETED_QUEUE)
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        log.info("Received PAYMENT_COMPLETED event for order: {}", event.getOrderId());
        
        Order order = orderRepository.findById(event.getOrderId()).orElse(null);
        if (order != null) {
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
            log.info("Order {} status updated to PAID", event.getOrderId());
        } else {
            log.warn("Order {} not found", event.getOrderId());
        }
    }

    @RabbitListener(queues = RabbitMQConfig.BOOKING_FAILED_QUEUE)
    public void handleBookingFailed(BookingFailedEvent event) {
        log.info("Received BOOKING_FAILED event for order: {}", event.getOrderId());
        
        Order order = orderRepository.findById(event.getOrderId()).orElse(null);
        if (order != null) {
            order.setStatus(OrderStatus.FAILED);
            orderRepository.save(order);
            log.info("Order {} status updated to FAILED. Reason: {}", event.getOrderId(), event.getReason());
        } else {
            log.warn("Order {} not found", event.getOrderId());
        }
    }
}
