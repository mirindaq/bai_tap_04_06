package iuh.fit.customer_service.repositories;

import iuh.fit.customer_service.entities.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<UserAccount> findByUsername(String username);

    Optional<UserAccount> findByEmail(String email);
}
