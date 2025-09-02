package kr.elroy.comma.user

import kr.elroy.comma.user.api.UserApi
import kr.elroy.comma.user.dto.LoginRequest
import kr.elroy.comma.user.dto.UserResponse
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(
    private val userService: UserService
): UserApi {
    override fun auth(request: LoginRequest): UserResponse {
        return userService.login(request)
    }

    override fun changeName(email: String, name: String): UserResponse {
        return userService.updateName(email, name)
    }
}