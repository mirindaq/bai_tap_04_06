package iuh.fit.customer_service.dtos.response;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class RegisterResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private Instant createdAt;
}
