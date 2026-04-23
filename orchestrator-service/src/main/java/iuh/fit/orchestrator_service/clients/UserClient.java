package iuh.fit.orchestrator_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import iuh.fit.orchestrator_service.dtos.request.LoginRequest;
import iuh.fit.orchestrator_service.dtos.request.RegisterRequest;
import iuh.fit.orchestrator_service.dtos.response.ApiResponse;
import iuh.fit.orchestrator_service.dtos.response.CustomerResponse;
import iuh.fit.orchestrator_service.dtos.response.LoginResponse;
import iuh.fit.orchestrator_service.dtos.response.RegisterResponse;

@FeignClient(name = "customer-service", contextId = "orchestratorUserClient", path = "/customer-service")
public interface UserClient {

    @PostMapping("/login")
    ApiResponse<LoginResponse> login(@RequestBody LoginRequest request);

    @PostMapping("/api/v1/auth/register")
    ApiResponse<RegisterResponse> register(@RequestBody RegisterRequest request);

    @GetMapping("/users/{id}")
    CustomerResponse getUserById(@PathVariable("id") Long id);
}
