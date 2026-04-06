package iuh.fit.payment_service.services;

import org.springframework.stereotype.Service;

import iuh.fit.payment_service.clients.OrderFeignClient;
import iuh.fit.payment_service.dtos.request.ProcessPaymentRequest;
import iuh.fit.payment_service.dtos.request.UpdatePaymentStatusRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderFeignClient orderFeignClient;

    public void process(ProcessPaymentRequest request) {
        UpdatePaymentStatusRequest body = new UpdatePaymentStatusRequest(
                request.getUserId(),
                request.getTotalAmount(),
                request.getSuccess());
        orderFeignClient.updatePaymentStatus(request.getOrderId(), body);
    }
}
