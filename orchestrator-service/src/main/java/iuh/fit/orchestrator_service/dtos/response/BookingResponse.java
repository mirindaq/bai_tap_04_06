package iuh.fit.orchestrator_service.dtos.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private Long userId;
    private LocalDateTime orderDate;
    private String status;
    private String paymentType;
    private Double totalAmount;
    private List<BookingDetailResponse> details = new ArrayList<>();
}
