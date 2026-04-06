package iuh.fit.customer_service.services;

import iuh.fit.customer_service.dtos.request.LoginRequest;
import iuh.fit.customer_service.dtos.request.RegisterRequest;
import iuh.fit.customer_service.dtos.response.LoginResponse;
import iuh.fit.customer_service.dtos.response.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
