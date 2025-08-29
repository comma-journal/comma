package kr.elroy.comma.user

import kr.elroy.comma.user.domain.User
import kr.elroy.comma.user.dto.CreateUserRequest
import kr.elroy.comma.user.dto.UserResponse
import org.springframework.stereotype.Service

@Service
class UserService {
    fun createUser(userRequest: CreateUserRequest): UserResponse {
        return User.new {
            this.name = userRequest.name
            this.email = userRequest.email
            this.password = userRequest.password
        }.toDTO()
    }

    fun updateEmail(id: Long, email: String): UserResponse {
        return User.findById(id)!!.apply {
            this.email = email
        }.toDTO()
    }

    fun User.toDTO(): UserResponse {
        return UserResponse(
            name = this.name,
            email = this.email
        )
    }
}