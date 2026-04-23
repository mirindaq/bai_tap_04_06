package iuh.fit.orchestrator_service.dtos.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    private Long userId;
    private String paymentType;
    private List<OrderLineRequest> items;
}
