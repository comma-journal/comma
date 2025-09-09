package kr.elroy.comma.diary.dto.response

import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kr.elroy.comma.diary.domain.DiaryEntry
import kr.elroy.comma.diary.dto.AnnotationDto

data class DiaryEntryResponse(
    val id: Long,
    val authorId: Long,
    val title: String,
    val content: String,
    val entryDate: LocalDate,
    val annotations: List<AnnotationDto>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?,
) {
    companion object {
        fun from(entity: DiaryEntry): DiaryEntryResponse {
            return DiaryEntryResponse(
                id = entity.id.value,
                authorId = entity.author.id.value,
                title = entity.title,
                content = entity.content,
                entryDate = entity.entryDate,
                annotations = entity.annotations.toList(),
                createdAt = entity.createdAt,
                updatedAt = entity.updatedAt,
            )
        }
    }
}