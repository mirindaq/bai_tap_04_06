package iuh.fit.orchestrator_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import iuh.fit.orchestrator_service.dtos.response.CustomerResponse;

@FeignClient(name = "customer-service", contextId = "orchestratorUserClient", path = "/customer-service")
public interface UserClient {

    @GetMapping("/users/{id}")
    CustomerResponse getUserById(@PathVariable("id") Long id);
}
