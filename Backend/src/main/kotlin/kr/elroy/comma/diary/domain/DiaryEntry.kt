package kr.elroy.comma.diary.domain

import kotlinx.datetime.LocalDate
import kotlinx.serialization.json.Json
import kr.elroy.comma.diary.dto.AnnotationDto
import kr.elroy.comma.user.domain.User
import kr.elroy.comma.user.domain.UserTable
import org.jetbrains.exposed.v1.core.ReferenceOption
import org.jetbrains.exposed.v1.core.dao.id.EntityID
import org.jetbrains.exposed.v1.core.dao.id.LongIdTable
import org.jetbrains.exposed.v1.dao.LongEntity
import org.jetbrains.exposed.v1.dao.LongEntityClass
import org.jetbrains.exposed.v1.datetime.CurrentDateTime
import org.jetbrains.exposed.v1.datetime.date
import org.jetbrains.exposed.v1.datetime.datetime
import org.jetbrains.exposed.v1.json.jsonb

class DiaryEntry(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<DiaryEntry>(DiaryEntryTable) {
        fun create(
            author: User,
            title: String,
            content: String,
            entryDate: LocalDate,
            annotations: List<AnnotationDto>,
        ): DiaryEntry {
            return new {
                this.author = author
                this.title = title
                this.content = content
                this.entryDate = entryDate
                this.annotations = annotations.toTypedArray()
            }
        }

        fun findAllByAuthorId(authorId: Long): List<DiaryEntry> {
            return find { DiaryEntryTable.author eq authorId }.toList()
        }
    }

    var author by User referencedOn DiaryEntryTable.author
    var title by DiaryEntryTable.title
    var content by DiaryEntryTable.content
    var entryDate by DiaryEntryTable.entryDate
    var annotations by DiaryEntryTable.annotations

    var createdAt by DiaryEntryTable.createdAt
    var updatedAt by DiaryEntryTable.updatedAt
}

object DiaryEntryTable : LongIdTable("diary_entries") {
    val author = reference("author", UserTable, onDelete = ReferenceOption.CASCADE)

    val title = varchar("title", 255)
    val content = text("content")
    val entryDate = date("entry_date")
    val annotations = jsonb<Array<AnnotationDto>>("annotations", Json.Default)

    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val updatedAt = datetime("updated_at").nullable()

    val indexAuthorAndEntryDate = index(false, author, entryDate)
}