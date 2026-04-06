package iuh.fit.customer_service.services;

import iuh.fit.customer_service.dtos.response.CustomerResponse;

public interface CustomerQueryService {
    CustomerResponse getCustomerById(Long id);
}
