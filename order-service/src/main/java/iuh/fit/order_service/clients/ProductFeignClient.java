package iuh.fit.order_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import iuh.fit.order_service.dtos.response.ProductResponse;

@FeignClient(
        name = "product-service",
        contextId = "productFeignClient",
        path = "/product-service")
public interface ProductFeignClient {

    @GetMapping("/products/{id}")
    ProductResponse getProductById(@PathVariable("id") Long id);
}
