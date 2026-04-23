package iuh.fit.orchestrator_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import iuh.fit.orchestrator_service.dtos.request.ProcessPaymentRequest;
import iuh.fit.orchestrator_service.dtos.response.PaymentResponse;

@FeignClient(name = "payment-service", contextId = "orchestratorPaymentClient")
public interface PaymentClient {

    @PostMapping("/payments")
    PaymentResponse processPayment(@RequestBody ProcessPaymentRequest request);
}
