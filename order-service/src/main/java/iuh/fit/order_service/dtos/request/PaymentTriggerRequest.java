package iuh.fit.order_service.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTriggerRequest {

    private Long userId;
    private Long orderId;
    private Double totalAmount;
    private Boolean success;
}
