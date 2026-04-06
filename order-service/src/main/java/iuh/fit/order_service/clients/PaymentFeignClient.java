package iuh.fit.order_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import iuh.fit.order_service.dtos.request.PaymentTriggerRequest;

@FeignClient(name = "payment-service", contextId = "paymentFeignClient")
public interface PaymentFeignClient {

    @PostMapping("/payments")
    void processPayment(@RequestBody PaymentTriggerRequest body);
}
