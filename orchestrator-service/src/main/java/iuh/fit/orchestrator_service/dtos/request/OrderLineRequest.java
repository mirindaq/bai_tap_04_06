package iuh.fit.orchestrator_service.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderLineRequest {

    private Long productId;
    private Integer quantity;
    private String seatNumber;
}
