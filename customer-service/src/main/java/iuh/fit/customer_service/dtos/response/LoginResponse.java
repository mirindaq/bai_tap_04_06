package iuh.fit.customer_service.dtos.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private String tokenType;
    private String accessToken;
    private long expiresIn;
    private String username;
    private String email;
    private String role;
}
