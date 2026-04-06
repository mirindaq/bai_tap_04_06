package iuh.fit.customer_service.controllers;

import iuh.fit.customer_service.dtos.response.CustomerResponse;
import iuh.fit.customer_service.services.CustomerQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix:/api/v1}/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerQueryService customerQueryService;

    @GetMapping("/{id}")
    public CustomerResponse getCustomerById(@PathVariable("id") Long id) {
        return customerQueryService.getCustomerById(id);
    }
}
