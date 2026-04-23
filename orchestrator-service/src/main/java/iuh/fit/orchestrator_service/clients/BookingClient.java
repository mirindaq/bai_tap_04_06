package iuh.fit.orchestrator_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import iuh.fit.orchestrator_service.dtos.request.CreateBookingRequest;
import iuh.fit.orchestrator_service.dtos.response.BookingResponse;

@FeignClient(name = "order-service", contextId = "orchestratorBookingClient", path = "/order-service")
public interface BookingClient {

    @PostMapping("/bookings")
    BookingResponse createBooking(@RequestBody CreateBookingRequest request);
}
