package kr.elroy.comma.diary.dto

data class AnnotationDto(
    val comments: List<CommentDto>,
    val highlights: List<HighlightDto>,
)