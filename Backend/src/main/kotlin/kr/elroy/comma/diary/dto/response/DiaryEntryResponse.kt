package kr.elroy.comma.diary.dto.response

import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
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
)