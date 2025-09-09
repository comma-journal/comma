package kr.elroy.comma.emotion

import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.LongIdTable
import org.jetbrains.exposed.v1.dao.LongEntity
import org.jetbrains.exposed.v1.dao.LongEntityClass

class Emotion(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Emotion>(EmotionTable) {
        fun findByName(name: String): Emotion? {
            return find { EmotionTable.name eq name }.firstOrNull()
        }
    }

    var name by EmotionTable.name
    var rgb by EmotionTable.rgb
    var description by EmotionTable.description
}

object EmotionTable : LongIdTable("emotions") {
    val name = varchar("name", 50).uniqueIndex()
    val rgb = integer("rgb")
    val description = varchar("description", 255).nullable()
}