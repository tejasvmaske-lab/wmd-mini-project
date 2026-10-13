package com.petadoption.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class AdminTokenService {

    private final JwtDecoder decoder;

    public AdminTokenService(@Value("${admin.jwt-secret}") String secret) {
        this.decoder = NimbusJwtDecoder.withSecretKey(
                        new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"))
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    public void requireAdmin(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(UNAUTHORIZED, "Admin authentication is required.");
        }

        try {
            Jwt token = decoder.decode(authorization.substring("Bearer ".length()));
            if (!"ADMIN".equals(token.getClaimAsString("role"))) {
                throw new ResponseStatusException(UNAUTHORIZED, "Admin authentication is required.");
            }
        } catch (JwtException exception) {
            throw new ResponseStatusException(UNAUTHORIZED, "Admin authentication is invalid.", exception);
        }
    }
}
