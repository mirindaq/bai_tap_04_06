package iuh.fit.orchestrator_service.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import iuh.fit.orchestrator_service.dtos.response.TourResponse;

@FeignClient(name = "product-service", contextId = "orchestratorTourClient", path = "/product-service")
public interface TourClient {

    @GetMapping("/tours")
    List<TourResponse> getTours();

    @GetMapping("/tours/{id}")
    TourResponse getTourById(@PathVariable("id") Long id);
}
