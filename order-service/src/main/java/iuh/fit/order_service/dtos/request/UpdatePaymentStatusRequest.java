package iuh.fit.order_service.dtos.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePaymentStatusRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Double totalAmount;

    @NotNull
    private Boolean success;
}
