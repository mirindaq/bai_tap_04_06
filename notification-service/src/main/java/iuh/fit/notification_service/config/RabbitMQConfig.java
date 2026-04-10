package iuh.fit.notification_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // User Exchange & Queues
    public static final String USER_EXCHANGE = "user.exchange";
    public static final String USER_REGISTERED_NOTIFICATION_QUEUE = "user.registered.notification.queue";
    public static final String USER_REGISTERED_ROUTING_KEY = "user.registered";

    // Booking Exchange & Queues
    public static final String BOOKING_EXCHANGE = "booking.exchange";
    public static final String BOOKING_CREATED_NOTIFICATION_QUEUE = "booking.created.notification.queue";
    public static final String BOOKING_CREATED_ROUTING_KEY = "booking.created";

    // Payment Exchange & Queues
    public static final String PAYMENT_EXCHANGE = "payment.exchange";
    public static final String PAYMENT_COMPLETED_NOTIFICATION_QUEUE = "payment.completed.notification.queue";
    public static final String PAYMENT_COMPLETED_ROUTING_KEY = "payment.completed";

    // User notification queue
    @Bean
    public Queue userRegisteredNotificationQueue() {
        return new Queue(USER_REGISTERED_NOTIFICATION_QUEUE, true);
    }

    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange(USER_EXCHANGE);
    }

    @Bean
    public Binding userRegisteredNotificationBinding() {
        return BindingBuilder
                .bind(userRegisteredNotificationQueue())
                .to(userExchange())
                .with(USER_REGISTERED_ROUTING_KEY);
    }

    // Booking notification queue
    @Bean
    public Queue bookingCreatedNotificationQueue() {
        return new Queue(BOOKING_CREATED_NOTIFICATION_QUEUE, true);
    }

    @Bean
    public TopicExchange bookingExchange() {
        return new TopicExchange(BOOKING_EXCHANGE);
    }

    @Bean
    public Binding bookingCreatedNotificationBinding() {
        return BindingBuilder
                .bind(bookingCreatedNotificationQueue())
                .to(bookingExchange())
                .with(BOOKING_CREATED_ROUTING_KEY);
    }

    // Payment notification queue
    @Bean
    public Queue paymentCompletedNotificationQueue() {
        return new Queue(PAYMENT_COMPLETED_NOTIFICATION_QUEUE, true);
    }

    @Bean
    public TopicExchange paymentExchange() {
        return new TopicExchange(PAYMENT_EXCHANGE);
    }

    @Bean
    public Binding paymentCompletedNotificationBinding() {
        return BindingBuilder
                .bind(paymentCompletedNotificationQueue())
                .to(paymentExchange())
                .with(PAYMENT_COMPLETED_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
