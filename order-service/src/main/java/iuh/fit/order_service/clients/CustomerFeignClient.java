package iuh.fit.order_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import iuh.fit.order_service.dtos.response.CustomerResponse;

@FeignClient(
        name = "customer-service",
        contextId = "customerFeignClient",
        path = "/customer-service/api/v1")
public interface CustomerFeignClient {

    @GetMapping("/customers/{id}")
    CustomerResponse getCustomerById(@PathVariable("id") Long id);
}
