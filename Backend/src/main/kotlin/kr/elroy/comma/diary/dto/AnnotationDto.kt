package kr.elroy.comma.diary.dto

import kotlinx.serialization.Serializable

@Serializable
data class AnnotationDto(
    val comments: List<CommentDto>,
    val highlights: List<HighlightDto>,
)