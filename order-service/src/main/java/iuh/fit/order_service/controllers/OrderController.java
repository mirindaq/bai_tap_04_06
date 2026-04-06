package iuh.fit.order_service.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import iuh.fit.order_service.dtos.request.CreateOrderRequest;
import iuh.fit.order_service.dtos.request.UpdatePaymentStatusRequest;
import iuh.fit.order_service.dtos.response.OrderResponse;
import iuh.fit.order_service.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse body = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestHeader("X-User-Id") String userIdHeader) {
        long userId;
        try {
            userId = Long.parseLong(userIdHeader.trim());
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "X-User-Id không hợp lệ");
        }
        return ResponseEntity.ok(orderService.getMyOrders(userId));
    }

    @PatchMapping("/{orderId}/payment")
    public ResponseEntity<OrderResponse> updatePaymentStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return ResponseEntity.ok(orderService.updatePaymentStatus(orderId, request));
    }
}
