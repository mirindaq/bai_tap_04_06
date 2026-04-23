package iuh.fit.payment_service.dtos.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long orderId;
    private Long userId;
    private Double amount;
    private Boolean success;
    private String message;
    private LocalDateTime paidAt;
}
