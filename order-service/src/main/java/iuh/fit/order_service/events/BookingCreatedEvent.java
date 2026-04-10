package iuh.fit.order_service.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreatedEvent implements Serializable {
    private Long orderId;
    private Long userId;
    private Double totalAmount;
    private String paymentType;
    private LocalDateTime createdAt;
}
