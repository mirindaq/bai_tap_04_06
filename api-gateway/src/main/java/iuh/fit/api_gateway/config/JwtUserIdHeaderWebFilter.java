package iuh.fit.api_gateway.config;

import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class JwtUserIdHeaderWebFilter implements WebFilter, Ordered {
    private static final String USER_ID_HEADER = "X-User-Id";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        if (exchange.getRequest().getHeaders().getFirst(USER_ID_HEADER) != null) {
            return chain.filter(exchange);
        }

        return exchange.getPrincipal()
                .flatMap(principal -> {
                    if (!(principal instanceof JwtAuthenticationToken jwtAuth)) {
                        return chain.filter(exchange);
                    }

                    String userId = extractUserId(jwtAuth);
                    if (!StringUtils.hasText(userId)) {
                        return chain.filter(exchange);
                    }

                    ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                            .header(USER_ID_HEADER, userId)
                            .build();
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                })
                .switchIfEmpty(chain.filter(exchange));
    }

    @Override
    public int getOrder() {
        return SecurityWebFiltersOrder.AUTHORIZATION.getOrder() + 1;
    }

    private String extractUserId(JwtAuthenticationToken jwtAuth) {
        Object uidClaim = jwtAuth.getToken().getClaims().get("uid");
        if (uidClaim != null && StringUtils.hasText(uidClaim.toString())) {
            return uidClaim.toString();
        }
        return jwtAuth.getToken().getSubject();
    }
}
