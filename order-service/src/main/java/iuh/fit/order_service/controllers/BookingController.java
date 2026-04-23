package iuh.fit.order_service.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.order_service.dtos.request.CreateOrderRequest;
import iuh.fit.order_service.dtos.response.OrderResponse;
import iuh.fit.order_service.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createBooking(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse body = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }
}
