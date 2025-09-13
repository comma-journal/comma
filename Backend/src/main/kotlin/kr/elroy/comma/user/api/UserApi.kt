package kr.elroy.comma.user.api

import io.swagger.v3.oas.annotations.Operation
import kr.elroy.comma.user.dto.LoginRequest
import kr.elroy.comma.user.dto.LoginResponse
import kr.elroy.comma.user.dto.UserResponse
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam

@RequestMapping("/v1/users")
interface UserApi {
    @Operation(summary = "로그인/회원가입 겸용 API", description = "사용자 생성 메소드")
    @PostMapping
    fun auth(@RequestBody request: LoginRequest): LoginResponse

    @Operation(summary = "이름 변경 API", description = "이름 변경")
    @PatchMapping
    fun changeName(@RequestHeader("Authorization") authHeader: String, @RequestParam("name") name: String): UserResponse

    @Operation(summary = "토큰 재발급 API", description = "토큰 재발급")
    @PostMapping("/renew")
    fun renewToken(@RequestHeader("Authorization") authHeader: String): String
}