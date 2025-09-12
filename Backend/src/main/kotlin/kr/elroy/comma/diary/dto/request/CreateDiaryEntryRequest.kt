package kr.elroy.comma.diary.dto.request

import kotlinx.datetime.LocalDate
import kr.elroy.comma.diary.dto.AnnotationDto

data class CreateDiaryEntryRequest(
    val title: String,
    val content: String,
    val entryDate: LocalDate,
    val annotation: AnnotationDto,
)
