package kr.elroy.comma.v2

import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.LongIdTable
import org.jetbrains.exposed.v1.dao.LongEntity
import org.jetbrains.exposed.v1.dao.LongEntityClass

class EmotionV2(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<EmotionV2>(EmotionTableV2) {
        fun findByName(name: String): EmotionV2? {
            return find { EmotionTableV2.name eq name }.firstOrNull()
        }
    }

    var name by EmotionTableV2.name
    var rgb by EmotionTableV2.rgb
    var description by EmotionTableV2.description
    var category by EmotionTableV2.category
}

object EmotionTableV2 : LongIdTable("emotions_v2") {
    val name = varchar("name", 50).uniqueIndex()
    val rgb = integer("rgb")
    val description = varchar("description", 255).nullable()
    val category = varchar("category", 255)
}