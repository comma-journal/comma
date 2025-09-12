package kr.elroy.comma.diary.dto.response

import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import kr.elroy.comma.diary.domain.DiaryEntry
import kr.elroy.comma.diary.dto.AnnotationDto
import kr.elroy.comma.emotion.dto.EmotionDto

data class DiaryEntryResponse(
    val id: Long,
    val authorId: Long,
    val title: String,
    val content: String,
    val entryDate: LocalDate,
    val annotation: AnnotationDto,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?,
) {
    val topEmotion: EmotionDto? = annotation.highlights
        .groupingBy { it.emotion }
        .eachCount()
        .maxByOrNull { it.value }
        ?.key

    companion object {
        fun from(entity: DiaryEntry): DiaryEntryResponse {
            return DiaryEntryResponse(
                id = entity.id.value,
                authorId = entity.author.id.value,
                title = entity.title,
                content = entity.content,
                entryDate = entity.entryDate,
                annotation = entity.annotation,
                createdAt = entity.createdAt,
                updatedAt = entity.updatedAt,
            )
        }
    }
}