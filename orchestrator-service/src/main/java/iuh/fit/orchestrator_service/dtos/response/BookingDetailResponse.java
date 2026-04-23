package iuh.fit.orchestrator_service.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetailResponse {

    private Long id;
    private Long productId;
    private Integer quantity;
    private Double unitPrice;
    private String seatNumber;
}
