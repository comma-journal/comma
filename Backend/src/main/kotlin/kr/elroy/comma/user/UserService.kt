package kr.elroy.comma.user

import kr.elroy.comma.user.domain.User
import kr.elroy.comma.user.dto.LoginRequest
import kr.elroy.comma.user.dto.UserResponse
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
class UserService {
    private val passwordEncoder = BCryptPasswordEncoder()

    // 토큰 관련 로직 추가 필요
    @Transactional
    fun login(userRequest: LoginRequest): UserResponse {
        val user = User.findByEmail(userRequest.email)
        // 존재 여부
        if(user != null) {
            if (passwordEncoder.matches(userRequest.password, user.password)) {
                return UserResponse(
                    name = user.name,
                    email = user.email,
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

        return UserResponse(
            name = newUser.name,
            email = newUser.email
        )
    }

    @Transactional
    fun updateName(email: String, name: String): UserResponse {
        return User.findByEmail(email)?.let { user ->
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