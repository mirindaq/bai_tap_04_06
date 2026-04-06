package iuh.fit.payment_service.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePaymentStatusRequest {

    private Long userId;
    private Double totalAmount;
    private Boolean success;
}
