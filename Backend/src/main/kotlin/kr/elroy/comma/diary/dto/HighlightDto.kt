package kr.elroy.comma.diary.dto

import kotlinx.serialization.Serializable
import kr.elroy.comma.emotion.dto.EmotionDto

@Serializable
data class HighlightDto(
    val start: Int,
    val end: Int,
    val emotion: EmotionDto,
)