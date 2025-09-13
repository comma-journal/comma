package kr.elroy.comma.user

import kr.elroy.comma.jwt.TokenProvider
import kr.elroy.comma.user.domain.User
import kr.elroy.comma.user.dto.LoginRequest
import kr.elroy.comma.user.dto.LoginResponse
import kr.elroy.comma.user.dto.UserResponse
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class UserService(
    private val passwordEncoder: PasswordEncoder,
    private val tokenProvider: TokenProvider
) {

    // 토큰 관련 로직 추가 필요
    @Transactional
    fun login(userRequest: LoginRequest): LoginResponse {
        val user = User.findByEmail(userRequest.email)
        // 존재 여부
        if(user != null) {
            if (passwordEncoder.matches(userRequest.password, user.password)) {
                return LoginResponse(
                    email = user.email,
                    name = user.name,
                    token = tokenProvider.issueAccessToken(user.id.value),
                    expiresAt = 86400L
                )
            } else {
                throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "비밀번호 오류")
            }
        }

        // 신규 생성 (임시 랜덤 닉네임)
        val randomName = "USER_" + UUID.randomUUID()
            .toString()
            .replace("-", "")
            .take(8)

        // 신규 생성
        val newUser = User.new {
            email = userRequest.email
            name = randomName
            password = passwordEncoder.encode(userRequest.password)
        }

        return LoginResponse(
            email = newUser.email,
            name = newUser.name,
            token = tokenProvider.issueAccessToken(newUser.id.value),
            expiresAt = 86400L
        )
    }

    fun renewToken(authHeader: String): String {
        if (!authHeader.startsWith("Bearer ")) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰 형식입니다.")
        }
        val userId = tokenProvider.getUserIdFromToken(authHeader.substringAfter("Bearer "))

        return tokenProvider.issueAccessToken(userId)
    }

    @Transactional
    fun updateName(authHeader: String, name: String): UserResponse {
        val userId = tokenProvider.getUserIdFromToken(authHeader.substringAfter("Bearer "))

        return User.findById(userId)?.let { user ->
            user.name = name
            user.toDTO()
        } ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
    }

    fun User.toDTO(): UserResponse {
        return UserResponse(
            name = this.name,
            email = this.email
        )
    }
}