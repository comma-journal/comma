package kr.elroy.comma.diary.dto

import kotlinx.serialization.Serializable

@Serializable
data class CommentDto(
    val start: Int,
    val end: Int,
    val content: String,
    val author: String,
)
