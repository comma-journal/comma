package kr.elroy.comma.config

import com.nimbusds.jose.jwk.JWKSet
import com.nimbusds.jose.jwk.RSAKey
import com.nimbusds.jose.jwk.RSAKey.Builder
import com.nimbusds.jose.jwk.source.JWKSource
import com.nimbusds.jose.proc.SecurityContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder
import java.security.KeyPairGenerator
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.util.UUID

@Configuration
class AuthConfig {

    @Bean
    fun rsaKey(): RSAKey {
        val keyPair = KeyPairGenerator.getInstance("RSA").apply { initialize(2048) }
            .generateKeyPair()

        val publicKey = keyPair.public as RSAPublicKey
        val privateKey = keyPair.private as RSAPrivateKey

        return Builder(publicKey)
            .privateKey(privateKey)
            .keyID(UUID.randomUUID().toString()) // kid
            .build()
    }

    @Bean
    fun jwtEncoder(rsaKey: RSAKey): JwtEncoder {
        val jwkSet = JWKSet(rsaKey)
        val jwkSource: JWKSource<SecurityContext> = JWKSource { selector, _ ->
            selector.select(jwkSet)
        }
        return NimbusJwtEncoder(jwkSource)
    }

    @Bean
    fun jwtDecoder(rsaKey: RSAKey): JwtDecoder {
        return NimbusJwtDecoder.withPublicKey(rsaKey.toRSAPublicKey()).build()
    }
}