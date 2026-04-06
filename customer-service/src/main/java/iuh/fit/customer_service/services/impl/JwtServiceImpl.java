package iuh.fit.customer_service.services.impl;

import iuh.fit.customer_service.services.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service

public class JwtServiceImpl implements JwtService {
    private final SecretKey secretKey;
    private final long accessTokenExpirationSeconds;

    public JwtServiceImpl(
            @Value("${app.security.jwt.secret}") String secret,
            @Value("${app.security.jwt.access-token-expiration-seconds:3600}") long accessTokenExpirationSeconds
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpirationSeconds = accessTokenExpirationSeconds;
    }

    @Override
    public String generateAccessToken(Long userId, String username, String role) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(accessTokenExpirationSeconds);
        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", userId);
        claims.put("role", role);

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    @Override
    public long getAccessTokenExpirationSeconds() {
        return accessTokenExpirationSeconds;
    }
}
