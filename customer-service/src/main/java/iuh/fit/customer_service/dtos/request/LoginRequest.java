package iuh.fit.customer_service.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "login is required")
    private String login;

    @NotBlank(message = "password is required")
    private String password;
}
