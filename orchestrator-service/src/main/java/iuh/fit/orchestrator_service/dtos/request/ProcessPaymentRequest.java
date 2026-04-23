package iuh.fit.orchestrator_service.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessPaymentRequest {

    private Long userId;
    private Long orderId;
    private Double totalAmount;
    private Boolean success;
}
