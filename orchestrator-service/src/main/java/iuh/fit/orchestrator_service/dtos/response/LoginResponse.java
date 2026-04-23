package iuh.fit.orchestrator_service.dtos.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {

    private String tokenType;
    private String accessToken;
    private long expiresIn;
    private String username;
    private String email;
    private String role;
}
