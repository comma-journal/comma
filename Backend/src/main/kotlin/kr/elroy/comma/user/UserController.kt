package kr.elroy.comma.user

import kr.elroy.comma.user.api.UserApi
import kr.elroy.comma.user.dto.CreateUserRequest
import kr.elroy.comma.user.dto.UserResponse
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(
    private val userService: UserService
): UserApi {
    override fun createUser(request: CreateUserRequest): UserResponse {
        return userService.createUser(request)
    }
}