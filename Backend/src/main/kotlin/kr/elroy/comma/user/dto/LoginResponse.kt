package kr.elroy.comma.user.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "유저 생성 요청 객체")
data class LoginResponse(
    @field:Schema(description = "이메일", example = "test@example.com")
    val email: String,

    @field:Schema(description = "이름", example = "홍길동")
    val name: String,

    @field:Schema(description = "토큰", example = "bearer {token}")
    val token: String,

    @field:Schema(description = "만료시간", example = "86400")
    val expiresAt: Long
)