package kr.elroy.comma.user.dto

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "유저 생성 요청 객체")
data class CreateUserRequest(
    @field:Schema(description = "이메일", example = "test@example.com")
    val email: String,

    @field:Schema(description = "이름", example = "홍길동")
    val name: String,

    @field:Schema(description = "비밀번호", example = "qwer1234")
    val password: String
)
