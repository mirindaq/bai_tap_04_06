package iuh.fit.payment_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import iuh.fit.payment_service.dtos.request.UpdatePaymentStatusRequest;

@FeignClient(name = "order-service", contextId = "orderFeignClient", path = "/order-service")
public interface OrderFeignClient {

    @PatchMapping("/orders/{orderId}/payment")
    void updatePaymentStatus(
            @PathVariable("orderId") Long orderId,
            @RequestBody UpdatePaymentStatusRequest body);
}
