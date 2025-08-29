package kr.elroy.comma.user.domain

import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.LongIdTable
import org.jetbrains.exposed.v1.dao.LongEntity
import org.jetbrains.exposed.v1.dao.LongEntityClass

class User(id: EntityID<Long>): LongEntity(id) {
    companion object : LongEntityClass<User>(UserTable)

    var email by UserTable.email
    var name by UserTable.name
    var password by UserTable.password
}

object UserTable: LongIdTable("user") {
    val email = varchar("email", 255).uniqueIndex()
    val name = varchar("name", 50)
    val password = varchar("password", 255)
}