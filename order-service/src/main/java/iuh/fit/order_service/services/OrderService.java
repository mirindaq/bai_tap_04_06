package iuh.fit.order_service.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import feign.FeignException;
import iuh.fit.order_service.exception.NotFoundException;
import iuh.fit.order_service.clients.CustomerFeignClient;
import iuh.fit.order_service.clients.PaymentFeignClient;
import iuh.fit.order_service.clients.ProductFeignClient;
import iuh.fit.order_service.dtos.request.CreateOrderRequest;
import iuh.fit.order_service.dtos.request.OrderLineRequest;
import iuh.fit.order_service.dtos.request.PaymentTriggerRequest;
import iuh.fit.order_service.dtos.request.UpdatePaymentStatusRequest;
import iuh.fit.order_service.dtos.response.OrderDetailResponse;
import iuh.fit.order_service.dtos.response.OrderResponse;
import iuh.fit.order_service.dtos.response.ProductResponse;
import iuh.fit.order_service.enums.OrderStatus;
import iuh.fit.order_service.enums.PaymentType;
import iuh.fit.order_service.models.Order;
import iuh.fit.order_service.models.OrderDetail;
import iuh.fit.order_service.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerFeignClient customerFeignClient;
    private final ProductFeignClient productFeignClient;
    private final PaymentFeignClient paymentFeignClient;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        validateCustomer(request.getUserId());

        Order order = Order.builder()
                .userId(request.getUserId())
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .paymentType(request.getPaymentType())
                .totalAmount(0.0)
                .build();

        double total = 0.0;
        for (OrderLineRequest line : request.getItems()) {
            ProductResponse product = getProductOrThrow(line.getProductId());
            double unitPrice = product.getPrice() != null ? product.getPrice() : 0.0;
            int qty = line.getQuantity() != null ? line.getQuantity() : 0;
            total += unitPrice * qty;

            OrderDetail detail = OrderDetail.builder()
                    .order(order)
                    .productId(product.getId())
                    .quantity(qty)
                    .unitPrice(unitPrice)
                    .build();
            order.getDetails().add(detail);
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);

        if (saved.getPaymentType() == PaymentType.BANK) {
            try {
                paymentFeignClient.processPayment(new PaymentTriggerRequest(
                        request.getUserId(),
                        saved.getId(),
                        saved.getTotalAmount(),
                        Boolean.TRUE));
            } catch (FeignException e) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Không gọi được payment-service");
            }
            saved = orderRepository.findById(saved.getId()).orElseThrow();
        }
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(Long userId) {
        validateCustomer(userId);
        return orderRepository.findByUserIdWithDetails(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updatePaymentStatus(Long orderId, UpdatePaymentStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn: " + orderId));

        if (!order.getUserId().equals(request.getUserId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId không khớp với đơn hàng");
        }
        if (order.getPaymentType() != PaymentType.BANK) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Chỉ đơn thanh toán BANK được cập nhật qua cổng thanh toán");
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Đơn không ở trạng thái chờ thanh toán (PENDING)");
        }

        double expected = order.getTotalAmount();
        double got = request.getTotalAmount() != null ? request.getTotalAmount() : 0.0;
        if (Math.abs(expected - got) > 0.01) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tổng tiền không khớp với đơn");
        }

        if (Boolean.TRUE.equals(request.getSuccess())) {
            order.setStatus(OrderStatus.PAID);
        } else {
            order.setStatus(OrderStatus.FAILED);
        }
        return toResponse(orderRepository.save(order));
    }

    private void validateCustomer(Long userId) {
        try {
            customerFeignClient.getCustomerById(userId);
        } catch (FeignException e) {
            if (e.status() == 404) {
                throw new NotFoundException("Không tìm thấy người dùng: " + userId);
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Không gọi được customer-service");
        }
    }

    private ProductResponse getProductOrThrow(Long productId) {
        try {
            return productFeignClient.getProductById(productId);
        } catch (FeignException e) {
            if (e.status() == 404) {
                throw new NotFoundException("Không tìm thấy sản phẩm: " + productId);
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Không gọi được product-service");
        }
    }

    private OrderResponse toResponse(Order order) {
        List<OrderDetailResponse> detailResponses = order.getDetails().stream()
                .map(d -> new OrderDetailResponse(
                        d.getId(),
                        d.getProductId(),
                        d.getQuantity(),
                        d.getUnitPrice()))
                .collect(Collectors.toList());

        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setOrderDate(order.getOrderDate());
        response.setStatus(order.getStatus());
        response.setPaymentType(order.getPaymentType());
        response.setTotalAmount(order.getTotalAmount());
        response.setDetails(detailResponses);
        return response;
    }
}
