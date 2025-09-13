package kr.elroy.comma.user

import kr.elroy.comma.user.api.UserApi
import kr.elroy.comma.user.dto.LoginRequest
import kr.elroy.comma.user.dto.LoginResponse
import kr.elroy.comma.user.dto.UserResponse
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(
    private val userService: UserService
): UserApi {
    override fun auth(request: LoginRequest): LoginResponse {
        return userService.login(request)
    }

    override fun changeName(authHeader: String, name: String): UserResponse {
        return userService.updateName(authHeader, name)
    }

    override fun renewToken(authHeader: String): String {
        return userService.renewToken(authHeader)
    }
}