package kr.elroy.comma.diary.dto

data class CommentDto(
    val start: Int,
    val end: Int,
    val content: String,
    val author: String,
)
