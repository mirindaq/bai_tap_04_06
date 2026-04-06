package iuh.fit.customer_service.services.impl;

import iuh.fit.customer_service.dtos.response.CustomerResponse;
import iuh.fit.customer_service.entities.UserAccount;
import iuh.fit.customer_service.exceptions.ResourceNotFoundException;
import iuh.fit.customer_service.repositories.UserAccountRepository;
import iuh.fit.customer_service.services.CustomerQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerQueryServiceImpl implements CustomerQueryService {
    private final UserAccountRepository userAccountRepository;

    @Override
    public CustomerResponse getCustomerById(Long id) {
        UserAccount user = userAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return new CustomerResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }
}
