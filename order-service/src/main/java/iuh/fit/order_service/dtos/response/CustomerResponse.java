package iuh.fit.order_service.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
}
