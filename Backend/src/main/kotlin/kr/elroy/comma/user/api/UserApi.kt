package kr.elroy.comma.user.api

import io.swagger.v3.oas.annotations.Operation
import kr.elroy.comma.user.dto.CreateUserRequest
import kr.elroy.comma.user.dto.UserResponse
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping

@RequestMapping("/v1/users")
interface UserApi {
    @Operation(summary = "회원가입 API", description = "사용자 생성 메소드")
    @PostMapping
    fun createUser(@RequestBody request: CreateUserRequest): UserResponse
}