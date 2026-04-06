package iuh.fit.order_service.dtos.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import iuh.fit.order_service.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotNull
    @Positive
    private Long userId;

    @NotNull
    private PaymentType paymentType;

    @NotEmpty(message = "Danh sách sản phẩm không được rỗng")
    private List<@Valid OrderLineRequest> items;
}
