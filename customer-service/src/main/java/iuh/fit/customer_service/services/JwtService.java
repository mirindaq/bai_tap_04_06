package iuh.fit.customer_service.services;

public interface JwtService {
    String generateAccessToken(Long userId, String username, String role);

    long getAccessTokenExpirationSeconds();
}
