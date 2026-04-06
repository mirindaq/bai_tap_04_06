package iuh.fit.customer_service.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = "username is required")
    @Size(min = 4, max = 50, message = "username must be between 4 and 50 characters")
    private String username;

    @NotBlank(message = "email is required")
    @Email(message = "email is invalid")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 6, max = 72, message = "password must be between 6 and 72 characters")
    private String password;

    @NotBlank(message = "fullName is required")
    @Size(max = 120, message = "fullName must not exceed 120 characters")
    private String fullName;
}
