package iuh.fit.orchestrator_service.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import feign.FeignException;
import iuh.fit.orchestrator_service.clients.BookingClient;
import iuh.fit.orchestrator_service.clients.PaymentClient;
import iuh.fit.orchestrator_service.clients.TourClient;
import iuh.fit.orchestrator_service.clients.UserClient;
import iuh.fit.orchestrator_service.dtos.request.BookTourRequest;
import iuh.fit.orchestrator_service.dtos.request.CreateBookingRequest;
import iuh.fit.orchestrator_service.dtos.request.LoginRequest;
import iuh.fit.orchestrator_service.dtos.request.OrderLineRequest;
import iuh.fit.orchestrator_service.dtos.request.ProcessPaymentRequest;
import iuh.fit.orchestrator_service.dtos.request.RegisterRequest;
import iuh.fit.orchestrator_service.dtos.response.ApiResponse;
import iuh.fit.orchestrator_service.dtos.response.BookTourResponse;
import iuh.fit.orchestrator_service.dtos.response.BookingResponse;
import iuh.fit.orchestrator_service.dtos.response.CustomerResponse;
import iuh.fit.orchestrator_service.dtos.response.LoginResponse;
import iuh.fit.orchestrator_service.dtos.response.PaymentResponse;
import iuh.fit.orchestrator_service.dtos.response.RegisterResponse;
import iuh.fit.orchestrator_service.dtos.response.TourResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrchestratorService {

    private final UserClient userClient;
    private final TourClient tourClient;
    private final BookingClient bookingClient;
    private final PaymentClient paymentClient;

    public ApiResponse<LoginResponse> login(LoginRequest request) {
        try {
            return userClient.login(request);
        } catch (FeignException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Khong goi duoc User Service");
        }
    }

    public ApiResponse<RegisterResponse> register(RegisterRequest request) {
        try {
            return userClient.register(request);
        } catch (FeignException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Khong goi duoc User Service");
        }
    }

    public List<TourResponse> getTours() {
        try {
            return tourClient.getTours();
        } catch (FeignException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Khong goi duoc Tour Service");
        }
    }

    public BookTourResponse bookTour(BookTourRequest request) {
        CustomerResponse user = callUserService(request.getUserId());
        TourResponse tour = callTourService(request.getTourId());
        BookingResponse booking = callBookingService(request);
        PaymentResponse payment = callPaymentService(request, booking);

        return new BookTourResponse(
                payment.getMessage(),
                user,
                tour,
                booking,
                payment);
    }

    private CustomerResponse callUserService(Long userId) {
        try {
            return userClient.getUserById(userId);
        } catch (FeignException.NotFound ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Khong tim thay user: " + userId);
        } catch (FeignException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Khong goi duoc User Service");
        }
    }

    private TourResponse callTourService(Long tourId) {
        try {
            return tourClient.getTourById(tourId);
        } catch (FeignException.NotFound ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Khong tim thay tour: " + tourId);
        } catch (FeignException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Khong goi duoc Tour Service");
        }
    }

    private BookingResponse callBookingService(BookTourRequest request) {
        CreateBookingRequest bookingRequest = new CreateBookingRequest(
                request.getUserId(),
                "BANK",
                List.of(new OrderLineRequest(
                        request.getTourId(),
                        request.getQuantity(),
                        request.getSeatNumber())));

        try {
            return bookingClient.createBooking(bookingRequest);
        } catch (FeignException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Khong tao duoc booking");
        }
    }

    private PaymentResponse callPaymentService(BookTourRequest request, BookingResponse booking) {
        ProcessPaymentRequest paymentRequest = new ProcessPaymentRequest(
                request.getUserId(),
                booking.getId(),
                booking.getTotalAmount(),
                true);

        try {
            return paymentClient.processPayment(paymentRequest);
        } catch (FeignException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Khong goi duoc Payment Service");
        }
    }
}
