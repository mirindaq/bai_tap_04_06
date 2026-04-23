package iuh.fit.orchestrator_service.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookTourResponse {

    private String message;
    private CustomerResponse user;
    private TourResponse tour;
    private BookingResponse booking;
    private PaymentResponse payment;
}
