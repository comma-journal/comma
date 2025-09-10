package kr.elroy.comma.jwt

import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.security.oauth2.jwt.JwtException
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class TokenProvider(
    private val jwtEncoder: JwtEncoder,
    private val jwtDecoder: JwtDecoder
) {
    fun issueAccessToken(userId: Long): String {
        val now = Instant.now()
        val expiry = 86400L

        val claims = JwtClaimsSet.builder()
            .issuer("comma-api")
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiry))
            .subject(userId.toString())
            .build()

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }

    fun getUserIdFromToken(token: String): Long {
        try {
            val jwt = jwtDecoder.decode(token)
            val subject = jwt.subject ?: throw JwtException("토큰에 UserID가 없습니다.")

            return subject.toLong()
        } catch (e: NumberFormatException) {
            throw JwtException("Subject를 Long 타입으로 변환할 수 없습니다.", e)
        } catch (e: JwtException) {
            throw IllegalStateException("유효하지 않은 토큰입니다.", e)
        }
    }
}