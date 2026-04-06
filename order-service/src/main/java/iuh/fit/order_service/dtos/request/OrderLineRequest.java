package iuh.fit.order_service.dtos.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderLineRequest {

    @NotNull
    @Positive
    private Long productId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
