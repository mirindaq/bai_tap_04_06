package iuh.fit.orchestrator_service.dtos.response;

import java.time.Instant;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private Instant createdAt;
}
