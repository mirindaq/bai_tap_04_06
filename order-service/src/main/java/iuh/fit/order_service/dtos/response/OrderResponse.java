package iuh.fit.order_service.dtos.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import iuh.fit.order_service.enums.OrderStatus;
import iuh.fit.order_service.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private Long userId;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private PaymentType paymentType;
    private double totalAmount;
    private List<OrderDetailResponse> details = new ArrayList<>();
}
